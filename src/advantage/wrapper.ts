import { Advantage } from "./advantage";
import { IAdvantageUILayer, IAdvantageWrapper } from "../types";

import { logger, traverseNodes, supportsAdoptingStyleSheets } from "../utils";

import { AdvantageAdSlotResponder } from "./messaging/publisher-side";

/**
 * Represents the AdvantageWrapper class, which extends the HTMLElement class and implements the IAdvantageWrapper interface.
 * This class is responsible for creating and managing the wrapper element for Advantage ads.
 * @noInheritDoc
 */
export class AdvantageWrapper extends HTMLElement implements IAdvantageWrapper {
    // Private fields
    #styleSheet: CSSStyleSheet | HTMLStyleElement;
    #root: ShadowRoot;
    #slotAdvantageContent: HTMLSlotElement;
    #slotChangeRegistered = false;
    // Whitelist set via attribute or API; when present it overrides exclude‑formats
    allowedFormats: string[] | null = null;
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
        if (supportsAdoptingStyleSheets) {
            this.#styleSheet = new CSSStyleSheet();
        } else {
            this.#styleSheet = document.createElement(
                "style"
            ) as HTMLStyleElement;
        }

        this.#root = this.attachShadow({ mode: "open" });

        if (supportsAdoptingStyleSheets) {
            this.#root.adoptedStyleSheets = [this.#styleSheet as CSSStyleSheet];
        } else {
            this.#root.appendChild(this.#styleSheet as HTMLStyleElement);
        }

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
        const observer = new MutationObserver((mutations) => {
            // Loop through all mutation records
            mutations.forEach((mutation) => {
                // We only care about added or removed nodes
                if (mutation.type === "childList") {
                    // Check for added nodes
                    mutation.addedNodes.forEach((node) => {
                        // Is this node an iframe?
                        if ((node as Element).tagName === "IFRAME") {
                            logger.debug("An <iframe> was added:", node);
                            // Attach a onload event listener to the iframe to detect when the ad is loaded and reloaded.
                        }
                    });

                    // Check for removed nodes
                    mutation.removedNodes.forEach((node) => {
                        if ((node as Element).tagName === "IFRAME") {
                            if (
                                this.currentFormat &&
                                this.simulating === false
                            ) {
                                logger.debug(
                                    "An <iframe> was removed. This probably means that a new ad was loaded. Time to reset the wrapper."
                                );
                                this.reset();
                            }
                        }
                    });
                }
            });
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
     * Restrict this wrapper to the given list of formats.
     * Calling this method overrides any list previously set via attribute or API.
     * @param formats Array of format names that are allowed for this wrapper.
     */
    setAllowedFormats(formats: string[]) {
        this.allowedFormats = formats.map((f) => f.trim().toUpperCase());
    }

    /**
     * Clears the programmatic whitelist so the wrapper falls back to attribute or default behaviour.
     */
    clearAllowedFormats() {
        this.allowedFormats = null;
    }

    /**
     * Morphs the wrapper into a specific ad format.
     * If `allowed-formats` is set (via attribute or API) it takes precedence over `exclude-formats`.
     * Comparisons are case-insensitive.
     * @param format - The format to morph into.
     * @returns A promise that resolves when the morphing is complete.
     */
    morphIntoFormat = async (format: string) => {
        logger.debug("MORPH INTO FORMAT");
        return new Promise<void>(async (resolve, reject) => {
            const formatId = format.toUpperCase();
            // 1. Check for an explicit allow‑list (attribute or programmatic).
            const attrAllowed = this.getAttribute("allowed-formats")
                ?.split(",")
                .map((f) => f.trim().toUpperCase())
                .filter(Boolean);
            const allowedList = this.allowedFormats ?? attrAllowed;
            if (allowedList && !allowedList.includes(formatId)) {
                logger.info(
                    `The format "${formatId}" is not in the allowed-formats list (${allowedList.join(
                        ", "
                    )}).`
                );
                reject(
                    `The format ${formatId} is not allowed for this wrapper. 🛑`
                );
                return;
            }

            // 2. If no allow‑list, fall back to exclude‑list logic.
            const forbiddenFormats = !allowedList
                ? this.getAttribute("exclude-formats")
                      ?.split(",")
                      .map((f) => f.trim().toUpperCase())
                : undefined;
            if (forbiddenFormats && forbiddenFormats.includes(formatId)) {
                logger.info(
                    `This wrapper does not support the format(s): "${forbiddenFormats.join(
                        ", "
                    )}".`
                );
                reject(
                    `The format ${formatId} is forbidden for this wrapper. 🛑`
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

            const integration = Advantage.getInstance().formatIntegrations.get(
                this.currentFormat
            );

            try {
                // 1. First we call the format setup function with optinal user defined format options
                await formatConfig.setup(
                    this,
                    this.messageHandler.ad?.iframe,
                    integration?.options
                );

                // 2. Then we call the integration setup function to apply site-specific adjustments
                await integration?.setup(this, this.messageHandler.ad?.iframe);

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
        if (integration) {
            if (typeof integration.reset === "function") {
                integration.reset(this, this.messageHandler?.ad?.iframe);
            } else if (typeof integration.onReset === "function") {
                integration.onReset(this, this.messageHandler?.ad?.iframe);
            }
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
        if (integration) {
            if (typeof integration.close === "function") {
                integration.close(this, this.messageHandler?.ad?.iframe);
            } else if (typeof integration.onClose === "function") {
                integration.onClose(this, this.messageHandler?.ad?.iframe);
            }
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
        if (supportsAdoptingStyleSheets) {
            (this.#styleSheet as CSSStyleSheet).replaceSync(CSS);
        } else {
            (this.#styleSheet as HTMLStyleElement).textContent = CSS;
        }
    }

    /**
     * Resets the CSS in the shadow root of the wrapper.
     */
    resetCSS() {
        if (supportsAdoptingStyleSheets) {
            (this.#styleSheet as CSSStyleSheet).replaceSync("");
        } else {
            (this.#styleSheet as HTMLStyleElement).textContent = "";
        }
    }

    /**
     * Lifecycle method called when the element is connected to the DOM.
     */
    connectedCallback() {}
}
