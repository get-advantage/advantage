/**
 * Matplatsen Test Bundle
 *
 * Temporary entry point for testing the Advantage + High Impact JS compatibility
 * layer on matplatsen.se. Includes the site's format integrations inline.
 *
 * Build with: npm run bundle:matplatsen
 */

import { Advantage } from "./advantage/index";
import { AdvantageFormatName, IAdvantageWrapper } from "./types";

// StyleManager - utility used by the site's format integrations
// Copied from the site's bundle since it's not part of Advantage core
class StyleManager {
    static stringInstances = new Map<string, StyleManager>();
    static elementInstances = new WeakMap<object, StyleManager>();
    originalStyles = new Map<HTMLElement, Record<string, string>>();

    static getInstance(key: any): StyleManager {
        if (typeof key === "string") {
            if (!StyleManager.stringInstances.has(key)) {
                StyleManager.stringInstances.set(key, new StyleManager());
            }
            return StyleManager.stringInstances.get(key)!;
        } else {
            if (!StyleManager.elementInstances.has(key)) {
                StyleManager.elementInstances.set(key, new StyleManager());
            }
            return StyleManager.elementInstances.get(key)!;
        }
    }

    setStyle(element: HTMLElement | null, styles: Record<string, string>) {
        if (!element) {
            console.error("Element is not defined");
            return;
        }
        let original = this.originalStyles.get(element) || {};
        for (const [prop, value] of Object.entries(styles)) {
            if (!(prop in original)) {
                original[prop] = (element.style as any)[prop];
            }
            (element.style as any)[prop] = value;
        }
        this.originalStyles.set(element, original);
    }

    restoreStyles() {
        this.originalStyles.forEach((styles, element) => {
            for (const [prop, value] of Object.entries(styles)) {
                (element.style as any)[prop] = value;
            }
        });
        this.originalStyles.clear();
    }
}

// Configure Advantage with matplatsen's format integrations
const advantage = Advantage.getInstance();
advantage.configure({
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            options: {
                closeButton: true,
                closeButtonText: "Annons - Stäng",
                downArrow: true,
                height: 80,
                closeButtonAnimationDuration: 0.5
            },
            setup: (
                wrapper: IAdvantageWrapper,
                iframe?: HTMLElement
            ) =>
                new Promise<void>((resolve) => {
                    StyleManager.getInstance(
                        iframe?.id ?? AdvantageFormatName.TopScroll
                    );
                    resolve();
                }),
            reset(wrapper: IAdvantageWrapper, iframe?: HTMLElement) {
                StyleManager.getInstance(
                    iframe?.id ?? AdvantageFormatName.TopScroll
                ).restoreStyles();
            },
            close: (
                wrapper: IAdvantageWrapper,
                iframe?: HTMLElement
            ) => {
                StyleManager.getInstance(
                    iframe?.id ?? AdvantageFormatName.TopScroll
                ).restoreStyles();
            }
        },
        {
            format: AdvantageFormatName.Midscroll,
            setup: (
                wrapper: IAdvantageWrapper,
                iframe?: HTMLElement
            ) =>
                new Promise<void>((resolve) => {
                    const sm = StyleManager.getInstance(
                        iframe?.id ?? AdvantageFormatName.Midscroll
                    );
                    sm.setStyle(wrapper.parentElement, {
                        position: "relative",
                        width: "100vw",
                        zIndex: "9999999999"
                    });
                    const rect =
                        wrapper.parentElement?.getBoundingClientRect();
                    if (rect && rect.left > 0) {
                        sm.setStyle(wrapper.parentElement, {
                            marginLeft: `-${rect.left}px`
                        });
                    }
                    resolve();
                }),
            reset(wrapper: IAdvantageWrapper, iframe?: HTMLElement) {
                StyleManager.getInstance(
                    iframe?.id ?? AdvantageFormatName.Midscroll
                ).restoreStyles();
            },
            close(wrapper: IAdvantageWrapper, iframe?: HTMLElement) {
                StyleManager.getInstance(
                    iframe?.id ?? AdvantageFormatName.Midscroll
                ).restoreStyles();
            }
        },
        {
            format: AdvantageFormatName.WelcomePage,
            options: {
                autoCloseDuration: 20,
                siteTitle: `${window.innerWidth < 450 ? "" : "Matplatsen"}`,
                logo: `https://icons.duckduckgo.com/ip3/${window.location.hostname}.ico`,
                continueToLabel: "Fortsätt till",
                scrollBackToTop: false,
                adLabel: "Annons"
            },
            setup: (
                wrapper: IAdvantageWrapper,
                iframe?: HTMLElement
            ) =>
                new Promise<void>((resolve) => {
                    const sm = StyleManager.getInstance(
                        iframe?.id ?? AdvantageFormatName.WelcomePage
                    );
                    sm.setStyle(iframe?.parentElement as HTMLElement, {
                        margin: "0"
                    });
                    sm.setStyle(wrapper.parentElement, {
                        position: "relative",
                        zIndex: "9999999999"
                    });
                    sm.setStyle(document.body, {
                        paddingTop: "100vh",
                        overflow: "hidden"
                    });
                    resolve();
                }),
            reset(wrapper: IAdvantageWrapper, iframe?: HTMLElement) {
                StyleManager.getInstance(
                    iframe?.id ?? AdvantageFormatName.WelcomePage
                ).restoreStyles();
            },
            close(wrapper: IAdvantageWrapper, iframe?: HTMLElement) {
                StyleManager.getInstance(
                    iframe?.id ?? AdvantageFormatName.WelcomePage
                ).restoreStyles();
            }
        }
    ]
});

// Re-export everything
export * from "./advantage/index";

if (typeof window !== "undefined") {
    (window as any).Advantage = Advantage;
    (window as any).advantageInstance = advantage;
}
