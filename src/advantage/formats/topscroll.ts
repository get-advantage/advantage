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
                downArrow.addEventListener("click", () => {
                    logger.debug("Down arrow clicked");
                    // Scroll the page down by the height of the ad
                    const scrollHeight = config.height && config.height <= 100 
                        ? window.innerHeight * (config.height / 100)
                        : window.innerHeight * 0.8;
                    window.scrollBy({
                        top: scrollHeight,
                        behavior: "smooth"
                    });
                });
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

        downArrow.addEventListener("click", () => {
            logger.debug("Down arrow clicked");
            // Scroll the page down by 80vh (default height)
            window.scrollBy({
                top: window.innerHeight * 0.8,
                behavior: "smooth"
            });
        });
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
