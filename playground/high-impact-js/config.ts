import { AdvantageFormatName, AdvantageConfig } from "../../src/types";
import logger from "../../src/utils/logging";

export default {
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            setup: () => {
                return new Promise<void>((resolve, reject) => {
                    resolve();
                });
            }
        },
        {
            format: AdvantageFormatName.Midscroll,
            setup: (wrapper) => {
                return new Promise<void>((resolve) => {
                    logger.debug(
                        "SETUP: Advantage.AdvantageWrapperElement",
                        "MIDSCROLL"
                    );

                    // Break out of parent container to full width
                    wrapper.style.cssText = `
                        position: relative;
                        left: 50%;
                        right: 50%;
                        margin-left: -50vw;
                        margin-right: -50vw;
                        width: 100vw;
                        max-width: 100vw;
                        box-sizing: border-box;
                    `;

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
