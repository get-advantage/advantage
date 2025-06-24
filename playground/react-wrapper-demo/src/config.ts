// Configuration for Advantage formats with format integrations
import { AdvantageFormatName, IAdvantageWrapper } from "../../../src/types";

class StyleManager {
    private static instances = new Map();
    private originalStyles = new Map();

    /**
     * Returns an instance of StyleManager for the specified identifier.
     * If an instance doesn't exist for the identifier, a new instance is created.
     * @param identifier - The identifier for the StyleManager instance.
     * @returns An instance of StyleManager.
     */
    static getInstance(identifier: string): StyleManager {
        if (!StyleManager.instances.has(identifier)) {
            StyleManager.instances.set(identifier, new StyleManager());
        }
        return StyleManager.instances.get(identifier);
    }

    /**
     * Sets the styles of an HTML element.
     * @param element - The HTML element to set the styles for.
     * @param styles - The styles to apply to the element.
     */
    setStyle(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
        if (!element) {
            console.error("Element is not defined");
            return;
        }
        const original: { [key: string]: string } = {};
        for (const [key, value] of Object.entries(styles)) {
            original[key] = element.style[key as any];
            // @ts-expect-error - TS doesn't know that key is a valid CSS property
            element.style[key as any] = value;
        }
        this.originalStyles.set(element, original);
    }

    /**
     * Restores the original styles of all elements that were modified using `setStyle`.
     */
    restoreStyles() {
        this.originalStyles.forEach((styles, element) => {
            for (const [key, value] of Object.entries(styles)) {
                element.style[key] = value;
            }
        });
        this.originalStyles.clear();
    }
}

const styleWelcomePageBar = (wrapper: any, title: string) => {
    console.log("Styling welcome page bar for", title);
};

export const advantageConfig = {
    formatIntegrations: [
        {
            format: "TOPSCROLL", // Using string instead of AdvantageFormatName.TopScroll for simplicity
            options: {
                closeButton: true,
                closeButtonText: "Fortsätt till sajt",
                downArrow: true,
                height: 80,
                closeButtonAnimationDuration: 0
            },
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                return new Promise<void>((resolve) => {
                    const styleManager = StyleManager.getInstance(
                        ad?.id ?? "TOPSCROLL"
                    );

                    console.log("ad: ", ad);

                    styleManager.setStyle(document.body as HTMLElement, {
                        marginTop: `80vh`
                    });
                    styleManager.setStyle(wrapper as HTMLElement, {
                        zIndex: `-1`,
                        position: "fixed"
                    });
                    styleManager.setStyle(ad as HTMLElement, {
                        width: "100vw",
                        height: "80vh",
                        position: "fixed",
                        top: "0",
                        left: "0"
                    });

                    resolve();
                });
            },
            reset(wrapper: IAdvantageWrapper, ad?: HTMLElement) {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? "TOPSCROLL"
                );

                console.log("reset!!!");
                styleManager.restoreStyles();
                document.body.style.marginTop = "";
            },
            close: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? "TOPSCROLL"
                );
                console.log("close!!! ", document.body);
                styleManager.restoreStyles();
                document.body.style.marginTop = "";
            }
        },
        {
            format: "MIDSCROLL",
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                return new Promise<void>((resolve) => {
                    const styleManager = StyleManager.getInstance(
                        ad?.id ?? "MIDSCROLL"
                    );

                    styleManager.setStyle(
                        wrapper.parentElement as HTMLElement,
                        {
                            position: "relative",
                            width: "100vw",
                            zIndex: "9999999999"
                        }
                    );
                    console.log(wrapper.parentElement);

                    styleManager.setStyle(
                        wrapper.parentElement?.parentElement
                            ?.parentElement as HTMLElement,
                        {
                            overflow: "visible"
                        }
                    );

                    const cords = (
                        wrapper.parentElement as HTMLElement
                    ).getBoundingClientRect();
                    if (cords.left > 0) {
                        styleManager.setStyle(
                            wrapper.parentElement as HTMLElement,
                            {
                                marginLeft: `-${cords.left}px`
                            }
                        );
                    }
                    resolve();
                });
            },
            reset(wrapper: IAdvantageWrapper, ad?: HTMLElement) {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? "MIDSCROLL"
                );
                styleManager.restoreStyles();
            },
            close(wrapper: IAdvantageWrapper, ad?: HTMLElement) {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? "MIDSCROLL"
                );
                styleManager.restoreStyles();
            }
        },
        {
            format: "WELCOME_PAGE",
            options: {
                autoCloseDuration: 999,
                siteTitle: "Test sida",
                logo: `https://icons.duckduckgo.com/ip3/${window.location.hostname}.ico`,
                continueToLabel: "Fortsätt till",
                scrollBackToTop: false,
                adLabel: "Annons"
            },
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                return new Promise<void>((resolve) => {
                    const styleManager = StyleManager.getInstance(
                        ad?.id ?? "WELCOME_PAGE"
                    );

                    styleManager.setStyle(ad?.parentElement as HTMLElement, {
                        margin: "0"
                    });
                    console.log(wrapper?.parentElement);
                    styleManager.setStyle(
                        wrapper?.parentElement as HTMLElement,
                        {
                            zIndex: "999999999"
                        }
                    );

                    styleManager.setStyle(document.body, {
                        paddingTop: "100vh",
                        overflow: "hidden"
                    });

                    styleWelcomePageBar(wrapper, "Breakit");
                    window.scrollTo(0, 0);
                    resolve();
                });
            },
            reset(wrapper: IAdvantageWrapper, ad?: HTMLElement) {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? "WELCOME_PAGE"
                );
                styleManager.restoreStyles();
            },
            close(wrapper: IAdvantageWrapper, ad?: HTMLElement) {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? "WELCOME_PAGE"
                );
                styleManager.restoreStyles();
            }
        }
    ]
};
