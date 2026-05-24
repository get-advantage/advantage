---
pageClass: docs
---

<p class="text-sm text-slate-500"><code>Docs > Quick Start Guide</code></p>

# Publisher tutorial

This part of the tutorial is aimed at website owners and publishers who want to implement Advantage on their site(s).

## Quick Start (CDN) {#quick-start-cdn}

The easiest way to get started with Advantage is by using our CDN. This method is perfect for AdOps and sites where you want a low-code integration.

### Step 1: Add the Advantage Script

Add the following script tag to the `<head>` of your website:

```html
<script src="https://cdn.jsdelivr.net/npm/@get-advantage/advantage/dist/bundles/advantage.iife.js"></script>
```

### Step 2: Wrap your ad slots

Wrap your existing ad placements with the `<advantage-wrapper>` component. This allows Advantage to take control when a high-impact ad is delivered.

```html
<advantage-wrapper>
    <div slot="advantage-ad-slot">
        <!-- YOUR AD SLOT HERE (e.g., GPT, Xandr, etc.) -->
        <div id="div-gpt-ad-12345-0"></div>
    </div>
</advantage-wrapper>
```

### Step 3: Success!

That's it! Your site is now ready to receive Advantage high-impact formats. When an Advantage-enabled creative is served into that slot, the wrapper will automatically handle the layout changes.

---

## Advanced Implementation (NPM) {#advanced-implementation-npm}

For developers who want full control, type safety, and custom integration logic.

### Step 1: Install Advantage

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

### Step 2: Import and Initialize

Import Advantage and get a reference to its singleton.

```ts [index.ts]
import { Advantage } from "@get-advantage/advantage";

// Get a reference to the Advantage singleton
const advantage = Advantage.getInstance();
```

### Step 3: Configure Custom Integrations

You can customize how Advantage interacts with your site's UI (e.g., hiding sticky headers) using the `configure` method.

```ts
import { Advantage, AdvantageFormatName } from "@get-advantage/advantage";

const advantage = Advantage.getInstance();

advantage.configure({
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            setup: (wrapper, adIframe) => {
                return new Promise((resolve) => {
                    // Custom logic: e.g., document.querySelector('header').style.display = 'none';
                    resolve();
                });
            }
        }
    ]
});
```

### Step 4: Programmatic Wrapping

If you prefer not to use HTML tags directly, you can wrap elements via JavaScript:

```ts
import { advantageWrapAdSlotElement } from "@get-advantage/advantage/utils";

// Wraps the element and prepares it for Advantage formats
advantageWrapAdSlotElement("#ad-slot-to-be-wrapped", ["TOPSCROLL"]);
```

---

## Common Configuration Options

### Allowed Formats

You can restrict which formats are allowed on a specific wrapper:

```html
<advantage-wrapper allowed-formats="TOPSCROLL,MIDSCROLL">
    <!-- ... -->
</advantage-wrapper>
```

### Manual Format Control

If you need to force a format for testing purposes:

```ts
const wrapper = document.querySelector("advantage-wrapper");
await wrapper.forceFormat("topscroll");
```

## Without the wrapper {#without-wrapper}

If you don't need the Advantage Wrapper but still want your website to be able to accept Advantage ads, you can use the [`AdvantageAdSlotResponder`](/api/classes/advantage_messaging_publisher_side.AdvantageAdSlotResponder.html) class.

```ts
import { AdvantageAdSlotResponder } from "@get-advantage/advantage";

new AdvantageAdSlotResponder({
    adSlotElement: document.querySelector("#advantage-enabled-ad-slot")!,
    formatRequestHandler: (format, elem) => {
        return new Promise((resolve) => {
            // Manually handle the transformation logic here
            resolve();
        });
    }
});
```
