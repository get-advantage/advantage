import { AdvantageFormatName, IAdvantageWrapper } from "../types";

export default {
    formats: [
        {
            name: "MyCustomFormat",
            description: "A custom format",
            setup: (wrapper: IAdvantageWrapper, ad: HTMLElement) => {
                wrapper.style.cssText = `position: relative; width: 100vw; height: 80vh;`;
                ad.style.cssText =
                    "position: fixed; width: 100vw; height: 80vh;";
            },
            teardown: (wrapper: IAdvantageWrapper, ad: HTMLElement) => {
                ad.style.cssText = "";
                wrapper.resetCSS();
            }
        }
    ],
    formatIntegrations: [
        {
            name: AdvantageFormatName.TopScroll,
            setup: () => {
                console.log("Running custom integration for top scroll format");
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
