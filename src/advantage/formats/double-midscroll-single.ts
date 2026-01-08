import { AdvantageFormat, AdvantageFormatName } from "../../types";
import styles from "./double-midscroll-single.css?inline";
import {
    setDimensionsUntilAdvantageAdSlot,
    resetDimensionsUntilAdvantageAdSlot
} from "./format-helper";
import logger from "../../utils/logging";

/**
 * Single-creative DoubleMidscroll format
 * 
 * This format provides a 2x viewport height scroll area with scroll progress events,
 * allowing a single creative to respond to scroll position without requiring a separate
 * background creative.
 * 
 * Key differences from standard DoubleMidscroll:
 * - Only one creative required (no backgroundAdURL needed)
 * - Provides scroll progress (0-1) instead of waypoint events
 * - Creative can implement its own scroll-based animations
 * - Simpler setup for advertisers who don't need separate background/foreground,
 *   for example when delivering creative as a tag
 */
export const doubleMidscrollSingle: AdvantageFormat = {
    name: AdvantageFormatName.DoubleMidscrollSingleCreative,
    description:
        "A double fullscreen format (2x viewport height) with scroll progress events for a single creative.",
    setup: (wrapper, ad) => {
        return new Promise((resolve) => {
            wrapper.insertCSS(styles);
            if (ad) setDimensionsUntilAdvantageAdSlot(ad, false);

            const uiContainer = document.createElement("div");
            uiContainer.id = "ui-container";
            wrapper.uiLayer.changeContent(uiContainer);

            // Setup scroll progress tracking
            setupScrollProgressTracking(wrapper, ad);

            logger.debug("DoubleMidscrollSingle format setup complete");
            resolve();
        });
    },
    reset: (wrapper, ad?) => {
        if (ad) {
            resetDimensionsUntilAdvantageAdSlot(ad, false);
        }
        wrapper.resetCSS();
        
        // Clean up scroll listener
        const scrollContainer = wrapper.shadowRoot?.querySelector('#ad-slot');
        if (scrollContainer) {
            const cleanup = (scrollContainer as any).__scrollCleanup;
            if (cleanup) {
                cleanup();
                delete (scrollContainer as any).__scrollCleanup;
            }
        }
    },
    close: (wrapper) => {
        wrapper.animateClose();
    }
};

/**
 * Sets up scroll progress tracking for the creative
 * Sends scroll progress (0-1) to the creative iframe
 */
function setupScrollProgressTracking(wrapper: any, ad?: HTMLIFrameElement | HTMLElement) {
    if (!ad) return;

    const scrollContainer = wrapper.shadowRoot?.querySelector('#ad-slot');
    if (!scrollContainer) return;

    let rafId: number | null = null;

    // Calculate and send scroll progress
    const updateScrollProgress = () => {
        const rect = scrollContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const containerHeight = scrollContainer.clientHeight;
        
        let progress = 0;
        
        // Calculate progress: 0 when container top enters viewport, 1 when scrolled through full container height
        if (rect.top <= 0 && rect.bottom > viewportHeight) {
            // Container is filling viewport - calculate progress through the 200vh
            const scrolled = Math.abs(rect.top);
            const totalScrollDistance = containerHeight - viewportHeight;
            progress = Math.min(1, Math.max(0, scrolled / totalScrollDistance));
        } else if (rect.bottom <= viewportHeight) {
            // Scrolled past container
            progress = 1;
        }

        // Send scroll progress to creative
        sendScrollProgress(wrapper, progress);
    };

    // Use scroll event with requestAnimationFrame for smooth updates
    const handleScroll = () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    updateScrollProgress();
    
    // Store cleanup function
    (scrollContainer as any).__scrollCleanup = () => {
        window.removeEventListener('scroll', handleScroll);
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
    };

    logger.debug("Scroll progress tracking initialized for DoubleMidscrollSingle");
}

/**
 * Sends scroll progress to the creative using the established MessagePort channel.
 * This ensures the message reaches the creative even when nested in multiple iframes.
 */
function sendScrollProgress(wrapper: any, progress: number) {
    if (!wrapper.messageHandler) {
        logger.debug('Cannot send scroll progress: messageHandler not available');
        return;
    }

    wrapper.messageHandler.sendMessage({
        action: 'SCROLL_PROGRESS',
        progress: progress
    });
}
