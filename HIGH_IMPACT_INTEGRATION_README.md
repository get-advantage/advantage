# High Impact JS Integration Configuration

This configuration file provides website-specific integration settings for Advantage that replicate the responsive ad styling behavior from the original High Impact JS library.

## What This Config Does

The original High Impact JS library baked website-specific settings directly into the bundle. This config file separates those concerns by using Advantage's integration configuration system to:

1. **Inject responsive ad styling** into ad iframes to ensure proper scaling
2. **Handle platform-specific CSS** for GAM, Adform, Xandr, DCM, Sizmek, etc.
3. **Ensure banners fill format containers** correctly with proper dimensions

## Usage

### Option 1: Direct Import (Recommended for testing)

```typescript
import highImpactConfig from "./high-impact-integration-config";
import { Advantage } from "@advantage/core";

const advantage = Advantage.getInstance();
advantage.configure(highImpactConfig);
```

### Option 2: Remote Loading (Recommended for production)

```typescript
import { Advantage } from "@advantage/core";

const advantage = Advantage.getInstance();
advantage.configure({
    configUrlResolver: () =>
        "https://your-cdn.com/high-impact-integration-config.js"
});
```

### Option 3: Merge with Existing Config

```typescript
import highImpactConfig from "./high-impact-integration-config";
import yourSiteConfig from "./your-site-config";

const advantage = Advantage.getInstance();
advantage.configure({
    ...yourSiteConfig,
    enableHighImpactCompatibility: true,
    formatIntegrations: [
        ...yourSiteConfig.formatIntegrations,
        ...highImpactConfig.formatIntegrations
    ]
});
```

## What Problem This Solves

When replacing the original High Impact JS bundle with Advantage + High Impact JS compatibility layer, you may notice that ad banners don't scale correctly within the format containers. This happens because:

1. **Original behavior**: High Impact JS injected platform-specific CSS directly into ad iframes
2. **The issue**: That CSS was part of the website-specific bundle, not the core library
3. **The solution**: This config file replicates that styling injection through Advantage's integration system

## Key Features

### Responsive Ad Styling

The config injects CSS into ad iframes that ensures:

-   HTML/body elements fill the iframe: `width: 100%; height: 100%`
-   Images use `object-fit: cover` for proper scaling
-   Platform-specific elements (GAM, Adform, Xandr) are handled correctly

### Platform-Specific Fixes

-   **Google Ad Manager (GAM)**: Handles GoogleActiveViewClass elements
-   **Adform**: Scales adform-adbox and related elements
-   **Xandr/AppNexus**: Proper scaling for adnxs images
-   **DCM**: Handles dcmads class
-   **Sizmek**: Scales sadbundle iframes

### Format Support

Currently configured for:

-   **TopScroll**: Full-width banner at top of page
-   **Midscroll**: Full-width banner inline with content
-   **DoubleMidscroll**: Two consecutive midscroll banners

## Customization

You can customize the configuration by modifying:

### Default Format Options

```typescript
{
    format: AdvantageFormatName.TopScroll,
    options: {
        closeButton: true,      // Show close button
        downArrow: true,        // Show scroll hint arrow
        height: 70              // Peek amount (70vh)
    }
}
```

### Responsive Styling

Edit the `injectResponsiveAdStyling` function to add custom CSS rules for your specific ad platforms or creative requirements.

### Setup Timing

Adjust the delay in the setup function if needed:

```typescript
setup: (wrapper, ad) => {
    return new Promise<void>((resolve) => {
        if (ad) {
            setTimeout(() => {
                injectResponsiveAdStyling(ad);
            }, 100); // ← Adjust this delay
        }
        resolve();
    });
};
```

## Architecture Benefits

This approach follows proper separation of concerns:

-   ✅ **Core library**: Generic High Impact JS compatibility in `src/advantage/high-impact-js/`
-   ✅ **Integration config**: Website-specific styling and behavior in this file
-   ✅ **Flexibility**: Can be loaded remotely, versioned separately, and customized per site
-   ✅ **Maintainability**: Updates to core library don't require rebundling site-specific settings

## Troubleshooting

### Banners Still Not Scaling?

1. Check browser console for cross-origin errors (some ad platforms use safe frames)
2. Verify the ad iframe is passed to the setup function
3. Increase the setup timeout delay
4. Add custom CSS rules for your specific ad platform

### Cross-Origin Restrictions?

Some ad platforms use sandboxed iframes that prevent script access. In these cases:

-   The styling injection will fail silently (by design)
-   The ad platform's own responsive styling should take over
-   Consider adding fallback styles at the wrapper level

## Migration from Original High Impact JS

If you're migrating from a site-specific High Impact JS bundle:

1. **Extract custom CSS**: Copy any custom responsive ad styles from your bundle
2. **Add to config**: Include them in the `injectResponsiveAdStyling` function
3. **Test thoroughly**: Verify all ad platforms scale correctly
4. **Deploy config**: Host this file on your CDN for remote loading

## Future Enhancements

Potential improvements for this config:

-   Add more ad platform-specific CSS rules
-   Support for additional High Impact JS templates (skins, takeover, etc.)
-   Per-format styling customization
-   Dynamic CSS injection based on detected ad platform
