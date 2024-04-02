# Advantage

At its essence, Advantage is a bespoke web component: `<advantage-wrapper></advantage-wrapper>`.

To leverage Advantage, enclose your ad placements or slots within the AdVantage wrapper as follows:

```
 <advantage-wrapper>
    <div slot="advantage-ad-slot">
        <!-- Insert your ad placement here -->
    </div>
</advantage-wrapper>
```

With this simple integration, your website is now primed to support a variety of engaging, high-impact ad formats.

## The basics

... more coming soon

## Usage

Import `advantage` and get a reference to the singleton instance:

```
import { Advantage } from "../advantage";
const advantage = Advantage.getInstance();

```

### Configuration

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
