import {
    IAdvantageWrapper,
    AdvantageAd,
    AdvantageMessage,
    AdvantageMessageAction
} from "../types";
import { Advantage } from "../advantage";
import { collectIframes, logger, ADVANTAGE } from "../utils";

/**
 * AdvantageAdSlotResponder can be used by website owners/publishers if they already have their own custom implementations of high impact ad formats
 * or if they do not want to use the AdvantageWrapper component for some reason. It takes care of listening for messages from Advantage ads and handling them.
 * It will handle the creation of a new session, format requests, and format confirmations.
 * @public
 * @remarks
 * This class is internally used by the AdvantageWrapper component to handle messages from Advantage ads. It can also be used by website owners/publishers to handle messages from ads if they have their own custom implementations of high-impact ad formats.
 *
 * @example
 * To handle messages from Advantage ads in a custom implementation, you can create an instance of the AdvantageAdSlotResponder class and pass in the configuration object.
 * ```typescript
 * new AdvantageAdSlotResponder({
 *      adSlotElement: document.querySelector("#the-ad-slot-element")!,
 *      formatRequestHandler: (format, parentElement) => {
 *           return new Promise((resolve, reject) => {
 *              // handle the format request here, e.g. by transforming the parent element into the requested format
 *              // resolve the promise if the format transformation was succesful or reject it if it failed
 *          });
 * });
 * ```
 */
export class AdvantageAdSlotResponder {
    #advantage: Advantage = Advantage.getInstance();
    #element: HTMLElement | IAdvantageWrapper;
    #messageValidator:
        | ((
              adSlotElement: HTMLElement | IAdvantageWrapper,
              message: MessageEvent<any>
          ) => boolean)
        | undefined = undefined;
    #isWrapper: boolean;
    #messagePort: MessagePort | null = null;
    #formatRequestHandler:
        | ((format: string, parentElement: HTMLElement) => Promise<void>)
        | undefined = undefined;
    ad: AdvantageAd | null = null;
    /**
     * Constructs a new instance of the AdvantageAdSlotResponder, initializing it with the provided configuration.
     *
     * @param config - The configuration object for the class instance.
     * @param config.adSlotElement - The HTML element that is/contains the ad slot where Advantage ads will loaded/displayed.
     * @param config.formatRequestHandler - An optional function that handles format requests. It takes a format string and a parent element as arguments. This function can be used to customize the handling of different ad formats.
     * @param config.messageValidator - An optional function that validates incoming messages. It takes a parent element (which can be an `HTMLElement` or an `IAdvantageWrapper`) and the message event as arguments. It should return a boolean indicating whether the message is valid.
     */
    constructor(config: {
        adSlotElement: HTMLElement;
        formatRequestHandler?: (
            format: string,
            parentElement: HTMLElement
        ) => Promise<void>;
        messageValidator?: (
            parentElement: HTMLElement | IAdvantageWrapper,
            message: MessageEvent<any>
        ) => boolean;
    }) {
        this.#element = config.adSlotElement;
        this.#formatRequestHandler = config.formatRequestHandler;
        this.#messageValidator = config.messageValidator;
        this.#isWrapper = this.#isAdvantageWrapper(config.adSlotElement);

        if (!this.#isWrapper) {
            /* Advantage wrappers will report themselves to the Advantage instance
            But since this is a custom wrapper, we need to register it manually */
            this.#advantage.registerCustomWrapper(config.adSlotElement);
        }
        // Bind the listenForMessages function to ensure 'this' context
        this.#listenForMessages = this.#listenForMessages.bind(this);
        window.addEventListener("message", this.#listenForMessages);
    }
    /**
     * This method handles incoming messages from Advantage ads and processes them accordingly.
     * @internal
     */
    #handleMessage = async (event: MessageEvent<AdvantageMessage>) => {
        // Handle the message here
        const message = event.data;
        // The message is a request to start a session
        if (message.action === AdvantageMessageAction.START_SESSION) {
            console.log("start session!", event);
            this.#messagePort = event.ports[0];
            this.#messagePort.postMessage({
                type: ADVANTAGE,
                action: AdvantageMessageAction.CONFIRM_SESSION,
                sessionID: message.sessionID
            });
            this.#messagePort.onmessage = this.#handleMessage.bind(this);
        }
        if (message.action === AdvantageMessageAction.REQUEST_FORMAT) {
            if (this.#isWrapper) {
                (this.#element as IAdvantageWrapper)
                    .morphIntoFormat(message.format!)
                    .then(() => {
                        console.log("morphed into format", message.format!);
                        this.#messagePort?.postMessage({
                            type: ADVANTAGE,
                            action: AdvantageMessageAction.FORMAT_CONFIRMED,
                            sessionID: message.sessionID
                        });
                    });
            } else {
                if (this.#formatRequestHandler) {
                    console.log(
                        "Sending format request",
                        this.#formatRequestHandler
                    );
                    this.#formatRequestHandler(message.format!, this.#element)
                        .then(() => {
                            this.#messagePort?.postMessage({
                                type: ADVANTAGE,
                                action: AdvantageMessageAction.FORMAT_CONFIRMED,
                                sessionID: message.sessionID
                            });
                        })
                        .catch(() => {
                            this.#messagePort?.postMessage({
                                type: ADVANTAGE,
                                action: AdvantageMessageAction.FORMAT_REJECTED,
                                sessionID: message.sessionID
                            });
                        });
                }
            }
        }
    };
    /**
     * Checks if the message is from an ad that is already registered
     * @internal
     */
    #childAdIsAlreadyRegistered(source: MessageEventSource | null) {
        if (!source) {
            return false;
        }
        return this.ad && this.ad.eventSource === source;
    }

    /**
     * This method listens for incoming messages from Advantage ads and processes them accordingly.
     * @internal
     */
    #listenForMessages = (event: MessageEvent) => {
        if (this.#childAdIsAlreadyRegistered(event.source)) {
            logger.info(
                "A message was received from a child of the component. 👍",
                event
            );
            this.#handleMessage(event as MessageEvent<AdvantageMessage>);
            return;
        }
        if (
            this.#messageValidator &&
            !this.#messageValidator(this.#element, event)
        ) {
            return;
        } else {
            const childAdFinder = (iframe: HTMLIFrameElement) => {
                if (iframe.contentWindow === event.source) {
                    logger.info(
                        "The message is from a child of the component. 👍"
                    );
                    this.ad = {
                        iframe,
                        eventSource: event.source!,
                        port: event.ports[0]
                    };
                    this.#handleMessage(
                        event as MessageEvent<AdvantageMessage>
                    );
                }
            };
            if (this.#isWrapper) {
                const iframes = (
                    this.#element as IAdvantageWrapper
                ).contentNodes.flatMap((node) => collectIframes(node));
                if (iframes.length === 0) {
                    return;
                }
                iframes.forEach(childAdFinder);
            } else {
                // Check if the source window is a child of the #element
                console.log("NOT A WRAPPER!", this.#element);
                Array.from(
                    this.#element.getElementsByTagName("iframe")
                ).forEach(childAdFinder);
            }
        }
    };
    /**
     * Checks if the provided element is an instance of IAdvantageWrapper.
     * @internal
     */
    #isAdvantageWrapper(
        element: HTMLElement | IAdvantageWrapper
    ): element is IAdvantageWrapper {
        return (
            "container" in element &&
            "currentFormat" in element &&
            "uiLayer" in element &&
            "morphIntoFormat" in element
        );
    }
}
