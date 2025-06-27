# High Impact JS Compatibility: Pre-wrapping Solution

## Problem Statement

When publishers implement Advantage using the High Impact JS style API, ad units are not wrapped with `AdvantageWrapper` until a creative is rendered that matches specific criteria (size, HTML content, etc.). However, Advantage creatives expect to communicate with an already-present `AdvantageWrapper` via postMessage from the moment they load.

### The Issue

```
Traditional Flow (Problematic):
1. Publisher calls highImpactJs.defineSlot()
2. Creative loads and tries to communicate with AdvantageWrapper
3. ❌ No AdvantageWrapper exists yet
4. Communication fails
5. Later, when High Impact logic detects matching criteria, it wraps the ad unit
6. Too late - the creative has already given up
```

### The Solution

```
New Flow (Fixed):
1. Publisher calls highImpactJs.defineSlot()
2. ✅ Ad unit is immediately pre-wrapped with AdvantageWrapper
3. Creative loads and successfully communicates with existing AdvantageWrapper
4. Format is applied immediately
5. Ad works perfectly
```

## Implementation Details

### Pre-wrapping Logic

The solution modifies the `defineSlot` method to:

1. **Immediate Wrapping**: Try to find and wrap the ad unit element immediately
2. **Deferred Wrapping**: If the element doesn't exist yet, set up observers and retries
3. **Smart Detection**: Avoid duplicate wrapping if element is already wrapped
4. **Format Restriction**: Set `allowed-formats` attribute to restrict to the configured template

### Key Functions

#### `preWrapAdUnit(slotConfig)`

-   Orchestrates the pre-wrapping process
-   Handles both immediate and deferred wrapping scenarios

#### `attemptPreWrap(slotConfig)`

-   Attempts to wrap an ad unit immediately
-   Returns `true` if successful, `false` if element not found

#### `setupDeferredWrapping(slotConfig)`

-   Sets up MutationObserver to watch for DOM changes
-   Implements retry mechanism with exponential backoff
-   Cleans up observers after max retries

#### `findAdUnitElement(adUnitId)`

-   Uses multiple selector strategies to find ad unit elements
-   Supports various naming conventions used by GAM, Xandr, etc.

### Element Discovery Strategies

The solution tries multiple common patterns for finding ad units:

```javascript
const selectors = [
    `#${adUnitId}`, // Direct ID match
    `[data-ad-unit="${adUnitId}"]`, // Data attribute
    `[data-ad-unit-id="${adUnitId}"]`, // Alternative data attribute
    `[data-google-ad-unit="${adUnitId}"]`, // GAM specific
    `[data-adunit="${adUnitId}"]`, // Shortened version
    `div[id*="${adUnitId}"]` // Partial ID match
];
```

## Benefits

### 1. Immediate Communication

-   Advantage creatives can communicate from the moment they load
-   No waiting for size/content detection
-   Eliminates race conditions

### 2. Broader Compatibility

-   Works with any Advantage creative, regardless of size
-   No dependency on HTML content patterns
-   Compatible with dynamic ad serving

### 3. Backward Compatibility

-   Fallback to traditional wrapping if pre-wrapping fails
-   No breaking changes to existing implementations
-   Graceful degradation

### 4. Performance

-   Eliminates need for polling or complex detection logic
-   Reduces DOM manipulation overhead
-   Faster ad format application

## Usage Examples

### Basic Usage

```javascript
// Initialize High Impact JS compatibility
window.highImpactJs = window.highImpactJs || { cmd: [] };

// Define slots - they will be pre-wrapped automatically
window.highImpactJs.cmd.push(() => {
    window.highImpactJs.defineSlot({
        template: "topscroll",
        adUnitId: "banner-ad-slot",
        sizes: [
            [728, 90],
            [970, 250]
        ]
    });

    window.highImpactJs.defineSlot({
        template: "midscroll",
        adUnitId: "content-ad-slot",
        sizes: [[300, 250]]
    });
});
```

### With Advantage Configuration

```javascript
import { Advantage } from "@get-advantage/advantage";

const advantage = Advantage.getInstance();
advantage.configure({
    enableHighImpactCompatibility: true,
    formatIntegrations: [
        {
            format: "TOPSCROLL",
            setup: () => {
                // Your site-specific setup
                return Promise.resolve();
            }
        },
        {
            format: "MIDSCROLL",
            setup: () => {
                // Your site-specific setup
                return Promise.resolve();
            }
        }
    ]
});
```

### HTML Structure

```html
<!-- Before defineSlot() -->
<div id="banner-ad-slot">
    <!-- GAM/Xandr ad will load here -->
</div>

<!-- After defineSlot() - automatically becomes: -->
<advantage-wrapper allowed-formats="TOPSCROLL">
    <div slot="advantage-ad-slot">
        <div id="banner-ad-slot">
            <!-- GAM/Xandr ad will load here -->
        </div>
    </div>
</advantage-wrapper>
```

## Testing

The solution includes comprehensive tests covering:

-   **Pre-wrapping when DOM element exists**: Verifies immediate wrapping
-   **Deferred wrapping when element doesn't exist**: Tests retry mechanism
-   **Duplicate prevention**: Ensures no double-wrapping occurs
-   **Format restriction**: Confirms correct `allowed-formats` attribute
-   **Backward compatibility**: Validates fallback behavior

### Running Tests

```bash
npm test -- --testPathPattern="high-impact-js"
```

## Migration Guide

### For Existing Implementations

No code changes required! The solution is backward compatible:

1. **Existing `defineSlot` calls**: Will now pre-wrap automatically
2. **Existing creative logic**: Continues to work unchanged
3. **Fallback behavior**: Still available if pre-wrapping fails

### For New Implementations

```javascript
// Old approach (still works)
window.highImpactJs.defineSlot({
    template: "topscroll",
    adUnitId: "my-ad-unit",
    sizes: [[728, 90]],
    waitForAdSignal: true // No longer necessary!
});

// New approach (recommended)
window.highImpactJs.defineSlot({
    template: "topscroll",
    adUnitId: "my-ad-unit",
    sizes: [[728, 90]]
    // Pre-wrapping handles communication timing automatically
});
```

## Troubleshooting

### Common Issues

1. **Element not found**: Check that `adUnitId` matches the actual DOM element ID
2. **Multiple wrappers**: Ensure each `adUnitId` is unique
3. **Format restrictions**: Verify the template maps to a valid Advantage format

### Debug Logging

Enable debug logging to troubleshoot:

```javascript
// Enable in browser console
localStorage.setItem("advantage-debug", "true");
```

Look for log messages like:

-   `[High Impact Compatibility] Pre-wrapped ad unit X with AdvantageWrapper`
-   `[High Impact Compatibility] Ad unit element not found yet for X`
-   `[High Impact Compatibility] Using pre-wrapped element for X`

## Technical Notes

### Browser Support

-   Modern browsers with `MutationObserver` support
-   Graceful fallback for older browsers
-   No external dependencies

### Performance Considerations

-   MutationObserver automatically disconnects after max retries
-   Retry intervals use exponential backoff
-   Minimal DOM queries with cached results

### Security

-   No eval() or unsafe DOM manipulation
-   Respects existing CSP policies
-   Safe element discovery methods

## Conclusion

The pre-wrapping solution eliminates the fundamental incompatibility between High Impact JS style APIs and Advantage creative messaging. It provides immediate, reliable communication while maintaining full backward compatibility and offering significant performance benefits.

This change enables publishers to seamlessly transition from High Impact JS to Advantage without any modifications to their creative assets or serving infrastructure.
