import {
    IAdvantageWrapper,
    AdvantageAd,
    AdvantageMessage,
    AdvantageMessageAction
} from "../types";
import { collectIframes, logger, ADVANTAGE } from "../utils";

export class AdvantageMessageHandler {
    #element: HTMLElement | IAdvantageWrapper;
    #messageValidator:
        | ((
              parentElement: HTMLElement | IAdvantageWrapper,
              message: MessageEvent<any>
          ) => boolean)
        | undefined = undefined;
    #isWrapper: boolean;
    #messagePort: MessagePort | null = null;
    #formatRequestHandler:
        | ((format: string, parentElement: HTMLElement) => void)
        | undefined = undefined;
    ad: AdvantageAd | null = null;
    constructor(config: {
        parentElement: HTMLElement;
        formatRequestHandler?: (
            format: string,
            parentElement: HTMLElement
        ) => void;
        messageValidator?: (
            parentElement: HTMLElement | IAdvantageWrapper,
            message: MessageEvent<any>
        ) => boolean;
    }) {
        this.#element = config.parentElement;
        this.#formatRequestHandler = config.formatRequestHandler;
        this.#messageValidator = config.messageValidator;
        this.#isWrapper = this.#isAdvantageWrapper(config.parentElement);
        // Bind the listenForMessages function to ensure 'this' context
        this.#listenForMessages = this.#listenForMessages.bind(this);
        window.addEventListener("message", this.#listenForMessages);
    }

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
                console.log(
                    "NOT A WRAPPER! REQUEST FOR FORMAT",
                    message.format
                );
                if (this.#formatRequestHandler) {
                    console.log(
                        "Sending format request",
                        this.#formatRequestHandler
                    );
                    this.#formatRequestHandler(message.format!, this.#element);
                }
            }
        }
    };

    #childAdIsAlreadyRegistered(source: MessageEventSource | null) {
        if (!source) {
            return false;
        }
        return this.ad && this.ad.eventSource === source;
    }

    // Register a window message listener and validate that the message is from a child of #element
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
