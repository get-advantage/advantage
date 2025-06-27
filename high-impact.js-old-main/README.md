# High Impact JS

High Impact JS is an open-source JavaScript library that enables publishers to easily implement high-impact advertising formats on their websites. It provides a collection of responsive, customizable ad templates that integrate seamlessly with multiple ad servers including Google Ad Manager (GAM) and Xandr (formerly AppNexus).

## Features

- 🎯 Multiple premium ad templates (topscroll, midscroll, sitebar, skins, etc.)
- 🔄 Responsive design support out of the box
- 🚀 Asynchronous loading similar to Google Tag Manager
- 🔌 Easy integration with multiple ad servers (GAM, Xandr)
- 📱 Mobile-friendly and cross-browser compatible
- ⚙️ Highly customizable templates
- 🛠️ Simple API for implementation

## Install
  
```bash
npm install
```

## Development

```bash
npm run dev
```

## Building high-impact.min.js

```bash
npm run build
```

## Implementation Guide

### 1. Installation

Host both required files on your server:
- `dist/high-impact.min.js` - Main SDK

```html
<script src="/high-impact.min.js"></script>
```

### 2. Basic Implementation

a) Initialize the library asynchronously (recommended):
```javascript
// Place this code as high as possible in the <head>
window.highImpactJs = window.highImpactJs || { cmd: [] };

// Load the library
var script = document.createElement('script');
script.async = true;
script.src = '/high-impact.min.js';
document.head.appendChild(script);
```

b) Create your ad slots in HTML. (These are the same ad slots as you configure in the GPT/AST script):
```html
<div id="banner1"></div>
<div id="banner2"></div>
```

c) Configure your ad units:
```javascript
window.highImpactJs.cmd.push(() => {
  // Global configuration
  window.highImpactJs.setConfig({
    plugins: ['gam'], // or ['xandr'] for Xandr
    topBarHeight: 60,
    zIndex: 1000001
  });

  // For Google Ad Manager
  window.highImpactJs.defineSlot({
    template: 'topscroll',
    sizes: [[1920, 1080]],
    adUnitId: 'banner1',
  });

  // For Xandr
  window.highImpactJs.defineSlot({
    template: 'topscroll',
    sizes: [[980, 240]],
    targetId: 'banner-topscroll',
  });
});
```

### Prepare High Impact JS

In the same manner as the Google Publisher Tag, you can prepare the High Impact JS to be loaded asynchronously.

```javascript
window.highImpactJs = window.highImpactJs || { cmd: [] };
window.highImpactJs.cmd.push(() => {
  // Your config here.
});
```

### Create a High Impact Ad Unit

#### Google Ad Manager Implementation
```javascript
window.highImpactJs.defineSlot({
  template: 'midscroll', // Which template to use
  sizes: [[728, 90]], // What ad sizes it should work with
  adUnitId: 'banner2', // Id of the ad slot wrapper div
  waitForAdSignal: true, // Default is false
  testTagToBeInserted: '', // Optional, a tag to be inserted in the ad slot for testing purposes (only works with friendly frames)
});
```

#### Xandr Implementation
```javascript
window.highImpactJs.defineSlot({
  template: 'topscroll', // Which template to use
  sizes: [[980, 240]], // What ad sizes it should work with
  targetId: 'banner-topscroll', // Id of the ad slot wrapper div
  waitForAdSignal: true, // Default is false
  testTagToBeInserted: '', // Optional, a tag to be inserted in the ad slot for testing purposes
});
```


If `waitForAdSignal` is true, high-impact.js will wait with applying the template until the ad has posted
a message saying "I'm high-impact.js compatible". This could be useful if running other high impact
frameworks in parallel to make sure they don't interfere with each other.
The best way to avoid collision between high impact frameworks is to set a unique ad size for high-impact.js campaigns,
preferably 1920x1080 for desktop and 1080x1920 for mobile.

Note: The slot will only be converted to high impact if `slot`, `size` and `adUnitId` match the google tag slot.

### Global settings

```javascript
window.highImpactJs.setConfig({
  topBarHeight: 76, // Height in px for the topbar (optional)
  plugins: ['gam'], // Use 'gam' for Google Ad Manager or 'xandr' for Xandr
  ignoreSlotOn: (html) => { // One way to ignore high-impact.js templates, based on what's in the ad html (optional)
    if (html && html.includes('adnm-')) {
      return true;
    }
    return false;
  },
  zIndex: 1000001
});
```

### Configure template settings

To override default template settings, you can use the `setTemplateConfig()` method.
All available options is defined under the templates section.

```javascript
window.highImpactJs.setTemplateConfig('topscroll', {
  peekAmount: '70vh',
  title: 'Scroll down to Publisher.com',
  arrowUrl: 'https://publisher.com/arrow-down.svg',
});
```

## Available Templates

High Impact JS comes with several premium ad templates, each designed for specific use cases:

### 1. Topscroll
A premium format that appears at the top of the page and responds to scroll behavior.

Options:
- `peekAmount` - Height of the visible area (e.g., '70vh')
- `title` - Text for the scroll down message
- `arrowUrl` - Custom arrow icon URL
- `showCloseButton` - Show/hide close button (boolean)
- `fadeOnScroll` - Enable/disable fade effect on scroll (boolean)
- `topBarHeight` - Height of the top bar in pixels
- `zIndex` - Custom z-index for the ad unit

### 2. Midscroll
An engaging format that appears while users scroll through content.

Options:
- `peekAmount` - Height of the visible area (e.g., '70vh')
- `topBarHeight` - Height of the top bar in pixels
- `bottomBarHeight` - Height of the bottom bar in pixels
- `zIndex` - Custom z-index for the ad unit

### 3. Sitebar
A responsive side-aligned format that stays in view while scrolling.

Options:
- `nonSitebarHeight` - Height of non-sitebar content (default: '101px')
- `nonSitebarWidth` - Width of non-sitebar content (default: '1026px + 300px')

### 4. Skins
A template for site skinning and background takeovers.

Options:
- `contentWrapperSelector` - Selector for the main content wrapper
- `topAdHeight` - Height of the top ad section in pixels
- `scrollTo` - Configuration for scroll behavior:
  - `section` - Selector for target section, or
  - `height` - Scroll height in pixels
- `addPushdownElementToSideBanners` - Array of selectors for side banners that need pushdown elements
- `zIndex` - Custom z-index

### 5. Double Fullscreen
An immersive format that utilizes two full screen sections.

Options:
- `topBarHeight` - Height of the top bar in pixels
- Supports dynamic waypoints through postMessage API for advanced animations

### 6. Takeover
A full-page takeover format for maximum impact.

Options:
- `topBarHeight` - Height of the top bar in pixels
- `peekAmount` - Height of the visible area (e.g., '100vh')
- `topBarHtml` - Custom HTML for the top bar
- `zIndex` - Custom z-index

## Debugging

To enable debug mode, add `debugHighImpact=true` as a URL parameter. For example:
```
https://your-site.com/page?debugHighImpact=true
```

When debug mode is enabled, the library will:
- Log detailed information about ad slot rendering and template application
- Add debug attributes to HTML elements for easier inspection
- Show additional information about ad configurations and states

## Best Practices

1. **Ad Sizes**
   - For desktop: Use 1920x1080 for full-screen formats
   - For mobile: Use 1080x1920 for vertical formats
   - For standard units: Follow IAB standard sizes

2. **Performance**
   - Load the library asynchronously
   - Use `waitForAdSignal` when running multiple high-impact frameworks
   - Configure appropriate z-index values to avoid conflicts

3. **Integration**
   - Host files at domain root for best compatibility
   - Test thoroughly in all major browsers
   - Implement proper fallbacks for non-supported scenarios

## Troubleshooting

### Common Issues

1. **Ad Not Displaying**
   - Verify correct adUnitId matches GAM configuration
   - Check if size matches defined sizes array

2. **Responsive Issues**
   - Check for CSS conflicts with site styling
   - Ensure viewport meta tag is properly set

3. **Integration Problems**
   - Confirm ad server setup (GAM or Xandr) matches library configuration
   - Check browser console for error messages
   - Verify all required files are properly hosted
   - For Xandr: Ensure correct placement IDs and member ID are configured

## Support

- Report issues via GitHub Issues
- Check documentation for updates
- Join our community discussions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
