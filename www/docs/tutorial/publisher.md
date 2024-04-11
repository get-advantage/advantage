# Publisher tutorial

This part of the tutorial is aimed at website owners and publishers who want to implement Advantage on their site(s).

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

### Step 2: Import Advantage

Import Advantage and get a reference to it's singleton

```ts [index.ts]
import { Advantage } from "advantage";

// Get a reference to the Advantage singleton
const advantage = Advantage.getInstance();
```

### Step 3: Decide if to use the Advantage Wrapper

Using the Advantage Wrapper is highly recommended as it makes implementing Advantage high-impact formats on your website quick and easy. But if you already have custom implementations of the formats that you want, you can choose not to use the wrapper. If so, you can jump ahead to [step 6](./publisher.html#without-wrapper). If you decide to use the Advantage wrapper, continue to the next step:

### Step 4: Wrap your ad slots/placements

It is now time to wrap your ad slots in the Advantage Wrapper.

```html
<advantage-wrapper>
    <div slot="advantage-ad-slot">
        <!-- YOUR AD SLOT HERE -->
    </div>
</advantage-wrapper>
```

You can also choose to use a helper method that does the wrapping for you:

```ts
import { advantageWrapAdSlotElement } from "advantage";

/* advantageWrapAdSlotElement is a function that wraps an ad slot element with an
Advantage-wrapper. It takes either a selector string or an HTMLElement as an argument.
You can also pass an optional second argument to specify the formats to exclude for the wrapped ad slot.*/
advantageWrapAdSlotElement("#ad-slot-to-be-wrapped", ["topscroll"]);
```

The above code will take an ad slot like this...

```html
<div id="ad-slot-to-be-wrapped"><!-- banners will be loaded here --></div>
```

... and wrap it like this:

```html
<advantage-wrapper>
    <div slot="advantage-ad-slot">
        <div id="ad-slot-to-be-wrapped">
            <!-- banners will be loaded here -->
        </div>
    </div>
</advantage-wrapper>
```

Your ad slot is now Advantage enabled!

### Step 5: Configuration

Advantage comes pre-built with a number of high-impact formats (detailed list and definitions coming soon) and they are included in the `<advantage-wrapper>`. These formats are pre-configured with the necessary styling out-of-the-box. Integration with your site might still be necessary for optimal performance. You can customize the integration through settings passed to Advantage. Pass your custom integrations in the `formatIntegrations` array. When the `<advantage-wrapper>` is about to transform into a format, it will run the provided `setup` function, so that you can make the necessary adjustments.

```ts
const advantage = Advantage.getInstance();

advantage.configure({
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            /**
             * This function will be run before a transformation into a high-impact format, allowing you to make adjustments that might be necessary
             * */
            setup: (
                wrapper: IAdvantageWrapper,
                adIframe: HTMLIFrameElement
            ) => {
                return new Promise<void>((resolve, reject) => {
                    /* Setup your site to accomodate the topscroll format here.
                    Perhaps you might need to hide a sticky header menu or similar. */

                    // call resolve when done
                    resolve();
                });
            }
        }
    ]
});
```

#### Remote or local configuration

If you don't want to bundle your configuration it is possible to make Advantage fetch it from a remote URL. To do so, simply supply the configure function with a `configUrlResolver`:

```ts [remote config]
advantage.configure({
    // If you want to, you can load the configuration from a remote file.
    // To do so, configure Advantage with a configUrlResolver, like this:
    configUrlResolver: () => {
        /* You could use the hostname or any other logic to determine the config file, or simply return a static URL.
        This is just an example of how you could dynamically load a config file based on the current hostname */
        return `https://example.com/configs/${window.location.hostname}.js`;
    }
});
```

The remote configuration file should be a javascript file that exports the configuration like so:

```ts
export default { ...configuration };
```

#### Custom formats

It is possible to create your own custom ad formats. These should be included into your configuration:

```ts
advantage.configure({
    formats: [
        {
            name: "MyCustomFormat",
            description: "A custom format",
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                return new Promise<void>((resolve) => {
                    // Style the wrapper and make other adjustments here
                    resolve();
                });
            }
        }
    ]
});
```

### Success!

Congratulations! Your website is now Advantage enabled!

### Step 6: Without the wrapper {#without-wrapper}

If you don't need the Advantage Wrapper but still want your website to be able to accept Advantage ads, you can use the [`AdvantageAdSlotResponder`](../../api/classes/messaging_publisher_side.AdvantageAdSlotResponder.html) class.

Create a new instance of the class for each ad slot/placement that you want Advantage-enabled:

```ts
import { AdvantageAdSlotResponder } from "advantage";

new AdvantageAdSlotResponder({
    adSlotElement: document.querySelector("#advantage-enabled-ad-slot")!,
    formatRequestHandler: (format, elem) => {
        return new Promise((resolve) => {
            // handle the format request here, e.g. by transforming the parent element into the requested format
            // resolve the promise if the format transformation was succesful or reject it if it failed
            resolve();
        });
    }
});
```

The `formatRequestHandler` will be called as soon as an Advantage ad is loaded into the ad slot and requests a format. It is now up to you to transform the ad slot into the requested format and then call `resolve()`.
