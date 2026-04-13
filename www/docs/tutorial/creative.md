---
pageClass: docs
---

<p class="text-sm text-slate-500"><code>Docs > Quick Start Guide</code></p>

# Creative tutorial

This part of the tutorial is aimed at creatives who makes high-impact ads. There are two approaches: the **Advantage protocol** (MessageChannel-based, full two-way communication) and the simpler **post-message signal** (one-shot announcement, no library needed inside the creative).

## Option A: Advantage Protocol

The Advantage protocol gives you a two-way communication channel with the publisher page, including session management, format confirmation/rejection, and waypoint tracking.

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

### Step 4: Listen for messages (optional)

After a session is established, you can listen for incoming messages from the publisher side. This is useful for reacting to format lifecycle changes or custom events.

```ts
advantageMessenger.onMessage((message) => {
    console.log("Received from publisher:", message.action);
});
```

### Step 5: Waypoints (optional)

Waypoints let a creative track element visibility across iframe boundaries. This is useful for triggering animations or analytics when specific parts of the ad scroll into view.

Waypoints use a `BroadcastChannel` tied to the session ID, so they work across different browsing contexts (e.g., between an ad iframe and the publisher page).

#### Setting up waypoints (producer side)

In the context that contains the elements you want to track, call `setupWaypoints` with an array of elements. Each element must have a `data-id` attribute.

```ts
// Mark elements with data-id attributes
// <div data-id="cta-button">...</div>
// <div data-id="product-image">...</div>

const waypoints = document.querySelectorAll("[data-id]");
const observer = advantageMessenger.setupWaypoints([...waypoints]);

// Later, when done:
observer.disconnect();
```

#### Listening to waypoints (consumer side)

In a different context (e.g., another iframe or the creative's main frame), listen for waypoint triggers:

```ts
const listener = advantageMessenger.listenToWaypoints(
    (waypointId, isIntersecting) => {
        if (waypointId === "cta-button" && isIntersecting) {
            // The CTA button scrolled into view — trigger animation
        }
    }
);

// Later, when done:
listener.disconnect();
```

---

## Option B: Post-Message Signal (simple one-tag) {#post-message}

If your creative doesn't need two-way communication — it just needs to announce "I'm here, activate the format" — you can skip the Advantage library entirely and send a single `postMessage` from the creative.

This is the approach used by one-tag banner solutions, where a banner is built to be responsive and works in multiple high impact formats. It requires the publisher to set `waitForAdSignal: true` on the slot.

### Minimal creative

```html
<!DOCTYPE html>
<html>
    <head>
        <style>
            body {
                margin: 0;
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        </style>
    </head>
    <body>
        <img src="https://example.com/ad-image.jpg" alt="Ad" />
        <script>
            // Tell the publisher page to activate the format
            window.top.postMessage(
                JSON.stringify({
                    sender: "high-impact-js",
                    action: "AD_RENDERED"
                }),
                "*"
            );
        </script>
    </body>
</html>
```

That's it — no library, no session, no build step. The publisher's library receives this message, matches it to a defined slot, and activates the format.

### Accepted message formats

Any of the following work:

```js
// Option 1: JSON string (recommended — works across all origins)
window.top.postMessage(
    JSON.stringify({ sender: "high-impact-js", action: "AD_RENDERED" }),
    "*"
);

// Option 2: Object
window.top.postMessage(
    { sender: "high-impact-js", action: "AD_RENDERED" },
    "*"
);

// Option 3: Typed message
window.top.postMessage({ type: "high-impact-ad-responsive" }, "*");
```

---

## Play CDN

Use the CDN to try the Advantage creative library right in the browser without any build step.

::: warning
The CDN is designed for development purposes only, and is not intended for production.
Talk to your tech vendor to load the script from a 3rd party certified CDN used for ad delivery.
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
