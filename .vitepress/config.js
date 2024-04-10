import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    srcDir: "www",
    ignoreDeadLinks: true,
    title: "Advantage",
    description: "Building User-First Ad Formats",
    lastUpdated: true,
    base: process.env.NODE_ENV === "production" ? "/advantage/" : "/",
    publicDir: "public",
    markdown: {
        theme: {
            light: "github-light",
            dark: "github-dark"
        }
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: {
            light: "/logo/rsz_5.png",
            dark: "/logo/rsz_3.png"
        },
        siteTitle: false,
        nav: [
            { text: "Home", link: "/" },
            { text: "About", link: "/about/index.md" },
            { text: "Docs", link: "/docs/index.md" },
            { text: "API", link: "/api/index.md" }
        ],
        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/madington/advantage"
            }
        ],
        editLink: {
            pattern:
                "https://github.com/madington/advantage/edit/main/www/:path",
            text: "Edit this page on GitHub"
        },
        outline: [2, 3],
        sidebar: {
            "/about": [
                {
                    text: "About",
                    items: [
                        { text: "What is Advantage?", link: "/about/index.md" },
                        {
                            text: "Why Advantage?",
                            link: "/about/why.md"
                        },
                        {
                            text: "How does it work?",
                            link: "/about/how.md"
                        },
                        {
                            text: "The team",
                            link: "/about/who.md"
                        },
                        {
                            text: "Contributions",
                            link: "/about/contributions.md"
                        },
                        {
                            text: "Code of Conduct",
                            link: "/about/codeofconduct.md"
                        }
                    ]
                }
            ],
            "/docs": [
                {
                    text: "Guide",
                    items: [
                        {
                            text: "Quickstart - Publisher",
                            link: "/docs/tutorial/publisher.md"
                        },
                        {
                            text: "Quickstart - Creative",
                            link: "/docs/tutorial/creative.md"
                        }
                    ]
                },
                {
                    text: "Formats",
                    items: [
                        {
                            text: "Topscroll",
                            link: "/docs/formats/topscroll.md"
                        },
                        {
                            text: "Midscroll",
                            link: "/docs/formats/midscroll.md"
                        },
                        {
                            text: "Double Midscroll",
                            link: "/docs/formats/double_midscroll.md"
                        },
                        {
                            text: "Welcome Page",
                            link: "/docs/formats/welcome_page.md"
                        }
                    ]
                },
                {
                    text: "Integration",
                    items: [
                        {
                            text: "Examples",
                            collapsed: true,
                            items: [
                                {
                                    text: `Next.js`,
                                    link: "/docs/integration/examples/nextjs.md"
                                },
                                {
                                    text: "Nuxt",
                                    link: "/docs/integration/examples/nuxt.md"
                                },
                                {
                                    text: "Remix",
                                    link: "/docs/integration/examples/remix.md"
                                }
                            ]
                        },
                        { text: "React", link: "/docs/integration/react.md" },
                        { text: "Vue", link: "/docs/integration/vue.md" },
                        { text: "Svelte", link: "/docs/integration/svelte.md" }
                    ]
                }
            ]
        }
    }
});
