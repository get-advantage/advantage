import {
    AdvantageFormatName,
    IAdvantageWrapper,
    AdvantageConfig
} from "@src/types";
import logger from "@src/utils/logging";

export default {
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
            options: {
                closeButtonAnimationDuration: 2
            },
            setup: (wrapper, ad) => {
                console.log(wrapper, ad);
                return new Promise<void>((resolve, reject) => {
                    const queryParams = new URLSearchParams(
                        window.location.search
                    );
                    const simulateIntegrationError = queryParams.get(
                        "simulateIntegrationError"
                    );

                    if (simulateIntegrationError === "true") {
                        reject();
                    } else {
                        resolve();
                    }
                });
            },
            close: () => {
                logger.debug("Closing top scroll format");
            },
            reset: () => {
                logger.debug("Resetting top scroll format");
            }
        },
        {
            format: AdvantageFormatName.DoubleMidscroll,
            options: {
                allowedOrigins: ["http://localhost:5173"]
            },
            setup: () => {},
            close: () => {
                logger.debug("Closing double midscroll format");
            },
            reset: () => {
                logger.debug("Resetting double midscroll format");
            }
        },
        {
            format: AdvantageFormatName.TripleMidscroll,
            options: {
                allowedOrigins: ["http://localhost:5173"]
            },
            setup: () => {},
            close: () => {
                logger.debug("Closing triple midscroll format");
            },
            reset: () => {
                logger.debug("Resetting triple midscroll format");
            }
        }
    ]
} as AdvantageConfig;
