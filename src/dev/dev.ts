import { Advantage } from "../advantage";
import localConfig from "./config";

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
