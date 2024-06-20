import { Advantage, AdvantageFormatName } from "@src/advantage";

/* 

This is the code that the publisher should include in their website.

*/

const advantage = Advantage.getInstance();

advantage.configure({
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            setup: () => {
                return new Promise<void>((resolve) => {
                    /* Setup your site to accomodate the topscroll format here.
                    Perhaps you might need to hide a sticky header menu or similar. */

                    // call resolve when done
                    resolve();
                });
            }
            /*
            close: () => {
                console.log("Closing top scroll format");
            }
            reset: () => {
                console.log("Resetting top scroll format");
            }
            */
        },
        {
            format: AdvantageFormatName.Midscroll,
            setup: () => {
                return new Promise<void>((resolve) => {
                    /* Setup your site to accomodate the Midscroll format here.
                    Perhaps you might need to adjust the wrapper to occupy 100% of page width or similar. */

                    // call resolve when done
                    resolve();
                });
            }
        }
    ]
});
