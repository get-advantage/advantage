import {
    AdvantageFormatName,
    IAdvantageWrapper,
    AdvantageConfig
} from "@src/types";
import logger from "@src/utils/logging";

export default {
    // Enable High Impact JS compatibility layer
    enableHighImpactCompatibility: true,

    formats: [
        {
            name: "MyCustomFormat",
            description: "A custom format",
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLIFrameElement) => {
                return new Promise<void>((resolve) => {
                    wrapper.style.cssText = `position: relative; width: 100vw; height: 80vh;`;
                    if (ad) {
                        ad.style.cssText =
                            "position: fixed; width: 100vw; height: 80vh;";
                    }

                    resolve();
                });
            },
            reset: (wrapper: IAdvantageWrapper, ad?: HTMLIFrameElement) => {
                if (ad) {
                    ad.style.cssText = "display: none;";
                }
                wrapper.resetCSS();
            }
        }
    ],
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            // uncomment to show/hide UI elements
            // options: {
            //     closeButton: true,
            //     downArrow: false,
            //     closeButtonText: "Lukk"
            // },
            setup: () => {
                return new Promise<void>((resolve, reject) => {
                    const queryParams = new URLSearchParams(
                        window.location.search
                    );
                    const delay = queryParams.get("delay") || "0";
                    const doReject = queryParams.get("reject") === "true";
                    logger.debug(
                        `SETUP: Integration will ${
                            doReject ? "reject" : "resolve"
                        } after ${delay}ms`
                    );
                    setTimeout(() => {
                        if (doReject) {
                            reject();
                        } else {
                            resolve();
                        }
                    }, parseInt(delay));
                });
            }
        },
        {
            format: AdvantageFormatName.Midscroll,
            setup: () => {
                return new Promise<void>((resolve) => {
                    logger.debug(
                        "SETUP: Advantage.AdvantageWrapperElement",
                        "MIDSCROLL"
                    );

                    resolve();
                });
            }
        },
        {
            format: AdvantageFormatName.DoubleMidscroll,
            options: {
                allowedOrigins: [
                    "http://localhost:5173", // Local development
                    "https://get-advantage.org" // Production
                ]
            },
            setup: () => {
                return new Promise<void>((resolve) => {
                    logger.debug(
                        "SETUP: Advantage.AdvantageWrapperElement",
                        "DOUBLE_MIDSCROLL"
                    );
                    resolve();
                });
            }
        },
        {
            format: AdvantageFormatName.WelcomePage,
            options: {
                autoCloseDuration: 18
            },
            setup: () => {
                return new Promise<void>((resolve) => {
                    logger.debug(
                        "SETUP: Advantage.AdvantageWrapperElement",
                        "WELCOME_PAGE"
                    );
                    resolve();
                });
            }
        }
    ]
} as AdvantageConfig;
