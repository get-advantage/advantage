# High Impact JS Styling Analysis & Migration Guide

## Overview

This document analyzes how styling is implemented in High Impact JS and compares it to the Advantage approach. This will help developers migrate site-specific configurations from High Impact JS to Advantage + High Impact JS compatibility layer.

---

## 🎨 High Impact JS Styling Implementation

### Architecture: Two-Level Styling System

High Impact JS uses a **two-level styling approach**:

#### 1. **Parent-Level Styling (Light DOM)**

Applied to the ad wrapper elements (`adWrapper`, `adUnit`, `adIframe`) in the **publisher's page DOM**.

**Example from Topscroll template:**

```javascript
// Calculates offset from viewport edge
const d = t.getBoundingClientRect(),
    s = window.getComputedStyle(t).marginLeft,
    l = d.left - parseInt(s, 10), // leftOffset
    g = document.documentElement.clientWidth;

// Injects CSS with calculated values
c(
    "topscroll",
    `
  .high-impact-ad-wrapper-topscroll {
    margin: 0 0 0 -${l}px !important;  /* Negative margin to break out of container */
    width: ${100 - (l / g) * 100}vw !important;  /* Full width minus offset */
    position: relative;
    z-index: ${r};
    height: ${h} !important;
    clip-path: polygon(0 0, 100vw 0, 100vw ${h}, 0 ${h});
  }
  .high-impact-ad-iframe-topscroll {
    position: fixed !important;
    left: 0;
    width: 100% !important;
    height: ${h} !important;
  }
`
);
```

**Key Techniques:**

-   **Negative margins** (`margin: 0 0 0 -${l}px`) to break out of centered/contained layouts
-   **Viewport-relative widths** calculated as percentage: `100vw - (leftOffset / clientWidth * 100)`
-   **Fixed positioning** for iframe to make it sticky
-   **Clip-path** to control visible area
-   **Dynamic z-index** from config

#### 2. **Creative-Level Styling (Shadow DOM)**

Applied **inside the ad creative's iframe** to make creatives responsive.

**Injected into every ad creative:**

```javascript
const v = (t) => {
    // t = iframe.contentDocument.head
    const e = document.createElement("style");
    e.innerHTML = `
    html, body, adfm-ad, #sf_align, .adform-adbox, .adform-adbox img {
      width: 100% !important; 
      height: 100% !important; 
      object-fit: cover;
    }
    .GoogleActiveViewClass, .GoogleActiveViewElement {
      transform: translate(calc(-50% + 50vw), 0); 
      width: 100vw !important; 
      height: 100vh !important;
    }
    .GoogleActiveViewClass img, .GoogleActiveViewElement img {
      width: 100vw !important; 
      height: 100vh !important; 
      object-fit: cover !important;
    }
    iframe[data-contents*='adform'] {
      width: 100vw !important;
      height: 100vh !important;
    }
  `;
    t.appendChild(e);
};

// Applied during onRender after transformation
((t, e) => {
    const iframe = t.querySelector("iframe"),
        doc = iframe.contentDocument || iframe.contentWindow.document;
    if (doc.head) {
        v(doc.head); // Inject responsive styles
    }
})(adWrapper, config);
```

**Purpose:**

-   Make ad creatives from various ad servers (Adform, Xandr, GAM) fill the entire iframe
-   Use `object-fit: cover` to maintain aspect ratios
-   Target specific ad server class names and elements

---

## 📐 Layout Calculation Strategy

### Problem: Ad slots are often inside centered containers

Publishers typically have layouts like:

```
<body>
  <div style="max-width: 1200px; margin: 0 auto;">  ← Centered container
    <div id="ad-slot-123">  ← Ad slot has offset from viewport edge
      <iframe>...</iframe>
    </div>
  </div>
</body>
```

### High Impact JS Solution:

**1. Measure the offset:**

```javascript
const rect = adWrapper.getBoundingClientRect();
const marginLeft = window.getComputedStyle(adWrapper).marginLeft;
const leftOffset = rect.left - parseInt(marginLeft, 10);
```

**2. Apply negative margin to break out:**

```javascript
margin: 0 0 0 -${leftOffset}px !important;
```

**3. Calculate proper width:**

```javascript
const viewportWidth = document.documentElement.clientWidth;
const widthPercent = 100 - (leftOffset / viewportWidth * 100);
width: ${widthPercent}vw !important;
```

**Result:** Ad breaks out of its container and spans full viewport width

---

## 🆚 Comparison: High Impact JS vs Advantage

### High Impact JS Approach

#### Configuration:

```javascript
// Site-wide config
highImpactJs.setConfig({
    topBarHeight: 76,
    zIndex: 1000001,
    plugins: ["gam"]
});

// Per-format config
highImpactJs.setTemplateConfig("topscroll", {
    peekAmount: "70vh",
    title: "Scroll ned",
    showCloseButton: true
});

// Slot definition
highImpactJs.defineSlot({
    template: "topscroll",
    adUnitId: "div-gpt-ad-123",
    sizes: [[728, 90]]
});
```

#### Styling Execution:

-   **Hardcoded** in template's `onRender()` function
-   Automatically calculates layout offsets
-   Injects CSS via `addTemplateStyle()` utility
-   No site-specific override mechanism
-   To customize, you need to **fork and bundle the library**

#### Custom Site Styling:

**Bundle:** The entire library was compiled with site-specific configurations and styling baked in. Changes require:

1. Modify source code
2. Rebuild bundle with Rollup
3. Deploy new bundle

---

### Advantage Approach

#### Configuration:

```javascript
advantage.configure({
  formatIntegrations: [
    {
      format: AdvantageFormatName.TopScroll,
      setup: (wrapper: IAdvantageWrapper, adIframe: HTMLIFrameElement) => {
        return new Promise<void>((resolve, reject) => {
          // Site-specific setup logic here

          // Example: Hide sticky header
          const stickyHeader = document.querySelector('.sticky-header');
          if (stickyHeader) {
            stickyHeader.style.display = 'none';
          }

          // Example: Adjust wrapper styling
          const wrapperElement = wrapper.getWrapperElement();
          wrapperElement.style.marginTop = '-20px';

          // Done
          resolve();
        });
      },
      teardown: (wrapper: IAdvantageWrapper) => {
        return new Promise<void>((resolve) => {
          // Cleanup when format is closed
          const stickyHeader = document.querySelector('.sticky-header');
          if (stickyHeader) {
            stickyHeader.style.display = 'block';
          }
          resolve();
        });
      }
    }
  ]
});
```

#### Styling Execution:

-   **Declarative** setup/teardown hooks per format
-   Core styling in Web Component (Shadow DOM)
-   Site customization via `setup()` function
-   **Separation of concerns:** Core vs site-specific logic
-   No need to fork/rebuild for customization

---

## 🔄 Migration Path: High Impact JS → Advantage

### Step 1: Identify Current Customizations

Look for site-specific values in your High Impact JS config:

```javascript
// Old High Impact JS config
highImpactJs.setConfig({
    topBarHeight: 76, // ← Site-specific
    bottomBarHeight: 0, // ← Site-specific
    zIndex: 1000001, // ← Site-specific
    plugins: ["gam"]
});

highImpactJs.setTemplateConfig("topscroll", {
    peekAmount: "70vh", // ← Site-specific
    title: "Scroll ned", // ← Site-specific
    arrowUrl: "/arrow.png", // ← Site-specific
    showCloseButton: true, // ← Site-specific
    fadeOnScroll: false // ← Site-specific
});
```

### Step 2: Map to Advantage Configuration

#### Global Settings → AdvantageConfig

```typescript
import { advantage, AdvantageFormatName } from "@get-advantage/advantage";

advantage.configure({
    // Map plugin config if needed
    enableHighImpactCompatibility: true,

    formatIntegrations: [
        // Per-format setup...
    ]
});
```

#### Template Config → Format Setup Hook

```typescript
{
  format: AdvantageFormatName.TopScroll,
  setup: async (wrapper, adIframe) => {
    // Apply site-specific adjustments

    // 1. Handle top bar (sticky header)
    const topBar = document.querySelector('.site-header');
    if (topBar) {
      topBar.style.display = 'none';
      wrapper.getWrapperElement().dataset.hidTopBar = 'true';
    }

    // 2. Adjust z-index if needed
    const wrapperEl = wrapper.getWrapperElement();
    wrapperEl.style.zIndex = '1000001';

    // 3. Custom messaging
    const message = document.createElement('div');
    message.textContent = 'Scroll ned';
    message.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 18px;
      z-index: 999999;
    `;
    wrapperEl.appendChild(message);
    wrapperEl.dataset.hasCustomMessage = 'true';
  },
  teardown: async (wrapper) => {
    // Restore site state
    const topBar = document.querySelector('.site-header');
    if (topBar && wrapper.getWrapperElement().dataset.hidTopBar) {
      topBar.style.display = '';
    }

    // Remove custom elements
    const wrapperEl = wrapper.getWrapperElement();
    if (wrapperEl.dataset.hasCustomMessage) {
      const message = wrapperEl.querySelector('div[style*="Scroll ned"]');
      message?.remove();
    }
  }
}
```

### Step 3: Handle Layout Offset Issues

If you see ads not spanning full width, you need the **wrapper-level styling fix**:

```typescript
import { advantage, AdvantageFormatName } from "@get-advantage/advantage";

const applyWrapperStyling = (
    wrapper: IAdvantageWrapper,
    formatName: AdvantageFormatName
) => {
    const wrapperElement = wrapper.getWrapperElement();
    const iframe = wrapperElement.querySelector("iframe");

    if (!iframe) return;

    // Measure layout offset (same as High Impact JS)
    const rect = wrapperElement.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(wrapperElement);
    const marginLeft = parseInt(computedStyle.marginLeft, 10) || 0;
    const leftOffset = rect.left - marginLeft;

    // Calculate proper width
    const viewportWidth = document.documentElement.clientWidth;
    const widthPercent = 100 - (leftOffset / viewportWidth) * 100;

    // Apply fixes based on format
    switch (formatName) {
        case AdvantageFormatName.TopScroll:
        case AdvantageFormatName.Midscroll:
            // Break out of container
            wrapperElement.style.marginLeft = `-${leftOffset}px`;
            wrapperElement.style.width = `${widthPercent}vw`;

            // Fix iframe positioning
            iframe.style.position = "fixed";
            iframe.style.left = "0";
            iframe.style.width = "100vw";
            break;
    }
};

advantage.configure({
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            setup: async (wrapper, adIframe) => {
                // Apply layout fixes
                applyWrapperStyling(wrapper, AdvantageFormatName.TopScroll);

                // ... other site-specific setup
            }
        }
    ]
});
```

### Step 4: Handle Responsive Creative Styling

Advantage already injects responsive styles into ad iframes via `injectResponsiveAdStyling()`. If you need additional creative-level styles:

```typescript
const injectCustomCreativeStyles = (iframe: HTMLIFrameElement) => {
    try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc?.head) return;

        const style = doc.createElement("style");
        style.innerHTML = `
      /* Your site-specific creative styles */
      .custom-ad-element {
        /* ... */
      }
    `;
        doc.head.appendChild(style);
    } catch (e) {
        console.warn("Could not inject creative styles (cross-origin):", e);
    }
};

advantage.configure({
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            setup: async (wrapper, adIframe) => {
                // Apply custom creative styling
                injectCustomCreativeStyles(adIframe);

                // ... other setup
            }
        }
    ]
});
```

---

## 📋 Migration Checklist

For developers migrating from High Impact JS to Advantage:

-   [ ] **Identify bundled customizations**

    -   [ ] Extract `setConfig()` values (topBarHeight, zIndex, etc.)
    -   [ ] Extract `setTemplateConfig()` values per format
    -   [ ] Note any custom template modifications

-   [ ] **Map to Advantage patterns**

    -   [ ] Global config → `advantage.configure()`
    -   [ ] Per-format config → `formatIntegrations[].setup()`
    -   [ ] Layout fixes → `applyWrapperStyling()` utility
    -   [ ] Creative styles → `injectCustomCreativeStyles()` utility

-   [ ] **Test on actual site**

    -   [ ] Verify full-width display
    -   [ ] Check z-index layering
    -   [ ] Test sticky header interactions
    -   [ ] Validate on mobile viewports

-   [ ] **Create separate config file**
    -   [ ] Keep core library untouched
    -   [ ] Site config in `site-config.ts`
    -   [ ] Version control the config separately

---

## 💡 Key Advantages of Advantage Approach

### 1. **Separation of Concerns**

-   Core library: Stable, versioned, npm-installed
-   Site config: Separate file, easy to modify
-   No need to fork/rebuild library

### 2. **Declarative Hooks**

```typescript
setup: async (wrapper, adIframe) => {
    // What to do BEFORE format shows
};
teardown: async (wrapper) => {
    // What to do WHEN format closes
};
```

Clear contract, predictable lifecycle.

### 3. **Type Safety**

```typescript
setup: (wrapper: IAdvantageWrapper, adIframe: HTMLIFrameElement) =>
    Promise<void>;
```

IDE autocomplete, compile-time checks, refactoring safety.

### 4. **Easier Updates**

```bash
npm install @get-advantage/advantage@latest
```

Get bug fixes and new features without rebuilding.

### 5. **Debugging**

-   Clear separation: Is it core or config?
-   Easier to isolate issues
-   Site-specific logic is visible and editable

---

## 🎯 Recommendation for Migration

### For Simple Sites (No Custom Bundle)

If you're using vanilla High Impact JS without a custom bundle:

**Just switch the script tag:**

```html
<!-- Old -->
<script src="https://cdn.example.com/highimpact.min.js"></script>

<!-- New -->
<script src="https://cdn.example.com/advantage-with-hijs.umd.js"></script>
```

**Config stays the same:**

```javascript
// Existing High Impact JS config still works
window.highImpactJs.cmd.push(() => {
    highImpactJs.setConfig({
        /* ... */
    });
    highImpactJs.defineSlot({
        /* ... */
    });
});
```

### For Custom Bundles

If you have a custom bundle with site-specific modifications:

**Create a configuration file:**

```typescript
// site-config.ts
import { advantage, AdvantageFormatName } from "@get-advantage/advantage";
import {
    applyWrapperStyling,
    injectResponsiveAdStyling
} from "./styling-utils";

export const configureAdvantageForSite = () => {
    advantage.configure({
        enableHighImpactCompatibility: true,
        formatIntegrations: [
            {
                format: AdvantageFormatName.TopScroll,
                setup: async (wrapper, adIframe) => {
                    // Extract all custom logic from bundle here
                    applyWrapperStyling(wrapper, AdvantageFormatName.TopScroll);

                    // Site-specific adjustments
                    const header = document.querySelector(".site-header");
                    if (header) header.style.display = "none";
                },
                teardown: async (wrapper) => {
                    const header = document.querySelector(".site-header");
                    if (header) header.style.display = "";
                }
            }
            // ... other formats
        ]
    });
};
```

**Use it:**

```html
<script src="https://cdn.example.com/advantage-with-hijs.umd.js"></script>
<script type="module">
    import { configureAdvantageForSite } from "./site-config.js";
    configureAdvantageForSite();
</script>
```

---

## 🔧 Utility Functions for Migration

### Complete Layout Fix (Replicates High Impact JS behavior)

```typescript
export const applyWrapperStyling = (
    wrapper: IAdvantageWrapper,
    formatName: AdvantageFormatName
): void => {
    const wrapperElement = wrapper.getWrapperElement();
    const iframe = wrapperElement.querySelector("iframe");
    if (!iframe) return;

    // Measure layout (same as High Impact JS)
    const rect = wrapperElement.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(wrapperElement);
    const marginLeft = parseInt(computedStyle.marginLeft, 10) || 0;
    const leftOffset = rect.left - marginLeft;
    const viewportWidth = document.documentElement.clientWidth;
    const widthPercent = 100 - (leftOffset / viewportWidth) * 100;

    // Format-specific fixes
    switch (formatName) {
        case AdvantageFormatName.TopScroll:
        case AdvantageFormatName.Midscroll:
            wrapperElement.style.marginLeft = `-${leftOffset}px`;
            wrapperElement.style.width = `${widthPercent}vw`;
            iframe.style.position = "fixed";
            iframe.style.left = "0";
            iframe.style.width = "100vw";
            break;

        case AdvantageFormatName.DoubleMidscroll:
            wrapperElement.style.marginLeft = `-${leftOffset}px`;
            wrapperElement.style.width = `${widthPercent}vw`;
            break;
    }
};
```

### Creative Styling (Replicates High Impact JS behavior)

```typescript
export const injectResponsiveAdStyling = (iframe: HTMLIFrameElement): void => {
    try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc?.head) return;

        const style = doc.createElement("style");
        style.innerHTML = `
      html, body, adfm-ad, #sf_align, .adform-adbox, .adform-adbox img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover;
      }
      .GoogleActiveViewClass, .GoogleActiveViewElement {
        transform: translate(calc(-50% + 50vw), 0);
        width: 100vw !important;
        height: 100vh !important;
        display: block;
      }
      .GoogleActiveViewClass img, .GoogleActiveViewElement img {
        width: 100vw !important;
        height: 100vh !important;
        object-fit: cover !important;
      }
    `;
        doc.head.appendChild(style);
    } catch (e) {
        console.warn("Could not inject responsive styles:", e);
    }
};
```

---

## Summary

**High Impact JS Styling:**

-   Hardcoded in template `onRender()` functions
-   Two-level: Parent DOM + iframe content
-   Layout calculation: `getBoundingClientRect()` → negative margins
-   Customization: Fork & bundle

**Advantage Styling:**

-   Declarative `setup()`/`teardown()` hooks
-   Core in Web Component + site config in hooks
-   Same layout calculation available as utility
-   Customization: Config file (no rebuild needed)

**Migration Strategy:**

1. Extract custom bundle logic
2. Move to `formatIntegrations[].setup()` hooks
3. Use utility functions for layout fixes
4. Keep config separate from core library

This approach gives you the **same styling power** with **better maintainability**.

---

### Live example:

```typescript
import {
    Advantage,
    AdvantageFormatName,
    IAdvantageWrapper
} from "@get-advantage/advantage";
import { StyleManager } from "../styleManager";
import { styleWelcomePageBar } from "../functions/welcomepage.leeads";
import { addAdvantageWrapper } from "../functions/addAdvantageWrapper";

addAdvantageWrapper("#div-leeadsFullpageAd", AdvantageFormatName.WelcomePage);
// Get a reference to the Advantage singleton
const advantage = Advantage.getInstance();
advantage.configure({
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            options: {
                closeButton: true,
                closeButtonText: "Fortsätt till sajt",
                downArrow: true,
                height: 80,
                closeButtonAnimationDuration: 0.5
            },
            setup: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                return new Promise<void>((resolve) => {
                    resolve();
                });
            },
            reset(wrapper, ad) {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? AdvantageFormatName.TopScroll
                );
                styleManager.restoreStyles();
            },
            close: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? AdvantageFormatName.TopScroll
                );
                styleManager.restoreStyles();
            }
        },
        {
            format: AdvantageFormatName.Midscroll,
            setup: (wrapper, ad) => {
                return new Promise<void>((resolve) => {
                    const styleManager = StyleManager.getInstance(
                        ad?.id ?? AdvantageFormatName.Midscroll
                    );

                    styleManager.setStyle(<HTMLElement>wrapper.parentElement, {
                        position: "relative",
                        width: "100vw",
                        zIndex: "9999999999"
                    });

                    styleManager.setStyle(
                        <HTMLElement>ad?.parentElement?.parentElement,
                        {
                            margin: "0",
                            padding: "0"
                        }
                    );

                    //Position ad in center of the screen
                    const cords = (<HTMLElement>(
                        wrapper.parentElement
                    )).getBoundingClientRect();
                    if (cords.left > 0) {
                        styleManager.setStyle(
                            <HTMLElement>wrapper.parentElement,
                            {
                                marginLeft: `-${cords.left}px`
                            }
                        );
                    }
                    resolve();
                });
            },
            reset(wrapper, ad) {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? AdvantageFormatName.Midscroll
                );
                styleManager.restoreStyles();
            },
            close(wrapper, ad) {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? AdvantageFormatName.Midscroll
                );
                styleManager.restoreStyles();
            }
        },
        {
            format: AdvantageFormatName.WelcomePage,
            options: {
                autoCloseDuration: 20,
                siteTitle: `${window.innerWidth < 450 ? "" : "Fragbite"}`,
                logo: `https://icons.duckduckgo.com/ip3/${window.location.hostname}.ico`,
                continueToLabel: `${
                    window.innerWidth < 450 ? "Fortsätt" : "Fortsätt till"
                }`,
                scrollBackToTop: false,
                adLabel: "Annons"
            },
            setup: (wrapper, ad) => {
                return new Promise<void>((resolve) => {
                    const styleManager = StyleManager.getInstance(
                        ad?.id ?? AdvantageFormatName.WelcomePage
                    );

                    styleManager.setStyle(<HTMLElement>ad?.parentElement, {
                        margin: "0"
                    });

                    styleManager.setStyle(document.body, {
                        paddingTop: "100vh",
                        overflow: "hidden"
                    });

                    styleWelcomePageBar(wrapper, "Fragbite");

                    resolve();
                });
            },
            reset(wrapper, ad) {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? AdvantageFormatName.WelcomePage
                );
                styleManager.restoreStyles();
            },
            close(wrapper, ad) {
                const styleManager = StyleManager.getInstance(
                    ad?.id ?? AdvantageFormatName.WelcomePage
                );
                styleManager.restoreStyles();
            }
        }
    ]
});
```
