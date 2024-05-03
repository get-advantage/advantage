import { AdvantageFormatName, IAdvantageWrapper } from "@src/types";

export default {
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
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
            }
            /*
            onClose: () => {
                console.log("Closing top scroll format");
            }
            onReset: () => {
                console.log("Resetting top scroll format");
            }
            */
        }
    ]
};
