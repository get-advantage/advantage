import { Advantage } from "./advantage";
import { IAdvantageUILayer, IAdvantageWrapper } from "../types";

import { logger, traverseNodes } from "../utils";

import { AdvantageAdSlotResponder } from "../advantage-protocol/publisher-side";

export class AdvantageWrapper extends HTMLElement implements IAdvantageWrapper {
    // Private fields
    #styleElem: HTMLStyleElement;
    #root: ShadowRoot;
    #advantage: Advantage;
    #slotAdvantageContent: HTMLSlotElement;
    #slotChangeRegistered = false;
    // Public fields
    container: HTMLDivElement;
    content: HTMLDivElement;
    uiLayer: IAdvantageUILayer;
    currentFormat: string | null = null;
    messageHandler: AdvantageAdSlotResponder;

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
        this.content.id = "ad-slot";
        this.content.className = "advantage-ad-slot";

        // Create the first slot, this is for advantage-content
        this.#slotAdvantageContent = document.createElement("slot");
        this.#slotAdvantageContent.name = "advantage-ad-slot";

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
            if (!this.#slotChangeRegistered) {
                //logger.info("First slot change");
                this.#slotChangeRegistered = true;
                return;
            }
            logger.error("The advantage-content slot should not be changed");
        });
        this.#detectDOMChanges();
        this.messageHandler = new AdvantageAdSlotResponder({
            adSlotElement: this,
            messageValidator: this.#advantage.config?.messageValidator
        });
    }

    #detectDOMChanges = () => {
        const observer = new MutationObserver(() => {
            if (this.currentFormat) {
                logger.info(
                    "DOM changes detected. This probably means that a new ad was loaded. Time to reset the wrapper."
                );

                this.reset();
            }
        });
        observer.observe(this, {
            childList: true,
            subtree: true
        });
    };

    // Getter for the content nodes
    get contentNodes() {
        return this.#slotAdvantageContent.assignedNodes() ?? [];
    }

    // Private method to morph the wrapper into a specific format
    morphIntoFormat = async (format: string) => {
        console.log("MORPH INTO FORMAT");
        return new Promise<void>(async (resolve, reject) => {
            const forbiddenFormats = this.getAttribute("exclude-formats")
                ?.split(",")
                .map((format) => format.trim());
            if (forbiddenFormats && forbiddenFormats.includes(format)) {
                logger.info(
                    `This wrapper does not support the format(s): \"${forbiddenFormats.join(
                        ", "
                    )}\".`
                );
                reject(
                    `The format ${format} is forbidden for this wrapper. 🛑`
                );
                return;
            }
            this.currentFormat = format;
            let formatConfig = this.#advantage.formats.get(format);

            if (!formatConfig) {
                formatConfig = this.#advantage.defaultFormats.find(
                    (f) => f.name === format
                );
                if (!formatConfig) {
                    reject(
                        `😱 The format ${format} is not supported. No configuration was found.`
                    );
                    this.currentFormat = null;
                    return;
                }
            }
            try {
                await this.#advantage.formatIntegrations
                    .get(format)
                    ?.setup(this, this.messageHandler.ad?.iframe);
                await formatConfig.setup(this, this.messageHandler.ad?.iframe);
                resolve();
            } catch (error) {
                this.reset();
                reject(error);
            }
        });
    };

    // Public method to reset the format
    reset() {
        if (!this.currentFormat) {
            return;
        }
        const formatConfig = this.#advantage.formats.get(this.currentFormat);
        if (formatConfig) {
            formatConfig.reset(this, this.messageHandler?.ad?.iframe);
        }
        const integration = this.#advantage.formatIntegrations.get(
            this.currentFormat
        );
        if (integration && integration.onReset) {
            integration.onReset(this, this.messageHandler?.ad?.iframe);
        }
        this.uiLayer.changeContent("");
        this.currentFormat = null;
    }
    // Public method to close the format
    close() {
        if (!this.currentFormat) {
            return;
        }
        const formatConfig = this.#advantage.formats.get(this.currentFormat);
        if (formatConfig) {
            formatConfig.close
                ? formatConfig.close(this, this.messageHandler?.ad?.iframe)
                : undefined;
        }
        const integration = this.#advantage.formatIntegrations.get(
            this.currentFormat
        );
        if (integration && integration.onClose) {
            integration.onClose(this, this.messageHandler?.ad?.iframe);
        }
        this.currentFormat = null;
    }
    // Public helper method to apply styles to all child elements
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
    // Public method to insert CSS into the shadow root
    insertCSS(CSS: string) {
        this.#styleElem.textContent = CSS;
    }
    // Public method to reset the CSS in the shadow root
    resetCSS() {
        this.#styleElem.textContent = "";
    }
    // Lifecycle method
    connectedCallback() {}
}
