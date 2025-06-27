/**
 * @fileoverview Types for High Impact JS Compatibility Layer
 */

/**
 * Plugin interface for compatibility layer
 */
export interface CompatibilityPlugin {
    init(): void;
    getRenderedSlots?(): Promise<any[]>;
    onAdSlotRendered?(handler: (slot: any) => void): void;
    getSlotFromSource?(source: Window): any;
}

/**
 * @typedef {Object} SlotConfig
 * @property {string} [template] - The template name to use (e.g., 'topscroll', 'midscroll', 'skins') - optional if using size-based detection
 * @property {string} adUnitId - The ID of the ad unit in Google Ad Manager
 * @property {string} [targetId] - The ID of the ad unit in Xandr (will be mapped to adUnitId)
 * @property {Array<Array<number>>} sizes - Array of ad sizes (e.g., [[728, 90], [970, 250]])
 * @property {boolean} [waitForAdSignal=false] - Whether to wait for an ad signal before rendering
 * @property {string} [testTagToBeInserted] - HTML string to inject for testing
 */
export interface SlotConfig {
    template?: string;
    adUnitId: string;
    targetId?: string;
    sizes?: number[][];
    waitForAdSignal?: boolean;
    testTagToBeInserted?: string;
    rendered?: any;
    preWrapped?: boolean;
    wrapperElement?: HTMLElement;
}

/**
 * @typedef {Object} TemplateConfig
 * @property {string} [contentWrapperSelector] - CSS selector for the content wrapper (skins template)
 * @property {string} [peekAmount] - Height of the visible area (e.g., '70vh') (topscroll, midscroll)
 * @property {string} [title] - Text for the scroll down message (topscroll)
 * @property {string} [arrowUrl] - Custom arrow icon URL (topscroll)
 * @property {boolean} [showCloseButton] - Show/hide close button (topscroll)
 * @property {boolean} [fadeOnScroll] - Enable/disable fade effect on scroll (topscroll)
 * @property {number} [topBarHeight] - Height of the top bar in pixels
 * @property {number} [bottomBarHeight] - Height of the bottom bar in pixels (midscroll)
 * @property {number} [zIndex] - Custom z-index for the ad unit
 */
export interface TemplateConfig {
    contentWrapperSelector?: string;
    peekAmount?: string;
    title?: string;
    arrowUrl?: string;
    showCloseButton?: boolean;
    fadeOnScroll?: boolean;
    topBarHeight?: number;
    bottomBarHeight?: number;
    zIndex?: number;
}

/**
 * @typedef {Object} GlobalConfig
 * @property {Array<string>} plugins - Array of plugin names to use (e.g., ['gam', 'xandr'])
 * @property {number} [topBarHeight] - Height of the top bar in pixels
 * @property {number} [bottomBarHeight] - Height of the bottom bar in pixels
 * @property {number} [zIndex] - Custom z-index for all ad units
 * @property {Function} [ignoreSlotOn] - Function to determine if a slot should be ignored
 */
export interface GlobalConfig {
    plugins?: string[];
    topBarHeight?: number;
    bottomBarHeight?: number;
    zIndex?: number;
    ignoreSlotOn?: (html: string) => boolean;
    debug?: boolean;
}
