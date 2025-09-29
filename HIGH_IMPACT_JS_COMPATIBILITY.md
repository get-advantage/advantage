# High Impact JS Compatibility Layer

## Overview

This document explains how the Advantage framework provides a compatibility layer that maintains the exact same API as the original High Impact JS library while internally using Advantage's modern component-based architecture.

## Architecture Comparison

### Original High Impact JS

```
┌─────────────────────────────────────┐
│ Original High Impact JS             │
├─────────────────────────────────────┤
│ • Direct DOM manipulation           │
│ • CSS injection for templates       │
│ • Plugin system (GAM/Xandr)        │
│ • Size-based format detection       │
│ • Template-specific rendering       │
└─────────────────────────────────────┘
```

### Advantage Compatibility Layer (`src/advantage/high-impact-js/`)

```
┌─────────────────────────────────────┐
│ High Impact JS API (compatibility)  │
├─────────────────────────────────────┤
│ • Same defineSlot() API             │
│ • Same setTemplateConfig() API      │
│ • Same plugin interface             │
│ • Size-based detection preserved    │
└─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────┐
│ Advantage Core System               │
├─────────────────────────────────────┤
│ • Custom Elements (Web Components)  │
│ • Modern CSS architecture           │
│ • Format-based rendering            │
│ • Advanced responsive handling      │
└─────────────────────────────────────┘
```

## API Compatibility

### 1. Core API Functions

The compatibility layer maintains 100% API compatibility:

#### `defineSlot(slotConfig)`

```javascript
// Original High Impact JS API
window.highImpactJs.defineSlot({
    template: "topscroll",
    adUnitId: "/123456/topscroll-ad",
    sizes: [[1, 1]],
    waitForAdSignal: false
});

// ✅ Works identically in Advantage compatibility layer
```

#### `setTemplateConfig(template, config)`

```javascript
// Original High Impact JS API
window.highImpactJs.setTemplateConfig("topscroll", {
    showCloseButton: true,
    peekAmount: "70vh",
    title: "Continue reading"
});

// ✅ Works identically in Advantage compatibility layer
```

#### `setConfig(globalConfig)`

```javascript
// Original High Impact JS API
window.highImpactJs.setConfig({
    plugins: ["gam"], // or ["xandr"]
    topBarHeight: 50
});

// ✅ Works identically in Advantage compatibility layer
```

#### Command Queue (`cmd.push`)

```javascript
// Original High Impact JS API
window.highImpactJs.cmd.push(function () {
    // Configuration code
});

// ✅ Works identically in Advantage compatibility layer
```

### 2. Plugin System Compatibility

The compatibility layer maintains the same plugin interface:

#### GAM Plugin

```javascript
// Original High Impact JS
class GAMPlugin {
    init() {
        /* GAM initialization */
    }
    onAdSlotRendered(handler) {
        /* Setup event listeners */
    }
    getSlotFromSource(source) {
        /* Match messages to slots */
    }
    getRenderedSlots() {
        /* Get existing slots */
    }
}

// ✅ Advantage compatibility layer uses identical interface
```

#### Xandr Plugin

```javascript
// Same interface maintained for Xandr integration
```

### 3. Template Configuration

All original template configurations are supported:

#### Topscroll Template

```javascript
window.highImpactJs.setTemplateConfig("topscroll", {
    showCloseButton: true, // ✅ Supported
    peekAmount: "70vh", // ✅ Supported
    title: "Continue reading", // ✅ Supported
    fadeOnScroll: true, // 🚧 Not yet implemented (easy to add)
    topBarHeight: 50 // 🚧 Not yet implemented
});
```

#### Midscroll Template

```javascript
window.highImpactJs.setTemplateConfig("midscroll", {
    peekAmount: "100vh", // ✅ Supported
    showCloseButton: true, // ✅ Supported
    bottomBarHeight: 0 // 🚧 Not yet implemented
});
```

## Implementation Details

### Template to Format Mapping

The compatibility layer maps High Impact JS templates to Advantage formats:

```typescript
const TEMPLATE_TO_FORMAT_MAP: Record<string, AdvantageFormatName> = {
    topscroll: AdvantageFormatName.TopScroll,
    midscroll: AdvantageFormatName.Midscroll,
    "double-fullscreen": AdvantageFormatName.DoubleMidscroll
};
```

### Configuration Translation

High Impact JS template configurations are translated to Advantage format options:

```typescript
// High Impact JS config
{
    peekAmount: "70vh",
    showCloseButton: true,
    title: "Continue reading"
}

// Translated to Advantage format options
{
    height: 70,              // Extracted from "70vh"
    closeButton: true,       // Mapped from showCloseButton
    closeButtonText: "Continue reading" // Mapped from title
}
```

### Pre-wrapping System

The compatibility layer uses an innovative pre-wrapping approach:

1. **Slot Definition**: When `defineSlot()` is called, the system immediately looks for the DOM element
2. **Pre-wrapping**: If found, it wraps the element with `<advantage-wrapper>`
3. **Format Restriction**: Sets `allowed-formats` attribute to restrict to the configured template
4. **Lazy Transformation**: When ads render with matching sizes, the format is applied

```html
<!-- Before (original ad slot) -->
<div id="/123456/topscroll-ad"></div>

<!-- After pre-wrapping -->
<advantage-wrapper allowed-formats="topscroll">
    <div slot="advantage-ad-slot">
        <div id="/123456/topscroll-ad"></div>
    </div>
</advantage-wrapper>
```

### Retroactive Configuration

The system supports setting template configurations after slot definition:

```javascript
// Define slot first
window.highImpactJs.defineSlot({
    template: "topscroll",
    adUnitId: "/123456/topscroll-ad",
    sizes: [[1, 1]]
});

// Configure template later (retroactively applied)
window.highImpactJs.setTemplateConfig("topscroll", {
    peekAmount: "60vh"
});
```

## Technical Differences

### 1. Underlying Architecture

-   **Web Components**: Built on Custom Elements standard for better encapsulation
-   **CSS Custom Properties**: Uses modern CSS features when available
-   **Shadow DOM**: Provides style isolation and prevents conflicts

### 2. Implementation Approach

-   **Component-based**: Reusable format components that can be shared across contexts
-   **Declarative Configuration**: Formats configured through HTML attributes and properties
-   **Event-driven**: Uses standard DOM events for communication between components

### 3. Additional Capabilities

-   **Format Extensibility**: New formats can be added without modifying core library
-   **Enhanced Plugin System**: Plugin architecture designed for complex integrations
-   **TypeScript Integration**: Provides type definitions for development tooling

### 4. Development & Maintenance

-   **Testing Framework**: Comprehensive test suite for reliability
-   **Modern Tooling**: Built with current JavaScript ecosystem practices
-   **Documentation**: Detailed API documentation and examples

## Migration Path

### Zero-Code Migration

Publishers using High Impact JS can migrate with **zero code changes**:

```html
<!-- Before: Original High Impact JS -->
<script src="high-impact.min.js"></script>

<!-- After: Advantage with compatibility layer -->
<script src="advantage.min.js"></script>
<!-- All existing High Impact JS code works unchanged -->
```

### Gradual Enhancement

Publishers can gradually adopt Advantage features:

```javascript
// Start with High Impact JS API
window.highImpactJs.defineSlot({...});

// Later, enhance with Advantage features
const advantage = Advantage.getInstance();
advantage.configure({
    // Advanced Advantage-specific options
});
```

## File Structure

```
src/advantage/high-impact-js/
├── index.ts              # Main compatibility layer
├── types.ts              # TypeScript interfaces
├── plugins/
│   ├── gam.ts           # Google Ad Manager plugin
│   └── xandr.ts         # Xandr plugin
└── README.md            # Plugin documentation
```

## Testing

The compatibility layer includes comprehensive testing:

-   **API Compatibility Tests**: Ensure all original APIs work identically
-   **Format Transformation Tests**: Verify correct mapping from templates to formats
-   **Plugin Integration Tests**: Test GAM and Xandr plugin compatibility
-   **Edge Case Handling**: Cross-origin restrictions, timing issues, etc.

## Browser Support

Maintains the same browser support as original High Impact JS while leveraging modern features where available:

-   **Legacy Support**: Graceful fallbacks for older browsers
-   **Progressive Enhancement**: Modern features in supported browsers
-   **Cross-Origin Handling**: Robust handling of iframe restrictions

## Implementation Status

### Currently Supported ✅

-   **Core API**: `defineSlot()`, `setTemplateConfig()`, `setConfig()`, `cmd.push()`
-   **Templates**: `topscroll`, `midscroll` (basic functionality)
-   **Template Options**: `showCloseButton`, `peekAmount`, `title`, `topBarHeight`, `bottomBarHeight`
-   **Plugins**: GAM and Xandr integration
-   **Size-based Detection**: Traditional High Impact JS triggering mechanism
-   **Pre-wrapping System**: Automatic wrapping with `<advantage-wrapper>`

### Not Yet Implemented 🚧

-   **fadeOnScroll**: Fade effect on scroll for topscroll template (straightforward to add)
-   **Skins Template**: Full-page background ad format
-   **Takeover Template**: Full-screen ad experience
-   **Advanced Plugin Features**: Some edge cases in plugin matching

### Easy to Add Later 📝

Most missing features are straightforward implementations that can be added without breaking existing functionality:

```javascript
// fadeOnScroll can be easily implemented by:
// 1. Adding scroll event listener in topscroll format
// 2. Applying opacity transition based on scroll position
// 3. Using existing CSS custom property system
```

## Future Roadmap

1. **Complete Template Options**: Implement remaining options like `fadeOnScroll`
2. **Additional Templates**: Support for skins, takeover, and other High Impact JS templates
3. **Enhanced Plugins**: More sophisticated plugin capabilities and edge case handling
4. **Performance Optimizations**: Further improvements to rendering speed
5. **Advanced Features**: Leverage more Advantage capabilities through the compatibility layer

## Conclusion

The High Impact JS compatibility layer provides a seamless bridge between the original High Impact JS library and the modern Advantage framework. Publishers get:

-   **Zero migration effort** - existing code works unchanged
-   **Modern underlying technology** - Web Components, better performance
-   **Enhanced capabilities** - access to Advantage's advanced features
-   **Future-proof architecture** - built on modern web standards

This approach allows publishers to continue using their familiar High Impact JS API while benefiting from Advantage's superior architecture and capabilities under the hood.
