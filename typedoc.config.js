/** @type {import('typedoc').TypeDocOptions} */
export default {
    plugin: ["typedoc-plugin-markdown"],
    entryPoints: [
        "./src/types/index.ts",
        "./src/utils/misc.ts",
        "./src/utils/messaging.ts",
        "./src/messaging/publisher-side.ts",
        "./src/messaging/creative-side.ts"
    ],
    out: "www/api",
    readme: "none",
    entryDocument: "index.md",
    githubPages: true,
    hideInPageTOC: true
};
