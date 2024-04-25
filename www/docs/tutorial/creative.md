---
pageClass: docs
---

<p class="text-sm text-slate-500"><code>Docs > Tutorial</code></p>

# Creative tutorial

This part of the tutorial is aimed at creatives who makes high-impact ads.

### Step 1: Install Advantage

To install Advantage, run the following command in your terminal:

::: code-group

```sh [npm]
$ npm i advantage
```

```sh [pnpm]
$ pnpm add advantage
```

```sh [yarn]
$ yarn add advantage
```

```sh [bun]
$ bun i advantage
```

:::

### Step 2: Import the messenger

Import the `AdvantageCreativeMessenger` class into your creative's code.

```ts
import { AdvantageCreativeMessenger } from "advantage";
```

### Step 3: Start a session

Create a new instance of the AdvantageCreativeMessenger class and start a session. When a session is established, send a message to request the format the the creative banner was built for:

```ts
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
