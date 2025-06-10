// Test setup file for Jest

// Polyfill TextEncoder/TextDecoder for Node.js environment
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { JSDOM } from "jsdom";
import "@testing-library/jest-dom";

// Setup DOM globals
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost",
    pretendToBeVisual: true,
    resources: "usable"
});

// Set globals (only if they don't already exist)
if (!(global as any).window) {
    Object.defineProperty(global, "window", {
        value: dom.window,
        writable: true
    });
}

if (!(global as any).document) {
    Object.defineProperty(global, "document", {
        value: dom.window.document,
        writable: true
    });
}

if (!(global as any).navigator) {
    Object.defineProperty(global, "navigator", {
        value: dom.window.navigator,
        writable: true
    });
}

if (!(global as any).HTMLElement) {
    Object.defineProperty(global, "HTMLElement", {
        value: dom.window.HTMLElement,
        writable: true
    });
}

if (!(global as any).customElements) {
    Object.defineProperty(global, "customElements", {
        value: dom.window.customElements,
        writable: true
    });
}

if (!(global as any).MutationObserver) {
    Object.defineProperty(global, "MutationObserver", {
        value: dom.window.MutationObserver,
        writable: true
    });
}

// Mock CSS constructors if they don't exist
if (!dom.window.CSSStyleSheet) {
    Object.defineProperty(global, "CSSStyleSheet", {
        value: class CSSStyleSheet {
            cssRules: any[] = [];
            replaceSync = () => {};
            insertRule = () => {};
            deleteRule = () => {};
        },
        writable: true
    });
}

// Mock ShadowRoot if needed
if (!dom.window.ShadowRoot) {
    Object.defineProperty(global, "ShadowRoot", {
        value: class ShadowRoot extends dom.window.DocumentFragment {
            adoptedStyleSheets: any[] = [];
        },
        writable: true
    });
}

// Mock location.ancestorOrigins for messaging tests
if (global.window && global.window.location) {
    Object.defineProperty(global.window.location, "ancestorOrigins", {
        value: {
            [Symbol.iterator]: function* () {
                // Mock empty ancestor origins
            },
            length: 0
        },
        writable: true,
        configurable: true
    });
}
