/**
 * High Impact JS Integration Configuration for Advantage
 *
 * This configuration file contains website-specific integration settings
 * that were originally baked into the High Impact JS bundle.
 *
 * Key features:
 * - Responsive ad styling for proper banner scaling within formats
 * - Platform-specific CSS fixes (GAM, Adform, Xandr, etc.)
 * - Ensures ad creatives fill the format container correctly
 *
 * Usage:
 * Import this config and pass it to Advantage.configure()
 */

import {
    AdvantageFormatName,
    IAdvantageWrapper,
    AdvantageConfig
} from "./src/types";

/**
 * Injects responsive ad styling into an iframe to ensure proper scaling
 * This is based on the original High Impact JS responsive styling approach
 */
const injectResponsiveAdStyling = (iframe: HTMLIFrameElement): void => {
    try {
        const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc || !iframeDoc.head) {
            return;
        }

        // Check if already injected
        if (iframeDoc.head.querySelector("#high-impact-responsive-ad-styles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "high-impact-responsive-ad-styles";
        style.innerHTML = `
            /* High Impact JS responsive ad styling for proper banner scaling */
            
            /* Base HTML/Body scaling - critical for proper sizing */
            html, body {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* Critical: Banner wrapper that often interferes with scaling */
            .banner {
                height: 0px !important;
            }
            
            /* Adform specific */
            adfm-ad, #sf_align, .adform-adbox, .adform-adbox img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover;
            }
            iframe[data-contents*='adform'] {
                width: 100vw !important;
                height: 100vh !important;
            }
            
            /* Xandr/AppNexus specific */
            [target='_blank'] img[src*='adnxs'] {
                object-fit: cover !important;
                width: 100% !important;
                height: 100% !important;
                position: fixed;
            }
            
            /* Google Ad Manager (GAM) specific */
            .GoogleActiveViewClass, .GoogleActiveViewElement {
                transform: translate(calc(-50% + 50vw), 0);
                width: 100vw !important;
                height: 100vh !important;
                display: block;
            }
            .GoogleActiveViewClass img, .GoogleActiveViewElement img {
                width: 100vw !important;
                height: 100vh !important;
                object-fit: cover !important;
            }
            .GoogleActiveViewClass iframe {
                width: 100vw !important;
                height: 100vh !important;
            }
            
            /* DoubleClick Campaign Manager (DCM) */
            .dcmads {
                width: 100% !important;
                height: 100% !important;
            }
            
            /* Sizmek */
            iframe[src*='net/sadbundle/'] {
                width: 100vw !important;
                height: 100vh !important;
            }
            
            /* Generic iframe scaling */
            body > iframe {
                width: 100% !important;
                height: 100% !important;
            }
        `;

        iframeDoc.head.appendChild(style);
        console.log(
            "[Advantage Integration] Injected responsive ad styling into iframe"
        );
    } catch (e) {
        // Silently fail for cross-origin iframes
        console.debug(
            "Could not inject responsive ad styling (cross-origin restriction):",
            e
        );
    }
};

/**
 * Applies wrapper-level styling to ensure iframe scales properly
 * This targets elements in the light DOM (outside the shadow root)
 */
const applyWrapperStyling = (wrapper: IAdvantageWrapper): void => {
    // Find all iframes and their parent containers
    const iframes = wrapper.querySelectorAll("iframe");

    iframes.forEach((iframe) => {
        // Ensure iframe fills its container
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0";
        iframe.style.margin = "0";
        iframe.style.padding = "0";
        iframe.style.display = "block";

        // Check for wrapper divs that might constrain the iframe
        let parent = iframe.parentElement;
        while (parent && parent !== wrapper) {
            // Reset any constraining styles on parent elements
            if (
                parent.classList.contains("banner") ||
                parent.id.includes("banner") ||
                parent.id.includes("ad")
            ) {
                parent.style.width = "100%";
                parent.style.height = "100%";
                parent.style.margin = "0";
                parent.style.padding = "0";
                parent.style.overflow = "visible";
            }
            parent = parent.parentElement;
        }
    });

    console.log("[Advantage Integration] Applied wrapper-level styling");
};

/**
 * Export the integration configuration
 */
export default {
    // Enable High Impact JS compatibility mode
    enableHighImpactCompatibility: true,

    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            options: {
                // Default options can be overridden by High Impact JS setTemplateConfig
                closeButton: true,
                downArrow: true,
                height: 90 // Default peek amount (70vh)
            },
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLIFrameElement) => {
                return new Promise<void>((resolve) => {
                    // Apply wrapper-level styling first
                    applyWrapperStyling(wrapper);

                    // Inject responsive styling into the ad iframe
                    if (ad) {
                        // Small delay to ensure iframe content is loaded
                        setTimeout(() => {
                            injectResponsiveAdStyling(ad);
                        }, 100);
                    }
                    resolve();
                });
            },
            close: () => {
                console.log("[Advantage Integration] TopScroll closed");
            },
            reset: () => {
                console.log("[Advantage Integration] TopScroll reset");
            }
        },
        {
            format: AdvantageFormatName.Midscroll,
            options: {
                // Default options
                closeButton: true,
                height: 100 // Default peek amount (100vh)
            },
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLIFrameElement) => {
                return new Promise<void>((resolve) => {
                    // Apply wrapper-level styling first
                    applyWrapperStyling(wrapper);

                    // Inject responsive styling into the ad iframe
                    if (ad) {
                        setTimeout(() => {
                            injectResponsiveAdStyling(ad);
                        }, 100);
                    }
                    resolve();
                });
            },
            close: () => {
                console.log("[Advantage Integration] Midscroll closed");
            },
            reset: () => {
                console.log("[Advantage Integration] Midscroll reset");
            }
        },
        {
            format: AdvantageFormatName.DoubleMidscroll,
            options: {
                allowedOrigins: ["*"] // Allow messages from any origin for High Impact JS compatibility
            },
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLIFrameElement) => {
                return new Promise<void>((resolve) => {
                    // Apply wrapper-level styling first
                    applyWrapperStyling(wrapper);

                    // Inject responsive styling into the ad iframe
                    if (ad) {
                        setTimeout(() => {
                            injectResponsiveAdStyling(ad);
                        }, 100);
                    }
                    resolve();
                });
            },
            close: () => {
                console.log("[Advantage Integration] DoubleMidscroll closed");
            },
            reset: () => {
                console.log("[Advantage Integration] DoubleMidscroll reset");
            }
        }
    ]
} as AdvantageConfig;
