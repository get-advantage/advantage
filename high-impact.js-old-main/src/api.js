/**
 * @fileoverview API module for High Impact JS library.
 * This module provides the core API functions for configuring and managing ad slots and templates.
 */

import { log } from './debug.js';

/**
 * @typedef {Object} SlotConfig
 * @property {string} template - The template name to use (e.g., 'topscroll', 'midscroll', 'skins')
 * @property {string} adUnitId - The ID of the ad unit in Google Ad Manager
 * @property {string} [targetId] - The ID of the ad unit in Xandr (will be mapped to adUnitId)
 * @property {Array<Array<number>>} sizes - Array of ad sizes (e.g., [[728, 90], [970, 250]])
 * @property {boolean} [waitForAdSignal=false] - Whether to wait for an ad signal before rendering
 * @property {string} [testTagToBeInserted] - HTML string to inject for testing
 */

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

/**
 * @typedef {Object} GlobalConfig
 * @property {Array<string>} plugins - Array of plugin names to use (e.g., ['gam', 'xandr'])
 * @property {number} [topBarHeight] - Height of the top bar in pixels
 * @property {number} [bottomBarHeight] - Height of the bottom bar in pixels
 * @property {number} [zIndex] - Custom z-index for all ad units
 * @property {Function} [ignoreSlotOn] - Function to determine if a slot should be ignored
 */

/** @private {Object} Internal state object to store slot configurations */
const state = {
  slots: {},
};

/**
 * Defines a new ad slot with the specified configuration
 * @param {SlotConfig} slotConfig - Configuration for the ad slot
 */
export const defineSlot = (slotConfig) => {
  const globalConfig = getConfig();
  // Handle Xandr integration by mapping targetId to adUnitId
  if (globalConfig.plugins && globalConfig.plugins[0] === 'xandr') {
    slotConfig.adUnitId = slotConfig.targetId;
  }
  const key = `${slotConfig.adUnitId}`;
  state.slots[key] = slotConfig;
  log('Slot defined', key);
};

/**
 * Command queue handler for asynchronous execution
 * @type {Object}
 */
export const cmd = {
  /**
   * Pushes a command to the execution queue
   * @param {Function} command - Function to execute
   */
  push: (command) => {
    if (typeof command === 'function') {
      command();
    }
  },
};

/**
 * Sets the visibility of the top bar
 * @param {boolean} isVisible - Whether the top bar should be visible
 */
export const setTopBarVisibility = (isVisible) => {
  const r = document.querySelector(':root');
  r.style.setProperty('--high-impact-top-bar-display', isVisible ? 'flex' : 'none');
};

/**
 * Gets the configuration for a specific slot
 * @param {string} elementId - The ID of the element/slot
 * @returns {SlotConfig|undefined} The slot configuration or undefined if not found
 */
export const getSlotConfig = (elementId) => {
  const key = `${elementId}`;
  log('Looking for config: ', key);
  if (state.slots[key]) {
    const config = state.slots[key];
    log('Found config: ', key, JSON.stringify(config));
    return config;
  }
};

/**
 * Sets the configuration for a specific template
 * @param {string} template - The template name
 * @param {TemplateConfig} config - Configuration for the template
 */
export const setTemplateConfig = (template, config) => {
  window.highImpactJs.templateConfig = window.highImpactJs.templateConfig || {};
  window.highImpactJs.templateConfig[template] = config;
};

/**
 * Gets the configuration for a specific template
 * @param {string} template - The template name
 * @returns {TemplateConfig} The template configuration
 */
export const getTemplateConfig = (template) => {
  if (window.highImpactJs.templateConfig && window.highImpactJs.templateConfig[template]) {
    return window.highImpactJs.templateConfig[template];
  }
  return {};
};

/**
 * Sets the global configuration
 * @param {GlobalConfig} config - Global configuration object
 */
export const setConfig = (config) => {
  window.highImpactJs.config = config;
};

/**
 * Gets the global configuration
 * @returns {GlobalConfig} The global configuration
 */
export const getConfig = () => {
  return window.highImpactJs.config || {};
};
