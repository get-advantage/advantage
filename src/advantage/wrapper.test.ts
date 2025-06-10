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
    supportsAdoptingStyleSheets: true
}));

// Mock format files to avoid CSS import issues
jest.mock("./formats", () => ({
    defaultFormats: []
}));

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
            close: jest.fn()
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
