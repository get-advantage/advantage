/** @type {import('typedoc').TypeDocOptions} */
export default {
    plugin: ["typedoc-plugin-markdown"],
    entryPoints: [
        "./src/types/index.ts",
        "./src/utils/misc.ts",
        "./src/utils/messaging.ts",
        "./src/advantage-protocol/publisher-side.ts",
        "./src/advantage-protocol/creative-side.ts"
    ],
    out: "www/api",
    readme: "none",
    entryDocument: "index.md",
    githubPages: true,
    hideInPageTOC: true
};
