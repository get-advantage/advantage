import { AdvantageFormat, AdvantageFormatName } from "../../types";
import styles from "./midscroll.css?raw";
import midscrollUICSS from "./midscroll-ui.css?raw";

export const midscroll: AdvantageFormat = {
    name: AdvantageFormatName.Midscroll,
    description:
        "A format that sticks the ad to the top of the page as the user scrolls down.",
    setup: (wrapper, ad) => {
        wrapper.insertCSS(styles);
        ad.style.cssText = `display: block; width: 100vw; height: 100vh;`;

        const uiContainer = document.createElement("div");
        uiContainer.id = "ui-container";
        const closeBtn = document.createElement("div");
        closeBtn.id = "close";
        uiContainer.appendChild(closeBtn);
        wrapper.uiLayer.insertCSS(midscrollUICSS);
        wrapper.uiLayer.changeContent(uiContainer);

        closeBtn.addEventListener("click", () => {
            console.log("Close button clicked");
            wrapper.close();
        });

        wrapper.runIntegration();
    },
    reset: (wrapper, ad) => {
        ad.style.cssText = "";
        wrapper.resetCSS();
    },
    close: (wrapper) => {
        wrapper.style.display = "none";
    }
};
