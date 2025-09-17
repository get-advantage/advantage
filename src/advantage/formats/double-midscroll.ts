import { AdvantageFormatName } from "../../types";
import { createMultiMidscroll } from "./multi-midscroll-base";

export const doubleMidscroll = createMultiMidscroll(
    AdvantageFormatName.DoubleMidscroll,
    "A double fullscreen format that fixes the ad to the middle of the page as the user scrolls down.",
    2
);
