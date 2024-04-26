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
    head: [
        ['script', { src: 'https://cdn.tailwindcss.com' }]
    ],
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
            },
            {
                icon: "slack",
                link: "https://join.slack.com/t/get-advantage/shared_invite/zt-2gy6c4z4m-4~pIuwRfe8eqPM5H7iV9MQ"
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
                    text: "Quick Start Guide",
                    items: [
                        {
                            text: "For Publisher",
                            link: "/docs/tutorial/publisher.md"
                        },
                        {
                            text: "For Creative",
                            link: "/docs/tutorial/creative.md"
                        }
                    ]
                },
                {
                    text: "Key Concepts",
                    items: [
                        {
                            text: "Formats",
                            link: "/docs/concepts/formats.md"
                        },
                        {
                            text: "Integration",
                            link: "/docs/concepts/integration.md"
                        },
                        {
                            text: "Wrapper",
                            link: "/docs/concepts/wrapper.md"
                        },
                        {
                            text: "UI Layer",
                            link: "/docs/concepts/ui-layer.md"
                        },
                        {
                            text: "Creative",
                            link: "/docs/concepts/creative.md"
                        }
                    ]
                },
                {
                    text: "Examples",

                    items: [
                        {
                            text: `Hello World`,
                            link: "/docs/examples/hello-world.md"
                        },
                        // {
                        //     text: "Nuxt",
                        //     link: "/docs/integration/examples/nuxt.md"
                        // },
                        // {
                        //     text: "Remix",
                        //     link: "/docs/integration/examples/remix.md"
                        // }
                    ]
                },
                //{ text: "React", link: "/docs/integration/react.md" },
                //{ text: "Vue", link: "/docs/integration/vue.md" },
                //{ text: "Svelte", link: "/docs/integration/svelte.md" }
            ]
        }
    }
});
