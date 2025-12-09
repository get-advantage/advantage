import { Advantage } from "./src/advantage";
import { topscroll } from "./src/advantage/formats/topscroll";
import { AdvantageFormatName } from "./src/types";

console.log("🚀 Repro Bug Script Loaded (Production Config)");

// --- Style Manager (from temp.js) ---
class StyleManager {
    static stringInstances = new Map();
    static elementInstances = new WeakMap();
    originalStyles = new Map();

    static getInstance(key: any) {
        if (typeof key === "string") {
            if (!StyleManager.stringInstances.has(key)) {
                StyleManager.stringInstances.set(key, new StyleManager());
            }
            return StyleManager.stringInstances.get(key);
        } else {
            if (!StyleManager.elementInstances.has(key)) {
                StyleManager.elementInstances.set(key, new StyleManager());
            }
            return StyleManager.elementInstances.get(key);
        }
    }

    setStyle(element: HTMLElement | null, styles: any) {
        if (!element) {
            console.error("Element is not defined");
            return;
        }
        let original = this.originalStyles.get(element) || {};
        for (let [prop, value] of Object.entries(styles)) {
            if (!(prop in original)) {
                original[prop] = element.style[prop as any];
            }
            element.style[prop as any] = value as string;
        }
        this.originalStyles.set(element, original);
    }

    restoreStyles() {
        this.originalStyles.forEach((styles, element) => {
            for (let [prop, value] of Object.entries(styles)) {
                element.style[prop as any] = value as string;
            }
        });
        this.originalStyles.clear();
    }
}

const advantage = Advantage.getInstance();

// --- Configuration from temp.js ---
advantage.configure({
    formats: [topscroll], // We only need TopScroll for this repro
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            options: {
                closeButton: true,
                closeButtonText: "Fortsätt till sajt",
                downArrow: true,
                height: 80,
                closeButtonAnimationDuration: 0
            },
            setup: (wrapper: any, iframe: any) =>
                new Promise<void>((resolve) => {
                    // Use the ID or fallback to format name
                    const key = iframe?.id ?? AdvantageFormatName.TopScroll;
                    const styleManager = StyleManager.getInstance(key);

                    // Apply the problematic styles that persist
                    styleManager.setStyle(
                        document.querySelector(".container"),
                        {
                            position: "relative",
                            marginTop: "80svh",
                            zIndex: "1"
                        }
                    );
                    styleManager.setStyle(document.querySelector("main"), {
                        position: "absolute",
                        top: "0"
                    });

                    const mainContainer = document
                        .querySelector("main")
                        ?.querySelector(".container");
                    const container = document.querySelector(
                        ".container"
                    ) as HTMLElement;

                    if (mainContainer && container) {
                        styleManager.setStyle(mainContainer, {
                            paddingTop: container.offsetHeight + "px"
                        });
                    }

                    resolve();
                }),
            reset(wrapper: any, iframe: any) {
                const key = iframe?.id ?? AdvantageFormatName.TopScroll;
                StyleManager.getInstance(key).restoreStyles();
            },
            close: (wrapper: any, iframe: any) => {
                const key = iframe?.id ?? AdvantageFormatName.TopScroll;
                StyleManager.getInstance(key).restoreStyles();
            }
        }
    ]
});

// Expose for debugging
(window as any).advantage = advantage;
