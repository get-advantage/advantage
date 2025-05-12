const fs = require("fs");
const path = require("path");

// --- minimal browser‑like globals so the ESM bundle doesn't crash in Node ---
if (typeof globalThis.window === "undefined") {
    globalThis.window = {};
}
if (typeof globalThis.document === "undefined") {
    globalThis.document = {};
}
// some libraries look for window.location or window.navigator; stub them
globalThis.window.location = globalThis.window.location || {};
globalThis.window.navigator = globalThis.window.navigator || {};
// if the code asks for addEventListener/removeEventListener just give no‑ops
globalThis.window.addEventListener = () => {};
globalThis.window.removeEventListener = () => {};

(async () => {
    const { defaultFormats } = await import(
        "../dist/advantage/formats/index.js"
    );

    const formats = defaultFormats;
    const outputPath = path.resolve(__dirname, "../dist/formats.json");

    fs.writeFileSync(outputPath, JSON.stringify(formats, null, 2));
    console.log(`Formats JSON written to ${outputPath}`);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
