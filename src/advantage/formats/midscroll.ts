import { AdvantageFormat, AdvantageFormatName } from "../../types";
import styles from "./midscroll.css?raw";
import midscrollUICSS from "./midscroll-ui.css?raw";
import {
    setDimensionsUntilAdvantageAdSlot,
    resetDimensionsUntilAdvantageAdSlot
} from "./format-helper";

export const midscroll: AdvantageFormat = {
    name: AdvantageFormatName.Midscroll,
    description:
        "A fullscreen format that fixes the ad to the middle of the page as the user scrolls down.",
    setup: (wrapper, ad) => {
        return new Promise((resolve) => {
            wrapper.insertCSS(styles);

            if (ad) {
                setDimensionsUntilAdvantageAdSlot(ad);
            }

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

            resolve();
        });
    },
    reset: (wrapper, ad?) => {
        if (ad) {
            resetDimensionsUntilAdvantageAdSlot(ad);
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
