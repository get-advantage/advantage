import { Advantage } from "./advantage";
export { Advantage } from "./advantage";
import { advantageWrapAdSlotElement as actualAdvantageWrapAdSlotElement } from "./wrapping-helper";
export { actualAdvantageWrapAdSlotElement as advantageWrapAdSlotElement };

Advantage.getInstance().registerComponents();

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
            console.error("Error executing callback:", error);
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
        console.error("Error executing callback:", error);
    }
};

// Run new commands immediately
(window as any).advantageCmd = function (callback: any) {
    try {
        callback(actualAdvantageWrapAdSlotElement);
    } catch (error) {
        console.error("Error executing callback:", error);
    }
};

(window as any).advantage = Advantage.getInstance();
