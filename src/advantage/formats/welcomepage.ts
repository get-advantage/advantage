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
            autoCloseDuration: 21,
            siteTitle: window.location.hostname,
            logo: `https://icons.duckduckgo.com/ip3/${window.location.hostname}.ico`,
            continueToLabel: "To",
            scrollBackToTop: false,
            adLabel: "Advertisement"
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
                    <div class="countdown ${
                        config.autoCloseDuration
                            ? "countdown--show"
                            : "countdown--hide"
                    }">
                      <div class="loader"></div>
                      <span class="cdw"><span class="cd">${
                          config.autoCloseDuration
                      }</span></span>
                    </div>
                    <div class="label">${config.adLabel}</div>
                    <div class="continue">
                        ${
                            config.logo
                                ? `<img class="favico" src="${config.logo}" onerror="this.style.display='none'" />`
                                : ""
                        }<span class="to-label">${config.continueToLabel} ${
                    config.siteTitle ? config.siteTitle : ""
                }</span><span class="arrow">➜</span>
                    </div>
                  </div>
                </div>`
            );

            let countdownInterval = 0;
            let autoCloseTimeout = 0;

            if (config?.autoCloseDuration) {
                const countdownElement = uiContainer.querySelector(".cd");
                let count = config.autoCloseDuration;
                if (countdownElement) {
                    countdownInterval = setInterval(() => {
                        count--;
                        countdownElement.textContent = count.toString();
                        if (count === 0) {
                            clearInterval(countdownInterval);
                        }
                    }, 1000);
                }

                wrapper.uiLayer.style.setProperty(
                    "--adv-wp-countdown-duration",
                    `${config.autoCloseDuration}s`
                );

                autoCloseTimeout = setTimeout(() => {
                    logger.debug("Auto closing the ad");
                    wrapper.close();
                }, config.autoCloseDuration * 1000);
            }

            const countinueElement = uiContainer.querySelector(".continue");
            if (countinueElement) {
                countinueElement.addEventListener("click", () => {
                    clearInterval(countdownInterval);
                    clearTimeout(autoCloseTimeout);
                    wrapper.close();
                });
            }

            wrapper.uiLayer.insertCSS(welcomepageUICSS);
            wrapper.uiLayer.changeContent(uiContainer);

            wrapper.classList.add("show");

            resolve();
        });
    },
    simulate: (wrapper) => {
        wrapper.resetCSS();
        wrapper.insertCSS(varsCSS.concat(welcomepageCSS));
        const ad = document.createElement("div");
        ad.id = "simulated-ad";
        wrapper.changeContent(ad);
    },
    reset: (wrapper, ad?) => {
        if (ad) {
            resetDimensionsUntilAdvantageAdSlot(ad);
        }
        wrapper.resetCSS();
    },
    close: (wrapper) => {
        function handleTransitionEnd() {
            wrapper.style.display = "none";
            // Remove the event listener after it has been executed
            container?.removeEventListener(
                "transitionend",
                handleTransitionEnd
            );
        }

        const container = wrapper.shadowRoot?.getElementById("container");
        container?.addEventListener("transitionend", handleTransitionEnd);
        wrapper.classList.remove("show");
        wrapper.style.height = "0px";
    }
};
