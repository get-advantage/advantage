import { Advantage } from "./advantage";
import { IAdvantageUILayer, IAdvantageWrapper } from "../types";

import { logger, traverseNodes } from "../utils";

import { AdvantageAdSlotResponder } from "./messaging/publisher-side";

/**
 * Represents the AdvantageWrapper class, which extends the HTMLElement class and implements the IAdvantageWrapper interface.
 * This class is responsible for creating and managing the wrapper element for Advantage ads.
 * @noInheritDoc
 */
export class AdvantageWrapper extends HTMLElement implements IAdvantageWrapper {
    // Private fields
    #styleElem: HTMLStyleElement;
    #root: ShadowRoot;
    #slotAdvantageContent: HTMLSlotElement;
    #slotChangeRegistered = false;
    // Public fields
    container: HTMLDivElement;
    content: HTMLDivElement;
    uiLayer: IAdvantageUILayer;
    currentFormat: string | null = null;
    messageHandler: AdvantageAdSlotResponder;
    simulating = false;

    /**
     * Creates an instance of AdvantageWrapper.
     */
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

        // Register the wrapper with the hub, so that it is aware of its existence
        Advantage.getInstance().registerWrapper(this);

        this.#slotAdvantageContent.addEventListener("slotchange", () => {
            if (!this.#slotChangeRegistered) {
                logger.info("The content slot has been changed");
                this.#slotChangeRegistered = true;
                return;
            }
            //logger.error("The advantage-content slot should not be changed");
        });
        this.#detectDOMChanges();
        this.messageHandler = new AdvantageAdSlotResponder({
            adSlotElement: this,
            messageValidator: Advantage.getInstance().config?.messageValidator
        });
    }

    /**
     * Detects DOM changes and resets the wrapper if a new ad is loaded.
     */
    #detectDOMChanges = () => {
        const observer = new MutationObserver(() => {
            if (this.currentFormat && this.simulating === false) {
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

    /**
     * Gets the content nodes assigned to the advantage-ad-slot.
     * @returns An array of content nodes.
     */
    get contentNodes() {
        return this.#slotAdvantageContent.assignedNodes() ?? [];
    }

    /**
     * Simulates a specific ad format.
     * @param format - The format to simulate.
     */
    simulateFormat = async (format: string) => {
        if (this.simulating) {
            return;
        }
        this.simulating = true;
        const formatConfig = Advantage.getInstance().formats.get(format);
        if (formatConfig && formatConfig.simulate) {
            logger.debug("SIMULATE FORMAT");
            formatConfig.simulate(this);
        }
    };

    /**
     * Morphs the wrapper into a specific ad format.
     * @param format - The format to morph into.
     * @returns A promise that resolves when the morphing is complete.
     */
    morphIntoFormat = async (format: string) => {
        logger.debug("MORPH INTO FORMAT");
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
            let formatConfig = Advantage.getInstance().formats.get(format);

            if (!formatConfig) {
                formatConfig = Advantage.getInstance().defaultFormats.find(
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
                await formatConfig.setup(this, this.messageHandler.ad?.iframe);
                await Advantage.getInstance()
                    .formatIntegrations.get(format)
                    ?.setup(this, this.messageHandler.ad?.iframe);
                resolve();
            } catch (error) {
                this.reset();
                reject(error);
            }
        });
    };

    /**
     * Changes the content of the wrapper.
     * @param content - The new content to be added to the wrapper.
     */
    changeContent(content: string | HTMLElement) {
        // Access the projected content in the light DOM
        const projectedContent = this.querySelector(
            '[slot="advantage-ad-slot"]'
        );
        projectedContent?.remove();
        // Check the type of the new content and add it accordingly
        if (typeof content === "string") {
            // If the content is a string, create a container for it
            const container = document.createElement("div");
            container.innerHTML = content;
            // Assign the slot attribute so it gets projected correctly
            container.setAttribute("slot", "advantage-ad-slot");
            this.appendChild(container); // Add to the light DOM of the custom element
        } else {
            // If the content is an HTMLElement, directly set the slot attribute and append
            content.setAttribute("slot", "advantage-ad-slot");
            this.appendChild(content); // Add to the light DOM of the custom element
        }
    }

    /**
     * Resets the current ad format.
     */
    reset() {
        if (!this.currentFormat) {
            return;
        }
        const formatConfig = Advantage.getInstance().formats.get(
            this.currentFormat
        );
        if (formatConfig) {
            formatConfig.reset(this, this.messageHandler?.ad?.iframe);
        }
        const integration = Advantage.getInstance().formatIntegrations.get(
            this.currentFormat
        );
        if (integration && integration.onReset) {
            integration.onReset(this, this.messageHandler?.ad?.iframe);
        }
        this.uiLayer.changeContent("");
        this.currentFormat = null;
    }

    animateClose() {
        this.classList.add("animate");
        this.addEventListener("transitionend", () => {
            this.style.display = "none";
        });
        this.style.height = "0px";
    }

    /**
     * Closes the current ad format.
     */
    close() {
        if (!this.currentFormat) {
            logger.info("No format to close.");
            return;
        }
        const formatConfig = Advantage.getInstance().formats.get(
            this.currentFormat
        );
        logger.info(
            "Advantage.getInstance().formats",
            Advantage.getInstance().formats
        );
        logger.info("Advantage.getInstance().id", Advantage.id);
        logger.info("Closing the current format.", formatConfig);
        if (formatConfig) {
            logger.info("Closing the current format.", formatConfig);
            formatConfig.close
                ? formatConfig.close(this, this.messageHandler?.ad?.iframe)
                : undefined;
        }
        const integration = Advantage.getInstance().formatIntegrations.get(
            this.currentFormat
        );
        if (integration && integration.onClose) {
            integration.onClose(this, this.messageHandler?.ad?.iframe);
        }
        this.currentFormat = null;
    }

    /**
     * Applies styles to all child elements of the wrapper.
     * @param styles - The CSS styles to apply.
     */
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

    /**
     * Inserts CSS into the shadow root of the wrapper.
     * @param CSS - The CSS to insert.
     */
    insertCSS(CSS: string) {
        this.#styleElem.textContent = CSS;
    }

    /**
     * Resets the CSS in the shadow root of the wrapper.
     */
    resetCSS() {
        this.#styleElem.textContent = "";
    }

    /**
     * Lifecycle method called when the element is connected to the DOM.
     */
    connectedCallback() {}
}
