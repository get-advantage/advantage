import {
    AdvantageFormat,
    AdvantageFormatName,
    AdvantageFormatOptions
} from "../../types";
import topscrollCSS from "./topscroll.css?inline";
import topscrollUICSS from "./topscroll-ui.css?inline";
import {
    setDimensionsUntilAdvantageAdSlot,
    resetDimensionsUntilAdvantageAdSlot
} from "./format-helper";
import logger from "../../utils/logging";

/**
 * Helper function to handle downArrow click event
 * Scrolls the page smoothly to the position past the ad
 */
const handleDownArrowClick = (wrapper: HTMLElement) => {
    logger.debug("Down arrow clicked");
    // Calculate the height of the ad to scroll past it
    const adHeight = wrapper.offsetHeight;
    window.scrollTo({
        top: adHeight,
        behavior: "smooth"
    });
};

export const topscroll: AdvantageFormat = {
    name: AdvantageFormatName.TopScroll,
    description:
        "A format that sticks the ad to the top of the page as the user scrolls down.",
    setup: (wrapper, ad, options) => {
        const defaults: AdvantageFormatOptions = {
            closeButton: true,
            closeButtonText: "Close ad",
            downArrow: true,
            height: 80,
            closeButtonAnimationDuration: 0.5
        };
        const config = { ...defaults, ...(options || {}) };

        return new Promise((resolve) => {
            // Inser the CSS for the top scroll format
            wrapper.insertCSS(topscrollCSS);
            // Set the styles for the ad iframe
            if (ad) {
                setDimensionsUntilAdvantageAdSlot(ad);
            }

            // Change the content of the UI layer
            const uiContainer = document.createElement("div");
            uiContainer.id = "ui-container";

            if (config.height && config.height <= 100) {
                wrapper.style.setProperty(
                    "--adv-topscroll-height",
                    `${config.height}svh`
                );
            }

            if (config?.closeButton) {
                const closeBtn = document.createElement("div");
                closeBtn.id = "close";
                closeBtn.addEventListener("click", () => {
                    logger.debug("Close button clicked");
                    wrapper.close();
                });
                uiContainer.appendChild(closeBtn);
                wrapper.uiLayer.style.setProperty(
                    "--before-content",
                    `'${config.closeButtonText}'`
                );
                wrapper.style.setProperty(
                    "--adv-close-button-animation-duration",
                    `${config.closeButtonAnimationDuration}s`
                );
            }

            if (config?.downArrow) {
                const downArrow = document.createElement("div");
                downArrow.id = "down-arrow";
                downArrow.addEventListener("click", () => handleDownArrowClick(wrapper));
                uiContainer.appendChild(downArrow);
            }

            wrapper.uiLayer.insertCSS(topscrollUICSS);
            wrapper.uiLayer.changeContent(uiContainer);

            resolve();
        });
    },
    simulate: (wrapper) => {
        wrapper.resetCSS();
        wrapper.insertCSS(topscrollCSS);
        const ad = document.createElement("div");
        ad.id = "simulated-ad";
        wrapper.changeContent(ad);

        // Change the content of the UI layer
        const uiContainer = document.createElement("div");
        uiContainer.id = "ui-container";
        const closeBtn = document.createElement("div");
        closeBtn.id = "close";
        const downArrow = document.createElement("div");
        downArrow.id = "down-arrow";
        uiContainer.appendChild(closeBtn);
        uiContainer.appendChild(downArrow);
        wrapper.uiLayer.insertCSS(topscrollUICSS);
        wrapper.uiLayer.changeContent(uiContainer);

        closeBtn.addEventListener("click", () => {
            logger.debug("Close button clicked");
            wrapper.close();
        });

        downArrow.addEventListener("click", () => handleDownArrowClick(wrapper));
    },
    reset: (wrapper, ad?) => {
        if (ad) {
            resetDimensionsUntilAdvantageAdSlot(ad);
        }
        wrapper.resetCSS();
    },
    close: (wrapper) => {
        wrapper.animateClose();
    }
};
