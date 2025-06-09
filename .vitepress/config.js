import { defineConfig } from "vitepress";

const hostname = "https://www.get-advantage.org";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    srcDir: "www",
    ignoreDeadLinks: true,
    title: "Advantage",
    description: "High Impact Advertising - Reimagined",
    lastUpdated: true,
    base: "/",
    publicDir: "public",
    cleanUrls: true,
    transformPageData(pageData) {
        const canonicalUrl = `${hostname}/${pageData.relativePath}`
            .replace(/index\.(md|html)$/, '')
            .replace(/\.(md|html)$/, '')

        pageData.frontmatter.head ??= []
        pageData.frontmatter.head.push([
            'link',
            { rel: 'canonical', href: canonicalUrl }
        ])
    },
    head: [
        ['script', { src: 'https://cdn.tailwindcss.com' }],
        ['link', { href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap', rel: 'stylesheet' }],
        ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/favicons/apple-touch-icon.png" }],
        ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicons/favicon-32x32.png" }],
        ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicons/favicon-16x16.png" }],
        ['link', { rel: "manifest", href: "/favicons/site.webmanifest" }],
        ['link', { rel: "mask-icon", href: "/favicons/safari-pinned-tab.svg", color: "#6b04fd" }],
        ['link', { rel: "shortcut icon", href: "/favicons/favicon.ico" }],
        ['meta', { name: "msapplication-TileColor", content: "#6b04fd" }],
        ['meta', { name: "msapplication-config", content: "/favicons/browserconfig.xml" }],
        ['meta', { name: "theme-color", content: "#18181b", media: "(prefers-color-scheme: dark)" }],
        ['meta', { name: "theme-color", content: "#FFFFFF", media: "(prefers-color-scheme: light)" }],
    ],
    sitemap: {
        hostname,
    },
    markdown: {
        theme: {
            light: "github-light",
            dark: "github-dark"
        }
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: {
            light: "/logo/advantage-logo.svg",
            dark: "/logo/advantage-logo-light.svg"
        },
        siteTitle: false,
        nav: [
            { text: "Home", link: "/" },
            { text: "About", link: "/about/index.md" },
            { text: "Docs", link: "/docs/index.md" },
            { text: "API", link: "/api/index.md" },
            { text: "Certified ✨", link: "/certified/index.md" }
        ],
        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/get-advantage/advantage"
            },
            {
                icon: "slack",
                link: "https://join.slack.com/t/get-advantage/shared_invite/zt-2gy6c4z4m-4~pIuwRfe8eqPM5H7iV9MQ"
            }
        ],
        editLink: {
            pattern:
                "https://github.com/get-advantage/advantage/edit/main/www/:path",
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
                            text: "Community",
                            link: "/about/community.md"
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
                    ]
                },
                {
                    text: "Resources",
                    items: [
                        {
                            text: "AI Tools ✨",
                            link: "/docs/ai-tools.md"
                        },
                        {
                            text: "Changelog",
                            link: "/docs/changelog.md"
                        },
                        {
                            text: "Releases",
                            link: "https://github.com/get-advantage/advantage/releases"
                        },
                    ]
                }
            ]
        }
    }
});
