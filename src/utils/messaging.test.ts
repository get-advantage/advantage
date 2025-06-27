import { ADVANTAGE } from "./messaging";

describe("sendMessageAndOpenChannel", () => {
    it("should export ADVANTAGE constant", () => {
        expect(ADVANTAGE).toBe("ADVANTAGE");
    });

    it("should be importable without errors", () => {
        const { sendMessageAndOpenChannel } = require("./messaging");
        expect(typeof sendMessageAndOpenChannel).toBe("function");
    });
});
