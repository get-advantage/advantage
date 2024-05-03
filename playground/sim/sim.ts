//import { IAdvantageWrapper } from "../types";
import { Advantage } from "@src/advantage";
import localConfig from "./config";

const advantage = Advantage.getInstance();

advantage.configure({
    /* Load the configuration from a remote file. Use your own logic for resolving a config url */
    configUrlResolver: () => {
        /* You could use hostname or any other logic to determine the config file 
        return `https://example.com/configs/${window.location.hostname}.js`;
        */
        return "./config.ts";
    },
    /* Or use a local configuration */
    ...localConfig
});
/*
const firstWrapper = document.querySelector(
    "advantage-wrapper"
) as IAdvantageWrapper;

setTimeout(() => {
    console.log("Simulating format request", firstWrapper);
    firstWrapper.simulateFormat("TOPSCROLL");
}, 500);
*/
