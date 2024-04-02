# Advantage

At its essence, Advantage is a bespoke web element: `<advantage-wrapper></advantage-wrapper>`.

To leverage Advantage, enclose your ad placements/slots within the Advantage wrapper as follows:

```
 <advantage-wrapper>
    <div slot="advantage-ad-slot">
        <!-- Insert your ad placement here -->
    </div>
</advantage-wrapper>
```

With this simple integration, your website is now primed to support a variety of engaging, high-impact ad formats.

## The Advantage mission

**Advantage's** mission is to redefine the landscape of high impact advertising by setting a new standard that streamlines the creation, integration, and management of high impact digital ads. Our goal is to facilitate a smoother, more effective advertising experience for publishers, advertisers, media buyers, and creatives alike. Through our innovative `<advantage-wrapper />`, customizable UI Layer, and versatile formats, we aim to enhance the efficiency and impact of ads across the digital ecosystem, ensuring every stakeholder benefits from the transformation.

## The basics

The `<advantage-wrapper />` has the built-in capabilty to morph into a number of high impact ad formats. A banner creative can send a request to it's parent `<advantage-wrapper />` for it to transform into a specific format. This is done through the **_advantage message protocol_**. The wrapper will then assess if it is possible to make the transformation – based on your configuration – and reply with either a confirmation or a rejection.

## Publisher usage

Import `advantage` and get a reference to the singleton instance:

```
import { Advantage } from "../advantage";
const advantage = Advantage.getInstance();

```

Advantage comes pre-built with a number of high impact formats (detailed list coming soon). These formats include pre-configured styling for ease of use, though integration with your site may be necessary for optimal performance. You can customize the integration through settings passed to the singleton:

```
const advantage = Advantage.getInstance();

advantage.configure({
   formatIntegrations: [
    {
        format: AdvantageFormatName.TopScroll,
        setup: (wrapper: IAdvantageWrapper, adIframe: HTMLIFrameElement) => {
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

### Remote configuration

If you don't want to bundle your configuration it is possible to make Advantage fetch it from a remote URL. To do so, simply supply the configure function with a `configUrlResolver`:

```
advantage.configure({
 configUrlResolver: () => {
        /* You could use hostname or any other logic to determine the config file
        return `https://example.com/configs/${window.location.hostname}.js`;
        */
        // or simple return a static URL
        return "https://example.com/configs/formats.js";
    },
})
```

The remote configuration file should be a javascript file that exports the configuration like so:

```
export default { ...configuration }
```

### Custom formats

It is possible to create your own custom ad formats. These should be included into your configuration:

```
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
    ],
})
```

## Creative usage

On the creative side, a banner that is loaded into an `<advantage-wrapper />` can request a specific ad format by sending a message utilizing the Advantage protocol:

```
import { AdvantageProtocol } from "../advantage-ad/advantage-protocol";
import { AdvantageMessageAction, AdvantageFormatName } from "../types";

const advantageProtocol = new AdvantageProtocol();
const session = await advantageProtocol.startSession();

if (session) {
    const response = await advantageProtocol.sendMessage({
        action: AdvantageMessageAction.REQUEST_FORMAT,
        format: AdvantageFormatName.TopScroll
    });
    if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
        console.log("Top scroll format is confirmed, starting ad");
    }
    if (response?.action === AdvantageMessageAction.FORMAT_REJECTED) {
        console.log("Top scroll format was rejected");
    }
}
```

The communication between the banner creative and Advantage is safe by default and can be done using SafeFrames (cross domain iframes);
