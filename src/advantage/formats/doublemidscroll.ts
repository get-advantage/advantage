import { AdvantageFormat, AdvantageFormatName } from "@src/types";
import styles from "./doublemidscroll.css?inline";
import {
  setDimensionsUntilAdvantageAdSlot,
  resetDimensionsUntilAdvantageAdSlot,
} from "./format-helper";
import { createDoubleFullscreen } from "./doublefullscreen_helper.ts";

export const doubleMidscroll: AdvantageFormat = {
  name: AdvantageFormatName.DoubleMidscroll,
  description:
    "A double fullscreen format that fixes the ad to the middle of the page as the user scrolls down.",
  setup: (wrapper, ad) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        createDoubleFullscreen(ad);

        wrapper.insertCSS(styles);
        if (ad) setDimensionsUntilAdvantageAdSlot(ad);

        const uiContainer = document.createElement("div");
        uiContainer.id = "ui-container";

        wrapper.uiLayer.changeContent(uiContainer);

        resolve();
      }, 500)

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
  },
};
