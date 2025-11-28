# Message System Merge Analysis: Advantage + High Impact JS

## Executive Summary

**Goal**: Create a unified message system that allows ad creatives to work seamlessly across all websites using the merged Advantage/High Impact JS library, regardless of which message format they use.

**Recommendation**: ✅ **Implement a dual-listener system** that accepts both message formats and translates them into a common internal format.

**Key Principle**: 100% backward compatibility - creatives built for either system should work without modification on any site using the merged library.

---

## Current State: Two Message Systems

### 1. Advantage Message System

**Purpose**: Two-way communication with format negotiation

**Architecture**:

-   Uses MessageChannel API for dedicated two-way communication
-   Session-based with explicit handshake
-   Format decision made **by the ad creative**
-   Publisher responds with confirmation/rejection

**Message Flow**:

```
┌─────────────────┐                    ┌──────────────────┐
│  Ad Creative    │                    │  Publisher Site  │
│                 │                    │                  │
│  1. START_      │──MessageChannel──>│  2. CONFIRM_     │
│     SESSION     │<──with ports──────│     SESSION      │
│                 │                    │                  │
│  3. REQUEST_    │──over port──────>│  4. FORMAT_      │
│     FORMAT      │                    │     CONFIRMED/   │
│     (TOPSCROLL) │<──────────────────│     REJECTED     │
│                 │                    │                  │
│  5. Ad renders  │                    │  6. Format       │
│     in format   │                    │     applied      │
└─────────────────┘                    └──────────────────┘
```

**Message Structure**:

```javascript
// 1. Ad creative starts session
{
    type: "ADVANTAGE",
    action: "START_SESSION",
    sessionID: "abc123"
}

// 2. Publisher confirms
{
    type: "ADVANTAGE",
    action: "CONFIRM_SESSION",
    sessionID: "abc123"
}

// 3. Ad requests format
{
    type: "ADVANTAGE",
    action: "REQUEST_FORMAT",
    format: "TOPSCROLL",  // Ad decides the format
    sessionID: "abc123"
}

// 4. Publisher confirms/rejects
{
    type: "ADVANTAGE",
    action: "FORMAT_CONFIRMED", // or FORMAT_REJECTED
    sessionID: "abc123"
}
```

**Creative Code Example**:

```javascript
import { AdvantageCreativeMessenger } from "@get-advantage/advantage";

const messenger = new AdvantageCreativeMessenger();
const session = await messenger.startSession();

if (session) {
    const response = await messenger.sendMessage({
        action: "REQUEST_FORMAT",
        format: "TOPSCROLL" // Creative specifies format
    });

    if (response?.action === "FORMAT_CONFIRMED") {
        // Render the ad
        showTopscrollAd();
    }
}
```

**Key Characteristics**:

-   ✅ Two-way communication
-   ✅ Format negotiation (can be rejected)
-   ✅ Session-based security
-   ✅ Ad controls format choice
-   ✅ Publisher has veto power
-   ❌ Requires ad creative to import library
-   ❌ More complex for simple ads

---

### 2. High Impact JS Message System

**Purpose**: One-way notification that ad is ready

**Architecture**:

-   Simple postMessage to window.top
-   No response expected
-   Format decision made **by publisher configuration**
-   Ad just signals "I'm here"

**Message Flow**:

```
┌─────────────────┐                    ┌──────────────────┐
│  Ad Creative    │                    │  Publisher Site  │
│                 │                    │                  │
│  1. Ad loads    │                    │  2. Plugin       │
│     and renders │                    │     monitors     │
│                 │                    │     ad slots     │
│  3. Sends "I'm  │──postMessage────>│  4. Receives     │
│     rendered"   │   (one-way)       │     signal       │
│     signal      │                    │                  │
│                 │                    │  5. Looks up     │
│                 │                    │     slot config  │
│                 │                    │                  │
│                 │                    │  6. Applies      │
│                 │                    │     configured   │
│                 │                    │     template     │
└─────────────────┘                    └──────────────────┘
```

**Message Structure**:

```javascript
// Ad sends (as JSON string or object)
{
    sender: "high-impact-js",
    action: "AD_RENDERED",
    origins: ["https://example.com"],
    qemId: "some-id",
    iframeName: "google_ads_iframe_/123/ad_0"
}
```

**Creative Code Example**:

```javascript
// Very simple - no library import needed
window.top.postMessage(
    JSON.stringify({
        sender: "high-impact-js",
        action: "AD_RENDERED",
        origins: Array.from(location.ancestorOrigins || []),
        iframeName: window.frameElement?.name
    }),
    "*"
);
```

**Publisher Configuration**:

```javascript
// Publisher pre-configures which template to use
window.highImpactJs.defineSlot({
    template: "topscroll", // Publisher decides format
    adUnitId: "/123456/topscroll-ad",
    sizes: [[1, 1]]
});
```

**Key Characteristics**:

-   ✅ Simple for ad creatives (no library needed)
-   ✅ Works with any ad server
-   ✅ One-way fire-and-forget
-   ✅ Publisher controls format
-   ❌ No negotiation possible
-   ❌ No confirmation back to ad
-   ❌ Requires publisher pre-configuration

---

## Fundamental Differences

| Aspect                  | Advantage                | High Impact JS             |
| ----------------------- | ------------------------ | -------------------------- |
| **Who decides format?** | Ad creative              | Publisher                  |
| **Communication**       | Two-way (MessageChannel) | One-way (postMessage)      |
| **Format negotiation**  | Yes (can be rejected)    | No (pre-configured)        |
| **Creative complexity** | Higher (import library)  | Lower (simple postMessage) |
| **Publisher setup**     | Minimal (auto-detects)   | Required (defineSlot)      |
| **Session security**    | Yes (sessionID)          | No                         |
| **Confirmation**        | Yes (FORMAT_CONFIRMED)   | No                         |
| **Plugin dependency**   | No                       | Yes (GAM/Xandr)            |
| **Size-based trigger**  | Optional                 | Standard                   |

---

## Challenge: Merging Two Philosophies

### The Core Conflict

1. **Advantage**: "Ad, tell me what format you want to be"
2. **High Impact JS**: "Ad, tell me you're ready. I'll decide the format"

These are fundamentally different approaches to the same problem.

### Why This Matters for Ad Buyers

Ad buyers and creative producers need to know:

1. **"Will my creative work on all sites?"**

    - If they build for Advantage, will it work on High Impact JS sites?
    - If they build for High Impact JS, will it work on Advantage sites?

2. **"Which message should I send?"**

    - Do I need to support both formats?
    - Can I detect which system is running?

3. **"Who controls the format?"**
    - Can I trust the publisher configured it correctly?
    - Can I override if needed?

---

## Proposed Solution: Unified Message System

### Design Principles

1. **100% Backward Compatibility**: Both message formats work everywhere
2. **Automatic Translation**: System detects and translates between formats
3. **Hybrid Decision Model**: Support both creative-driven and publisher-driven formats
4. **Graceful Degradation**: If one method fails, fall back to the other
5. **No Breaking Changes**: Existing creatives continue working

### Architecture: Dual-Listener System

```
┌─────────────────────────────────────────────────────────────┐
│              Unified Message Listener Layer                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐    ┌──────────────────────────┐  │
│  │  Advantage Listener   │    │ High Impact JS Listener  │  │
│  │  (MessageChannel)     │    │ (postMessage)            │  │
│  └──────────┬────────────┘    └──────────┬───────────────┘  │
│             │                             │                  │
│             └────────────┬────────────────┘                  │
│                          │                                   │
│                          ▼                                   │
│              ┌─────────────────────┐                        │
│              │ Message Translator   │                        │
│              └──────────┬───────────┘                        │
│                         │                                    │
│                         ▼                                    │
│              ┌─────────────────────┐                        │
│              │  Format Resolver     │                        │
│              │  (Hybrid Logic)      │                        │
│              └──────────┬───────────┘                        │
│                         │                                    │
│                         ▼                                    │
│              ┌─────────────────────┐                        │
│              │ Format Application   │                        │
│              └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Strategy

#### 1. Dual Message Listeners

Both listeners operate simultaneously:

```typescript
class UnifiedMessageSystem {
    constructor() {
        // Listen for Advantage messages
        this.setupAdvantageListener();

        // Listen for High Impact JS messages
        this.setupHighImpactListener();
    }

    setupAdvantageListener() {
        window.addEventListener("message", (event) => {
            if (this.isAdvantageMessage(event)) {
                this.handleAdvantageMessage(event);
            }
        });
    }

    setupHighImpactListener() {
        window.addEventListener("message", (event) => {
            if (this.isHighImpactMessage(event)) {
                this.handleHighImpactMessage(event);
            }
        });
    }

    isAdvantageMessage(event): boolean {
        return (
            event.data?.type === "ADVANTAGE" &&
            event.data?.action === "START_SESSION"
        );
    }

    isHighImpactMessage(event): boolean {
        const data =
            typeof event.data === "string"
                ? JSON.parse(event.data)
                : event.data;
        return (
            data?.sender === "high-impact-js" && data?.action === "AD_RENDERED"
        );
    }
}
```

#### 2. Message Translation Layer

Translate High Impact JS messages into Advantage format internally:

```typescript
class MessageTranslator {
    translateHighImpactToAdvantage(highImpactMessage, slotConfig) {
        // Translate High Impact JS message to internal Advantage format
        return {
            type: "ADVANTAGE",
            action: "REQUEST_FORMAT",
            format: this.mapTemplateToFormat(slotConfig.template),
            sessionID: this.generateSessionId(),
            // Keep original data for context
            _originalMessage: highImpactMessage,
            _source: "high-impact-js"
        };
    }

    mapTemplateToFormat(template: string): string {
        const map = {
            topscroll: "TOPSCROLL",
            midscroll: "MIDSCROLL",
            "double-fullscreen": "DOUBLE_MIDSCROLL"
        };
        return map[template] || template.toUpperCase();
    }
}
```

#### 3. Hybrid Format Resolution

Support both creative-driven and publisher-driven format selection:

```typescript
class FormatResolver {
    resolveFormat(message, slot): string {
        // Priority order:
        // 1. Explicit format from Advantage creative (if present)
        // 2. Template from High Impact JS slot config (if present)
        // 3. Size-based detection (fallback)

        if (message._source === "advantage") {
            // Advantage creative explicitly requested format
            return message.format;
        }

        if (message._source === "high-impact-js") {
            // High Impact JS - use publisher's configured template
            const slotConfig = this.getSlotConfig(slot);
            if (slotConfig?.template) {
                return this.mapTemplateToFormat(slotConfig.template);
            }

            // Fallback to size-based detection
            return this.detectFormatFromSize(slot.size);
        }

        return null;
    }
}
```

#### 4. Unified Format Application

Single code path applies formats regardless of message source:

```typescript
async applyFormat(wrapper, format, ad, source) {
    try {
        // Apply the format using Advantage's morphIntoFormat
        await wrapper.morphIntoFormat(format);

        // Send confirmation back if Advantage creative
        if (source === "advantage") {
            this.sendFormatConfirmation(ad.port, format);
        }

        // Dispatch event for High Impact JS compatibility
        window.dispatchEvent(new CustomEvent('high-impact-ad-rendered', {
            detail: { format, source }
        }));

    } catch (error) {
        // Send rejection if Advantage creative
        if (source === "advantage") {
            this.sendFormatRejection(ad.port, format);
        }
    }
}
```

---

## Compatibility Matrix

### For Ad Creatives

| Creative Type      | Sites with Advantage | Sites with High Impact JS | Sites with Merged Library |
| ------------------ | -------------------- | ------------------------- | ------------------------- |
| **Advantage**      | ✅ Works             | ❌ No support             | ✅ Works                  |
| **High Impact JS** | ❌ No support        | ✅ Works                  | ✅ Works                  |
| **Hybrid (both)**  | ✅ Works             | ✅ Works                  | ✅ Works (best choice)    |

### For Publishers

| Publisher Setup         | Advantage Creatives | High Impact JS Creatives | Hybrid Creatives          |
| ----------------------- | ------------------- | ------------------------ | ------------------------- |
| **Advantage only**      | ✅ Works            | ❌ No support            | ✅ Works (Advantage path) |
| **High Impact JS only** | ❌ No support       | ✅ Works                 | ✅ Works (HIJS path)      |
| **Merged library**      | ✅ Works            | ✅ Works                 | ✅ Works (optimal)        |

---

## Detailed Implementation Plan

### Phase 1: Detection & Routing (Week 1)

#### Task 1.1: Enhance Message Detection

```typescript
// src/advantage/messaging/message-detector.ts
export class MessageDetector {
    detectMessageType(
        event: MessageEvent
    ): "advantage" | "high-impact-js" | "unknown" {
        // Check for Advantage format
        if (event.data?.type === "ADVANTAGE") {
            return "advantage";
        }

        // Check for High Impact JS format (JSON string)
        if (typeof event.data === "string") {
            try {
                const parsed = JSON.parse(event.data);
                if (
                    parsed.sender === "high-impact-js" &&
                    parsed.action === "AD_RENDERED"
                ) {
                    return "high-impact-js";
                }
            } catch (e) {}
        }

        // Check for High Impact JS format (object)
        if (
            event.data?.sender === "high-impact-js" &&
            event.data?.action === "AD_RENDERED"
        ) {
            return "high-impact-js";
        }

        return "unknown";
    }
}
```

#### Task 1.2: Create Unified Message Handler

```typescript
// src/advantage/messaging/unified-handler.ts
export class UnifiedMessageHandler {
    private advantageHandler: AdvantageAdSlotResponder;
    private highImpactHandler: HighImpactMessageHandler;
    private detector: MessageDetector;

    constructor(wrapper: IAdvantageWrapper) {
        this.detector = new MessageDetector();
        this.advantageHandler = new AdvantageAdSlotResponder({
            adSlotElement: wrapper
        });
        this.highImpactHandler = new HighImpactMessageHandler(wrapper);

        this.setupListener();
    }

    private setupListener() {
        window.addEventListener("message", (event) => {
            const type = this.detector.detectMessageType(event);

            if (type === "advantage") {
                this.advantageHandler.handle(event);
            } else if (type === "high-impact-js") {
                this.highImpactHandler.handle(event);
            }
        });
    }
}
```

### Phase 2: Translation Layer (Week 1-2)

#### Task 2.1: High Impact JS to Advantage Translator

```typescript
// src/advantage/messaging/translator.ts
export class MessageTranslator {
    translateHighImpactToInternal(
        highImpactMessage: any,
        slotConfig: SlotConfig,
        source: Window
    ): InternalMessage {
        return {
            source: source,
            messageType: "high-impact-js",
            format: this.resolveFormat(slotConfig),
            config: slotConfig,
            originalMessage: highImpactMessage,
            requiresConfirmation: false // High Impact JS doesn't expect confirmation
        };
    }

    translateAdvantageToInternal(
        advantageMessage: AdvantageMessage,
        port: MessagePort
    ): InternalMessage {
        return {
            source: port,
            messageType: "advantage",
            format: advantageMessage.format!,
            sessionID: advantageMessage.sessionID,
            originalMessage: advantageMessage,
            requiresConfirmation: true // Advantage expects confirmation
        };
    }

    private resolveFormat(slotConfig: SlotConfig): string {
        // Template mapping
        const templateMap = {
            topscroll: AdvantageFormatName.TopScroll,
            midscroll: AdvantageFormatName.Midscroll,
            "double-fullscreen": AdvantageFormatName.DoubleMidscroll
        };

        return templateMap[slotConfig.template] || slotConfig.template;
    }
}
```

### Phase 3: Hybrid Format Resolution (Week 2)

#### Task 3.1: Smart Format Resolver

```typescript
// src/advantage/messaging/format-resolver.ts
export class FormatResolver {
    resolveFormat(
        message: InternalMessage,
        wrapper: IAdvantageWrapper
    ): string | null {
        // Priority 1: Explicit format from creative
        if (message.messageType === "advantage" && message.format) {
            logger.debug(
                `Format resolved from Advantage creative: ${message.format}`
            );
            return message.format;
        }

        // Priority 2: Publisher-configured template
        if (
            message.messageType === "high-impact-js" &&
            message.config?.template
        ) {
            const format = this.mapTemplateToFormat(message.config.template);
            logger.debug(
                `Format resolved from High Impact JS config: ${format}`
            );
            return format;
        }

        // Priority 3: Size-based detection (fallback)
        if (message.originalMessage.size) {
            const format = this.detectFormatFromSize(
                message.originalMessage.size
            );
            logger.debug(`Format resolved from size detection: ${format}`);
            return format;
        }

        // Priority 4: Check allowed formats on wrapper
        if (wrapper.allowedFormats && wrapper.allowedFormats.length > 0) {
            const format = wrapper.allowedFormats[0];
            logger.debug(`Format resolved from allowed formats: ${format}`);
            return format;
        }

        logger.warn("Could not resolve format");
        return null;
    }
}
```

### Phase 4: Configuration Merging (Week 2-3)

#### Task 4.1: Merge Template Config with Format Options

```typescript
// src/advantage/messaging/config-merger.ts
export class ConfigMerger {
    mergeConfigs(
        slotConfig: SlotConfig,
        templateConfig: TemplateConfig,
        advantageMessage?: AdvantageMessage
    ): AdvantageFormatOptions {
        // Start with template config
        const merged: AdvantageFormatOptions = {
            closeButton: templateConfig.showCloseButton,
            closeButtonText: templateConfig.title,
            height: this.extractHeight(templateConfig.peekAmount)
        };

        // Layer slot-specific config
        if (slotConfig.topBarHeight) {
            // Store in a way formatIntegrations can access
            merged._highImpactJs = {
                topBarHeight: slotConfig.topBarHeight,
                bottomBarHeight: slotConfig.bottomBarHeight,
                zIndex: slotConfig.zIndex
            };
        }

        // Layer message config (from Advantage creative)
        if (advantageMessage) {
            Object.assign(merged, {
                sessionID: advantageMessage.sessionID,
                allowedOrigins: advantageMessage.origins,
                ...advantageMessage // Include any custom properties
            });
        }

        return merged;
    }
}
```

### Phase 5: Unified Creative API (Week 3)

#### Task 5.1: Hybrid Creative Helper

```typescript
// src/advantage/messaging/hybrid-creative.ts
export class HybridCreativeMessenger {
    private advantageMessenger?: AdvantageCreativeMessenger;
    private mode: "advantage" | "high-impact-js" | "auto";

    constructor(
        options: { mode?: "advantage" | "high-impact-js" | "auto" } = {}
    ) {
        this.mode = options.mode || "auto";
    }

    async initialize(): Promise<boolean> {
        if (this.mode === "auto") {
            // Try Advantage first
            if (await this.tryAdvantageMode()) {
                this.mode = "advantage";
                return true;
            }

            // Fall back to High Impact JS
            this.sendHighImpactMessage();
            this.mode = "high-impact-js";
            return true;
        } else if (this.mode === "advantage") {
            return this.tryAdvantageMode();
        } else {
            this.sendHighImpactMessage();
            return true;
        }
    }

    private async tryAdvantageMode(): Promise<boolean> {
        try {
            this.advantageMessenger = new AdvantageCreativeMessenger();
            const session = await this.advantageMessenger.startSession();
            return session;
        } catch (e) {
            return false;
        }
    }

    private sendHighImpactMessage() {
        window.top?.postMessage(
            JSON.stringify({
                sender: "high-impact-js",
                action: "AD_RENDERED",
                origins: this.getOrigins(),
                iframeName: this.getIframeName()
            }),
            "*"
        );
    }

    async requestFormat(format: string): Promise<boolean> {
        if (this.mode === "advantage" && this.advantageMessenger) {
            const response = await this.advantageMessenger.sendMessage({
                action: "REQUEST_FORMAT",
                format: format
            });
            return response?.action === "FORMAT_CONFIRMED";
        }

        // High Impact JS mode - format is determined by publisher
        // Just return true since message was already sent
        return true;
    }
}
```

#### Task 5.2: Export Unified API

```typescript
// src/advantage/index.ts
export {
    HybridCreativeMessenger,
    AdvantageCreativeMessenger // Keep for backward compatibility
} from "./messaging";
```

---

## Creative Migration Paths

### Path 1: Pure Advantage Creative (No Changes Needed)

```javascript
// Existing Advantage creatives work as-is
import { AdvantageCreativeMessenger } from "@get-advantage/advantage";

const messenger = new AdvantageCreativeMessenger();
const session = await messenger.startSession();
if (session) {
    await messenger.sendMessage({
        action: "REQUEST_FORMAT",
        format: "TOPSCROLL"
    });
}
```

### Path 2: Pure High Impact JS Creative (No Changes Needed)

```javascript
// Existing High Impact JS creatives work as-is
window.top?.postMessage(
    JSON.stringify({
        sender: "high-impact-js",
        action: "AD_RENDERED"
    }),
    "*"
);
```

### Path 3: Hybrid Creative (Best Practice)

```javascript
// New recommended approach for maximum compatibility
import { HybridCreativeMessenger } from "@get-advantage/advantage";

const messenger = new HybridCreativeMessenger({ mode: "auto" });
await messenger.initialize(); // Auto-detects which system

// Works on both Advantage and High Impact JS sites
await messenger.requestFormat("TOPSCROLL");
```

### Path 4: Defensive Creative (Maximum Safety)

```javascript
// Send both messages for 100% compatibility
async function initAd() {
    let success = false;

    // Try Advantage first
    try {
        const { AdvantageCreativeMessenger } = await import(
            "@get-advantage/advantage"
        );
        const messenger = new AdvantageCreativeMessenger();
        if (await messenger.startSession()) {
            await messenger.sendMessage({
                action: "REQUEST_FORMAT",
                format: "TOPSCROLL"
            });
            success = true;
        }
    } catch (e) {}

    // Fall back to High Impact JS
    if (!success) {
        window.top?.postMessage(
            JSON.stringify({
                sender: "high-impact-js",
                action: "AD_RENDERED"
            }),
            "*"
        );
    }
}
```

---

## Publisher Migration Path

### Step 1: Install Merged Library

```html
<!-- Replace either library with merged version -->
<script src="https://cdn.jsdelivr.net/npm/@get-advantage/advantage@latest/dist/advantage.min.js"></script>
```

### Step 2: Minimal Configuration (Auto-mode)

```javascript
// Works with both message types automatically
const advantage = Advantage.getInstance();
advantage.configure({
    enableHighImpactCompatibility: true // Enable dual listeners
});
```

### Step 3: Optional: Explicit Configuration

```javascript
// Define slots for High Impact JS creatives
window.highImpactJs.defineSlot({
    template: "topscroll",
    adUnitId: "/123456/topscroll",
    sizes: [[1, 1]]
});

// Configure format integrations for Advantage creatives
advantage.configure({
    formatIntegrations: [
        {
            format: AdvantageFormatName.TopScroll,
            setup: async (wrapper, ad, config) => {
                // Works for both message types
                console.log("Format applied from:", config._messageSource);
            }
        }
    ]
});
```

---

## Testing Strategy

### Test Matrix

| Creative Type  | Publisher Setup     | Expected Result                    |
| -------------- | ------------------- | ---------------------------------- |
| Advantage      | Advantage only      | ✅ Format applies                  |
| Advantage      | High Impact JS only | ✅ Format applies (via translator) |
| Advantage      | Merged (both)       | ✅ Format applies (Advantage path) |
| High Impact JS | Advantage only      | ✅ Format applies (via translator) |
| High Impact JS | High Impact JS only | ✅ Format applies                  |
| High Impact JS | Merged (both)       | ✅ Format applies (HIJS path)      |
| Hybrid         | Any                 | ✅ Format applies (best path)      |

### Test Cases

#### Test 1: Advantage Creative on HIJS Site

```typescript
describe("Advantage creative on High Impact JS site", () => {
    it("should translate and apply format", async () => {
        // Setup: Site with High Impact JS config
        window.highImpactJs.defineSlot({
            template: "topscroll",
            adUnitId: "/123/ad",
            sizes: [[1, 1]]
        });

        // Action: Advantage creative sends message
        const messenger = new AdvantageCreativeMessenger();
        await messenger.startSession();
        const response = await messenger.sendMessage({
            action: "REQUEST_FORMAT",
            format: "TOPSCROLL"
        });

        // Assert: Format is applied
        expect(response.action).toBe("FORMAT_CONFIRMED");
        expect(wrapper.currentFormat).toBe("TOPSCROLL");
    });
});
```

#### Test 2: High Impact JS Creative on Advantage Site

```typescript
describe("High Impact JS creative on Advantage site", () => {
    it("should translate and apply format", async () => {
        // Setup: Site with Advantage wrapper
        const wrapper = document.createElement("advantage-wrapper");

        // Action: HIJS creative sends message
        window.postMessage(
            JSON.stringify({
                sender: "high-impact-js",
                action: "AD_RENDERED"
            }),
            "*"
        );

        // Wait for processing
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Assert: Format is applied based on slot config
        expect(wrapper.currentFormat).toBeTruthy();
    });
});
```

#### Test 3: Hybrid Creative

```typescript
describe("Hybrid creative", () => {
    it("should work on both site types", async () => {
        const messenger = new HybridCreativeMessenger({ mode: "auto" });
        const initialized = await messenger.initialize();

        expect(initialized).toBe(true);

        const success = await messenger.requestFormat("TOPSCROLL");
        expect(success).toBe(true);
    });
});
```

---

## Benefits Summary

### For Ad Buyers

✅ **100% Compatibility** - Build once, works everywhere  
✅ **Format Control** - Choose Advantage for control or HIJS for simplicity  
✅ **No Detection Needed** - System auto-detects message type  
✅ **Gradual Migration** - Can update creatives at own pace

### For Publishers

✅ **No Breaking Changes** - Existing setups continue working  
✅ **Automatic Translation** - No manual bridging needed  
✅ **Configuration Flexibility** - Use either or both APIs  
✅ **Future-Proof** - Single library for all creatives

### For Developers

✅ **Clean Architecture** - Clear separation of concerns  
✅ **Maintainability** - Single codebase, dual interfaces  
✅ **Extensibility** - Easy to add new message formats  
✅ **Type Safety** - Full TypeScript support

---

## Risks & Mitigation

### Risk 1: Message Collision

**Risk**: Both messages sent by confused creative  
**Likelihood**: Low  
**Impact**: Medium (duplicate format applications)  
**Mitigation**:

-   Detect duplicate messages from same source
-   Apply format only once per ad
-   Add debouncing logic

### Risk 2: Configuration Conflicts

**Risk**: Template config conflicts with format request  
**Likelihood**: Medium  
**Impact**: Low (wrong format applied)  
**Mitigation**:

-   Clear priority order (creative > config > size)
-   Logging for debugging
-   Publisher override options

### Risk 3: Performance Impact

**Risk**: Dual listeners slow down page  
**Likelihood**: Low  
**Impact**: Low  
**Mitigation**:

-   Efficient event filtering
-   Single unified handler internally
-   Lazy initialization of unused paths

### Risk 4: Security Concerns

**Risk**: Accepting more message types = more attack surface  
**Likelihood**: Low  
**Impact**: Medium  
**Mitigation**:

-   Maintain origin validation
-   Session-based security for Advantage
-   Publisher messageValidator still works

---

## Recommendation

**✅ Implement the Unified Message System with Dual Listeners**

This approach provides:

1. **100% backward compatibility** for existing creatives
2. **Zero migration burden** for publishers
3. **Maximum flexibility** for ad buyers
4. **Clean architecture** for maintainability
5. **Future-proof** design for evolution

The implementation can be phased over 3 weeks with minimal risk and immediate benefits.

---

## Next Steps

1. **Week 1**: Implement detection and routing layer
2. **Week 2**: Build translation and resolution logic
3. **Week 3**: Create hybrid creative API and documentation
4. **Week 4**: Comprehensive testing and rollout

**Decision Point**: Should we proceed with this unified approach?
