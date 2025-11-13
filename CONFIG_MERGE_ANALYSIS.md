# Config Merge Analysis: Advantage + High Impact JS

## Executive Summary

**Recommendation: ✅ YES - Merge both configs into a unified object**

Merging the Advantage config and High Impact JS config into a single object passed to integration hooks makes sense for:

1. **Unified API experience** - Integration authors have access to all configuration in one place
2. **Future compatibility** - As the libraries merge, having a single config object is more natural
3. **No conflicts** - The two config objects have zero property overlap
4. **Developer convenience** - One parameter is easier than two separate config objects

## Current State

### AdvantageConfig Properties

```typescript
interface AdvantageConfig {
    configUrlResolver?: () => string; // Load config from remote URL
    formats?: AdvantageFormat[]; // Custom format definitions
    formatIntegrations?: AdvantageFormatIntegration[]; // Site-specific hooks
    messageValidator?: (parent, message) => boolean; // Security validation
    enableHighImpactCompatibility?: boolean; // Enable High Impact JS layer
}
```

**Key characteristics:**

-   Framework-level configuration
-   Controls Advantage library behavior
-   Defines formats and integrations
-   Set once at initialization via `advantage.configure()`

### High Impact JS GlobalConfig Properties

```typescript
interface GlobalConfig {
    plugins?: string[]; // ['gam', 'xandr']
    topBarHeight?: number; // Site header height in px
    bottomBarHeight?: number; // Site footer height in px
    zIndex?: number; // Custom z-index for ads
    ignoreSlotOn?: (html: string) => boolean; // Skip certain ads
    debug?: boolean; // Enable debug logging
}
```

**Key characteristics:**

-   Publisher-level configuration
-   Controls visual/behavioral aspects
-   Site-specific styling values
-   Set by publishers via `window.highImpactJs.setConfig()`

## Property Overlap Analysis

### No Conflicts Found ✅

There is **zero overlap** between the two config objects:

| AdvantageConfig               | GlobalConfig    | Conflict? |
| ----------------------------- | --------------- | --------- |
| configUrlResolver             | plugins         | ❌ No     |
| formats                       | topBarHeight    | ❌ No     |
| formatIntegrations            | bottomBarHeight | ❌ No     |
| messageValidator              | zIndex          | ❌ No     |
| enableHighImpactCompatibility | ignoreSlotOn    | ❌ No     |
| -                             | debug           | ❌ No     |

The properties serve completely different purposes:

-   **AdvantageConfig**: Framework initialization and format definitions
-   **GlobalConfig**: Publisher-specific styling and behavior tweaks

## Use Cases: Who Needs What?

### Integration Hooks Need

1. **High Impact JS config** ✅ (Currently passing this)
    - `topBarHeight` - Adjust layouts for sticky headers
    - `bottomBarHeight` - Adjust for sticky footers
    - `zIndex` - Respect publisher z-index hierarchy
    - `debug` - Conditional logging
2. **Advantage config** 🤔 (Not currently passing)
    - `formatIntegrations` - Access other format configs? (edge case)
    - `messageValidator` - Unlikely need
    - `formats` - Could inspect available formats (rare)
    - `enableHighImpactCompatibility` - Detect compatibility mode (possible)

### Real-World Scenarios

#### Scenario 1: Check if High Impact JS compatibility is enabled

```typescript
{
    format: AdvantageFormatName.TopScroll,
    setup: async (wrapper, ad, config) => {
        if (config?.enableHighImpactCompatibility) {
            console.log('Running in High Impact JS compatibility mode');
            // Apply legacy behavior
        }
    }
}
```

#### Scenario 2: Conditional behavior based on available formats

```typescript
{
    format: AdvantageFormatName.Midscroll,
    setup: async (wrapper, ad, config) => {
        // Check if WelcomePage format is available
        const hasWelcomePage = config?.formats?.some(
            f => f.name === AdvantageFormatName.WelcomePage
        );

        if (hasWelcomePage) {
            // Different behavior when WelcomePage is also configured
        }
    }
}
```

#### Scenario 3: Access custom messageValidator

```typescript
{
    format: AdvantageFormatName.TopScroll,
    setup: async (wrapper, ad, config) => {
        // Re-use the same security validation logic
        if (config?.messageValidator) {
            const isValid = config.messageValidator(wrapper, someMessage);
        }
    }
}
```

## Implementation Recommendation

### Option A: Merge into Unified Config Object (RECOMMENDED) ✅

Pass a merged object with both configs:

```typescript
// In wrapper.ts
const mergedConfig = {
    ...Advantage.getInstance().config, // AdvantageConfig
    ...highImpactConfig // GlobalConfig
};

await integration.setup(wrapper, ad, mergedConfig);
```

**Pros:**

-   ✅ Clean, single parameter API
-   ✅ No property conflicts
-   ✅ Future-proof for library merger
-   ✅ Easy for integration authors
-   ✅ All config accessible via one object

**Cons:**

-   ⚠️ Slightly less explicit about config sources
-   ⚠️ Could be confusing which properties come from where

**Mitigation:** Document clearly in types/comments

### Option B: Pass Separate Configs

```typescript
setup: (wrapper, ad, advantageConfig, highImpactConfig) => {};
```

**Pros:**

-   ✅ Explicit separation of concerns
-   ✅ Clear config sources

**Cons:**

-   ❌ Two parameters instead of one
-   ❌ More verbose API
-   ❌ Against the "merging libraries" philosophy
-   ❌ Future migration pain if we fully merge

### Option C: Nested Structure

```typescript
config = {
    advantage: { ...AdvantageConfig },
    highImpactJs: { ...GlobalConfig }
};
```

**Pros:**

-   ✅ Namespaced, clear origins
-   ✅ Explicit structure

**Cons:**

-   ❌ More verbose usage: `config.advantage.formats` vs `config.formats`
-   ❌ Inconsistent with "unified library" goal

## Recommended Implementation

### 1. Update TypeScript Interface

```typescript
// src/types/index.ts
export interface AdvantageFormatIntegration {
    format: AdvantageFormatName | string;
    options?: AdvantageFormatOptions;
    setup: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLIFrameElement | HTMLElement,
        config?: MergedIntegrationConfig // ← New type
    ) => Promise<void>;
    teardown?: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLIFrameElement | HTMLElement,
        config?: MergedIntegrationConfig
    ) => void;
    close?: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLIFrameElement | HTMLElement,
        config?: MergedIntegrationConfig
    ) => void;
    reset?: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLIFrameElement | HTMLElement,
        config?: MergedIntegrationConfig
    ) => void;
}

/**
 * Merged configuration passed to format integration hooks.
 * Combines Advantage framework config with High Impact JS global config.
 */
export interface MergedIntegrationConfig extends Partial<AdvantageConfig> {
    // High Impact JS GlobalConfig properties
    plugins?: string[];
    topBarHeight?: number;
    bottomBarHeight?: number;
    zIndex?: number;
    ignoreSlotOn?: (html: string) => boolean;
    debug?: boolean;
}
```

### 2. Update Wrapper Implementation

```typescript
// In wrapper.ts - morphIntoFormat, reset, close methods

// Get High Impact JS global config if compatibility is enabled
let highImpactConfig: any = undefined;
try {
    const highImpactModule = await import("./high-impact-js/index");
    highImpactConfig = highImpactModule.getConfig();
} catch (e) {
    // High Impact JS compatibility layer not available
}

// Merge both configs
const mergedConfig = {
    ...Advantage.getInstance().config,
    ...highImpactConfig
};

// Pass merged config to integration hooks
await integration?.setup(this, this.messageHandler.ad?.iframe, mergedConfig);
```

### 3. Update Documentation

Add to `HIGH_IMPACT_CONFIG_ACCESS.md`:

````markdown
## Merged Configuration

The config parameter passed to integration hooks contains **both**:

1. **Advantage Config** - Framework-level configuration

    - `formats` - Available format definitions
    - `formatIntegrations` - Other integration configurations
    - `messageValidator` - Security validation function
    - `enableHighImpactCompatibility` - Compatibility mode flag

2. **High Impact JS Config** - Publisher-level configuration
    - `topBarHeight` - Site header height
    - `bottomBarHeight` - Site footer height
    - `zIndex` - Custom z-index
    - `plugins` - Active plugins (e.g., 'gam', 'xandr')
    - `debug` - Debug mode
    - `ignoreSlotOn` - Ad filtering function

### Usage Example

```typescript
{
    format: AdvantageFormatName.TopScroll,
    setup: async (wrapper, ad, config) => {
        // Access High Impact JS config (common)
        const topBarHeight = config?.topBarHeight || 0;

        // Access Advantage config (less common, but useful)
        if (config?.enableHighImpactCompatibility) {
            console.log('Running in compatibility mode');
        }

        if (config?.debug) {
            console.log('Available formats:', config.formats);
        }
    }
}
```
````

```

## Benefits Summary

### For Integration Authors
- ✅ Access to all configuration in one place
- ✅ Simpler API (one parameter)
- ✅ Can detect compatibility mode
- ✅ Can inspect available formats
- ✅ Can access shared messageValidator

### For Library Maintenance
- ✅ Aligns with "merging libraries" goal
- ✅ No breaking changes (backward compatible)
- ✅ No property conflicts to manage
- ✅ Future-proof architecture

### For Publishers
- ✅ Consistent experience
- ✅ No API changes needed
- ✅ Better introspection capabilities

## Risks & Mitigation

### Risk 1: Property Name Collision (Future)
**Likelihood:** Low
**Impact:** Medium
**Mitigation:**
- Document both interfaces clearly
- Add tests to detect collisions
- Use TypeScript to enforce separation

### Risk 2: Confusion About Config Sources
**Likelihood:** Medium
**Impact:** Low
**Mitigation:**
- Clear documentation with examples
- TypeScript comments indicating source
- Comprehensive usage guide

### Risk 3: Performance (Config Object Size)
**Likelihood:** Low
**Impact:** Negligible
**Mitigation:**
- Config objects are small (~5-10 properties each)
- Shallow merge is fast
- Only created when integration hooks are called

## Decision Matrix

| Criteria | Option A (Merge) | Option B (Separate) | Option C (Nested) |
|----------|------------------|---------------------|-------------------|
| Developer Experience | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Clarity | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Future Compatibility | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| No Breaking Changes | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Aligns with Merger | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **TOTAL** | **23/25** | **16/25** | **18/25** |

## Conclusion

**Recommendation: Implement Option A - Merge both configs**

The merged config approach:
1. Has no property conflicts (verified above)
2. Provides better developer experience
3. Aligns with the library merger philosophy
4. Is backward compatible
5. Gives integration authors maximum flexibility

The main "con" (less explicit about sources) is easily addressed with good documentation and TypeScript types.

## Next Steps

1. ✅ Update `MergedIntegrationConfig` type interface
2. ✅ Modify wrapper.ts to merge configs before passing
3. ✅ Update documentation with merged config examples
4. ✅ Add JSDoc comments explaining config sources
5. ⏭️ Test with real integration code
6. ⏭️ Update migration guide if needed
```
