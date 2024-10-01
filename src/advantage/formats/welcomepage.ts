import {
    AdvantageFormat,
    AdvantageFormatName,
    AdvantageFormatOptions
} from "../../types";
import varsCSS from "./vars.css?raw";
import welcomepageCSS from "./welcomepage.css?raw";
import welcomepageUICSS from "./welcomepage-ui.css?raw";
import {
    setDimensionsUntilAdvantageAdSlot,
    resetDimensionsUntilAdvantageAdSlot
} from "./format-helper";
import logger from "../../utils/logging";

export const welcomePage: AdvantageFormat = {
    name: AdvantageFormatName.WelcomePage,
    description:
        "Positioned on top of the site content with a close button to continue to the site",
    setup: (wrapper, ad, options) => {
        const defaults: AdvantageFormatOptions = {
            closeButton: true,
            closeButtonText: "Close ad",
            autoCloseDuration: 0,
            siteTitle: window.location.hostname
        };
        const config = { ...defaults, ...(options || {}) };

        return new Promise((resolve) => {
            // Inser the CSS for the top scroll format
            wrapper.insertCSS(varsCSS.concat(welcomepageCSS));
            // Set the styles for the ad iframe
            if (ad) {
                setDimensionsUntilAdvantageAdSlot(ad);
            }

            // Change the content of the UI layer
            const uiContainer = document.createElement("div");
            uiContainer.id = "ui-container";

            uiContainer.insertAdjacentHTML(
                "afterbegin",
                `<div class="close-area">
                  <div class="mw">
                    <div class="countdown">
                        <svg class="cw" height="2em" width="2em">
                            <circle class="circle-2" cx="1em" cy="1em" r=".9em" stroke-width=".2em" fill-opacity="0" />
                            <circle class="circle" cx="1em" cy="1em" r=".9em" stroke-width=".2em" fill-opacity="0" />
                        </svg>
                        <span class="cdw"><span class="cd">10</span></span>
                    </div>
                    <div class="continue">Gå videre til artikkel <img class="arrow" src="assets/arrow-right.svg"></div>
                  </div>
                </div>`
            );
            // const countdown = document.createElement("div");
            // countdown.id = "countdown";

            // const continueContainer = document.createElement("div");
            // continueContainer.id = "continue";

            // if (config?.closeButton) {
            //     const closeBtn = document.createElement("div");
            //     closeBtn.id = "close";
            //     closeBtn.addEventListener("click", () => {
            //         logger.debug("Close button clicked");
            //         wrapper.close();
            //     });
            //     uiContainer.appendChild(closeBtn);
            //     wrapper.uiLayer.style.setProperty(
            //         "--before-content",
            //         `'${config.closeButtonText}'`
            //     );
            // }

            if (config?.autoCloseDuration) {
                setTimeout(() => {
                    logger.debug("Auto closing the ad");
                    wrapper.close();
                }, config.autoCloseDuration * 1000);
            }

            wrapper.uiLayer.insertCSS(welcomepageUICSS);
            wrapper.uiLayer.changeContent(uiContainer);

            resolve();
        });
    },
    simulate: (wrapper) => {
        wrapper.resetCSS();
        wrapper.insertCSS(welcomepageCSS);
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
        wrapper.uiLayer.insertCSS(welcomepageUICSS);
        wrapper.uiLayer.changeContent(uiContainer);

        closeBtn.addEventListener("click", () => {
            logger.debug("Close button clicked");
            wrapper.close();
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
