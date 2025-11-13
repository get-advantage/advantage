# Accessing Config in Format Integrations

## Overview

Format integrations can now access **both** Advantage framework configuration and High Impact JS global configuration in their `setup`, `reset`, `close`, and `teardown` hooks.

The configs are automatically merged and passed as a single unified object, giving integration authors access to all configuration values in one place.

## How It Works

### Setting Configuration

**Advantage Config** (Framework-level):

```typescript
// Set via advantage.configure()
advantage.configure({
    enableHighImpactCompatibility: true,
    formats: [...],
    formatIntegrations: [...]
});
```

**High Impact JS Config** (Publisher-level):

```javascript
// Publishers set global config using the High Impact JS API
window.highImpactJs.setConfig({
    plugins: ["gam"],
    topBarHeight: 76,
    bottomBarHeight: 0,
    zIndex: 1000001,
    debug: true
});
```

### Accessing Merged Config in Format Integrations

The merged config is automatically passed as the **third parameter** to integration hooks:

```typescript
advantage.configure({
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            options: {
                closeButton: true,
                closeButtonText: "Fortsätt till sajt",
                downArrow: true,
                height: 80
            },
            setup: async (wrapper, ad, config) => {
                // ✅ config contains BOTH Advantage and High Impact JS config

                // Access High Impact JS properties
                if (config?.topBarHeight) {
                    const topBar = document.querySelector(".site-header");
                    if (topBar) {
                        topBar.style.height = `${config.topBarHeight}px`;
                    }
                }

                if (config?.zIndex) {
                    wrapper.getWrapperElement().style.zIndex = String(
                        config.zIndex
                    );
                }

                // Access Advantage properties
                if (config?.enableHighImpactCompatibility) {
                    console.log("Running in High Impact JS compatibility mode");
                }

                if (config?.debug) {
                    console.log("Available formats:", config.formats);
                }
            },
            reset: (wrapper, ad, config) => {
                // ✅ config available in reset too

                if (config?.topBarHeight) {
                    const topBar = document.querySelector(".site-header");
                    if (topBar) {
                        topBar.style.height = "";
                    }
                }
            },
            close: (wrapper, ad, config) => {
                // ✅ config available in close too

                console.log("Closing with config:", config);
            }
        }
    ]
});
```

## Merged Config Type Definition

```typescript
/**
 * Merged configuration passed to format integration hooks.
 * Combines Advantage framework config with High Impact JS global config.
 */
interface MergedIntegrationConfig {
    // Advantage Config properties (framework-level)
    configUrlResolver?: () => string; // Load config from remote URL
    formats?: AdvantageFormat[]; // Custom format definitions
    formatIntegrations?: AdvantageFormatIntegration[]; // Site-specific hooks
    messageValidator?: (parent, message) => boolean; // Security validation
    enableHighImpactCompatibility?: boolean; // Enable High Impact JS layer

    // High Impact JS GlobalConfig properties (publisher-level)
    plugins?: string[]; // e.g., ["gam"], ["xandr"]
    topBarHeight?: number; // Height of sticky header in px
    bottomBarHeight?: number; // Height of bottom bar in px
    zIndex?: number; // Custom z-index for ads
    ignoreSlotOn?: (html: string) => boolean; // Function to skip certain ads
    debug?: boolean; // Enable debug logging
}
```

## Usage Examples

### Example 1: Adjusting for Top Bar

```typescript
{
    format: AdvantageFormatName.TopScroll,
    setup: async (wrapper, ad, config) => {
        const topBarHeight = config?.topBarHeight || 0;

        // Adjust ad positioning to account for top bar
        const wrapperEl = wrapper.getWrapperElement();
        wrapperEl.style.top = `${topBarHeight}px`;

        // Calculate available height
        const availableHeight = `calc(100vh - ${topBarHeight}px)`;
        wrapperEl.style.height = availableHeight;
    }
}
```

### Example 2: Respecting Z-Index

```typescript
{
    format: AdvantageFormatName.Midscroll,
    setup: async (wrapper, ad, config) => {
        const baseZIndex = config?.zIndex || 1000000;

        // Apply z-index hierarchy
        wrapper.getWrapperElement().style.zIndex = String(baseZIndex);

        // UI layer should be on top
        const uiLayer = wrapper.querySelector('advantage-ui-layer');
        if (uiLayer) {
            (uiLayer as HTMLElement).style.zIndex = String(baseZIndex + 1);
        }
    }
}
```

### Example 3: Debug Mode

```typescript
{
    format: AdvantageFormatName.WelcomePage,
    setup: async (wrapper, ad, config) => {
        if (config?.debug) {
            console.log('🔍 WelcomePage setup', {
                wrapper,
                ad,
                config
            });

            // Add debug indicators
            wrapper.getWrapperElement().classList.add('debug-mode');
        }
    },
    close: (wrapper, ad, config) => {
        if (config?.debug) {
            console.log('🔍 WelcomePage closed', {
                duration: performance.now()
            });
        }
    }
}
```

### Example 4: Detecting Compatibility Mode

```typescript
{
    format: AdvantageFormatName.TopScroll,
    setup: async (wrapper, ad, config) => {
        if (config?.enableHighImpactCompatibility) {
            console.log('Running in High Impact JS compatibility mode');
            // Apply legacy-compatible behavior if needed
        }
    }
}
```

### Example 5: Accessing Available Formats

```typescript
{
    format: AdvantageFormatName.Midscroll,
    setup: async (wrapper, ad, config) => {
        // Check if WelcomePage format is available
        const hasWelcomePage = config?.formats?.some(
            f => f.name === AdvantageFormatName.WelcomePage
        );

        if (hasWelcomePage) {
            console.log('WelcomePage is configured on this site');
            // Adjust behavior when WelcomePage is also available
        }
    }
}
```

### Example 6: Conditional Behavior Based on Bottom Bar

```typescript
{
    format: AdvantageFormatName.TopScroll,
    setup: async (wrapper, ad, config) => {
        // Check if bottom bar exists
        const hasBottomBar = (config?.bottomBarHeight || 0) > 0;

        if (hasBottomBar) {
            // Adjust scroll behavior for pages with bottom bars
            const scrollHeight = `calc(100vh - ${config.topBarHeight || 0}px - ${config.bottomBarHeight}px)`;
            wrapper.getWrapperElement().style.height = scrollHeight;
        }
    }
}
```

## Config Availability

| Hook                   | Config Available | Notes           |
| ---------------------- | ---------------- | --------------- |
| `setup`                | ✅ Yes           | Third parameter |
| `teardown`             | ✅ Yes           | Third parameter |
| `reset`                | ✅ Yes           | Third parameter |
| `close`                | ✅ Yes           | Third parameter |
| `onReset` (deprecated) | ❌ No            | Not updated     |
| `onClose` (deprecated) | ❌ No            | Not updated     |

## Implementation Details

The merged config is created by combining both Advantage and High Impact JS configs:

```typescript
// In wrapper.ts
const mergedConfig = {
    ...Advantage.getInstance().config, // Advantage framework config
    ...highImpactConfig // High Impact JS global config
};

// Pass to integration hooks
await integration.setup(wrapper, ad, mergedConfig);
```

This happens automatically in the wrapper when calling integration hooks. If the High Impact JS compatibility layer is not loaded, only Advantage config properties will be present.

## TypeScript Support

The third parameter is typed as `MergedIntegrationConfig`:

```typescript
setup: (
    wrapper: IAdvantageWrapper,
    adIframe?: HTMLIFrameElement | HTMLElement,
    config?: MergedIntegrationConfig // Merged Advantage + High Impact JS config
) => Promise<void>;
```

You can import the type for better IntelliSense:

```typescript
import type { MergedIntegrationConfig } from "@get-advantage/advantage";

setup: async (wrapper, ad, config) => {
    // TypeScript knows about all available properties
    if (config?.topBarHeight) {
        // High Impact JS property
    }

    if (config?.enableHighImpactCompatibility) {
        // Advantage property
    }
};
```

## Backward Compatibility

✅ **Fully backward compatible** - existing integrations that don't use the third parameter will continue to work:

```typescript
// Old style - still works
{
    format: AdvantageFormatName.TopScroll,
    setup: async (wrapper, ad) => {
        // No config parameter needed
    }
}

// New style - config available
{
    format: AdvantageFormatName.TopScroll,
    setup: async (wrapper, ad, config) => {
        // Can access config
    }
}
```

## Complete Real-World Example

```typescript
import { Advantage, AdvantageFormatName } from "@get-advantage/advantage";

// 1. Configure Advantage framework
const advantage = Advantage.getInstance();
advantage.configure({
    enableHighImpactCompatibility: true,
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            options: {
                closeButton: true,
                height: 70
            },
            setup: async (wrapper, ad, config) => {
                // Access High Impact JS config
                console.log("TopBar height:", config?.topBarHeight); // 60
                console.log("Z-index:", config?.zIndex); // 999999

                // Access Advantage config
                console.log(
                    "Compatibility mode:",
                    config?.enableHighImpactCompatibility
                ); // true

                // Apply site-specific styling based on merged config
                const wrapperEl = wrapper.getWrapperElement();

                if (config?.topBarHeight) {
                    wrapperEl.style.marginTop = `${config.topBarHeight}px`;
                }

                if (config?.zIndex) {
                    wrapperEl.style.zIndex = String(config.zIndex);
                }

                // Hide site header
                const header = document.querySelector(".site-header");
                if (header) {
                    (header as HTMLElement).style.display = "none";
                }
            },
            reset: (wrapper, ad, config) => {
                // Restore site header
                const header = document.querySelector(".site-header");
                if (header) {
                    (header as HTMLElement).style.display = "";
                }

                if (config?.debug) {
                    console.log("TopScroll reset");
                }
            },
            close: (wrapper, ad, config) => {
                // Same cleanup as reset
                const header = document.querySelector(".site-header");
                if (header) {
                    (header as HTMLElement).style.display = "";
                }

                if (config?.debug) {
                    console.log("TopScroll closed");
                }
            }
        }
    ]
});

// 2. Publishers set their global config (can be done before or after Advantage.configure)
window.highImpactJs.setConfig({
    topBarHeight: 60,
    bottomBarHeight: 0,
    zIndex: 999999,
    debug: true
});
```

## Summary

✅ **Unified API** - Both Advantage and High Impact JS config in one object  
✅ **Easy to use** - Config is automatically merged and passed as third parameter  
✅ **Backward compatible** - Existing code works without changes  
✅ **Type-safe** - TypeScript support with `MergedIntegrationConfig` interface  
✅ **Flexible** - Access framework config (formats, compatibility mode) and publisher config (topBarHeight, zIndex, debug)  
✅ **No breaking changes** - Purely additive feature  
✅ **Future-proof** - Aligns with Advantage + High Impact JS library merger

This makes it easy to write site-specific integration code that respects both framework-level and publisher-level configuration!
