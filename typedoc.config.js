/** @type {import('typedoc').TypeDocOptions} */
export default {
    plugin: ["typedoc-plugin-markdown", "typedoc-plugin-no-inherit"],
    entryPoints: [
        "./src/types/index.ts",
        "./src/utils/misc.ts",
        "./src/utils/messaging.ts",
        "./src/advantage/messaging/publisher-side.ts",
        "./src/advantage/messaging/creative-side.ts",
        "./src/advantage/advantage.ts",
        "./src/advantage/wrapper.ts",
        "./src/advantage/wrapping-helper.ts",
        "./src/advantage/ui-layer.ts"
    ],
    out: "www/api",
    readme: "none",
    entryDocument: "index.md",
    githubPages: true,
    hideInPageTOC: true
};
