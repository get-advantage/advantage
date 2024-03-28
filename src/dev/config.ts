import { AdvantageFormatName, IAdvantageWrapper } from "../types";

export default {
    formats: [
        {
            name: "MyCustomFormat",
            description: "A custom format",
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                return new Promise<void>((resolve) => {
                    wrapper.style.cssText = `position: relative; width: 100vw; height: 80vh;`;
                    if (ad) {
                        ad.style.cssText =
                            "position: fixed; width: 100vw; height: 80vh;";
                    }

                    resolve();
                });
            },
            reset: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                if (ad) {
                    ad.style.cssText = "display: none;";
                }
                wrapper.resetCSS();
            }
        }
    ],
    formatIntegrations: [
        {
            name: AdvantageFormatName.TopScroll,
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
