---
pageClass: docs
---

<p class="text-sm text-slate-500"><code>Docs > Quick Start Guide</code></p>

# Creative tutorial

This part of the tutorial is aimed at creatives and developers who build high-impact ads.

## Quick Start (CDN) {#quick-start-cdn}

The fastest way to build an Advantage-compatible ad is to use our CDN-hosted library. This works in any HTML environment.

### 1. Include the Library

Add this to your ad's HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/@get-advantage/advantage/dist/bundles/creative-side.iife.js"></script>
```

### 2. Request a Format

Use the following script to communicate with the publisher's website and request a high-impact format (like `topscroll`).

```html
<script>
    const { AdvantageCreativeMessenger, AdvantageMessageAction, AdvantageFormatName } = window.advantage;

    async function startAd() {
        const messenger = new AdvantageCreativeMessenger();
        const session = await messenger.startSession();

        if (session) {
            // Request the format your ad was built for
            const response = await messenger.sendMessage({
                action: AdvantageMessageAction.REQUEST_FORMAT,
                format: AdvantageFormatName.TopScroll
            });

            if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
                // Success! The site has adjusted its layout for your ad.
                console.log("Advantage format confirmed. Starting ad animation...");
            }
        }
    }

    startAd();
</script>
```

---

## Professional Workflow (NPM)

For advanced creative builds using modern bundling tools (Webpack, Vite, etc.).

### 1. Install

```sh
npm i @get-advantage/advantage
```

### 2. Implementation

```ts
import {
    AdvantageCreativeMessenger,
    AdvantageMessageAction,
    AdvantageFormatName
} from "@get-advantage/advantage/creative";

async function init() {
    const messenger = new AdvantageCreativeMessenger();
    const session = await messenger.startSession();

    if (session) {
        const response = await messenger.sendMessage({
            action: AdvantageMessageAction.REQUEST_FORMAT,
            format: AdvantageFormatName.TopScroll
        });

        if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
            // Initialize your high-impact creative logic here
        }
    }
}

init();
```

---

## Why is this necessary?

Standard ad banners are often stuck inside fixed-size `iframes`. To create "High Impact" experiences like parallax scrolling or full-screen takeovers, the ad needs a secure way to tell the parent website: *"I'm not a regular banner, please give me more space!"*

Advantage provides this secure communication bridge.

## Next Steps

-   View the [Messaging Protocol](../concepts/creative.md) for more advanced actions.
-   Check out the [Hello World Example](../examples/hello-world.md).
