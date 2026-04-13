# How does it work?

High Impact JS lets you turn any ad slot on your page into a high-impact ad placement. You tell the library which slots to watch, and it handles the rest — detecting when an ad renders, communicating with the creative, and transforming the slot into the right format.

## 1. You define your slots {#define}

Call `defineSlot()` for each ad placement that should support high-impact formats. You specify the ad unit ID, the template (e.g., topscroll, midscroll), and optionally which creative sizes to accept.

```js
highImpactJs.defineSlot({
    adUnitId: "/1234/topscroll-ad",
    template: "topscroll",
    sizes: [
        [970, 250],
        [1920, 1080]
    ]
});
```

## 2. The library wraps the slot {#wrapper}

When you define a slot, the library finds the matching DOM element and wraps it in an `<advantage-wrapper>` — a self-contained web component that encapsulates the high-impact format. The wrapper uses Shadow DOM to keep ad styles isolated from your page.

```
Before:   <div id="gpt-ad-topscroll">...</div>

After:    <advantage-wrapper>
              <div id="gpt-ad-topscroll">...</div>
          </advantage-wrapper>
```

This happens automatically. You don't need to add any HTML.

## 3. An ad renders in the slot {#detection}

The library integrates with your ad server (GAM, Xandr, or both) and listens for ad render events. When an ad appears in a defined slot, the library checks whether it matches the slot's configuration (template, sizes, etc.).

The creative sends a post-message signal to announce itself. The library picks this up and matches it to the right slot.

## 4. The format activates {#activation}

Once a matching ad is detected, the wrapper transforms into the configured format — topscroll, midscroll, double-fullscreen, etc. The format is pre-built into the library with the right styling and behavior.

If you've configured [format integrations](/docs/tutorial/publisher#step-4-integrate-formats-with-your-site), your `setup` function runs first so you can adjust your page layout (e.g., push content down for a topscroll, go full-width for a midscroll). When the ad is closed or reset, your `close` / `reset` functions clean things up.

## 5. Lifecycle events fire {#events}

The library dispatches events at each stage so you can react in your own code:

- `advantage:format-start` — format activated
- `advantage:format-close` — user closed the ad
- `advantage:format-reset` — format reset (e.g., new ad loaded)

These bubble through the DOM, so you can listen on `document` or any ancestor element.

## Summary

```
defineSlot()  →  auto-wrap  →  ad renders  →  format activates  →  events fire
```

The publisher defines **what** should be a high-impact slot. The library handles **how** — wrapping, detection, format rendering, and cleanup. The creative only needs to either use the [Advantage messaging protocol](/docs/tutorial/creative) or send a simple [post-message signal](/docs/tutorial/creative#post-message) to trigger the format.
