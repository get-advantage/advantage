import { AdvantageFormat, AdvantageFormatName } from "../../types";
import styles from "./midscroll.css?inline";
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
            if (ad) setDimensionsUntilAdvantageAdSlot(ad);

            const uiContainer = document.createElement("div");
            uiContainer.id = "ui-container";

            wrapper.uiLayer.changeContent(uiContainer);

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
        wrapper.animateClose();
    }
};
