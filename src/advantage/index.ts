export { Advantage } from "./advantage";
import { AdvantageWrapper } from "./wrapper";
import { AdvantageUILayer } from "./ui-layer";
import logger from "../utils/logging";
import { advantageWrapAdSlotElement as actualAdvantageWrapAdSlotElement } from "../utils/wrapping-helper";
export { actualAdvantageWrapAdSlotElement as advantageWrapAdSlotElement };
export * from "./messaging";
export * from "../types";

// Process any queued items
if ((window as any).advantageWrapQueue) {
    for (let item of (window as any).advantageWrapQueue) {
        const [target, excludedFormats] = item;
        actualAdvantageWrapAdSlotElement(target, excludedFormats);
    }
}

// Replace the global function with the actual function
(window as any).advantageWrapAdSlotElement = actualAdvantageWrapAdSlotElement;

// Process the advantageCmdQueue
if ((window as any).advantageCmdQueue) {
    for (let callback of (window as any).advantageCmdQueue) {
        try {
            callback(actualAdvantageWrapAdSlotElement);
        } catch (error) {
            logger.error("Error executing callback:", error);
        }
    }
} else {
    (window as any).advantageCmdQueue = [];
}

(window as any).advantageCmdQueue.push = function (callback: any) {
    Array.prototype.push.call(this, callback);
    try {
        callback(actualAdvantageWrapAdSlotElement);
    } catch (error) {
        logger.error("Error executing callback:", error);
    }
};

// Run new commands immediately
(window as any).advantageCmd = function (callback: any) {
    try {
        callback(actualAdvantageWrapAdSlotElement);
    } catch (error) {
        logger.error("Error executing callback:", error);
    }
};

customElements.define("advantage-wrapper", AdvantageWrapper);
customElements.define("advantage-ui-layer", AdvantageUILayer);
