# High Impact JS Compatibility Playground

This directory contains interactive demos and examples showing how the High Impact JS compatibility layer works with Advantage, including the new **pre-wrapping** functionality that ensures immediate communication between Advantage creatives and the wrapper.

## 🎯 Problem Solved

Previously, when publishers used High Impact JS style APIs, ad units were only wrapped with `AdvantageWrapper` **after** a creative was rendered and met specific criteria (size, HTML content, etc.). This created a timing issue where Advantage creatives couldn't communicate immediately upon loading.

The **pre-wrapping solution** now wraps ad units with `AdvantageWrapper` immediately when `defineSlot()` is called, ensuring Advantage creatives can communicate from the moment they load.

## 📁 Demo Files

### 🧪 `simple-demo.html` - **Recommended Starting Point**

A clean, focused demonstration of the pre-wrapping functionality.

**Features:**

-   Before/after visualization of pre-wrapping
-   Step-by-step console logging
-   Interactive button to trigger the demo
-   Clear visual feedback

**URL:** `http://localhost:5174/playground/high-impact-js/simple-demo.html`

### 🔬 `test-page.html` - Technical Testing

A comprehensive test page for verifying pre-wrapping functionality.

**Features:**

-   Automated test execution
-   Detailed test results
-   Error handling and validation
-   Developer-focused output

**URL:** `http://localhost:5174/playground/high-impact-js/test-page.html`

### 🎬 `pre-wrapping-demo.html` - Multiple Scenarios

Demonstrates three different pre-wrapping scenarios:

1. Immediate pre-wrapping when DOM element exists
2. Deferred wrapping with retry mechanism
3. Handling already-wrapped elements

**URL:** `http://localhost:5174/playground/high-impact-js/pre-wrapping-demo.html`

### 🚀 `advantage-creative-demo.html` - Creative Side

**Status: ✅ WORKING**

Demonstrates the complete flow: publisher sets up High Impact JS compatibility (which pre-wraps the ad unit), then an Advantage creative communicates with the wrapper.

**Features:**

-   Full publisher-to-creative communication demo
-   Real-time status updates and logging
-   Interactive format request demonstration
-   Shows immediate session establishment due to pre-wrapping
-   Plugin timeout handling prevents hanging when ad servers aren't available

**Key Fix Applied:** Added 2-second timeouts to GAM and Xandr plugins to prevent initialization hanging when Google Ad Manager or Xandr libraries aren't loaded.

**Setup:** The demo now automatically initializes the High Impact JS compatibility layer:

```javascript
import { initializeHighImpactJs } from "../../src/advantage/high-impact-js/index";
await initializeHighImpactJs();
```

**Complete Features:**

-   Publisher-side setup with High Impact JS compatibility
-   Automatic pre-wrapping demonstration
-   Immediate session establishment
-   Format request demonstration
-   Communication logging
-   Complete end-to-end example
-   Manual test functionality for debugging

**URL:** `http://localhost:5174/playground/high-impact-js/advantage-creative-demo.html`

### 📚 `example.html` - Complete Integration

Full working example showing traditional High Impact JS code working with Advantage.

**Features:**

-   Real High Impact JS configuration
-   Multiple ad slots
-   Template configurations
-   Event handling

**URL:** `http://localhost:5174/playground/high-impact-js/example.html`

## 🚀 Getting Started

1. **Start the development server:**

    ```bash
    cd /path/to/advantage
    npm run dev
    ```

2. **Open any demo in your browser:**

    - Navigate to `http://localhost:5174/playground/high-impact-js/`
    - Choose a demo file from the list above

3. **For beginners, start with:**
   `simple-demo.html` - Provides the clearest demonstration of the core concept

## 🔍 What to Look For

### ✅ Success Indicators

-   **Green borders** around ad units indicate successful AdvantageWrapper creation
-   **Console messages** show the pre-wrapping process step-by-step
-   **Test results** confirm functionality is working as expected
-   **Immediate communication** in creative demos shows no timing issues

### 🛠 Key Features Demonstrated

1. **Pre-wrapping on defineSlot():**

    ```javascript
    // This now immediately wraps the ad unit
    window.highImpactJs.defineSlot({
        template: "topscroll",
        adUnitId: "my-ad-unit",
        sizes: [
            [728, 90],
            [970, 250]
        ]
    });
    ```

2. **Format restrictions:**

    ```html
    <!-- Wrapper gets allowed-formats attribute -->
    <advantage-wrapper allowed-formats="TOPSCROLL">
        <div slot="advantage-ad-slot">
            <div id="my-ad-unit"><!-- Ad loads here --></div>
        </div>
    </advantage-wrapper>
    ```

3. **Immediate creative communication:**
    ```javascript
    // Advantage creatives can now communicate immediately
    const messenger = new AdvantageCreativeMessenger();
    const session = await messenger.startSession(); // ✅ Works immediately!
    ```

## 🐛 Troubleshooting

### Common Issues

1. **"High Impact JS compatibility layer not found"**

    - **Solution:** Ensure you're properly initializing the compatibility layer:
        ```javascript
        import { initializeHighImpactJs } from "../../src/advantage/high-impact-js/index";
        await initializeHighImpactJs();
        ```
    - Wait longer for initialization (demos include retry logic)
    - Check console for import errors
    - Ensure development server is running

2. **"Session failed - no AdvantageWrapper found"**

    - **Root cause:** Pre-wrapping failed or High Impact JS not initialized
    - **Solution:** Check that `initializeHighImpactJs()` was called before `defineSlot()`
    - Verify the ad unit element exists in DOM when `defineSlot()` is called
    - Check that the `adUnitId` matches the actual element ID
    - Look for console error messages about pre-wrapping

3. **Pre-wrapping not working**

    - Verify the ad unit element exists in DOM when `defineSlot()` is called
    - Check that the `adUnitId` matches the actual element ID
    - Look for console error messages

4. **Import errors**
    - Ensure you're running the development server (`npm run dev`)
    - Check that the server is accessible at the correct port
    - All demos use relative imports (`../../src/advantage`) instead of aliases

### Debug Tips

1. **Open browser developer tools** to see console messages
2. **Check the Elements tab** to see wrapper creation in real-time
3. **Use the Network tab** to verify modules are loading correctly
4. **Enable Advantage debug logging:**
    ```javascript
    localStorage.setItem("advantage-debug", "true");
    ```

## 🧪 Running Tests

To verify the compatibility layer is working correctly:

```bash
# Run High Impact compatibility tests
npm test src/advantage/high-impact-js/index.test.ts

# Run all tests
npm test
```

## 📖 Technical Documentation

For detailed technical information about the pre-wrapping implementation, see:

-   [`docs/high-impact-js-pre-wrapping.md`](../../docs/high-impact-js-pre-wrapping.md)

## 🤝 Contributing

When modifying these demos:

1. **Test all scenarios** - Each demo serves a different purpose
2. **Update this README** if you add new files or change functionality
3. **Verify backward compatibility** - Ensure existing High Impact JS code still works
4. **Run the test suite** to ensure no regressions

## 📋 Demo Checklist

When creating new demos:

-   [ ] Include proper error handling
-   [ ] Add console logging for debugging
-   [ ] Provide visual feedback to users
-   [ ] Test with both immediate and deferred wrapping scenarios
-   [ ] Verify creative communication works correctly
-   [ ] Document any new features or edge cases
