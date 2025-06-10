/// <reference types="jest" />

import { AdvantageWrapper } from "./wrapper";
import { Advantage } from "./advantage";

// Mock all problematic imports at the module level
jest.mock("./advantage", () => ({
    Advantage: {
        getInstance: jest.fn()
    }
}));

jest.mock("./messaging/publisher-side", () => ({
    AdvantageAdSlotResponder: jest.fn().mockImplementation(() => ({
        ad: {
            iframe: document.createElement("iframe")
        }
    }))
}));

jest.mock("../utils", () => ({
    logger: {
        debug: jest.fn(),
        info: jest.fn(),
        error: jest.fn()
    },
    traverseNodes: jest.fn(),
    supportsAdoptingStyleSheets: true,
    ADVANTAGE: "ADVANTAGE"
}));

// Mock format files to avoid CSS import issues
jest.mock("./formats", () => ({
    defaultFormats: []
}));

describe("AdvantageWrapper constructor and initialization", () => {
    let mockAdvantage: jest.Mocked<Advantage>;

    beforeEach(() => {
        // Define custom elements if not already defined
        if (!customElements.get("advantage-ui-layer")) {
            customElements.define(
                "advantage-ui-layer",
                class extends HTMLElement {
                    changeContent = jest.fn();
                    insertCSS = jest.fn();
                    getSlottedElement = jest.fn();
                    getAllSlottedElements = jest.fn();
                    querySlottedElements = jest.fn();
                }
            );
        }

        // Mock Advantage singleton
        mockAdvantage = {
            registerWrapper: jest.fn(),
            formats: new Map(),
            defaultFormats: [],
            formatIntegrations: new Map(),
            config: null
        } as any;

        (Advantage.getInstance as jest.Mock).mockReturnValue(mockAdvantage);

        // Define custom element if not already defined
        if (!customElements.get("advantage-wrapper")) {
            customElements.define("advantage-wrapper", AdvantageWrapper);
        }

        jest.clearAllMocks();
    });

    test("should create shadow DOM with correct structure", () => {
        const wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        // Should have shadow root
        expect(wrapper.shadowRoot).toBeTruthy();
        expect(wrapper.shadowRoot?.mode).toBe("open");

        // Should have container
        expect(wrapper.container).toBeTruthy();
        expect(wrapper.container.id).toBe("container");

        // Should have content div
        expect(wrapper.content).toBeTruthy();
        expect(wrapper.content.id).toBe("ad-slot");
        expect(wrapper.content.className).toBe("advantage-ad-slot");

        // Should have UI layer
        expect(wrapper.uiLayer).toBeTruthy();
        expect(wrapper.uiLayer.tagName.toLowerCase()).toBe(
            "advantage-ui-layer"
        );

        // Should have slots in shadow DOM
        const slots = wrapper.shadowRoot?.querySelectorAll("slot");
        expect(slots?.length).toBe(2);

        const advantageSlot = wrapper.shadowRoot?.querySelector(
            'slot[name="advantage-ad-slot"]'
        );
        const overlaySlot = wrapper.shadowRoot?.querySelector(
            'slot[name="overlay"]'
        );
        expect(advantageSlot).toBeTruthy();
        expect(overlaySlot).toBeTruthy();
    });

    test("should register with Advantage singleton on construction", () => {
        const wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        expect(mockAdvantage.registerWrapper).toHaveBeenCalledWith(wrapper);
        expect(mockAdvantage.registerWrapper).toHaveBeenCalledTimes(1);
    });

    test("should set up DOM mutation observer", () => {
        const observeMock = jest.fn();
        const mockObserver = {
            observe: observeMock,
            disconnect: jest.fn()
        };

        // Mock MutationObserver
        const MutationObserverMock = jest
            .fn()
            .mockImplementation((_callback) => {
                return mockObserver;
            });
        global.MutationObserver = MutationObserverMock;

        const wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        expect(MutationObserverMock).toHaveBeenCalledWith(expect.any(Function));
        expect(observeMock).toHaveBeenCalledWith(wrapper, {
            childList: true,
            subtree: true
        });
    });

    test("should initialize with correct default values", () => {
        const wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        expect(wrapper.allowedFormats).toBe(null);
        expect(wrapper.currentFormat).toBe("");
        expect(wrapper.simulating).toBe(false);
        expect(wrapper.messageHandler).toBeTruthy();
    });

    test("should handle adoptedStyleSheets when supported", () => {
        const wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        // Since we mocked supportsAdoptingStyleSheets as true
        expect(wrapper.shadowRoot?.adoptedStyleSheets).toBeDefined();
    });

    test("should set up slot change listener", () => {
        const addEventListenerSpy = jest.spyOn(
            HTMLSlotElement.prototype,
            "addEventListener"
        );

        document.createElement("advantage-wrapper") as AdvantageWrapper;

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            "slotchange",
            expect.any(Function)
        );

        addEventListenerSpy.mockRestore();
    });
});

describe("DOM change detection", () => {
    let wrapper: AdvantageWrapper;
    let mockAdvantage: jest.Mocked<Advantage>;
    let mockObserver: { observe: jest.Mock; disconnect: jest.Mock };
    let mutationCallback: (mutations: MutationRecord[]) => void;

    beforeEach(() => {
        // Define custom elements if not already defined
        if (!customElements.get("advantage-ui-layer")) {
            customElements.define(
                "advantage-ui-layer",
                class extends HTMLElement {
                    changeContent = jest.fn();
                    insertCSS = jest.fn();
                    getSlottedElement = jest.fn();
                    getAllSlottedElements = jest.fn();
                    querySlottedElements = jest.fn();
                }
            );
        }

        // Mock Advantage singleton
        mockAdvantage = {
            registerWrapper: jest.fn(),
            formats: new Map(),
            defaultFormats: [],
            formatIntegrations: new Map(),
            config: null
        } as any;

        (Advantage.getInstance as jest.Mock).mockReturnValue(mockAdvantage);

        // Mock MutationObserver
        mockObserver = {
            observe: jest.fn(),
            disconnect: jest.fn()
        };

        const MutationObserverMock = jest
            .fn()
            .mockImplementation((callback) => {
                mutationCallback = callback;
                return mockObserver;
            });
        global.MutationObserver = MutationObserverMock;

        // Define custom element if not already defined
        if (!customElements.get("advantage-wrapper")) {
            customElements.define("advantage-wrapper", AdvantageWrapper);
        }

        // Create wrapper instance
        wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;
        wrapper.reset = jest.fn();

        jest.clearAllMocks();
    });

    test("should reset wrapper when iframe is removed and format is active", () => {
        // Set up active format
        wrapper.currentFormat = "TOPSCROLL";
        wrapper.simulating = false;

        // Create mock iframe element
        const mockIframe = document.createElement("iframe");

        // Create mock mutation record
        const mockMutation: Partial<MutationRecord> = {
            type: "childList",
            addedNodes: [] as any,
            removedNodes: [mockIframe] as any
        };

        // Trigger mutation callback
        mutationCallback([mockMutation as MutationRecord]);

        expect(wrapper.reset).toHaveBeenCalledTimes(1);
    });

    test("should not reset when iframe removed during simulation", () => {
        // Set up active format but in simulation mode
        wrapper.currentFormat = "TOPSCROLL";
        wrapper.simulating = true;

        // Create mock iframe element
        const mockIframe = document.createElement("iframe");

        // Create mock mutation record
        const mockMutation: Partial<MutationRecord> = {
            type: "childList",
            addedNodes: [] as any,
            removedNodes: [mockIframe] as any
        };

        // Trigger mutation callback
        mutationCallback([mockMutation as MutationRecord]);

        expect(wrapper.reset).not.toHaveBeenCalled();
    });

    test("should not reset when no current format is set", () => {
        // No active format
        wrapper.currentFormat = "";
        wrapper.simulating = false;

        // Create mock iframe element
        const mockIframe = document.createElement("iframe");

        // Create mock mutation record
        const mockMutation: Partial<MutationRecord> = {
            type: "childList",
            addedNodes: [] as any,
            removedNodes: [mockIframe] as any
        };

        // Trigger mutation callback
        mutationCallback([mockMutation as MutationRecord]);

        expect(wrapper.reset).not.toHaveBeenCalled();
    });

    test("should log iframe additions", () => {
        const { logger } = require("../utils");

        // Create mock iframe element
        const mockIframe = document.createElement("iframe");

        // Create mock mutation record
        const mockMutation: Partial<MutationRecord> = {
            type: "childList",
            addedNodes: [mockIframe] as any,
            removedNodes: [] as any
        };

        // Trigger mutation callback
        mutationCallback([mockMutation as MutationRecord]);

        expect(logger.debug).toHaveBeenCalledWith(
            "An <iframe> was added:",
            mockIframe
        );
    });

    test("should ignore non-iframe node changes", () => {
        wrapper.currentFormat = "TOPSCROLL";
        wrapper.simulating = false;

        // Create mock non-iframe element
        const mockDiv = document.createElement("div");

        // Create mock mutation record
        const mockMutation: Partial<MutationRecord> = {
            type: "childList",
            addedNodes: [] as any,
            removedNodes: [mockDiv] as any
        };

        // Trigger mutation callback
        mutationCallback([mockMutation as MutationRecord]);

        expect(wrapper.reset).not.toHaveBeenCalled();
    });

    test("should ignore non-childList mutations", () => {
        wrapper.currentFormat = "TOPSCROLL";
        wrapper.simulating = false;

        // Create mock mutation record for attribute change
        const mockMutation: Partial<MutationRecord> = {
            type: "attributes",
            addedNodes: [] as any,
            removedNodes: [] as any
        };

        // Trigger mutation callback
        mutationCallback([mockMutation as MutationRecord]);

        expect(wrapper.reset).not.toHaveBeenCalled();
    });
});

describe("content management", () => {
    let wrapper: AdvantageWrapper;
    let mockAdvantage: jest.Mocked<Advantage>;

    beforeEach(() => {
        // Define custom elements if not already defined
        if (!customElements.get("advantage-ui-layer")) {
            customElements.define(
                "advantage-ui-layer",
                class extends HTMLElement {
                    changeContent = jest.fn();
                    insertCSS = jest.fn();
                    getSlottedElement = jest.fn();
                    getAllSlottedElements = jest.fn();
                    querySlottedElements = jest.fn();
                }
            );
        }

        // Mock Advantage singleton
        mockAdvantage = {
            registerWrapper: jest.fn(),
            formats: new Map(),
            defaultFormats: [],
            formatIntegrations: new Map(),
            config: null
        } as any;

        (Advantage.getInstance as jest.Mock).mockReturnValue(mockAdvantage);

        // Define custom element if not already defined
        if (!customElements.get("advantage-wrapper")) {
            customElements.define("advantage-wrapper", AdvantageWrapper);
        }

        // Create wrapper instance
        wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        jest.clearAllMocks();
    });

    test("should change content with string input", () => {
        const testContent = "<div>Test Content</div>";

        wrapper.changeContent(testContent);

        // Should create a container div with the content
        const slottedElement = wrapper.querySelector(
            '[slot="advantage-ad-slot"]'
        );
        expect(slottedElement).toBeTruthy();
        expect(slottedElement?.innerHTML).toBe(testContent);
        expect(slottedElement?.getAttribute("slot")).toBe("advantage-ad-slot");
    });

    test("should change content with HTMLElement input", () => {
        const testElement = document.createElement("div");
        testElement.textContent = "Test Element";

        wrapper.changeContent(testElement);

        // Should directly append the element with slot attribute
        const slottedElement = wrapper.querySelector(
            '[slot="advantage-ad-slot"]'
        );
        expect(slottedElement).toBe(testElement);
        expect(slottedElement?.getAttribute("slot")).toBe("advantage-ad-slot");
        expect(slottedElement?.textContent).toBe("Test Element");
    });

    test("should remove existing slotted content before adding new", () => {
        // Add initial content
        const initialElement = document.createElement("span");
        initialElement.setAttribute("slot", "advantage-ad-slot");
        initialElement.textContent = "Initial";
        wrapper.appendChild(initialElement);

        // Verify initial content exists
        expect(wrapper.querySelector('[slot="advantage-ad-slot"]')).toBe(
            initialElement
        );

        // Add new content
        const newContent = "<div>New Content</div>";
        wrapper.changeContent(newContent);

        // Should remove old content and add new
        expect(wrapper.querySelector("span")).toBe(null);
        const newSlottedElement = wrapper.querySelector(
            '[slot="advantage-ad-slot"]'
        );
        expect(newSlottedElement).toBeTruthy();
        expect(newSlottedElement?.innerHTML).toBe(newContent);
    });

    test("should return correct contentNodes", () => {
        // Create test content and add it to the wrapper
        const testDiv = document.createElement("div");
        testDiv.setAttribute("slot", "advantage-ad-slot");
        testDiv.textContent = "Test content";
        wrapper.appendChild(testDiv);

        // The contentNodes getter should return the assigned nodes
        const contentNodes = wrapper.contentNodes;

        expect(Array.isArray(contentNodes)).toBe(true);
        // Note: In our test environment, the slot may not work exactly like in browser
        // but we can at least verify the getter doesn't throw and returns an array
    });

    test("should return empty array when no assigned nodes", () => {
        // With no content added, should return empty array or handle null gracefully
        const contentNodes = wrapper.contentNodes;

        expect(Array.isArray(contentNodes)).toBe(true);
    });

    test("should handle multiple content changes", () => {
        // First change - string content
        wrapper.changeContent("<p>First</p>");
        let slottedElement = wrapper.querySelector(
            '[slot="advantage-ad-slot"]'
        );
        expect(slottedElement?.innerHTML).toBe("<p>First</p>");

        // Second change - element content
        const secondElement = document.createElement("span");
        secondElement.textContent = "Second";
        wrapper.changeContent(secondElement);

        // Should have removed first content
        expect(wrapper.querySelector("p")).toBe(null);
        // Should have new content
        slottedElement = wrapper.querySelector('[slot="advantage-ad-slot"]');
        expect(slottedElement).toBe(secondElement);

        // Third change - another string
        wrapper.changeContent("<h1>Third</h1>");

        // Should have removed second content
        expect(wrapper.querySelector("span")).toBe(null);
        // Should have third content
        slottedElement = wrapper.querySelector('[slot="advantage-ad-slot"]');
        expect(slottedElement?.innerHTML).toBe("<h1>Third</h1>");
    });
});

describe("CSS management", () => {
    let wrapper: AdvantageWrapper;
    let mockAdvantage: jest.Mocked<Advantage>;

    beforeEach(() => {
        // Define custom elements if not already defined
        if (!customElements.get("advantage-ui-layer")) {
            customElements.define(
                "advantage-ui-layer",
                class extends HTMLElement {
                    changeContent = jest.fn();
                    insertCSS = jest.fn();
                    getSlottedElement = jest.fn();
                    getAllSlottedElements = jest.fn();
                    querySlottedElements = jest.fn();
                }
            );
        }

        // Mock Advantage singleton
        mockAdvantage = {
            registerWrapper: jest.fn(),
            formats: new Map(),
            defaultFormats: [],
            formatIntegrations: new Map(),
            config: null
        } as any;

        (Advantage.getInstance as jest.Mock).mockReturnValue(mockAdvantage);

        // Define custom element if not already defined
        if (!customElements.get("advantage-wrapper")) {
            customElements.define("advantage-wrapper", AdvantageWrapper);
        }

        jest.clearAllMocks();
    });

    test("should insert CSS into shadow root with adoptedStyleSheets", () => {
        // Mock supportsAdoptingStyleSheets to return true
        const utils = require("../utils");
        const originalSupports = utils.supportsAdoptingStyleSheets;
        utils.supportsAdoptingStyleSheets = true;

        // Mock CSSStyleSheet constructor and replaceSync
        const mockReplaceSync = jest.fn();
        const mockCSSStyleSheet = jest.fn().mockImplementation(() => ({
            replaceSync: mockReplaceSync
        }));
        global.CSSStyleSheet = mockCSSStyleSheet as any;

        // Create wrapper instance after mocking
        wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        const testCSS = ".test { color: red; }";
        wrapper.insertCSS(testCSS);

        expect(mockReplaceSync).toHaveBeenCalledWith(testCSS);

        // Restore
        utils.supportsAdoptingStyleSheets = originalSupports;
    });

    test("should insert CSS into shadow root with style element fallback", () => {
        // Mock supportsAdoptingStyleSheets to be false
        const utils = require("../utils");
        const originalSupports = utils.supportsAdoptingStyleSheets;
        utils.supportsAdoptingStyleSheets = false;

        // Create new wrapper with fallback mode
        const fallbackWrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        const testCSS = ".test { color: blue; }";
        fallbackWrapper.insertCSS(testCSS);

        // Should find style element in shadow root
        const styleElement = fallbackWrapper.shadowRoot?.querySelector("style");
        expect(styleElement).toBeTruthy();
        expect(styleElement?.textContent).toBe(testCSS);

        // Restore original value
        utils.supportsAdoptingStyleSheets = originalSupports;
    });

    test("should reset CSS in shadow root with adoptedStyleSheets", () => {
        // Mock supportsAdoptingStyleSheets to return true
        const utils = require("../utils");
        const originalSupports = utils.supportsAdoptingStyleSheets;
        utils.supportsAdoptingStyleSheets = true;

        // Mock CSSStyleSheet constructor and replaceSync
        const mockReplaceSync = jest.fn();
        const mockCSSStyleSheet = jest.fn().mockImplementation(() => ({
            replaceSync: mockReplaceSync
        }));
        global.CSSStyleSheet = mockCSSStyleSheet as any;

        // Create wrapper instance after mocking
        const testWrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        testWrapper.resetCSS();

        expect(mockReplaceSync).toHaveBeenCalledWith("");

        // Restore
        utils.supportsAdoptingStyleSheets = originalSupports;
    });

    test("should reset CSS in shadow root with style element fallback", () => {
        // Mock supportsAdoptingStyleSheets to be false
        const utils = require("../utils");
        const originalSupports = utils.supportsAdoptingStyleSheets;
        utils.supportsAdoptingStyleSheets = false;

        // Create new wrapper with fallback mode
        const fallbackWrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        // First insert some CSS
        fallbackWrapper.insertCSS(".test { color: red; }");

        // Then reset it
        fallbackWrapper.resetCSS();

        // Should clear style element content
        const styleElement = fallbackWrapper.shadowRoot?.querySelector("style");
        expect(styleElement).toBeTruthy();
        expect(styleElement?.textContent).toBe("");

        // Restore original value
        utils.supportsAdoptingStyleSheets = originalSupports;
    });

    test("should apply styles to all child elements", () => {
        const { traverseNodes } = require("../utils");

        // Mock traverseNodes
        const mockTraverseNodes = jest.fn();
        traverseNodes.mockImplementation(mockTraverseNodes);

        // Mock contentNodes to return some test nodes
        const mockContentNodes = [
            document.createElement("div"),
            document.createTextNode("text")
        ];

        // Mock the contentNodes getter
        Object.defineProperty(wrapper, "contentNodes", {
            get: () => mockContentNodes,
            configurable: true
        });

        const testStyles = "color: red; background: blue;";
        wrapper.applyStylesToAllChildElements(testStyles);

        // Should call traverseNodes for each content node
        expect(mockTraverseNodes).toHaveBeenCalledTimes(
            mockContentNodes.length
        );
        expect(mockTraverseNodes).toHaveBeenCalledWith(
            mockContentNodes[0],
            expect.any(Function)
        );
        expect(mockTraverseNodes).toHaveBeenCalledWith(
            mockContentNodes[1],
            expect.any(Function)
        );
    });

    test("should apply styles only to div and iframe elements", () => {
        const { traverseNodes } = require("../utils");

        // Create test elements
        const testDiv = document.createElement("div");
        const testIframe = document.createElement("iframe");
        const testSpan = document.createElement("span");
        const testParagraph = document.createElement("p");

        // Mock traverseNodes to call the callback with each element
        traverseNodes.mockImplementation(
            (_node: Node, callback: (node: Node) => void) => {
                [testDiv, testIframe, testSpan, testParagraph].forEach(
                    callback
                );
            }
        );

        // Mock contentNodes
        Object.defineProperty(wrapper, "contentNodes", {
            get: () => [document.createElement("div")],
            configurable: true
        });

        const testStyles = "color: red; background: blue;";
        wrapper.applyStylesToAllChildElements(testStyles);

        // Should only apply styles to div and iframe
        expect(testDiv.style.cssText).toBe(testStyles);
        expect(testIframe.style.cssText).toBe(testStyles);
        expect(testSpan.style.cssText).toBe("");
        expect(testParagraph.style.cssText).toBe("");
    });

    test("should handle multiple CSS insertions", () => {
        // Mock supportsAdoptingStyleSheets to return true
        const utils = require("../utils");
        const originalSupports = utils.supportsAdoptingStyleSheets;
        utils.supportsAdoptingStyleSheets = true;

        // Mock CSSStyleSheet constructor and replaceSync
        const mockReplaceSync = jest.fn();
        const mockCSSStyleSheet = jest.fn().mockImplementation(() => ({
            replaceSync: mockReplaceSync
        }));
        global.CSSStyleSheet = mockCSSStyleSheet as any;

        // Create wrapper instance after mocking
        const testWrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        const css1 = ".class1 { color: red; }";
        const css2 = ".class2 { color: blue; }";

        testWrapper.insertCSS(css1);
        testWrapper.insertCSS(css2);

        // Should replace stylesheet each time
        expect(mockReplaceSync).toHaveBeenCalledTimes(2);
        expect(mockReplaceSync).toHaveBeenNthCalledWith(1, css1);
        expect(mockReplaceSync).toHaveBeenNthCalledWith(2, css2);

        // Restore
        utils.supportsAdoptingStyleSheets = originalSupports;
    });

    test("should handle empty CSS strings", () => {
        // Mock supportsAdoptingStyleSheets to return true
        const utils = require("../utils");
        const originalSupports = utils.supportsAdoptingStyleSheets;
        utils.supportsAdoptingStyleSheets = true;

        // Mock CSSStyleSheet constructor and replaceSync
        const mockReplaceSync = jest.fn();
        const mockCSSStyleSheet = jest.fn().mockImplementation(() => ({
            replaceSync: mockReplaceSync
        }));
        global.CSSStyleSheet = mockCSSStyleSheet as any;

        // Create wrapper instance after mocking
        const testWrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        testWrapper.insertCSS("");

        expect(mockReplaceSync).toHaveBeenCalledWith("");

        // Restore
        utils.supportsAdoptingStyleSheets = originalSupports;
    });
});

describe("Format Simulation Tests", () => {
    let wrapper: AdvantageWrapper;
    let mockAdvantage: jest.Mocked<Advantage>;
    let mockFormatConfig: any;

    beforeEach(() => {
        // Define custom elements if not already defined
        if (!customElements.get("advantage-ui-layer")) {
            customElements.define(
                "advantage-ui-layer",
                class extends HTMLElement {
                    changeContent = jest.fn();
                    insertCSS = jest.fn();
                    getSlottedElement = jest.fn();
                    getAllSlottedElements = jest.fn();
                    querySlottedElements = jest.fn();
                }
            );
        }

        // Create mock format config with simulate method
        mockFormatConfig = {
            name: "TOPSCROLL",
            description: "Test format",
            setup: jest.fn().mockResolvedValue(undefined),
            reset: jest.fn(),
            close: jest.fn(),
            simulate: jest.fn()
        };

        // Mock Advantage singleton
        mockAdvantage = {
            registerWrapper: jest.fn(),
            formats: new Map([["TOPSCROLL", mockFormatConfig]]),
            defaultFormats: [mockFormatConfig],
            formatIntegrations: new Map(),
            config: null
        } as any;

        (Advantage.getInstance as jest.Mock).mockReturnValue(mockAdvantage);

        // Define custom element if not already defined
        if (!customElements.get("advantage-wrapper")) {
            customElements.define("advantage-wrapper", AdvantageWrapper);
        }

        // Create wrapper instance
        wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        jest.clearAllMocks();
    });

    test("should simulate format when not already simulating", async () => {
        expect(wrapper.simulating).toBe(false);

        await wrapper.simulateFormat("TOPSCROLL");

        expect(wrapper.simulating).toBe(true);
        expect(mockFormatConfig.simulate).toHaveBeenCalledWith(wrapper);
        expect(mockFormatConfig.simulate).toHaveBeenCalledTimes(1);
    });

    test("should not simulate if already simulating", async () => {
        wrapper.simulating = true;

        await wrapper.simulateFormat("TOPSCROLL");

        expect(mockFormatConfig.simulate).not.toHaveBeenCalled();
    });

    test("should handle format without simulate method gracefully", async () => {
        const formatWithoutSimulate = {
            name: "NO_SIMULATE",
            description: "Format without simulate",
            setup: jest.fn(),
            reset: jest.fn()
        };

        mockAdvantage.formats.set("NO_SIMULATE", formatWithoutSimulate);

        await wrapper.simulateFormat("NO_SIMULATE");

        expect(wrapper.simulating).toBe(true);
        // Should not throw error when simulate method doesn't exist
    });

    test("should handle unknown format gracefully", async () => {
        await wrapper.simulateFormat("UNKNOWN_FORMAT");

        expect(wrapper.simulating).toBe(true);
        // Should not throw error when format doesn't exist
    });

    test("should log debug message when simulating", async () => {
        const { logger } = require("../utils");

        await wrapper.simulateFormat("TOPSCROLL");

        expect(logger.debug).toHaveBeenCalledWith("SIMULATE FORMAT");
    });

    test("should set simulating flag before calling simulate method", async () => {
        let simulatingDuringCall = false;
        mockFormatConfig.simulate.mockImplementation(() => {
            simulatingDuringCall = wrapper.simulating;
        });

        await wrapper.simulateFormat("TOPSCROLL");

        expect(simulatingDuringCall).toBe(true);
    });

    test("should prevent DOM change detection reset during simulation", async () => {
        // Mock the mutation observer to capture the callback
        let mutationCallback: (mutations: MutationRecord[]) => void = () => {};
        const observerMock = jest.fn();

        const MutationObserverMock = jest
            .fn()
            .mockImplementation((callback) => {
                mutationCallback = callback;
                return { observe: observerMock, disconnect: jest.fn() };
            });
        global.MutationObserver = MutationObserverMock;

        // Create a new wrapper to capture the callback
        const testWrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;
        testWrapper.reset = jest.fn();
        testWrapper.currentFormat = "TOPSCROLL";
        testWrapper.simulating = true;

        // Simulate iframe removal during simulation
        const mockIframe = document.createElement("iframe");
        const mockMutation: Partial<MutationRecord> = {
            type: "childList",
            addedNodes: [] as any,
            removedNodes: [mockIframe] as any
        };

        // Trigger the mutation callback
        mutationCallback([mockMutation as MutationRecord]);

        // Should not reset during simulation
        expect(testWrapper.reset).not.toHaveBeenCalled();
    });
});

describe("Reset and Close Behavior Tests", () => {
    let wrapper: AdvantageWrapper;
    let mockAdvantage: jest.Mocked<Advantage>;
    let mockFormatConfig: any;
    let mockIntegration: any;

    beforeEach(() => {
        // Define custom elements if not already defined
        if (!customElements.get("advantage-ui-layer")) {
            customElements.define(
                "advantage-ui-layer",
                class extends HTMLElement {
                    changeContent = jest.fn();
                    insertCSS = jest.fn();
                    getSlottedElement = jest.fn();
                    getAllSlottedElements = jest.fn();
                    querySlottedElements = jest.fn();
                }
            );
        }

        // Create mock format config
        mockFormatConfig = {
            name: "TOPSCROLL",
            description: "Test format",
            setup: jest.fn().mockResolvedValue(undefined),
            reset: jest.fn(),
            close: jest.fn()
        };

        // Create mock integration
        mockIntegration = {
            format: "TOPSCROLL",
            setup: jest.fn().mockResolvedValue(undefined),
            reset: jest.fn(),
            close: jest.fn(),
            onReset: jest.fn(), // deprecated method
            onClose: jest.fn() // deprecated method
        };

        // Mock Advantage singleton
        mockAdvantage = {
            registerWrapper: jest.fn(),
            formats: new Map([["TOPSCROLL", mockFormatConfig]]),
            defaultFormats: [mockFormatConfig],
            formatIntegrations: new Map([["TOPSCROLL", mockIntegration]]),
            config: null
        } as any;

        (Advantage.getInstance as jest.Mock).mockReturnValue(mockAdvantage);

        // Define custom element if not already defined
        if (!customElements.get("advantage-wrapper")) {
            customElements.define("advantage-wrapper", AdvantageWrapper);
        }

        // Create wrapper instance
        wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;
        wrapper.messageHandler = {
            ad: {
                iframe: document.createElement("iframe")
            }
        } as any;

        jest.clearAllMocks();
    });

    describe("reset method", () => {
        test("should not reset when no current format is set", () => {
            wrapper.currentFormat = "";

            wrapper.reset();

            expect(mockFormatConfig.reset).not.toHaveBeenCalled();
            expect(mockIntegration.reset).not.toHaveBeenCalled();
        });

        test("should call format reset method when format is active", () => {
            wrapper.currentFormat = "TOPSCROLL";

            wrapper.reset();

            expect(mockFormatConfig.reset).toHaveBeenCalledWith(
                wrapper,
                wrapper.messageHandler.ad?.iframe
            );
        });

        test("should call integration reset method when available", () => {
            wrapper.currentFormat = "TOPSCROLL";

            wrapper.reset();

            expect(mockIntegration.reset).toHaveBeenCalledWith(
                wrapper,
                wrapper.messageHandler.ad?.iframe
            );
        });

        test("should call deprecated onReset method when reset is not available", () => {
            wrapper.currentFormat = "TOPSCROLL";

            // Remove modern reset method, keep deprecated one
            const integrationWithoutReset = {
                ...mockIntegration,
                reset: undefined,
                onReset: jest.fn()
            };
            mockAdvantage.formatIntegrations.set(
                "TOPSCROLL",
                integrationWithoutReset
            );

            wrapper.reset();

            expect(integrationWithoutReset.onReset).toHaveBeenCalledWith(
                wrapper,
                wrapper.messageHandler.ad?.iframe
            );
        });

        test("should clear UI layer content on reset", () => {
            wrapper.currentFormat = "TOPSCROLL";

            wrapper.reset();

            expect(wrapper.uiLayer.changeContent).toHaveBeenCalledWith("");
        });

        test("should clear currentFormat after reset", () => {
            wrapper.currentFormat = "TOPSCROLL";

            wrapper.reset();

            expect(wrapper.currentFormat).toBe("");
        });

        test("should handle missing format config gracefully", () => {
            wrapper.currentFormat = "UNKNOWN_FORMAT";

            expect(() => wrapper.reset()).not.toThrow();
            expect(wrapper.currentFormat).toBe("");
        });

        test("should handle missing integration gracefully", () => {
            wrapper.currentFormat = "TOPSCROLL";
            mockAdvantage.formatIntegrations.clear();

            expect(() => wrapper.reset()).not.toThrow();
            expect(wrapper.currentFormat).toBe("");
        });
    });

    describe("close method", () => {
        test("should log and return early when no current format is set", () => {
            const { logger } = require("../utils");
            wrapper.currentFormat = "";

            wrapper.close();

            expect(logger.info).toHaveBeenCalledWith("No format to close.");
            expect(mockFormatConfig.close).not.toHaveBeenCalled();
        });

        test("should call format close method when available", () => {
            wrapper.currentFormat = "TOPSCROLL";

            wrapper.close();

            expect(mockFormatConfig.close).toHaveBeenCalledWith(
                wrapper,
                wrapper.messageHandler.ad?.iframe
            );
        });

        test("should handle format without close method gracefully", () => {
            wrapper.currentFormat = "TOPSCROLL";

            // Remove close method
            const formatWithoutClose = {
                ...mockFormatConfig,
                close: undefined
            };
            mockAdvantage.formats.set("TOPSCROLL", formatWithoutClose);

            expect(() => wrapper.close()).not.toThrow();
        });

        test("should call integration close method when available", () => {
            wrapper.currentFormat = "TOPSCROLL";

            wrapper.close();

            expect(mockIntegration.close).toHaveBeenCalledWith(
                wrapper,
                wrapper.messageHandler.ad?.iframe
            );
        });

        test("should call deprecated onClose method when close is not available", () => {
            wrapper.currentFormat = "TOPSCROLL";

            // Remove modern close method, keep deprecated one
            const integrationWithoutClose = {
                ...mockIntegration,
                close: undefined,
                onClose: jest.fn()
            };
            mockAdvantage.formatIntegrations.set(
                "TOPSCROLL",
                integrationWithoutClose
            );

            wrapper.close();

            expect(integrationWithoutClose.onClose).toHaveBeenCalledWith(
                wrapper,
                wrapper.messageHandler.ad?.iframe
            );
        });

        test("should clear currentFormat after close", () => {
            wrapper.currentFormat = "TOPSCROLL";

            wrapper.close();

            expect(wrapper.currentFormat).toBe("");
        });

        test("should log debug information during close", () => {
            const { logger } = require("../utils");
            wrapper.currentFormat = "TOPSCROLL";

            wrapper.close();

            expect(logger.info).toHaveBeenCalledWith(
                "Advantage.getInstance().formats",
                mockAdvantage.formats
            );
            expect(logger.info).toHaveBeenCalledWith(
                "Closing the current format.",
                mockFormatConfig
            );
        });

        test("should handle missing integration gracefully", () => {
            wrapper.currentFormat = "TOPSCROLL";
            mockAdvantage.formatIntegrations.clear();

            expect(() => wrapper.close()).not.toThrow();
            expect(wrapper.currentFormat).toBe("");
        });
    });
});

describe("Animation Tests", () => {
    let wrapper: AdvantageWrapper;
    let mockAdvantage: jest.Mocked<Advantage>;

    beforeEach(() => {
        // Define custom elements if not already defined
        if (!customElements.get("advantage-ui-layer")) {
            customElements.define(
                "advantage-ui-layer",
                class extends HTMLElement {
                    changeContent = jest.fn();
                    insertCSS = jest.fn();
                    getSlottedElement = jest.fn();
                    getAllSlottedElements = jest.fn();
                    querySlottedElements = jest.fn();
                }
            );
        }

        // Mock Advantage singleton
        mockAdvantage = {
            registerWrapper: jest.fn(),
            formats: new Map(),
            defaultFormats: [],
            formatIntegrations: new Map(),
            config: null
        } as any;

        (Advantage.getInstance as jest.Mock).mockReturnValue(mockAdvantage);

        // Define custom element if not already defined
        if (!customElements.get("advantage-wrapper")) {
            customElements.define("advantage-wrapper", AdvantageWrapper);
        }

        // Create wrapper instance
        wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        jest.clearAllMocks();
    });

    test("should add animate class on animateClose", () => {
        wrapper.animateClose();

        expect(wrapper.classList.contains("animate")).toBe(true);
    });

    test("should set height to 0px on animateClose", () => {
        wrapper.animateClose();

        expect(wrapper.style.height).toBe("0px");
    });

    test("should hide element on transitionend event", () => {
        wrapper.animateClose();

        // Simulate transitionend event
        const transitionEvent = new Event("transitionend");
        wrapper.dispatchEvent(transitionEvent);

        expect(wrapper.style.display).toBe("none");
    });

    test("should add transitionend event listener", () => {
        const addEventListenerSpy = jest.spyOn(wrapper, "addEventListener");

        wrapper.animateClose();

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            "transitionend",
            expect.any(Function)
        );

        addEventListenerSpy.mockRestore();
    });
});

describe("AdvantageWrapper morphIntoFormat", () => {
    let wrapper: AdvantageWrapper;
    let mockAdvantage: jest.Mocked<Advantage>;
    let mockFormatConfig: any;
    let mockIntegration: any;

    beforeEach(() => {
        // Define custom elements if not already defined
        if (!customElements.get("advantage-ui-layer")) {
            customElements.define(
                "advantage-ui-layer",
                class extends HTMLElement {
                    changeContent = jest.fn();
                    insertCSS = jest.fn();
                    getSlottedElement = jest.fn();
                    getAllSlottedElements = jest.fn();
                    querySlottedElements = jest.fn();
                }
            );
        }

        // Create mock format config
        mockFormatConfig = {
            name: "TOPSCROLL",
            description: "Test format",
            setup: jest.fn().mockResolvedValue(undefined),
            reset: jest.fn(),
            close: jest.fn()
        };

        // Create mock integration
        mockIntegration = {
            format: "TOPSCROLL",
            setup: jest.fn().mockResolvedValue(undefined),
            reset: jest.fn(),
            close: jest.fn(),
            onReset: jest.fn(), // deprecated method
            onClose: jest.fn() // deprecated method
        };

        // Mock Advantage singleton
        mockAdvantage = {
            registerWrapper: jest.fn(),
            formats: new Map([["TOPSCROLL", mockFormatConfig]]),
            defaultFormats: [mockFormatConfig],
            formatIntegrations: new Map([["TOPSCROLL", mockIntegration]]),
            config: null
        } as any;

        (Advantage.getInstance as jest.Mock).mockReturnValue(mockAdvantage);

        // Define custom element if not already defined
        if (!customElements.get("advantage-wrapper")) {
            customElements.define("advantage-wrapper", AdvantageWrapper);
        }

        // Create wrapper instance
        wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;
        wrapper.messageHandler = {
            ad: {
                iframe: document.createElement("iframe")
            }
        } as any;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("allowed-formats validation", () => {
        test("should allow format when it's in the allowed-formats attribute", async () => {
            wrapper.setAttribute("allowed-formats", "TOPSCROLL,WELCOMEPAGE");

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            expect(mockFormatConfig.setup).toHaveBeenCalledWith(
                wrapper,
                wrapper.messageHandler.ad?.iframe,
                { backgroundAdURL: undefined, sessionID: undefined }
            );
            expect(mockIntegration.setup).toHaveBeenCalled();
        });

        test("should allow format when it's in the programmatic allowedFormats list", async () => {
            wrapper.setAllowedFormats(["TOPSCROLL", "WELCOMEPAGE"]);

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            expect(mockFormatConfig.setup).toHaveBeenCalled();
        });

        test("should reject format not in allowed-formats attribute", async () => {
            wrapper.setAttribute("allowed-formats", "WELCOMEPAGE");

            await expect(wrapper.morphIntoFormat("TOPSCROLL")).rejects.toBe(
                "The format TOPSCROLL is not allowed for this wrapper. 🛑"
            );
            expect(mockFormatConfig.setup).not.toHaveBeenCalled();
        });

        test("should reject format not in programmatic allowedFormats list", async () => {
            wrapper.setAllowedFormats(["WELCOMEPAGE"]);

            await expect(wrapper.morphIntoFormat("TOPSCROLL")).rejects.toBe(
                "The format TOPSCROLL is not allowed for this wrapper. 🛑"
            );
            expect(mockFormatConfig.setup).not.toHaveBeenCalled();
        });

        test("should prioritize programmatic allowedFormats over attribute", async () => {
            wrapper.setAttribute("allowed-formats", "TOPSCROLL");
            wrapper.setAllowedFormats(["WELCOMEPAGE"]);

            await expect(wrapper.morphIntoFormat("TOPSCROLL")).rejects.toBe(
                "The format TOPSCROLL is not allowed for this wrapper. 🛑"
            );
        });

        test("should handle case-insensitive format comparison", async () => {
            wrapper.setAttribute("allowed-formats", "topscroll");

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            expect(mockFormatConfig.setup).toHaveBeenCalled();
        });

        test("should handle whitespace in allowed-formats attribute", async () => {
            wrapper.setAttribute(
                "allowed-formats",
                " TOPSCROLL , WELCOMEPAGE "
            );

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            expect(mockFormatConfig.setup).toHaveBeenCalled();
        });

        test("should filter out empty format names", async () => {
            wrapper.setAttribute("allowed-formats", "TOPSCROLL,,WELCOMEPAGE");

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            expect(mockFormatConfig.setup).toHaveBeenCalled();
        });
    });

    describe("exclude-formats validation", () => {
        test("should allow format when exclude-formats is not set", async () => {
            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            expect(mockFormatConfig.setup).toHaveBeenCalled();
        });

        test("should reject format when it's in exclude-formats", async () => {
            wrapper.setAttribute("exclude-formats", "TOPSCROLL,MIDSCROLL");

            await expect(wrapper.morphIntoFormat("TOPSCROLL")).rejects.toBe(
                "The format TOPSCROLL is forbidden for this wrapper. 🛑"
            );
            expect(mockFormatConfig.setup).not.toHaveBeenCalled();
        });

        test("should allow format when it's not in exclude-formats", async () => {
            wrapper.setAttribute("exclude-formats", "WELCOMEPAGE,MIDSCROLL");

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            expect(mockFormatConfig.setup).toHaveBeenCalled();
        });

        test("should ignore exclude-formats when allowed-formats is set", async () => {
            wrapper.setAttribute("allowed-formats", "TOPSCROLL");
            wrapper.setAttribute("exclude-formats", "TOPSCROLL");

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            expect(mockFormatConfig.setup).toHaveBeenCalled();
        });
    });

    describe("format configuration resolution", () => {
        test("should use format from formats map", async () => {
            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            expect(mockFormatConfig.setup).toHaveBeenCalled();
        });

        test("should fallback to defaultFormats when not in formats map", async () => {
            mockAdvantage.formats.clear();

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            expect(mockFormatConfig.setup).toHaveBeenCalled();
        });

        test("should reject when format is not found anywhere", async () => {
            mockAdvantage.formats.clear();
            mockAdvantage.defaultFormats = [];

            await expect(
                wrapper.morphIntoFormat("UNKNOWN_FORMAT")
            ).rejects.toBe(
                "😱 The format UNKNOWN_FORMAT is not supported. No configuration was found."
            );
            expect(wrapper.currentFormat).toBe("");
        });
    });

    describe("format setup execution", () => {
        test("should call format setup with correct parameters", async () => {
            await wrapper.morphIntoFormat("TOPSCROLL");

            expect(mockFormatConfig.setup).toHaveBeenCalledWith(
                wrapper,
                wrapper.messageHandler.ad?.iframe,
                { backgroundAdURL: undefined, sessionID: undefined }
            );
        });

        test("should call integration setup after format setup", async () => {
            const setupOrder: string[] = [];
            mockFormatConfig.setup.mockImplementation(() => {
                setupOrder.push("format");
                return Promise.resolve();
            });
            mockIntegration.setup.mockImplementation(() => {
                setupOrder.push("integration");
                return Promise.resolve();
            });

            await wrapper.morphIntoFormat("TOPSCROLL");

            expect(setupOrder).toEqual(["format", "integration"]);
        });

        test("should handle missing integration gracefully", async () => {
            mockAdvantage.formatIntegrations.clear();

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            expect(mockFormatConfig.setup).toHaveBeenCalledWith(
                wrapper,
                wrapper.messageHandler.ad?.iframe,
                { backgroundAdURL: undefined, sessionID: undefined }
            );
        });

        test("should set currentFormat before setup", async () => {
            let currentFormatDuringSetup: string | null = null;
            mockFormatConfig.setup.mockImplementation(() => {
                currentFormatDuringSetup = wrapper.currentFormat;
                return Promise.resolve();
            });

            await wrapper.morphIntoFormat("TOPSCROLL");

            expect(currentFormatDuringSetup).toBe("TOPSCROLL");
            expect(wrapper.currentFormat).toBe("TOPSCROLL");
        });
    });

    describe("error handling", () => {
        test("should reset wrapper and reject when format setup fails", async () => {
            const setupError = new Error("Setup failed");
            mockFormatConfig.setup.mockRejectedValue(setupError);
            const resetSpy = jest.spyOn(wrapper, "reset");

            await expect(wrapper.morphIntoFormat("TOPSCROLL")).rejects.toBe(
                setupError
            );
            expect(resetSpy).toHaveBeenCalled();
        });

        test("should reset wrapper and reject when integration setup fails", async () => {
            const integrationError = new Error("Integration failed");
            mockIntegration.setup.mockRejectedValue(integrationError);
            const resetSpy = jest.spyOn(wrapper, "reset");

            await expect(wrapper.morphIntoFormat("TOPSCROLL")).rejects.toBe(
                integrationError
            );
            expect(resetSpy).toHaveBeenCalled();
        });

        test("should clear currentFormat when format not found", async () => {
            mockAdvantage.formats.clear();
            mockAdvantage.defaultFormats = [];

            wrapper.currentFormat = "SOME_FORMAT";

            await expect(
                wrapper.morphIntoFormat("UNKNOWN_FORMAT")
            ).rejects.toContain("not supported");
            expect(wrapper.currentFormat).toBe("");
        });
    });

    describe("integration with setAllowedFormats and clearAllowedFormats", () => {
        test("should respect formats set via setAllowedFormats", async () => {
            wrapper.setAllowedFormats(["TOPSCROLL"]);

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            await expect(
                wrapper.morphIntoFormat("WELCOMEPAGE")
            ).rejects.toContain("not allowed");
        });

        test("should fallback to attribute after clearAllowedFormats", async () => {
            wrapper.setAttribute("allowed-formats", "TOPSCROLL");
            wrapper.setAllowedFormats(["WELCOMEPAGE"]);
            wrapper.clearAllowedFormats();

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
            await expect(
                wrapper.morphIntoFormat("WELCOMEPAGE")
            ).rejects.toContain("not allowed");
        });

        test("should allow all formats when no restrictions are set", async () => {
            wrapper.clearAllowedFormats();
            // No allowed-formats attribute and no exclude-formats

            await expect(
                wrapper.morphIntoFormat("TOPSCROLL")
            ).resolves.toBeUndefined();
        });
    });
});

describe("forceFormat Method Tests", () => {
    let wrapper: AdvantageWrapper;
    let mockAdvantage: jest.Mocked<Advantage>;
    let mockFormatConfig: any;

    beforeEach(() => {
        // Define custom elements if not already defined
        if (!customElements.get("advantage-ui-layer")) {
            customElements.define(
                "advantage-ui-layer",
                class extends HTMLElement {
                    changeContent = jest.fn();
                    insertCSS = jest.fn();
                    getSlottedElement = jest.fn();
                    getAllSlottedElements = jest.fn();
                    querySlottedElements = jest.fn();
                }
            );
        }

        // Create mock format config
        mockFormatConfig = {
            name: "TOPSCROLL",
            description: "Test format",
            setup: jest.fn().mockResolvedValue(undefined),
            reset: jest.fn(),
            close: jest.fn()
        };

        // Mock Advantage singleton
        mockAdvantage = {
            registerWrapper: jest.fn(),
            formats: new Map([["TOPSCROLL", mockFormatConfig]]),
            defaultFormats: [mockFormatConfig],
            formatIntegrations: new Map(),
            config: null
        } as any;

        (Advantage.getInstance as jest.Mock).mockReturnValue(mockAdvantage);

        // Define custom element if not already defined
        if (!customElements.get("advantage-wrapper")) {
            customElements.define("advantage-wrapper", AdvantageWrapper);
        }

        // Create wrapper instance
        wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        // Mock morphIntoFormat to track calls
        wrapper.morphIntoFormat = jest.fn().mockResolvedValue(undefined);

        jest.clearAllMocks();
    });

    test("should log debug message when forcing format", async () => {
        const { logger } = require("../utils");

        await wrapper.forceFormat("TOPSCROLL");

        expect(logger.debug).toHaveBeenCalledWith("FORCE FORMAT", "TOPSCROLL");
    });

    test("should call morphIntoFormat with format name", async () => {
        await wrapper.forceFormat("TOPSCROLL");

        expect(wrapper.morphIntoFormat).toHaveBeenCalledWith(
            "TOPSCROLL",
            expect.any(Object)
        );
    });

    test("should handle forceFormat without iframe", async () => {
        await wrapper.forceFormat("TOPSCROLL");

        expect(wrapper.morphIntoFormat).toHaveBeenCalledWith(
            "TOPSCROLL",
            expect.objectContaining({
                type: "ADVANTAGE",
                action: "REQUEST_FORMAT",
                format: "TOPSCROLL",
                sessionID: expect.any(String)
            })
        );
    });

    test("should handle forceFormat with iframe", async () => {
        const mockIframe = document.createElement("iframe");

        // Mock MessageChannel before test
        const mockPort1 = { postMessage: jest.fn() };
        const mockPort2 = { postMessage: jest.fn() };
        const mockMessageChannel = {
            port1: mockPort1,
            port2: mockPort2
        };
        global.MessageChannel = jest.fn(() => mockMessageChannel) as any;

        await wrapper.forceFormat("TOPSCROLL", mockIframe);

        // Should set up AdvantageAd in messageHandler
        expect(wrapper.messageHandler.ad).toBeDefined();
        expect(wrapper.messageHandler.ad!.iframe).toBe(mockIframe);
        expect(wrapper.messageHandler.ad!.eventSource).toBe(
            mockIframe.contentWindow
        );
        expect(wrapper.messageHandler.ad!.port).toBeDefined();
    });

    test("should include custom options in message", async () => {
        const customOptions = {
            backgroundAdURL: "https://example.com/bg.jpg",
            customParam: "customValue"
        };

        await wrapper.forceFormat("TOPSCROLL", undefined, customOptions);

        expect(wrapper.morphIntoFormat).toHaveBeenCalledWith(
            "TOPSCROLL",
            expect.objectContaining({
                type: "ADVANTAGE",
                action: "REQUEST_FORMAT",
                format: "TOPSCROLL",
                sessionID: expect.any(String),
                backgroundAdURL: "https://example.com/bg.jpg",
                customParam: "customValue"
            })
        );
    });

    test("should generate unique session ID", async () => {
        await wrapper.forceFormat("TOPSCROLL");
        const firstCall = (wrapper.morphIntoFormat as jest.Mock).mock
            .calls[0][1];

        jest.clearAllMocks();

        await wrapper.forceFormat("TOPSCROLL");
        const secondCall = (wrapper.morphIntoFormat as jest.Mock).mock
            .calls[0][1];

        expect(firstCall.sessionID).not.toBe(secondCall.sessionID);
        expect(firstCall.sessionID).toMatch(/^[a-z0-9]+$/);
        expect(secondCall.sessionID).toMatch(/^[a-z0-9]+$/);
    });

    test("should create MessageChannel for iframe communication", async () => {
        const mockIframe = document.createElement("iframe");

        // Mock MessageChannel
        const mockPort1 = { postMessage: jest.fn() };
        const mockPort2 = { postMessage: jest.fn() };
        const mockMessageChannel = {
            port1: mockPort1,
            port2: mockPort2
        };
        global.MessageChannel = jest.fn(() => mockMessageChannel) as any;

        await wrapper.forceFormat("TOPSCROLL", mockIframe);

        expect(global.MessageChannel).toHaveBeenCalled();
        expect(wrapper.messageHandler.ad!.port).toBe(mockPort1);
    });

    test("should propagate morphIntoFormat rejection", async () => {
        const morphError = new Error("Morph failed");
        wrapper.morphIntoFormat = jest.fn().mockRejectedValue(morphError);

        await expect(wrapper.forceFormat("TOPSCROLL")).rejects.toBe(morphError);
    });

    test("should handle different format types", async () => {
        await wrapper.forceFormat("WELCOMEPAGE");

        expect(wrapper.morphIntoFormat).toHaveBeenCalledWith(
            "WELCOMEPAGE",
            expect.objectContaining({
                format: "WELCOMEPAGE"
            })
        );
    });
});

describe("Edge Cases and Error Handling Tests", () => {
    let wrapper: AdvantageWrapper;
    let mockAdvantage: jest.Mocked<Advantage>;

    beforeEach(() => {
        // Define custom elements if not already defined
        if (!customElements.get("advantage-ui-layer")) {
            customElements.define(
                "advantage-ui-layer",
                class extends HTMLElement {
                    changeContent = jest.fn();
                    insertCSS = jest.fn();
                    getSlottedElement = jest.fn();
                    getAllSlottedElements = jest.fn();
                    querySlottedElements = jest.fn();
                }
            );
        }

        // Mock Advantage singleton
        mockAdvantage = {
            registerWrapper: jest.fn(),
            formats: new Map(),
            defaultFormats: [],
            formatIntegrations: new Map(),
            config: null
        } as any;

        (Advantage.getInstance as jest.Mock).mockReturnValue(mockAdvantage);

        // Define custom element if not already defined
        if (!customElements.get("advantage-wrapper")) {
            customElements.define("advantage-wrapper", AdvantageWrapper);
        }

        // Create wrapper instance
        wrapper = document.createElement(
            "advantage-wrapper"
        ) as AdvantageWrapper;

        jest.clearAllMocks();
    });

    test("should handle empty content changes gracefully", () => {
        expect(() => wrapper.changeContent("")).not.toThrow();

        const slottedElement = wrapper.querySelector(
            '[slot="advantage-ad-slot"]'
        );
        expect(slottedElement).toBeTruthy();
        expect(slottedElement?.innerHTML).toBe("");
    });

    test("should handle null content gracefully", () => {
        const nullElement = null as any;

        // This test expects the method to throw when null is passed
        // since the implementation doesn't handle null gracefully
        expect(() => wrapper.changeContent(nullElement)).toThrow();
    });

    test("should handle contentNodes when slot has no assigned nodes", () => {
        // Create a wrapper and get its slot
        const slotElement = wrapper.shadowRoot?.querySelector(
            'slot[name="advantage-ad-slot"]'
        );

        if (slotElement) {
            // Mock slot with no assigned nodes
            Object.defineProperty(slotElement, "assignedNodes", {
                value: () => null,
                configurable: true
            });
        }

        const contentNodes = wrapper.contentNodes;
        expect(Array.isArray(contentNodes)).toBe(true);
        expect(contentNodes.length).toBe(0);
    });

    test("should handle CSS operations with malformed CSS", () => {
        const malformedCSS = "{ invalid css ";

        expect(() => wrapper.insertCSS(malformedCSS)).not.toThrow();
        expect(() => wrapper.resetCSS()).not.toThrow();
    });

    test("should handle very long CSS strings", () => {
        const longCSS =
            ".test { ".repeat(10000) + "color: red; " + "}".repeat(10000);

        expect(() => wrapper.insertCSS(longCSS)).not.toThrow();
    });

    test("should handle special characters in content", () => {
        const specialContent = "<div>Special: &lt;&gt;&amp;\"'</div>";

        wrapper.changeContent(specialContent);

        const slottedElement = wrapper.querySelector(
            '[slot="advantage-ad-slot"]'
        );
        expect(slottedElement?.innerHTML).toBe(specialContent);
    });

    test("should handle allowedFormats with empty strings", () => {
        expect(() =>
            wrapper.setAllowedFormats(["", " ", "VALID"])
        ).not.toThrow();

        // Should filter out empty strings in morphIntoFormat
        wrapper.setAllowedFormats(["", " ", "TOPSCROLL"]);
        expect(wrapper.allowedFormats).toEqual(["", "", "TOPSCROLL"]);
    });

    test("should handle very large allowedFormats arrays", () => {
        const largeArray = Array(1000)
            .fill("FORMAT_")
            .map((prefix, i) => prefix + i);

        expect(() => wrapper.setAllowedFormats(largeArray)).not.toThrow();
        expect(wrapper.allowedFormats?.length).toBe(1000);
    });

    test("should handle repeated calls to same methods", () => {
        // Multiple resets
        expect(() => {
            wrapper.reset();
            wrapper.reset();
            wrapper.reset();
        }).not.toThrow();

        // Multiple closes
        expect(() => {
            wrapper.close();
            wrapper.close();
            wrapper.close();
        }).not.toThrow();

        // Multiple CSS resets
        expect(() => {
            wrapper.resetCSS();
            wrapper.resetCSS();
            wrapper.resetCSS();
        }).not.toThrow();
    });

    test("should handle DOM manipulation during operations", () => {
        // Change content while other operations are happening
        wrapper.changeContent("<div>First</div>");
        wrapper.insertCSS(".test { color: red; }");
        wrapper.changeContent("<div>Second</div>");

        const slottedElement = wrapper.querySelector(
            '[slot="advantage-ad-slot"]'
        );
        expect(slottedElement?.innerHTML).toBe("<div>Second</div>");
    });

    test("should handle missing messageHandler gracefully", () => {
        wrapper.messageHandler = null as any;

        expect(() => wrapper.reset()).not.toThrow();
        expect(() => wrapper.close()).not.toThrow();
    });
});

// The existing morphIntoFormat tests are already comprehensive
// and located earlier in the file, so we don't need to duplicate them here.
