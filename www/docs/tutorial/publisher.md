---
pageClass: docs
---

<p class="text-sm text-slate-500"><code>Docs > Quick Start Guide</code></p>

# Publisher tutorial

This part of the tutorial is aimed at website owners and publishers who want to implement High Impact JS on their site(s).

### Step 1: Install High Impact JS

To install High Impact JS, run the following command in your terminal:

::: code-group

```sh [npm]
$ npm i @ghigh-impact-js
```

```sh [pnpm]
$ pnpm add @high-impact-js
```

```sh [yarn]
$ yarn add @high-impact-js
```

```sh [bun]
$ bun i @high-impact-js
```

:::

### Step 2: Load the library

Add the library to your page. You can use a `<script>` tag or import it as an ES module.

::: code-group

```html [Script tag]
<script>
    window.highImpactJs = window.highImpactJs || { cmd: [] };
</script>
<script src="https://cdn.example.com/high-impact-js/latest/high-impact-js.umd.js"></script>
```

```ts [ES module]
import { Advantage } from "@high-impact-js";
```

:::

The command queue (`window.highImpactJs.cmd`) lets you call API functions before the library has finished loading. Commands are executed automatically once the library is ready.

### Step 3: Define your ad slots

Use `defineSlot` to register each ad placement that should support high-impact formats. The library will automatically find the matching DOM element, wrap it, detect when an ad renders, and activate the format.

```html
<script>
    window.highImpactJs = window.highImpactJs || { cmd: [] };
    window.highImpactJs.cmd.push(function () {
        highImpactJs.defineSlot({
            adUnitId: "/1234/topscroll-ad",
            template: "topscroll",
            sizes: [
                [970, 250],
                [1920, 1080]
            ]
        });
    });
</script>
```

#### SlotConfig properties

| Property          | Type         | Required | Description                                                                                                            |
| :---------------- | :----------- | :------- | :--------------------------------------------------------------------------------------------------------------------- |
| `adUnitId`        | `string`     | **Yes**  | The ad unit ID (e.g., a GAM slot element ID).                                                                          |
| `template`        | `string`     | No       | `"topscroll"`, `"midscroll"`, or `"double-fullscreen"`.                                                                |
| `targetId`        | `string`     | No       | Xandr target ID. Use instead of `adUnitId` for Xandr.                                                                  |
| `sizes`           | `number[][]` | No       | Accepted creative sizes, e.g. `[[970, 250]]`. Format only activates when the rendered ad matches.                      |
| `waitForAdSignal` | `boolean`    | No       | Wait for the creative to send a post-message signal before activating. Required for one-tag banners. Default: `false`. |

<div class="tip custom-block" style="padding-top: 8px">
  ℹ️ If your ad slot can serve both standard size ads and high-impact ads, nothing will happen when a non-high-impact ad is served. The slot behaves like a normal ad placement until a matching creative is detected.
</div>

### Step 4: Integrate formats with your site

High-impact formats take over parts of the page layout (e.g., a topscroll pushes content down, a midscroll goes full-width). Almost every website needs some adjustments to make this work smoothly — hiding a sticky header, resetting padding, expanding a container to full viewport width, etc.

You configure this with `formatIntegrations`. For each format you provide a `setup` function (called when the format activates) and optional `close` / `reset` functions (called when the user dismisses the ad or when the format is reset).

```ts
import {
    Advantage,
    AdvantageFormatName,
    IAdvantageWrapper
} from "@high-impact-js";

const advantage = Advantage.getInstance();

advantage.configure({
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            options: {
                closeButtonText: "Ad",
                closeButtonAnimationDuration: 0
            },
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                return new Promise<void>((resolve) => {
                    // Push the page content down to make room for the topscroll
                    const main = document.querySelector("main") as HTMLElement;
                    (main.parentElement as HTMLElement).style.paddingTop =
                        "80svh";
                    wrapper.style.top = "0";
                    wrapper.style.position = "absolute";
                    resolve();
                });
            },
            close: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                // Undo the layout changes when the ad is closed
                const main = document.querySelector("main") as HTMLElement;
                (main.parentElement as HTMLElement).style.paddingTop = "";
                wrapper.style.top = "";
            },
            reset: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                // Same cleanup when the format is reset
                const main = document.querySelector("main") as HTMLElement;
                (main.parentElement as HTMLElement).style.paddingTop = "";
                wrapper.style.top = "";
            }
        },
        {
            format: AdvantageFormatName.Midscroll,
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                return new Promise<void>((resolve) => {
                    // Remove margins so the ad stretches to full viewport width
                    const container = ad?.parentElement
                        ?.parentElement as HTMLElement;
                    if (container) {
                        container.style.margin = "0";
                        container.style.borderWidth = "0";
                    }

                    // Compensate if the wrapper isn't flush with the left edge
                    const rect = wrapper.getBoundingClientRect();
                    if (rect.left > 0) {
                        wrapper.style.marginLeft = `-${rect.left}px`;
                    }

                    resolve();
                });
            },
            reset: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                // Restore original styles
                const container = ad?.parentElement
                    ?.parentElement as HTMLElement;
                if (container) {
                    container.style.margin = "";
                    container.style.borderWidth = "";
                }
                wrapper.style.marginLeft = "";
            }
        }
    ]
});
```

#### FormatIntegration properties

| Property  | Type                                                              | Required | Description                                                                                               |
| :-------- | :---------------------------------------------------------------- | :------- | :-------------------------------------------------------------------------------------------------------- |
| `format`  | `AdvantageFormatName \| string`                                   | **Yes**  | Which format this integration applies to.                                                                 |
| `options` | `object`                                                          | No       | Format-specific options (e.g., `closeButtonText`, `autoCloseDuration`, `logo`). Varies by format.         |
| `setup`   | `(wrapper: IAdvantageWrapper, ad?: HTMLElement) => Promise<void>` | **Yes**  | Called when the format is about to activate. Make your layout adjustments here, then call `resolve()`.    |
| `close`   | `(wrapper: IAdvantageWrapper, ad?: HTMLElement) => void`          | No       | Called when the user dismisses the ad (e.g., clicks the close button). Undo your layout changes here.     |
| `reset`   | `(wrapper: IAdvantageWrapper, ad?: HTMLElement) => void`          | No       | Called when the format is reset (e.g., a new ad loads into the same slot). Undo your layout changes here. |

<div class="tip custom-block" style="padding-top: 8px">

**Tip:** If your `close` and `reset` handlers do the same thing, extract the cleanup into a shared function to avoid duplication.

</div>

### Step 5: Configure templates

Use `setTemplateConfig` to control the display options for a template. This is applied to all slots using that template, including slots defined before the call.

```js
highImpactJs.setTemplateConfig("topscroll", {
    showCloseButton: true,
    title: "Close ad",
    peekAmount: "80vh"
});
```

#### TemplateConfig properties

| Property          | Type      | Templates            | Description                                                                     |
| :---------------- | :-------- | :------------------- | :------------------------------------------------------------------------------ |
| `showCloseButton` | `boolean` | topscroll            | Show a close button. Default: `true`.                                           |
| `title`           | `string`  | topscroll            | Text shown next to the close button (e.g., "Close ad" or "Scroll to continue"). |
| `peekAmount`      | `string`  | topscroll, midscroll | How much of the viewport the format occupies, e.g. `"80vh"` or `"70%"`.         |
| `fadeOnScroll`    | `boolean` | topscroll            | Whether the ad fades as the user scrolls past it.                               |
| `zIndex`          | `number`  | all                  | CSS z-index applied to the wrapper element.                                     |

### Step 6: Set global configuration

Use `setConfig` to set library-wide settings such as which ad server plugins to use.

```js
highImpactJs.setConfig({
    plugins: ["gam"],
    zIndex: 9999
});
```

#### GlobalConfig properties

| Property          | Type                        | Description                                                                                                                                            |
| :---------------- | :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plugins`         | `string[]`                  | Ad server plugins to use: `"gam"` (Google Ad Manager) and/or `"xandr"`. Default: `["gam", "xandr"]`.                                                   |
| `zIndex`          | `number`                    | Default z-index for all format wrappers. Can be overridden per template.                                                                               |
| `topBarHeight`    | `number`                    | Height in pixels of any fixed top navigation bar on the page.                                                                                          |
| `bottomBarHeight` | `number`                    | Height in pixels of any fixed bottom navigation bar.                                                                                                   |
| `ignoreSlotOn`    | `(html: string) => boolean` | A callback that receives the ad's HTML content. Return `true` to prevent the format from activating (e.g., to filter out blank or fallback creatives). |

### Step 7: Lifecycle Events

The library dispatches lifecycle events that bubble up through the DOM. Use them to react to format changes on your page (e.g., pause a video player, adjust analytics, hide sticky elements).

| Event                    | When                                    | `event.detail`                |
| :----------------------- | :-------------------------------------- | :---------------------------- |
| `advantage:format-start` | Format has been activated               | `{ format, wrapper, iframe }` |
| `advantage:format-close` | User closed the format (e.g., × button) | `{ format, wrapper, iframe }` |
| `advantage:format-reset` | Format was reset (e.g., new ad loaded)  | `{ format, wrapper, iframe }` |

```js
document.addEventListener("advantage:format-start", (e) => {
    console.log("Format activated:", e.detail.format);
    // e.g. hide a sticky header
});

document.addEventListener("advantage:format-close", (e) => {
    console.log("Format closed:", e.detail.format);
    // e.g. restore the sticky header
});
```

### Success!

Congratulations! Your website is now set up for high-impact ad formats!

---

## Full Example

A complete publisher-side setup:

```html
<script>
    window.highImpactJs = window.highImpactJs || { cmd: [] };
    window.highImpactJs.cmd.push(function () {
        // Global settings
        highImpactJs.setConfig({
            plugins: ["gam"]
        });

        // Template settings
        highImpactJs.setTemplateConfig("topscroll", {
            showCloseButton: true,
            title: "Close ad",
            peekAmount: "80vh"
        });

        // Define slots
        highImpactJs.defineSlot({
            adUnitId: "/1234/topscroll-ad",
            template: "topscroll",
            sizes: [
                [970, 250],
                [1920, 1080]
            ],
            waitForAdSignal: true
        });

        highImpactJs.defineSlot({
            adUnitId: "/1234/midscroll-ad",
            template: "midscroll"
        });
    });
</script>
<script src="https://cdn.example.com/high-impact-js/latest/high-impact-js.umd.js"></script>
```

The library will:

1. Find the DOM elements matching each ad unit ID
2. Wrap them with `<advantage-wrapper>` elements configured for the right format
3. Listen for the GAM `slotRenderEnded` event
4. Wait for the creative's post-message signal (when `waitForAdSignal: true`)
5. Activate the format once all conditions are met

For the full Slot API reference (all properties, getter functions, post-message signals, etc.), see the [Slot API Reference](../migration/api).
