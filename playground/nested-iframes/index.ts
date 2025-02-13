import { Advantage } from "@src/advantage";
import { AdvantageFormatName } from "@src/types";
import logger from "@src/utils/logging";

/* 

This is the code that the publisher should include in their website.

*/

const advantage = Advantage.getInstance();

advantage.configure({
    /* Load the configuration from a remote file. Use your own logic for resolving a config url 
    configUrlResolver: () => {
        // You could use hostname or any other logic to determine the config file 
        // return `https://example.com/configs/${window.location.hostname}.js`;

        return "./config.ts";
    },
    */
    /* Or use a local configuration */
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
        }
    ]
});
