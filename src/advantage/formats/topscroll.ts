import { AdvantageFormat, AdvantageFormatName } from "../../types";
import topscrollCSS from "./topscroll.css?raw";
import topscrollUICSS from "./topscroll-ui.css?raw";

export const topscroll: AdvantageFormat = {
    name: AdvantageFormatName.TopScroll,
    description:
        "A format that sticks the ad to the top of the page as the user scrolls down.",
    setup: (wrapper, ad) => {
        return new Promise((resolve) => {
            // Inser the CSS for the top scroll format
            wrapper.insertCSS(topscrollCSS);
            // Set the styles for the ad iframe
            if (ad) {
                ad.style.cssText = `display: block; width: 100vw; height: 80vh;`;
            }

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
                wrapper.close();
            });
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
            console.log("Close button clicked");
            wrapper.close();
        });
    },
    reset: (wrapper, ad?) => {
        if (ad) {
            ad.style.display = "none";
        }
        wrapper.resetCSS();
    },
    close: (wrapper) => {
        wrapper.addEventListener("transitionend", () => {
            wrapper.style.display = "none";
        });
        wrapper.style.height = "0";
    }
};
