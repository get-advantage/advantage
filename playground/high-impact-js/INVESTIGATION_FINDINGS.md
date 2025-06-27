# Iframe Communication Timeout Investigation - FINDINGS

## Problem Summary

The creative iframe shows "❌ Session failed - no AdvantageWrapper found" after a 5-second timeout, despite the pre-wrapping solution being implemented and the AdvantageWrapper being present in the DOM.

## Root Cause Analysis

### Core Issue: Race Condition in Iframe Detection

The issue is NOT with the pre-wrapping or the iframe messaging architecture. The problem is a **timing race condition** in the `AdvantageAdSlotResponder.#listenForMessages` method.

### Technical Details

1. **Message Flow**:

    - Creative iframe sends START_SESSION message via `sendMessageAndOpenChannel()`
    - Message goes to `window.top` (correct)
    - `AdvantageAdSlotResponder` receives the message via `window.addEventListener("message", ...)`

2. **Iframe Detection Logic**:

    - `AdvantageAdSlotResponder` tries to find iframes using `wrapper.contentNodes.flatMap(node => collectIframes(node))`
    - `contentNodes` returns `this.#slotAdvantageContent.assignedNodes()` (from slot system)
    - **RACE CONDITION**: When iframe loads and immediately sends messages, the slot system may not have updated `assignedNodes()` yet

3. **Critical Code Path** (in `publisher-side.ts` line ~241):
    ```typescript
    const iframes = (this.#element as IAdvantageWrapper).contentNodes.flatMap(
        (node) => collectIframes(node)
    );
    if (iframes.length === 0) {
        return; // ❌ EXITS EARLY - MESSAGE IGNORED
    }
    ```

### Evidence

-   Enhanced debugging shows that wrapper can find iframe via DOM queries
-   But `contentNodes` returns empty array initially
-   Message source (`iframe.contentWindow`) matches the added iframe
-   The 5-second timeout (25 attempts × 200ms) confirms no response from `AdvantageAdSlotResponder`

## Solutions

### 1. Immediate Workaround (Demo)

Add delays to ensure slot system updates before iframe sends messages:

-   Parent: Wait 2000ms before loading iframe
-   Iframe: Wait 1500ms before starting session
-   Result: Works but not production-ready

### 2. Robust Fix (Library)

Modify `AdvantageAdSlotResponder.#listenForMessages` to be more resilient:

```typescript
// Instead of early return when no iframes found in contentNodes,
// add fallback detection using direct DOM queries
if (this.#isWrapper) {
    let iframes = (this.#element as IAdvantageWrapper).contentNodes.flatMap(
        (node) => collectIframes(node)
    );

    // FALLBACK: If slot system hasn't updated yet, try direct DOM search
    if (iframes.length === 0) {
        iframes = Array.from(this.#element.getElementsByTagName("iframe"));
    }

    if (iframes.length === 0) {
        return;
    }
    iframes.forEach(childAdFinder);
}
```

### 3. Alternative Approach (Demo)

Use iframe onload event to ensure iframe is fully loaded and slot system is updated before starting communication.

## Test Results

### Current Demo Status

-   ✅ Pre-wrapping works correctly
-   ✅ AdvantageWrapper created and configured
-   ✅ Iframe properly added to DOM
-   ✅ Message sent to correct target (window.top)
-   ❌ AdvantageAdSlotResponder cannot find iframe due to slot timing
-   ❌ 5-second timeout occurs

### Enhanced Debugging Reveals

-   Wrapper `contentNodes.length = 0` when message arrives
-   Direct DOM query finds iframe successfully
-   Message source matches iframe contentWindow
-   Iframe detection test shows timing dependency

## Recommendations

1. **For Production**: Implement robust iframe detection with fallback in `AdvantageAdSlotResponder`
2. **For Demo**: Use the timing-based workaround already implemented
3. **Future**: Consider iframe onload event-based initialization for more predictable timing

## Status

The core architecture is **CORRECT**. This is a timing optimization issue, not a fundamental design problem. The pre-wrapping + iframe messaging approach works once the race condition is resolved.
