# High Impact JS Compatibility Layer

This document explains the High Impact JS compatibility layer for Advantage, which allows existing High Impact JS users to transition seamlessly to Advantage without changing their existing code.

## Overview

The High Impact JS compatibility layer provides:

1. **Full API Compatibility**: Maintains the exact same API as High Impact JS
2. **Automatic Format Mapping**: Maps High Impact JS templates to Advantage formats
3. **Plugin Support**: Compatible with existing GAM and Xandr plugins
4. **Event Compatibility**: Fires the same events for backward compatibility
5. **Zero Code Changes**: Existing High Impact JS code works without modification

## How It Works

The compatibility layer works by:

1. **Intercepting High Impact JS API calls** and storing slot configurations
2. **Detecting ad slot rendering** through GAM/Xandr plugin integration
3. **Automatically wrapping ad slots** with AdvantageWrapper elements
4. **Converting templates to formats** using the mapping system
5. **Applying format transformations** using `AdvantageWrapper.forceFormat`

## Template to Format Mapping

| High Impact JS Template | Advantage Format   | Description                  |
| ----------------------- | ------------------ | ---------------------------- |
| `topscroll`             | `TOPSCROLL`        | Top-of-page scrolling format |
| `midscroll`             | `MIDSCROLL`        | Mid-content scrolling format |
| `double-fullscreen`     | `DOUBLE_MIDSCROLL` | Extended midscroll format    |
| `skins`                 | `WELCOME_PAGE`     | Full-screen welcome format   |
| `takeover`              | `WELCOME_PAGE`     | Full-screen takeover format  |
| `sitebar`               | `WELCOME_PAGE`     | Sidebar-style format         |

## Configuration Options

Template configurations are automatically converted to Advantage format options:

### Topscroll Template

```javascript
window.highImpactJs.setTemplateConfig("topscroll", {
    showCloseButton: true, // -> closeButton: true
    peekAmount: "70vh", // -> height: 70
    title: "Custom Title", // -> closeButtonText: 'Custom Title'
    fadeOnScroll: true // -> (handled by format)
});
```

### Midscroll Template

```javascript
window.highImpactJs.setTemplateConfig("midscroll", {
    zIndex: 1000 // -> (applied via CSS)
});
```

## Usage Examples

### Basic Setup (No Code Changes Required)

```javascript
// Existing High Impact JS code works as-is
window.highImpactJs = window.highImpactJs || { cmd: [] };

window.highImpactJs.cmd.push(function () {
    // Set global configuration
    window.highImpactJs.setConfig({
        plugins: ["gam"], // or ['xandr']
        debug: true
    });

    // Configure templates
    window.highImpactJs.setTemplateConfig("topscroll", {
        showCloseButton: true,
        peekAmount: "80vh"
    });

    // Define ad slots
    window.highImpactJs.defineSlot({
        template: "topscroll",
        adUnitId: "/123456/topscroll-ad",
        sizes: [
            [970, 250],
            [728, 90]
        ]
    });
});
```

### Enabling Compatibility in Advantage

```javascript
import { Advantage } from "@get-advantage/advantage";

const advantage = Advantage.getInstance();
advantage.configure({
    enableHighImpactCompatibility: true
    // ... other Advantage configuration
});
```

## Plugin Support

### GAM Plugin

The GAM plugin automatically detects Google Ad Manager slots and converts them:

```javascript
window.highImpactJs.setConfig({
    plugins: ["gam"]
});
```

### Xandr Plugin

The Xandr plugin works with Xandr/AppNexus ad slots:

```javascript
window.highImpactJs.setConfig({
    plugins: ["xandr"]
});

// Use targetId for Xandr
window.highImpactJs.defineSlot({
    template: "midscroll",
    targetId: "xandr-slot-123",
    sizes: [[300, 250]]
});
```

## Events

The compatibility layer fires High Impact JS events for backward compatibility:

```javascript
window.addEventListener("high-impact-ad-rendered", (event) => {
    console.log("Ad rendered:", event.detail);
    // {
    //   size: { width: 970, height: 250 },
    //   template: 'topscroll',
    //   advantageFormat: 'TOPSCROLL'
    // }
});
```

## Migration Path

The compatibility layer provides a smooth migration path:

1. **Phase 1**: Enable compatibility layer alongside existing High Impact JS
2. **Phase 2**: Gradually migrate to native Advantage API
3. **Phase 3**: Remove High Impact JS compatibility layer

### Phase 1: Enable Compatibility

```javascript
// Keep existing High Impact JS code
// Add Advantage with compatibility enabled
advantage.configure({
    enableHighImpactCompatibility: true
});
```

### Phase 2: Gradual Migration

```javascript
// Start using Advantage API for new implementations
advantage.configure({
    enableHighImpactCompatibility: true, // Keep for existing code
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            setup: (wrapper, iframe) => {
                // New Advantage-native configuration
            }
        }
    ]
});
```

### Phase 3: Full Migration

```javascript
// Remove compatibility layer
advantage.configure({
    enableHighImpactCompatibility: false, // or remove this line
    formatIntegrations: [
        // All configurations migrated to Advantage API
    ]
});
```

## Architecture

### Compatibility Layer Components

1. **`index.ts`**: Main compatibility API that maintains High Impact JS interface
2. **`plugins/gam.ts`**: GAM plugin for Google Ad Manager integration
3. **`plugins/xandr.ts`**: Xandr plugin for AppNexus integration
4. **Template conversion logic**: Maps High Impact JS templates to Advantage formats

### Integration Flow

```
High Impact JS API Call
         ↓
Compatibility Layer
         ↓
Store Configuration
         ↓
Ad Slot Detected (via Plugin)
         ↓
Create AdvantageWrapper
         ↓
Apply Format via forceFormat()
         ↓
Fire Compatibility Events
```

## Testing

Run the compatibility layer tests:

```bash
npm test -- src/advantage/high-impact-js/
```

## Examples

See the example files:

-   `playground/high-impact-js/example.html` - HTML example
-   `playground/high-impact-js/index.ts` - TypeScript example
-   `playground/high-impact-js/config.ts` - Configuration example

## Debugging

Enable debug logging to trace compatibility layer operations:

```javascript
window.highImpactJs.setConfig({
    debug: true
});
```

This will log:

-   Slot definitions
-   Template configurations
-   Ad slot detection
-   Format conversions
-   Event dispatching

## Limitations

1. **Custom Templates**: Custom High Impact JS templates need manual mapping
2. **Advanced Configurations**: Some advanced configurations may need adjustment
3. **Performance**: Additional layer adds minimal overhead
4. **Dependencies**: Requires both High Impact JS structure understanding and Advantage

## Support

For issues with the compatibility layer:

1. Check the debug logs
2. Verify template mappings
3. Ensure plugin configuration is correct
4. Test with native Advantage API to isolate issues

## Contributing

To contribute to the compatibility layer:

1. Understand both High Impact JS and Advantage APIs
2. Add tests for new functionality
3. Update documentation
4. Test with real ad servers when possible
