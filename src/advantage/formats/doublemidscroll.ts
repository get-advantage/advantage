import { AdvantageFormat, AdvantageFormatName } from "../../types";
import styles from "./doublemidscroll.css?inline";
import {
  setDimensionsUntilAdvantageAdSlot,
  resetDimensionsUntilAdvantageAdSlot,
} from "./format-helper";
import { createDoubleFullscreen } from "./double_fullscreen";

export const doubleMidscroll: AdvantageFormat = {
  name: AdvantageFormatName.DoubleMidscroll,
  description:
    "A double fullscreen format that fixes the ad to the middle of the page as the user scrolls down.",
  setup: (wrapper, ad) => {
    return new Promise((resolve) => {
      createDoubleFullscreen(ad);
      // console.log(ad?.contentWindow);
      // wrapper[1].contentWindow.document.querySelectorAll("iframe")[1].style.position =
      //   "absolute";
      // wrapper[1].contentWindow.document.querySelectorAll("iframe")[1].style.top = "0";
      // wrapper[1].contentWindow.document.querySelectorAll("iframe")[0].style.opacity = 0;

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
  },
};
