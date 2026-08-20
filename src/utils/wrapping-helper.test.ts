import { describe, expect, it } from "@jest/globals";
import { JSDOM } from "jsdom";
import { advantageWrapAdSlotElement } from "./wrapping-helper";

describe("advantageWrapAdSlotElement", () => {
    it("does not wrap an already wrapped ad slot element", () => {
        const { window } = new JSDOM(
            `<body><div id="target">ad slot</div></body>`
        );
        global.document = window.document as Document;

        const target = window.document.getElementById("target");
        expect(target).not.toBeNull();

        advantageWrapAdSlotElement(target as HTMLElement);
        advantageWrapAdSlotElement(target as HTMLElement);

        expect(window.document.querySelectorAll("advantage-wrapper")).toHaveLength(
            1
        );
        expect(
            window.document.querySelectorAll(
                "advantage-wrapper > div[slot='advantage-ad-slot']"
            )
        ).toHaveLength(1);
    });
});
