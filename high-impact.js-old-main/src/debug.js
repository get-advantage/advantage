/**
 * @fileoverview Debug utilities for High Impact JS library.
 * This module provides debugging tools for the High Impact JS library, including
 * logging, debug attribute addition, and test tag injection.
 */

/** @private {boolean|undefined} Flag indicating if debug mode is enabled */
let _debugEnabled;

/**
 * Checks if debug mode is enabled via URL parameter 'debugHighImpact'
 * @returns {boolean} True if debug mode is enabled, false otherwise
 */
export const debugEnabled = () => {
  if (_debugEnabled === undefined) {
    _debugEnabled = new URLSearchParams(window.location.search).has('debugHighImpact');
  }
  return _debugEnabled;
};

/**
 * Logs a message to the console if debug mode is enabled
 * @param {string} message - The message to log
 * @param {...any} params - Additional parameters to log
 */
export const log = (message, ...params) => {
  // only log if query param debugHighImpact is set
  if (debugEnabled()) {
    console.log('[high-impact.js]', message, params.join(' '));
  }
};

/**
 * Adds debug attributes to an element for visual identification
 * @param {HTMLElement} element - The element to add debug attributes to
 * @param {boolean} [globalConfigDebug=false] - Whether to add visual debug styling
 * @param {boolean} [force=false] - Whether to force debug attributes regardless of debug mode
 */
export const addDebugAttribute = (element, globalConfigDebug = false, force = false) => {
  if ((element && debugEnabled()) || force) {
    element.dataset.highImpactJs = true;

    // if debug set red background
    if (globalConfigDebug) {
      element.style.backgroundColor = 'red';
    }
  }
};

/**
 * Injects test tag content into an ad wrapper iframe
 * @param {HTMLElement} containerElement - The container element with the iframe
 * @param {Object} [config={}] - Configuration object containing testTagToBeInserted
 * @param {string} [config.testTagToBeInserted] - HTML string to inject into the iframe
 */
export const injectTestTagInAdWrapper = (containerElement, config = {}) => {
  try {
    const iframe = containerElement.querySelector('iframe');
    const iframeContent = iframe.contentDocument || iframe.contentWindow.document;

    if (config.testTagToBeInserted) {
      // Hide existing content
      for (const child of iframeContent.body.children) {
        child.style.display = 'none';
      }
      
      // Create temporary container and parse HTML
      const tmp = document.createElement('div');
      tmp.innerHTML = config.testTagToBeInserted;      
      // Append nodes, handling scripts specially to ensure they execute
      iframeContent.body.append(...[...tmp.childNodes].map((node) => {
        if (node.tagName === 'SCRIPT') {
          if (node.src) {
            const script = document.createElement('script');
            // copy over all of the attributes from the original script
            for (let i = 0; i < node.attributes.length; i++) {
              script.setAttribute(node.attributes[i].name, node.attributes[i].value);
            }
            script.src = node.src;
            return script;
          }
          const script = document.createElement('script');
          script.innerHTML = node.innerHTML;
          return script;
        }
        return node;
      }));
    }
  } catch (e) {
    log('Error injecting test tag - possibly because of cross-origin restrictions or safe frame', e);
  }
};