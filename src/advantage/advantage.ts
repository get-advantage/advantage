import { logger } from "../utils";

import type {
    AdvantageConfig,
    IAdvantageWrapper,
    AdvantageFormat,
    AdvantageFormatIntegration
} from "../types";
import { defaultFormats } from "./formats";

/**
 * The main class for the Advantage library. This class is a singleton and is used to configure the library, register wrappers, and register custom elements.
 * @public
 */
export class Advantage {
    private static instance: Advantage | null = null;
    config: AdvantageConfig | null = null;
    defaultFormats: AdvantageFormat[] = defaultFormats;
    wrappers: IAdvantageWrapper[] = [];
    #customWrappers: HTMLElement[] = [];
    formats: Map<string, AdvantageFormat> = new Map();
    formatIntegrations: Map<string, AdvantageFormatIntegration> = new Map();
    public static id = 0;

    private constructor() {
        Advantage.id++;
        logger.info("Advantage constructor", Advantage.id);
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
        this.wrappers.push(wrapper);
        logger.info("Wrapper registered", wrapper);
    }

    // Public method to register a custom wrapper with the library.
    public registerCustomWrapper(wrapper: HTMLElement) {
        this.#customWrappers.push(wrapper);
        logger.info("Custom wrapper registered", wrapper);
    }

    // Public method to get a reference to the singleton instance of the library.
    public static getInstance(): Advantage {
        if (!Advantage.instance) {
            logger.info("Creating a new instance of Advantage");
            Advantage.instance = new Advantage();
        }
        return Advantage.instance;
    }

    // Private method to load the configuration from a remote file.
    private loadConfig(configUrl: string) {
        logger.info(`⬇ Loading config from remote URL: ${configUrl}`);
        import(/* @vite-ignore */ configUrl)
            .then((module) => {
                this.applyConfig(module.default);
            })
            .catch((e) => {
                logger.error("Error fetching config", e);
            });
    }

    // Private method to apply the configuration to the library.
    private applyConfig(config: AdvantageConfig) {
        this.config = config;
        if (config.formats) {
            this.mergeUniqueFormats(this.defaultFormats, config.formats);
        } else {
            this.formats = new Map(defaultFormats.map((f) => [f.name, f]));
        }
        logger.info("Format configurations applied ✅", this.formats);
        if (config.formatIntegrations) {
            for (const integration of config.formatIntegrations) {
                this.formatIntegrations.set(integration.format, integration);
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
