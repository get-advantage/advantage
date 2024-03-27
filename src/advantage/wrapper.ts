import { Advantage } from "./advantage";
import {
    IAdvantageUILayer,
    IAdvantageWrapper,
    AdvantageChildAd,
    AdvantageMessage,
    AdvantageMessageAction
} from "../types";

import { logger, collectIframes, ADVANTAGE, traverseNodes } from "../utils";

export class AdvantageWrapper extends HTMLElement implements IAdvantageWrapper {
    // Private fields
    #styleElem: HTMLStyleElement;
    #root: ShadowRoot;
    #advantage: Advantage;
    #slotAdvantageContent: HTMLSlotElement;
    #childAd: AdvantageChildAd | null = null;
    #messagePort: MessagePort | null = null;
    // Public fields
    container: HTMLDivElement;
    content: HTMLDivElement;
    uiLayer: IAdvantageUILayer;
    currentFormat: string | null = null;

    constructor() {
        super();
        this.#root = this.attachShadow({ mode: "open" });
        this.#styleElem = document.createElement("style");
        this.#styleElem.textContent = "";
        this.#root.append(this.#styleElem);

        // Create the container div
        this.container = document.createElement("div");
        this.container.id = "container";

        // Create the content div
        this.content = document.createElement("div");
        this.content.id = "content";
        this.content.className = "advantage-content";

        // Create the first slot, this is for advantage-content
        this.#slotAdvantageContent = document.createElement("slot");
        this.#slotAdvantageContent.name = "advantage-content";

        // Create the second slot, this is for the ui layer
        const slotOverlay = document.createElement("slot");
        slotOverlay.name = "overlay";

        // Create the advantage-ui-layer element
        this.uiLayer = document.createElement(
            "advantage-ui-layer"
        ) as IAdvantageUILayer;

        // Append the slots and the advantage-overlay to the content div
        this.content.appendChild(this.#slotAdvantageContent);
        this.content.appendChild(slotOverlay);
        this.content.appendChild(this.uiLayer);

        // Append the content div to the container
        this.container.appendChild(this.content);

        // Append the container to the shadow root
        this.#root.append(this.container);
        // Get a reference to the hub singleton
        this.#advantage = Advantage.getInstance();
        // Register the wrapper with the hub, so that it is aware of its existence
        this.#advantage.registerWrapper(this);

        this.#slotAdvantageContent.addEventListener("slotchange", () => {
            //console.log("A new ad has been added to the slot?");
            // A new ad has probably been added to the slot
        });
    }

    get contentNodes() {
        return this.#slotAdvantageContent.assignedNodes() ?? [];
    }

    #childAdIsAlreadyRegistered(source: MessageEventSource | null) {
        if (!source) {
            return false;
        }
        return this.#childAd && this.#childAd.eventSource === source;
    }

    #morphIntoFormat = (format: string) => {
        this.currentFormat = format;
        const formatConfig = this.#advantage.formats.get(format);
        if (!formatConfig) {
            return;
        }
        formatConfig.setup(this, this.#childAd?.ad!);
    };

    runIntegration() {
        if (!this.currentFormat) {
            return;
        }
        const integration = this.#advantage.formatIntegrations.get(
            this.currentFormat
        );
        if (integration) {
            integration.setup(this, this.#childAd?.ad!);
        }
    }

    reset() {
        if (!this.currentFormat) {
            return;
        }
        const formatConfig = this.#advantage.formats.get(this.currentFormat);
        if (formatConfig) {
            formatConfig.teardown(this, this.#childAd?.ad!);
        }
        const integration = this.#advantage.formatIntegrations.get(
            this.currentFormat
        );
        if (integration && integration.onReset) {
            integration.onReset(this, this.#childAd?.ad!);
        }
    }

    close() {
        if (!this.currentFormat) {
            return;
        }
        const formatConfig = this.#advantage.formats.get(this.currentFormat);
        if (formatConfig) {
            formatConfig.close
                ? formatConfig.close(this, this.#childAd?.ad!)
                : undefined;
        }
        const integration = this.#advantage.formatIntegrations.get(
            this.currentFormat
        );
        if (integration && integration.onClose) {
            integration.onClose(this, this.#childAd?.ad!);
        }
    }

    applyStylesToAllChildElements(styles: string) {
        this.contentNodes.forEach((node) =>
            traverseNodes(node, (node) => {
                if (
                    node instanceof HTMLDivElement ||
                    node instanceof HTMLIFrameElement
                ) {
                    node.style.cssText = styles;
                }
            })
        );
    }

    insertCSS(CSS: string) {
        this.#styleElem.textContent = CSS;
    }

    resetCSS() {
        this.#styleElem.textContent = "";
    }

    #handleMessage = (event: MessageEvent<AdvantageMessage>) => {
        const message = event.data;

        if (message.action === AdvantageMessageAction.START_SESSION) {
            this.#messagePort = event.ports[0];
            event.ports[0].postMessage({
                type: ADVANTAGE,
                action: AdvantageMessageAction.CONFIRM_SESSION,
                sessionID: message.sessionID
            });
            event.ports[0].onmessage = this.#handleMessage.bind(this);
        }
        if (message.action === AdvantageMessageAction.REQUEST_FORMAT) {
            logger.info(`Received a request for the format ${message.format}.`);
            this.#morphIntoFormat(message.format!);
            this.#messagePort?.postMessage({
                type: ADVANTAGE,
                action: AdvantageMessageAction.CONFIRM_FORMAT,
                format: message.format,
                sessionID: message.sessionID
            });
        }
    };

    #listenForMessages = (event: MessageEvent) => {
        if (event.data.type !== ADVANTAGE || !event.source) {
            return;
        }
        if (this.#childAdIsAlreadyRegistered(event.source)) {
            logger.info(
                "A message was received from a child of the component.",
                event
            );
            this.#handleMessage(event as MessageEvent<AdvantageMessage>);
            return;
        }

        if (this.#advantage.config?.messageValidator) {
            logger.info(
                "Let the provided messageValidator decide if the message is valid and from a child of the component."
            );
            if (this.#advantage.config.messageValidator(event)) {
                this.#childAd = {
                    eventSource: event.source!,
                    port: event.ports[0]
                };
                this.#handleMessage(event);
                return;
            } else {
                logger.info(
                    "The message was not validated by the messageValidator."
                );
                return;
            }
        } else {
            const iframes = this.contentNodes.flatMap((node) =>
                collectIframes(node)
            );
            if (iframes.length === 0) {
                return;
            }
            let isConfirmedChildAd = false;
            iframes.forEach((iframe) => {
                if (iframe.contentWindow === event.source) {
                    logger.info(
                        "The message is from a child of the component."
                    );
                    isConfirmedChildAd = true;
                    this.#childAd = {
                        ad: iframe,
                        eventSource: event.source!,
                        port: event.ports[0]
                    };
                    this.#handleMessage(
                        event as MessageEvent<AdvantageMessage>
                    );
                }
            });
            if (!isConfirmedChildAd) {
                logger.info(
                    "The message was rejected because it could not be confirmed as coming from a child of the component."
                );
            }
        }
    };

    connectedCallback() {
        window.addEventListener("message", this.#listenForMessages.bind(this));
    }
}
