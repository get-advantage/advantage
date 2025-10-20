/**
 * @fileoverview High Impact JS Compatibility Layer for Advantage
 *
 * This module provides a compatibility layer that allows existing High Impact JS users
 * to transition easily to Advantage. It maintains the core High Impact JS API
 * while internally using Advantage's AdvantageWrapper system.
 *
 * Core features supported:
 * - defineSlot() API for slot configuration
 * - setConfig() for global settings
 * - setTemplateConfig() for template-specific options
 * - waitForAdSignal support for creative communication
 * - Plugin system for GAM and Xandr integration
 * - Async command queue (cmd.push)
 */

import { AdvantageFormatName } from "../../types";
import { GAMPlugin } from "./plugins/gam";
import { XandrPlugin } from "./plugins/xandr";
import {
    CompatibilityPlugin,
    SlotConfig,
    TemplateConfig,
    GlobalConfig
} from "./types";
import logger from "../../utils/logging";

/**
 * Internal state object to store slot configurations
 */
const state = {
    slots: {} as Record<string, SlotConfig>,
    plugins: {} as Record<string, CompatibilityPlugin>,
    config: {} as GlobalConfig,
    templateConfig: {} as Record<string, TemplateConfig>,
    initialized: false,
    pluginsReady: false,
    pluginSetupInProgress: false, // Prevent multiple simultaneous plugin setups
    messageQueue: [] as Array<{
        source?: Window;
        adMessageData?: any;
        iframeName?: string;
    }>
};

/**
 * Maps High Impact JS template names to Advantage format names
 */
const TEMPLATE_TO_FORMAT_MAP: Record<string, AdvantageFormatName> = {
    topscroll: AdvantageFormatName.TopScroll,
    midscroll: AdvantageFormatName.Midscroll,
    "double-fullscreen": AdvantageFormatName.DoubleMidscroll
};

/**
 * Test tag injection utility for testing purposes
 */
const injectTestTagInAdWrapper = (
    containerElement: HTMLElement,
    config: Partial<SlotConfig> = {}
): void => {
    try {
        const iframe = containerElement.querySelector(
            "iframe"
        ) as HTMLIFrameElement;
        if (!iframe || !config.testTagToBeInserted) return;

        const iframeContent =
            iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeContent) return;

        // Hide existing content
        for (const child of Array.from(iframeContent.body.children)) {
            (child as HTMLElement).style.display = "none";
        }

        // Create temporary container and parse HTML
        const tmp = document.createElement("div");
        tmp.innerHTML = config.testTagToBeInserted;

        // Append content (simplified version without script handling)
        iframeContent.body.append(...Array.from(tmp.childNodes));
    } catch (e) {
        logger.debug(
            "Error injecting test tag - possibly because of cross-origin restrictions or safe frame",
            e
        );
    }
};

/**
 * Checks if a slot should be ignored based on HTML content
 */
const shouldIgnore = (html: string): boolean => {
    if (state.config.ignoreSlotOn) {
        return state.config.ignoreSlotOn(html);
    }
    return false;
};

/**
 * Converts High Impact JS template config to Advantage format options
 * This is a simplified mapping focused on the most important options
 */
const convertTemplateConfigToFormatOptions = (
    template: string,
    templateConfig: TemplateConfig,
    _globalConfig: GlobalConfig
) => {
    logger.debug(
        `🔧 [CONVERSION DEBUG] Converting template config for '${template}':`,
        templateConfig
    );
    const options: any = {};

    switch (template) {
        case "topscroll":
            if (templateConfig.showCloseButton !== undefined) {
                options.closeButton = templateConfig.showCloseButton;
            }
            if (templateConfig.title) {
                options.closeButtonText = templateConfig.title;
            }
            if (templateConfig.peekAmount) {
                logger.debug(
                    `🔧 [CONVERSION DEBUG] Processing peekAmount: "${templateConfig.peekAmount}"`
                );
                const match = templateConfig.peekAmount.match(/(\d+)(vh|%)/);
                logger.debug(
                    `🔧 [CONVERSION DEBUG] Regex match result:`,
                    match
                );
                if (match) {
                    options.height = parseInt(match[1]);
                    logger.debug(
                        `🔧 [CONVERSION DEBUG] Set height to: ${options.height}`
                    );
                } else {
                    logger.debug(
                        `🔧 [CONVERSION DEBUG] No regex match for peekAmount`
                    );
                }
            }
            options.downArrow = true;
            break;

        case "midscroll":
            if (templateConfig.peekAmount) {
                const match = templateConfig.peekAmount.match(/(\d+)(vh|%)/);
                if (match) {
                    options.height = parseInt(match[1]);
                }
            }
            break;

        default:
            // For other templates, use minimal options
            break;
    }

    logger.debug(
        `🔧 [CONVERSION DEBUG] Final format options for '${template}':`,
        options
    );
    return options;
};

/**
 * Handles when an ad slot is rendered
 */
const onAdSlotRendered = (options: {
    elementId: string;
    plugin: string;
    fromAdResponsiveSignal?: boolean;
    adIframe?: HTMLElement;
    adWrapper?: HTMLElement;
    adUnit?: HTMLElement;
    size?: [number, number];
    html?: string;
    adMessageData?: any;
}) => {
    const slotRenderStartTime = performance.now();
    const {
        elementId,
        plugin,
        fromAdResponsiveSignal = false,
        adIframe,
        adWrapper,
        size,
        html
    } = options;
    logger.debug(
        `⚡ [TIMING] onAdSlotRendered called for ${elementId} at ${slotRenderStartTime.toFixed(
            2
        )}ms`
    );

    logger.debug(
        `[High Impact Compatibility] Ad slot rendered: ${elementId} via ${plugin}`
    );

    logger.debug(
        `📢 [AD SLOT DEBUG] Ad slot rendered: ${elementId} via ${plugin}, fromAdResponsiveSignal: ${fromAdResponsiveSignal}`
    );

    const config = getSlotConfig(elementId);
    if (!config) {
        logger.debug(`❌ [AD SLOT DEBUG] No config found for ${elementId}`);
        logger.debug(
            `[High Impact Compatibility] No config found for ${elementId}`
        );
        return;
    }

    logger.debug(`✅ [AD SLOT DEBUG] Found config for ${elementId}:`, {
        template: config.template,
        waitForAdSignal: config.waitForAdSignal,
        rendered: !!config.rendered,
        preWrapped: config.preWrapped
    });

    // Check if already rendered
    if (config.rendered) {
        if (fromAdResponsiveSignal) {
            logger.debug(
                `[High Impact Compatibility] Already rendered ${elementId} - skipping`
            );
            return;
        } else {
            logger.debug(
                `[High Impact Compatibility] Already rendered ${elementId} - cleaning up`
            );
            if (config.rendered.destroy) {
                config.rendered.destroy();
            }
            config.rendered = false;
        }
    } else {
        // Inject test tag if specified
        if (adWrapper) {
            injectTestTagInAdWrapper(adWrapper, config);
        }
    }

    // Check if size matches config
    if (config.sizes && config.sizes.length > 0) {
        const sizeExistInConfig = config.sizes.some(
            (s) => JSON.stringify(s) === JSON.stringify(size)
        );
        if (!sizeExistInConfig) {
            logger.debug(
                `[High Impact Compatibility] Size ${size} not in config for ${elementId}`
            );
            return;
        }
    }

    // Check if we should wait for ad signal
    if (config.waitForAdSignal && !fromAdResponsiveSignal) {
        logger.debug(
            `⏸️ [AD SLOT DEBUG] Waiting for ad signal for ${elementId} (waitForAdSignal: ${config.waitForAdSignal}, fromAdResponsiveSignal: ${fromAdResponsiveSignal})`
        );
        logger.debug(
            `[High Impact Compatibility] Waiting for ad signal for ${elementId}`
        );
        return;
    }

    logger.debug(
        `🚀 [AD SLOT DEBUG] Proceeding with format transformation for ${elementId} (waitForAdSignal: ${config.waitForAdSignal}, fromAdResponsiveSignal: ${fromAdResponsiveSignal})`
    );

    // Check if we should ignore this slot
    if (html && shouldIgnore(html)) {
        logger.debug(
            `[High Impact Compatibility] Ignoring slot ${elementId} based on HTML content`
        );
        return;
    }

    // If no template specified, skip (slots without templates remain as regular banners)
    if (!config.template) {
        logger.debug(
            `[High Impact Compatibility] No template specified for ${elementId} - remaining as regular banner`
        );
        return;
    }

    // Get the Advantage format name
    const advantageFormat = TEMPLATE_TO_FORMAT_MAP[config.template];
    if (!advantageFormat) {
        logger.debug(
            `[High Impact Compatibility] Unknown template: ${config.template}`
        );
        return;
    }

    // Get template configuration
    const templateConfig = getTemplateConfig(config.template);
    const globalConfig = getConfig();
    const formatOptions = convertTemplateConfigToFormatOptions(
        config.template,
        templateConfig,
        globalConfig
    );

    logger.debug(
        `[High Impact Compatibility] Converting ${config.template} to ${advantageFormat} (size: ${size})`
    );

    logger.debug(
        `🎯 DEBUG: Starting format conversion for ${config.template} → ${advantageFormat}`
    );
    logger.debug(`🎯 DEBUG: adWrapper:`, adWrapper);
    logger.debug(`🎯 DEBUG: adIframe:`, adIframe);
    logger.debug(`🎯 DEBUG: config.preWrapped:`, config.preWrapped);
    logger.debug(`🎯 DEBUG: config.wrapperElement:`, config.wrapperElement);

    try {
        // Check if this ad unit was pre-wrapped
        let wrapper: any = null;
        let advantageWrapperElement: HTMLElement | null = null;

        if (config.preWrapped && config.wrapperElement) {
            // Use the pre-wrapped element
            advantageWrapperElement = config.wrapperElement;
            wrapper = (advantageWrapperElement as any).advantageWrapper;

            logger.debug(
                `🎯 DEBUG: Using pre-wrapped element, wrapper found:`,
                !!wrapper
            );
            logger.debug(
                `[High Impact Compatibility] Using pre-wrapped element for ${elementId}`
            );
        } else {
            // Check if there's already a wrapper in the DOM
            wrapper = (adWrapper as any).advantageWrapper;
            logger.debug(
                `🎯 DEBUG: Looking for wrapper on adWrapper, found:`,
                !!wrapper
            );
        }

        if (!wrapper) {
            logger.debug(`🎯 DEBUG: No wrapper found, creating new one`);
            if (!advantageWrapperElement) {
                // Create new wrapper - this is the fallback for non-pre-wrapped elements
                advantageWrapperElement =
                    document.createElement("advantage-wrapper");
                const slotDiv = document.createElement("div");
                slotDiv.setAttribute("slot", "advantage-ad-slot");

                logger.debug(`🎯 DEBUG: Moving iframe into new wrapper`);
                // Move the ad iframe into the advantage wrapper
                if (adIframe) {
                    slotDiv.appendChild(adIframe);
                }
                advantageWrapperElement.appendChild(slotDiv);

                // Replace the original ad wrapper with advantage wrapper
                if (adWrapper) {
                    adWrapper.parentNode?.replaceChild(
                        advantageWrapperElement,
                        adWrapper
                    );
                }
                logger.debug(
                    `🎯 DEBUG: Replaced adWrapper with advantage-wrapper in DOM`
                );
            }

            // Wait for the custom element to be defined and upgraded
            logger.debug(
                `⏳ [WRAPPER DEBUG] Waiting for advantage-wrapper custom element definition for ${config.template}...`
            );
            logger.debug(
                `🎯 DEBUG: Waiting for advantage-wrapper custom element definition`
            );
            customElements.whenDefined("advantage-wrapper").then(() => {
                logger.debug(
                    `✅ [WRAPPER DEBUG] advantage-wrapper custom element defined for ${config.template}`
                );
                wrapper = (advantageWrapperElement as any).advantageWrapper;
                logger.debug(
                    `🎯 DEBUG: Custom element defined, wrapper instance:`,
                    !!wrapper
                );
                if (wrapper) {
                    logger.debug(
                        `🎯 DEBUG: Calling wrapper.forceFormat(${advantageFormat}) with iframe`
                    );
                    // Force the format transformation
                    wrapper
                        .forceFormat(advantageFormat, adIframe, formatOptions)
                        .then(() => {
                            logger.debug(
                                `✅ [FORMAT SUCCESS] Successfully applied ${advantageFormat} format to ${config.template} slot!`
                            );
                            logger.debug(
                                `🎯 DEBUG: Successfully applied ${advantageFormat} format!`
                            );
                            logger.debug(
                                `[High Impact Compatibility] Successfully applied ${advantageFormat} format`
                            );

                            // Mark as rendered
                            config.rendered = {
                                wrapper,
                                destroy: () => {
                                    wrapper?.reset();
                                }
                            };

                            // Dispatch High Impact JS event for compatibility
                            window.dispatchEvent(
                                new CustomEvent("high-impact-ad-rendered", {
                                    detail: {
                                        size: {
                                            width:
                                                adIframe?.clientWidth ||
                                                size?.[0] ||
                                                0,
                                            height:
                                                adIframe?.clientHeight ||
                                                size?.[1] ||
                                                0
                                        },
                                        template: config.template,
                                        advantageFormat
                                    }
                                })
                            );
                        })
                        .catch((error: any) => {
                            console.error(
                                `❌ [FORMAT ERROR] Failed to apply ${advantageFormat} format to ${config.template}:`,
                                error
                            );
                            logger.debug(
                                `🎯 DEBUG: ERROR applying format:`,
                                error
                            );
                            logger.error(
                                `[High Impact Compatibility] Failed to apply format: ${error}`
                            );
                        });
                } else {
                    logger.debug(
                        `🎯 DEBUG: No wrapper instance found after custom element definition!`
                    );
                }
            });
        } else {
            logger.debug(
                `🎯 DEBUG: Wrapper already exists, calling forceFormat directly`
            );
            // Wrapper already exists, just force the format
            wrapper
                .forceFormat(advantageFormat, adIframe, formatOptions)
                .then(() => {
                    logger.debug(
                        `✅ [FORMAT SUCCESS] Successfully applied ${advantageFormat} format to existing ${config.template} wrapper!`
                    );
                    logger.debug(
                        `🎯 DEBUG: Successfully applied ${advantageFormat} format to existing wrapper!`
                    );
                    logger.debug(
                        `[High Impact Compatibility] Successfully applied ${advantageFormat} format to existing wrapper`
                    );

                    config.rendered = {
                        wrapper,
                        destroy: () => {
                            wrapper?.reset();
                        }
                    };

                    // Dispatch event
                    window.dispatchEvent(
                        new CustomEvent("high-impact-ad-rendered", {
                            detail: {
                                size: {
                                    width:
                                        adIframe?.clientWidth || size?.[0] || 0,
                                    height:
                                        adIframe?.clientHeight || size?.[1] || 0
                                },
                                template: config.template,
                                advantageFormat
                            }
                        })
                    );
                })
                .catch((error: any) => {
                    logger.error(
                        `[High Impact Compatibility] Failed to apply format: ${error}`
                    );
                });
        }
    } catch (error) {
        logger.error(
            `[High Impact Compatibility] Error processing ad slot: ${error}`
        );
    }
};

/**
 * Pre-wraps an ad unit with AdvantageWrapper based on slot configuration
 * This ensures Advantage creatives can communicate immediately when they load
 */
const preWrapAdUnit = (slotConfig: SlotConfig): void => {
    logger.debug(
        `🔧 [Pre-wrapping] Starting pre-wrap for ad unit: ${slotConfig.adUnitId}`
    );

    // Add to window for debugging
    (window as any).preWrapDebug = (window as any).preWrapDebug || [];
    (window as any).preWrapDebug.push(
        `Pre-wrap called for ${slotConfig.adUnitId}`
    );

    // Try immediate wrapping first
    if (attemptPreWrap(slotConfig)) {
        logger.debug(
            `✅ [Pre-wrapping] Immediate pre-wrap successful for ${slotConfig.adUnitId}`
        );
        (window as any).preWrapDebug.push(
            `Pre-wrap successful for ${slotConfig.adUnitId}`
        );
        return;
    }

    logger.debug(
        `⏳ [Pre-wrapping] Immediate pre-wrap failed, setting up deferred wrapping for ${slotConfig.adUnitId}`
    );
    (window as any).preWrapDebug.push(
        `Pre-wrap failed, trying deferred for ${slotConfig.adUnitId}`
    );
    // If DOM element not found, set up observers and retries
    setupDeferredWrapping(slotConfig);
};

/**
 * Attempts to pre-wrap an ad unit immediately
 */
const attemptPreWrap = (slotConfig: SlotConfig): boolean => {
    logger.debug(
        `🔍 [Pre-wrapping] Looking for ad unit element: ${slotConfig.adUnitId}`
    );
    const adUnitElement = findAdUnitElement(slotConfig.adUnitId);

    if (!adUnitElement) {
        logger.debug(
            `❌ [Pre-wrapping] Ad unit element not found: ${slotConfig.adUnitId}`
        );
        return false;
    }

    logger.debug(`✅ [Pre-wrapping] Found ad unit element:`, adUnitElement);

    // Check if already wrapped - important to prevent double-wrapping
    // when both Advantage and High Impact JS compatibility layer are present
    const existingWrapper = adUnitElement.closest("advantage-wrapper");
    if (existingWrapper) {
        logger.debug(
            `ℹ️ [Pre-wrapping] Ad unit ${slotConfig.adUnitId} already wrapped (existing Advantage installation detected)`
        );
        logger.debug(
            `[High Impact Compatibility] Ad unit ${slotConfig.adUnitId} already wrapped`
        );
        slotConfig.preWrapped = true;
        slotConfig.wrapperElement = existingWrapper as HTMLElement;
        return true;
    }

    // Skip pre-wrapping if no template specified
    if (!slotConfig.template) {
        logger.debug(
            `[High Impact Compatibility] No template specified for ${slotConfig.adUnitId}, skipping pre-wrap`
        );
        return false;
    }

    // Get allowed formats for this template
    const advantageFormat = TEMPLATE_TO_FORMAT_MAP[slotConfig.template];
    if (!advantageFormat) {
        logger.debug(
            `[High Impact Compatibility] Unknown template: ${slotConfig.template}, cannot pre-wrap`
        );
        return false;
    }

    try {
        logger.debug(
            `🔧 [Pre-wrapping] Creating AdvantageWrapper for ${slotConfig.adUnitId}`
        );
        // Create advantage wrapper
        const advantageWrapperElement =
            document.createElement("advantage-wrapper");

        // Set allowed formats to restrict to only the configured template
        advantageWrapperElement.setAttribute(
            "allowed-formats",
            advantageFormat
        );
        logger.debug(
            `📋 [Pre-wrapping] Set allowed-formats to: ${advantageFormat}`
        );

        // Create slot div
        const slotDiv = document.createElement("div");
        slotDiv.setAttribute("slot", "advantage-ad-slot");

        // Move the ad unit into the wrapper
        const parent = adUnitElement.parentNode;
        if (parent) {
            logger.debug(
                `🔄 [Pre-wrapping] Moving ad unit into wrapper structure`
            );
            parent.insertBefore(advantageWrapperElement, adUnitElement);
            slotDiv.appendChild(adUnitElement);
            advantageWrapperElement.appendChild(slotDiv);

            logger.debug(
                `✅ [Pre-wrapping] Successfully pre-wrapped ${slotConfig.adUnitId}!`
            );
            logger.debug(
                `🔍 [Pre-wrapping] Wrapper HTML:`,
                advantageWrapperElement.outerHTML
            );

            logger.debug(
                `[High Impact Compatibility] Pre-wrapped ad unit ${slotConfig.adUnitId} with AdvantageWrapper for template ${slotConfig.template}`
            );

            // Store reference to wrapper in slot config for later use
            slotConfig.preWrapped = true;
            slotConfig.wrapperElement = advantageWrapperElement;
            return true;
        } else {
            console.error(`❌ [Pre-wrapping] Ad unit has no parent node!`);
        }
    } catch (error) {
        console.error(
            `❌ [Pre-wrapping] Failed to pre-wrap ad unit ${slotConfig.adUnitId}:`,
            error
        );
        logger.error(
            `[High Impact Compatibility] Failed to pre-wrap ad unit ${slotConfig.adUnitId}:`,
            error
        );
    }

    return false;
};

/**
 * Sets up deferred wrapping using MutationObserver and periodic retries
 */
const setupDeferredWrapping = (slotConfig: SlotConfig): void => {
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = 500; // 500ms

    const retryWrapping = () => {
        if (retryCount >= maxRetries) {
            logger.debug(
                `[High Impact Compatibility] Max retries reached for ${slotConfig.adUnitId}, will wrap when rendered`
            );
            return;
        }

        if (attemptPreWrap(slotConfig)) {
            return; // Successfully wrapped
        }

        retryCount++;
        setTimeout(retryWrapping, retryInterval);
    };

    // Set up MutationObserver to watch for DOM changes
    if (typeof window !== "undefined" && window.MutationObserver) {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (
                    mutation.type === "childList" &&
                    mutation.addedNodes.length > 0
                ) {
                    if (attemptPreWrap(slotConfig)) {
                        observer.disconnect();
                        return;
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Clean up observer after max retries
        setTimeout(() => {
            observer.disconnect();
        }, maxRetries * retryInterval);
    }

    // Also start periodic retries
    setTimeout(retryWrapping, retryInterval);
};

/**
 * Attempts to find the ad unit element in the DOM
 */
const findAdUnitElement = (adUnitId: string): HTMLElement | null => {
    // Try multiple common patterns for ad unit identification
    const selectors = [
        `#${adUnitId}`,
        `[data-ad-unit="${adUnitId}"]`,
        `[data-ad-unit-id="${adUnitId}"]`,
        `[data-google-ad-unit="${adUnitId}"]`,
        `[data-adunit="${adUnitId}"]`,
        `div[id*="${adUnitId}"]`
    ];

    for (const selector of selectors) {
        try {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
                logger.debug(
                    `[High Impact Compatibility] Found ad unit element using selector: ${selector}`
                );
                return element;
            }
        } catch (error) {
            // Invalid selector, continue to next
        }
    }

    return null;
};

/**
 * Defines a new ad slot with the specified configuration
 */
export const defineSlot = (slotConfig: SlotConfig): void => {
    logger.debug(
        `🎯 [DEFINE SLOT DEBUG] defineSlot called for ${slotConfig.adUnitId}`
    );

    const globalConfig = getConfig();

    // Handle Xandr integration by mapping targetId to adUnitId
    if (globalConfig.plugins && globalConfig.plugins[0] === "xandr") {
        slotConfig.adUnitId = slotConfig.targetId || slotConfig.adUnitId;
    }

    const key = `${slotConfig.adUnitId}`;
    state.slots[key] = slotConfig;

    logger.debug(
        `✅ [DEFINE SLOT DEBUG] Slot stored in state: ${key}`,
        slotConfig
    );

    // Pre-wrap the ad unit with AdvantageWrapper to ensure Advantage creatives
    // can communicate immediately when they load
    preWrapAdUnit(slotConfig);

    logger.debug(`📦 [DEFINE SLOT DEBUG] preWrapAdUnit completed for ${key}`);

    logger.debug(
        `[High Impact Compatibility] Slot defined: ${key}`,
        slotConfig
    );
};

/**
 * Command queue handler for asynchronous execution
 */
export const cmd = {
    push: (command: () => void): void => {
        if (typeof command === "function") {
            command();
        }
    }
};

/**
 * Sets the visibility of the top bar
 */
export const setTopBarVisibility = (isVisible: boolean): void => {
    const root = document.querySelector(":root") as HTMLElement;
    if (root) {
        root.style.setProperty(
            "--high-impact-top-bar-display",
            isVisible ? "flex" : "none"
        );
    }
};

/**
 * Gets the configuration for a specific slot
 */
export const getSlotConfig = (elementId: string): SlotConfig | undefined => {
    const key = `${elementId}`;
    logger.debug(`[High Impact Compatibility] Looking for config: ${key}`);

    if (state.slots[key]) {
        const config = state.slots[key];
        logger.debug(
            `[High Impact Compatibility] Found config: ${key}`,
            config
        );
        return config;
    }

    return undefined;
};

/**
 * Sets the configuration for a specific template
 */
export const setTemplateConfig = (
    template: string,
    config: TemplateConfig
): void => {
    logger.debug(
        `⚙️ [TEMPLATE CONFIG DEBUG] setTemplateConfig called for '${template}'`,
        config
    );

    state.templateConfig[template] = config;
    logger.debug(
        `[High Impact Compatibility] Template config set for ${template}`,
        config
    );

    logger.debug(
        `🔄 [TEMPLATE CONFIG DEBUG] About to call applyTemplateConfigToExistingSlots...`
    );

    // Apply template config retroactively to existing slots
    applyTemplateConfigToExistingSlots(template, config);
};

/**
 * Apply template configuration to existing slots that use this template
 */
const applyTemplateConfigToExistingSlots = (
    template: string,
    templateConfig: TemplateConfig
): void => {
    logger.debug(
        `🔄 [RETROACTIVE DEBUG] Starting retroactive application for template '${template}' with config:`,
        templateConfig
    );

    // Debug: Show all slots in state
    logger.debug(
        `📊 [RETROACTIVE DEBUG] Total slots in state:`,
        Object.keys(state.slots).length
    );
    logger.debug(`📋 [RETROACTIVE DEBUG] All slots:`, state.slots);

    logger.debug(
        `[High Impact Compatibility] Applying template config retroactively to existing ${template} slots`
    );

    // Find all slots that use this template
    Object.values(state.slots).forEach((slotConfig) => {
        logger.debug(
            `🔍 [RETROACTIVE DEBUG] Checking slot ${
                slotConfig.adUnitId
            }: template=${slotConfig.template}, preWrapped=${
                slotConfig.preWrapped
            }, hasWrapper=${!!slotConfig.wrapperElement}`
        );

        if (
            slotConfig.template === template &&
            slotConfig.preWrapped &&
            slotConfig.wrapperElement
        ) {
            logger.debug(
                `✅ [RETROACTIVE DEBUG] Found matching pre-wrapped slot: ${slotConfig.adUnitId}`
            );
            logger.debug(
                `[High Impact Compatibility] Updating pre-wrapped slot ${slotConfig.adUnitId} with new ${template} config`
            );

            const wrapper = (slotConfig.wrapperElement as any).advantageWrapper;
            if (wrapper) {
                logger.debug(
                    `🎯 [RETROACTIVE DEBUG] Found wrapper for ${slotConfig.adUnitId}, applying format...`
                );

                // Convert template config to format options
                const advantageFormat = TEMPLATE_TO_FORMAT_MAP[template];
                if (advantageFormat) {
                    const globalConfig = getConfig();
                    const formatOptions = convertTemplateConfigToFormatOptions(
                        template,
                        templateConfig,
                        globalConfig
                    );

                    logger.debug(
                        `⚙️ [RETROACTIVE DEBUG] Converted template config to format options for ${slotConfig.adUnitId}:`,
                        formatOptions
                    );

                    // Apply the format options to the existing wrapper
                    logger.debug(
                        `[High Impact Compatibility] Applying format options to ${slotConfig.adUnitId}:`,
                        formatOptions
                    );

                    // Re-apply the format with new options
                    const adIframe =
                        slotConfig.wrapperElement.querySelector("iframe");
                    if (adIframe) {
                        logger.debug(
                            `🎯 [RETROACTIVE DEBUG] Found iframe for ${slotConfig.adUnitId}, calling forceFormat with iframe...`
                        );
                        wrapper
                            .forceFormat(
                                advantageFormat,
                                adIframe,
                                formatOptions
                            )
                            .then(() => {
                                logger.debug(
                                    `✅ [RETROACTIVE DEBUG] forceFormat succeeded for ${slotConfig.adUnitId} with iframe`
                                );
                            })
                            .catch((error: any) => {
                                console.error(
                                    `❌ [RETROACTIVE DEBUG] forceFormat failed for ${slotConfig.adUnitId}:`,
                                    error
                                );
                                logger.error(
                                    `[High Impact Compatibility] Failed to apply retroactive format options to ${slotConfig.adUnitId}:`,
                                    error
                                );
                            });
                    } else {
                        logger.debug(
                            `⚠️ [RETROACTIVE DEBUG] No iframe found for ${slotConfig.adUnitId}, calling forceFormat without iframe...`
                        );
                        // No iframe yet, but wrapper exists - apply format without iframe
                        wrapper
                            .forceFormat(
                                advantageFormat,
                                undefined,
                                formatOptions
                            )
                            .then(() => {
                                logger.debug(
                                    `✅ [RETROACTIVE DEBUG] forceFormat succeeded for ${slotConfig.adUnitId} without iframe`
                                );
                            })
                            .catch((error: any) => {
                                console.error(
                                    `❌ [RETROACTIVE DEBUG] forceFormat failed for ${slotConfig.adUnitId}:`,
                                    error
                                );
                                logger.error(
                                    `[High Impact Compatibility] Failed to apply retroactive format options to ${slotConfig.adUnitId}:`,
                                    error
                                );
                            });
                    }
                }
            }
        }
    });
};

/**
 * Gets the configuration for a specific template
 */
export const getTemplateConfig = (template: string): TemplateConfig => {
    return state.templateConfig[template] || {};
};

/**
 * Sets the global configuration
 */
export const setConfig = (config: GlobalConfig): void => {
    state.config = { ...state.config, ...config };
    logger.debug(`[High Impact Compatibility] Global config set`, state.config);
};

/**
 * Gets the global configuration
 */
export const getConfig = (): GlobalConfig => {
    return state.config;
};

/**
 * Imports and sets up plugins
 */
const setupPlugins = async (
    plugins: string[] = []
): Promise<Record<string, CompatibilityPlugin>> => {
    // Prevent multiple simultaneous plugin setups
    if (state.pluginSetupInProgress) {
        logger.debug(
            `⏸️ [SETUP PLUGINS DEBUG] Plugin setup already in progress, skipping duplicate call`
        );
        return state.plugins;
    }

    // If plugins are already ready, return them immediately
    if (state.pluginsReady) {
        logger.debug(
            `✅ [SETUP PLUGINS DEBUG] Plugins already ready, returning existing plugins`
        );
        return state.plugins;
    }

    state.pluginSetupInProgress = true;
    const setupStartTime = performance.now();
    logger.debug(
        `🔌 [SETUP PLUGINS DEBUG] Setting up plugins:`,
        plugins,
        `at ${setupStartTime.toFixed(2)}ms`
    );
    const imported: Record<string, CompatibilityPlugin> = {};

    for (const pluginName of plugins) {
        try {
            let plugin: CompatibilityPlugin;

            switch (pluginName.toLowerCase()) {
                case "gam":
                    plugin = new GAMPlugin();
                    break;
                case "xandr":
                    plugin = new XandrPlugin();
                    break;
                default:
                    logger.debug(
                        `[High Impact Compatibility] Unknown plugin: ${pluginName}`
                    );
                    continue;
            }

            imported[pluginName] = plugin;
            logger.debug(
                `✅ [SETUP PLUGINS DEBUG] Successfully created ${pluginName} plugin`
            );

            // Initialize the plugin
            if (plugin.init) {
                plugin.init();
                logger.debug(
                    `🚀 [SETUP PLUGINS DEBUG] Initialized ${pluginName} plugin`
                );
            }

            // Set up ad slot rendered handler
            if (plugin.onAdSlotRendered) {
                plugin.onAdSlotRendered(onAdSlotRendered);
            }

            // REMOVED: getRenderedSlots() call - was causing 4-second delay
            // This async operation was the bottleneck causing slow initialization

            logger.debug(
                `[High Impact Compatibility] Plugin ${pluginName} imported and initialized successfully`
            );
        } catch (error) {
            logger.error(
                `[High Impact Compatibility] Failed to import plugin ${pluginName}:`,
                error
            );
        }
    }

    logger.debug(
        `🏁 [SETUP PLUGINS DEBUG] Plugin setup complete. Loaded plugins:`,
        Object.keys(imported)
    );

    // Assign plugins to state BEFORE processing queued messages
    state.plugins = imported;
    logger.debug(
        `🔗 [SETUP PLUGINS DEBUG] Plugins assigned to state:`,
        Object.keys(state.plugins)
    );

    // Mark plugins as ready and process any queued messages
    state.pluginsReady = true;
    state.pluginSetupInProgress = false; // Reset the flag
    const setupEndTime = performance.now();
    const setupDuration = setupEndTime - setupStartTime;
    logger.debug(
        `🎉 [SETUP PLUGINS DEBUG] Plugins are now ready! Setup took ${setupDuration.toFixed(
            2
        )}ms`
    );
    processQueuedMessages();

    return imported;
};

/**
 * Core message processing logic (extracted to avoid duplication)
 */
const processHighImpactMessage = (options: {
    source?: Window;
    adMessageData?: any;
    iframeName?: string;
}) => {
    logger.debug(
        "[High Impact Compatibility] Got ad responsive signal",
        options
    );

    const { adMessageData } = options;

    logger.debug(
        "🔍 [AD RESPONSIVE DEBUG] Checking plugins:",
        Object.keys(state.plugins)
    );

    // Debug: log all defined slots
    logger.debug(
        "📋 [AD RESPONSIVE DEBUG] All defined slots:",
        Object.keys(state.slots)
    );

    let slotFound = false;

    for (const [pluginName, plugin] of Object.entries(state.plugins)) {
        logger.debug(`🔌 [AD RESPONSIVE DEBUG] Checking plugin: ${pluginName}`);

        let slot;
        if (plugin.getSlotFromSource && options?.source) {
            logger.debug(
                `🔍 [AD RESPONSIVE DEBUG] Getting slot from source for ${pluginName}...`
            );
            slot = plugin.getSlotFromSource(options.source);
            if (slot) {
                logger.debug(
                    `✅ [AD RESPONSIVE DEBUG] Got slot from source:`,
                    slot
                );

                // Debug: Check if we have a matching slot config
                const slotConfig = getSlotConfig(slot.elementId);
                logger.debug(
                    `🔍 [AD RESPONSIVE DEBUG] Slot config for ${slot.elementId}:`,
                    slotConfig
                );

                logger.debug(
                    "[High Impact Compatibility] Got slot from source"
                );
                slotFound = true;
            } else {
                logger.debug(
                    `❌ [AD RESPONSIVE DEBUG] No slot found for source in ${pluginName}`
                );
            }
        } else {
            logger.debug(
                `⚠️ [AD RESPONSIVE DEBUG] Plugin ${pluginName} has no getSlotFromSource method or no source provided`
            );
        }

        if (slot) {
            logger.debug(
                `🚀 [AD RESPONSIVE DEBUG] Calling onAdSlotRendered for slot:`,
                slot
            );
            onAdSlotRendered({
                ...slot,
                fromAdResponsiveSignal: true,
                adMessageData
            });
        }
    }

    // Original High Impact JS approach: if no plugin found a slot, we're done
    // The plugins handle all the validation and iframe matching

    if (!slotFound) {
        logger.debug("❌ [AD RESPONSIVE DEBUG] No slot found via any method");
    }

    logger.debug("🏁 [AD RESPONSIVE DEBUG] Message processing completed");
};

/**
 * Processes any queued messages after plugins are ready
 */
const processQueuedMessages = () => {
    if (state.messageQueue.length > 0) {
        logger.debug(
            `📨 [QUEUE DEBUG] Processing ${state.messageQueue.length} queued messages...`
        );

        const queuedMessages = [...state.messageQueue];
        state.messageQueue = []; // Clear the queue

        queuedMessages.forEach((message, index) => {
            logger.debug(
                `🔄 [QUEUE DEBUG] Processing queued message ${index + 1}:`,
                message
            );
            processHighImpactMessage(message);
        });

        logger.debug(
            `✅ [QUEUE DEBUG] Finished processing all queued messages`
        );
    } else {
        logger.debug(`📭 [QUEUE DEBUG] No messages in queue to process`);
    }
};

/**
 * Handles ad responsive signal from post messages
 */
const onAdResponsiveSignal = (options: {
    source?: Window;
    adMessageData?: any;
    iframeName?: string;
}) => {
    const startTime = performance.now();
    logger.debug(
        "🎯 [AD RESPONSIVE DEBUG] onAdResponsiveSignal called with:",
        options,
        `at ${startTime.toFixed(2)}ms`
    );

    // Ultra-fast path: If plugins are ready, process immediately
    if (state.pluginsReady) {
        const processStartTime = performance.now();
        logger.debug(
            `🚀 [ULTRA-FAST] Processing message immediately (plugins ready) at ${processStartTime.toFixed(
                2
            )}ms`
        );
        processHighImpactMessage(options);
        const processEndTime = performance.now();
        logger.debug(
            `🚀 [ULTRA-FAST] Message processing completed in ${(
                processEndTime - processStartTime
            ).toFixed(2)}ms`
        );
        return;
    }

    // Fallback: If plugins aren't ready yet, queue this message
    logger.debug(
        "⏳ [AD RESPONSIVE DEBUG] Plugins not ready yet, queueing message..."
    );
    state.messageQueue.push(options);
};

/**
 * Sets up post message listeners for ad responsive signals
 */
const listenToHighImpactPostMessages = (handler: (options: any) => void) => {
    logger.debug(
        "🎧 [MESSAGE DEBUG] Setting up High Impact JS message listener"
    );

    window.addEventListener("message", (event) => {
        // Silently check message formats without logging every message
        let isValidMessage = false;
        let messageData = event.data;

        // Support both original High Impact JS format and new format
        if (event.data && event.data.type === "high-impact-ad-responsive") {
            // New format
            isValidMessage = true;
            logger.debug("✅ [MESSAGE DEBUG] Recognized as NEW format message");
        } else if (typeof event.data === "string") {
            // Original High Impact JS format (JSON string)
            try {
                const data = JSON.parse(event.data);
                if (
                    data.sender === "high-impact-js" &&
                    data.action === "AD_RENDERED"
                ) {
                    isValidMessage = true;
                    messageData = data;
                    logger.debug(
                        "✅ [MESSAGE DEBUG] Recognized as ORIGINAL format message (JSON string)"
                    );
                    logger.debug(
                        "[High Impact Compatibility] Received original High Impact JS message:",
                        data
                    );
                }
            } catch (e) {
                // Not a valid JSON string, silently ignore
            }
        } else if (
            event.data &&
            typeof event.data === "object" &&
            event.data.sender === "high-impact-js" &&
            event.data.action === "AD_RENDERED"
        ) {
            // Original High Impact JS format (object)
            isValidMessage = true;
            logger.debug(
                "✅ [MESSAGE DEBUG] Recognized as ORIGINAL format message (object)"
            );
            logger.debug(
                "[High Impact Compatibility] Received original High Impact JS message:",
                event.data
            );
        }

        // Only process and log valid messages
        if (isValidMessage) {
            logger.debug(
                "🎯 [MESSAGE DEBUG] Processing valid High Impact JS message..."
            );
            let iframeName;
            try {
                iframeName = (event.source as any)?.name;
            } catch (_) {}

            handler({
                source: event.source,
                iframeName: iframeName,
                adMessageData: messageData
            });
        }
        // Silently ignore invalid messages - no logging for non-High Impact JS messages
    });

    logger.debug("✅ [MESSAGE DEBUG] Message listener setup complete");
};

/**
 * Initialize the High Impact JS compatibility layer
 */
export const initializeHighImpactJs = async (): Promise<void> => {
    if (state.initialized) {
        logger.debug("[High Impact Compatibility] Already initialized");
        return;
    }

    logger.debug("[High Impact Compatibility] Initializing...");
    state.initialized = true;

    // Set up global window object
    (window as any).highImpactJs = (window as any).highImpactJs || { cmd: [] };

    const highImpactJs = (window as any).highImpactJs;

    // Assign API functions
    highImpactJs.defineSlot = defineSlot;
    highImpactJs.setTemplateConfig = setTemplateConfig;
    highImpactJs.setConfig = setConfig;

    // Expose state properties for debugging and compatibility
    highImpactJs.initialized = true;
    highImpactJs.config = state.config;
    highImpactJs.slots = state.slots;

    // Expose helper function for mock GAM to trigger slot rendered events
    highImpactJs._triggerSlotRendered = onAdSlotRendered;

    // Process any queued commands BEFORE replacing cmd
    if (Array.isArray(highImpactJs.cmd) && highImpactJs.cmd.length > 0) {
        while (highImpactJs.cmd.length) {
            const item = highImpactJs.cmd.shift();
            if (typeof item === "function") {
                await item();
            }
        }
    }

    // Replace cmd array with our handler
    highImpactJs.cmd = cmd;

    // Set default plugins if not configured
    if (!state.config.plugins) {
        state.config.plugins = ["gam", "xandr"];
    }

    // Set up plugins (skip if already initialized by pre-init)
    if (state.config.plugins && !state.pluginsReady) {
        await setupPlugins(state.config.plugins);
    } else if (state.pluginsReady) {
        logger.debug(
            "⚡ [SPEED OPTIMIZATION] Plugins already pre-initialized, skipping setup"
        );
    }

    logger.debug("[High Impact Compatibility] Initialization complete");
};

// Set up message listener immediately when module loads (not waiting for full init)
if (typeof window !== "undefined") {
    logger.debug(
        "🚀 [EARLY INIT] Setting up High Impact JS message listener immediately on module load"
    );
    listenToHighImpactPostMessages(onAdResponsiveSignal);

    // Pre-initialize plugins with default configuration for speed (GAM only for now)
    logger.debug(
        "⚡ [SPEED OPTIMIZATION] Pre-initializing GAM plugin for fast message processing"
    );
    setupPlugins(["gam"])
        .then(() => {
            logger.debug(
                "🚀 [SPEED OPTIMIZATION] Plugin pre-initialization complete! Ready for messages."
            );
        })
        .catch((error) => {
            console.warn(
                "⚠️ [SPEED OPTIMIZATION] Plugin pre-initialization failed:",
                error
            );
        });
}

// Export a reset function for testing
export const resetState = () => {
    state.initialized = false;
    state.config = {};
    state.slots = {};
    state.templateConfig = {};
    state.plugins = {};
};
