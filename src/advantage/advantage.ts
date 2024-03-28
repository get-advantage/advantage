import { logger } from "../utils";
import { AdvantageWrapper } from "./wrapper";
import { AdvantageUILayer } from "./ui-layer";

import type {
    AdvantageConfig,
    IAdvantageWrapper,
    AdvantageFormat,
    AdvantageFormatIntegration
} from "../types";
import { defaultFormats } from "./formats";

export class Advantage {
    private static instance: Advantage;
    config: AdvantageConfig | null = null;
    #defaultFormats: AdvantageFormat[] = defaultFormats;
    #wrappers: IAdvantageWrapper[] = [];
    formats: Map<string, AdvantageFormat> = new Map();
    formatIntegrations: Map<string, AdvantageFormatIntegration> = new Map();

    private constructor() {
        logger.info("Advantage constructor");
    }
    // Entry point for the library. This is where the configuration is loaded and the library is initialized.
    public configure(config: AdvantageConfig) {
        if (config.configUrlResolver) {
            logger.info("Config URL resolver provided");
            this.loadConfig(config.configUrlResolver());
        } else {
            logger.info(
                "No config URL resolver provided, using provided config"
            );
            this.applyConfig(config);
        }
    }

    // Public method to register a wrapper with the library.
    public registerWrapper(wrapper: IAdvantageWrapper) {
        this.#wrappers.push(wrapper);
        logger.info("Wrapper registered", wrapper);
    }

    // Public method to get a reference to the singleton instance of the library.
    public static getInstance(): Advantage {
        if (!Advantage.instance) {
            logger.info("Creating a new instance of Advantage");
            Advantage.instance = new Advantage();
        }
        return Advantage.instance;
    }

    // Public method to register the custom elements with the browser.
    public registerComponents() {
        customElements.define("advantage-wrapper", AdvantageWrapper);
        customElements.define("advantage-ui-layer", AdvantageUILayer);
        logger.info(
            "Components registered: <advantage-wrapper>, <advantage-ui-layer> ✅"
        );
    }

    // Private method to load the configuration from a remote file.
    private loadConfig(configUrl: string) {
        logger.info(`⬇ Loading config from remote URL: ${configUrl}`);
        import(/* @vite-ignore */ configUrl)
            .then((module) => {
                this.applyConfig(module.default);
            })
            .catch((e) => {
                console.error("Error fetching config", e);
            });
    }

    // Private method to apply the configuration to the library.
    private applyConfig(config: AdvantageConfig) {
        this.config = config;
        if (config.formats) {
            this.mergeUniqueFormats(this.#defaultFormats, config.formats);
            logger.info("Format configurations applied ✅", this.formats);
        }
        if (config.formatIntegrations) {
            for (const integration of config.formatIntegrations) {
                this.formatIntegrations.set(integration.name, integration);
            }
            logger.info(
                "Format integrations applied ✅",
                this.formatIntegrations
            );
        }
    }

    // Private helper method to merge the default formats with the user provided formats.
    private mergeUniqueFormats(
        localFormats: AdvantageFormat[],
        userFormats: AdvantageFormat[]
    ): AdvantageFormat[] {
        const mergedArray = [...localFormats, ...userFormats];
        const formatsMap = new Map<string, AdvantageFormat>();
        for (const item of mergedArray) {
            formatsMap.set(item.name, item);
        }
        this.formats = formatsMap;
        return Array.from(formatsMap.values());
    }
}
