import { Advantage } from "../advantage";
import { AdvantageAdSlotResponder } from "../advantage-protocol/publisher";
import localConfig from "./config";

/* 

This is the code that the publisher should include in their website.

*/

const advantage = Advantage.getInstance();

advantage.configure({
    /* Load the configuration from a remote file. Use your own logic for resolving a config url */
    configUrlResolver: () => {
        /* You could use hostname or any other logic to determine the config file 
        return `https://example.com/configs/${window.location.hostname}.js`;
        */
        return "/src/dev/config.ts";
    },
    /* Or use a local configuration */
    ...localConfig
});

// Advantage Publisher API
new AdvantageAdSlotResponder({
    adSlotElement: document.querySelector("#custom")!,
    formatRequestHandler: (format, elem) => {
        console.log("Requesting format", format, elem);
    }
});
/*
setTimeout(() => {
    const midscroll = document.querySelector("#midscroll");
    midscroll?.parentElement?.removeChild(midscroll);
}, 5000);
*/
