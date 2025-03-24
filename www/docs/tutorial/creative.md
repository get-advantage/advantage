---
pageClass: docs
---

<p class="text-sm text-slate-500"><code>Docs > Quick Start Guide</code></p>

# Creative tutorial

This part of the tutorial is aimed at creatives who makes high-impact ads.

### Step 1: Install Advantage

To install Advantage, run the following command in your terminal:

::: code-group

```sh [npm]
$ npm i @get-advantage/advantage
```

```sh [pnpm]
$ pnpm add @get-advantage/advantage
```

```sh [yarn]
$ yarn add @get-advantage/advantage
```

```sh [bun]
$ bun i @get-advantage/advantage
```

:::

### Step 2: Import the messenger

Import the `AdvantageCreativeMessenger` class into your creative's code.

```ts
import {
    AdvantageCreativeMessenger,
    AdvantageMessageAction,
    AdvantageFormatName
} from "@get-advantage/advantage/creative";
```

### Step 3: Start a session

Create a new instance of the AdvantageCreativeMessenger class and start a session. When a session is established, send a message to request the format the the creative banner was built for:

```ts [TypeScript]
async function main() {
    const advantageMessenger = new AdvantageCreativeMessenger();
    const session = await advantageMessenger.startSession();
    if (session) {
        const response = await advantageMessenger.sendMessage({
            action: AdvantageMessageAction.REQUEST_FORMAT,
            format: AdvantageFormatName.TopScroll
        });
        if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
            // Yay! Format is confirmed by Advantage on the website
            // Start the ad here
        }
        if (response?.action === AdvantageMessageAction.FORMAT_REJECTED) {
            // Oh no, the format was rejected. Time to for a backup plan
        }
    } else {
        // For some reason, a session was not created. Perhaps the site isn't yet Advantage enabled?
    }
}
main();
```

## Play CDN

Use the CDN to try Advantage right in the browser without any build step.

::: warning
The CDN is designed for development purposes only, and is not intended for production.
Talk to your tech vendor to load the script from a 3rd party cirtified CDN used for ad delivery.
:::

::: code-group

```html{6,10-43} [JS]
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.jsdelivr.net/npm/@get-advantage/advantage/dist/bundles/creative-side.iife.js"></script>
    </head>
    <body>
        <h1>Hello world!</h1>
        <script>
            const {
                AdvantageCreativeMessenger,
                AdvantageMessageAction,
                AdvantageFormatName
            } = window.advantage;
            const advantageMessenger = new AdvantageCreativeMessenger();
            advantageMessenger.startSession().then((session) => {
                if (session) {
                    advantageMessenger
                        .sendMessage({
                            action: AdvantageMessageAction.REQUEST_FORMAT,
                            format: AdvantageFormatName.TopScroll
                        })
                        .then((response) => {
                            if (
                                response?.action ===
                                AdvantageMessageAction.FORMAT_CONFIRMED
                            ) {
                                // Yay! Format is confirmed by Advantage on the website
                                // Start the ad here
                            }
                            if (
                                response?.action ===
                                AdvantageMessageAction.FORMAT_REJECTED
                            ) {
                                // Oh no, the format was rejected. Time to for a backup plan
                            }
                        });
                } else {
                    // For some reason, a session was not created. Perhaps the site isn't yet Advantage enabled?
                }
            });
        </script>
    </body>
</html>
```

```html{10-14} [ESM]
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
        <h1>Hello world!</h1>
        <script type="module">
            import {
                AdvantageCreativeMessenger,
                AdvantageMessageAction,
                AdvantageFormatName
            } from "https://cdn.jsdelivr.net/npm/@get-advantage/advantage/dist/bundles/creative-side.js";
            const advantageMessenger = new AdvantageCreativeMessenger();
            const session = await advantageMessenger.startSession();
            if (session) {
                const response = await advantageMessenger.sendMessage({
                    action: AdvantageMessageAction.REQUEST_FORMAT,
                    format: AdvantageFormatName.TopScroll
                });
                if (
                    response.action === AdvantageMessageAction.FORMAT_CONFIRMED
                ) {
                    // Yay! Format is confirmed by Advantage on the website
                    // Start the ad here
                }
                if (
                    response?.action === AdvantageMessageAction.FORMAT_REJECTED
                ) {
                    // Oh no, the format was rejected. Time to for a backup plan
                }
            } else {
                // For some reason, a session was not created. Perhaps the site isn't yet Advantage enabled?
            }
        </script>
    </body>
</html>
```

:::

::: tip
There are many more pre baked bundles available in the CDN. Check out the [CDN documentation](https://cdn.jsdelivr.net/npm/@get-advantage/advantage/dist/bundles/) for more information.
:::
