---
pageClass: docs
---

<p class="text-sm text-slate-500"><code>Docs > Get started</code></p>

# Get Started with High Impact JS

<div class="tip custom-block" style="padding-top: 8px">
  ℹ️ This project is still in <code>BETA</code>. Big changes might happen in the near future
</div>

Welcome to the High Impact JS documentation! High Impact JS revolutionizes high-impact display advertising by providing a unified, secure, and standardized platform for both publishers and advertisers. Whether you're looking to implement high-impact formats on your website or create engaging advertisements, this documentation will guide you through every step.

## The Merge: Advantage + High Impact JS

High Impact JS is the result of merging two open-source projects — **Advantage** and the original **High Impact JS** — into a single library. Both projects set out to solve the same problem: making high-impact advertising on the web more standardized, more secure, and easier to implement. Having two libraries created fragmentation, so we combined the best of both into one:

| From Advantage                               | From High Impact JS                          |
| :------------------------------------------- | :------------------------------------------- |
| Web Component engine (`<advantage-wrapper>`) | Declarative Slot API (`defineSlot`)          |
| Secure MessageChannel messaging              | GAM & Xandr plugin integrations              |
| Format system (Topscroll, Midscroll, etc.)   | Template configuration system                |
| Shadow DOM isolation & UI Layer              | One-tag banner / post-message signal support |

### Why some things are still called "Advantage"

You'll notice that the HTML element is still `<advantage-wrapper>`, events are prefixed `advantage:`, and some TypeScript APIs use `Advantage` in their names (e.g., `AdvantageFormatName`, `AdvantageCreativeMessenger`).

This is intentional. For this first merged release we kept the internal naming from Advantage to ensure a **smooth, non-breaking transition**. Existing Advantage integrations continue to work without changes, and the High Impact JS Slot API is layered on top.

In a future **2.0 major release** with breaking changes, we plan to rename all elements, events, and APIs to use the `highImpactJs` / `high-impact-js` naming consistently. Until then, both naming conventions coexist and work correctly.

For the full story behind the merge, migration guides for both libraries, and the complete Slot API reference, see the **[Migration section](./migration/)**.

## Quick Start

### For Publishers & Website Owners

Ready to implement high-impact advertising formats on your site? Start with our comprehensive publisher guide.

👉 **[Publisher Tutorial](./tutorial/publisher)** - Learn how to integrate Advantage on your website

### For Creatives & Advertisers

Want to create compelling Advantage-compatible advertisements? Our creative tutorial has you covered.

👉 **[Creative Tutorial](./tutorial/creative)** - Build high-impact ads that work seamlessly across platforms

## What You'll Learn

### 🎯 **Core Concepts**

Understand the fundamental building blocks of Advantage:

- **[Formats](./concepts/formats.md)** - High-impact ad formats like Topscroll, Midscroll, and Welcome Page
- **[Wrapper](./concepts/wrapper.md)** - The secure container that manages ad display
- **[Messaging Protocol](./concepts/creative.md)** - How ads communicate with websites
- **[UI Layer](./concepts/ui-layer.md)** - Customization and theming options
- **[Integrations](./concepts/integration.md)** - How formats connect with your website

### 🛠 **Available Formats**

Explore the high-impact formats available in Advantage:

- **[Topscroll](./formats/topscroll.md)** - Premium branding format that appears at the top
- **[Midscroll](./formats/midscroll.md)** - Engaging mid-content format with parallax effects
- **[Welcome Page](./formats/welcome_page.md)** - Full-screen welcome experience
- **[Double Midscroll](./formats/double_midscroll.md)** - Extended midscroll format

### 💡 **Developer Tools**

Enhance your development workflow:

- **[MCP Server](./ai-tools.md)** - AI-powered development assistance with live documentation access
- **[Examples](./examples/hello-world.md)** - Ready-to-use code samples and implementations

## Key Features

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">

<div class="p-6 border border-gray-200 rounded-lg">
  <h3 class="text-lg font-semibold mb-3">📐 Unified Standards</h3>
  <p>Consistent implementation across all platforms and buying channels, simplifying the advertising ecosystem.</p>
</div>

<div class="p-6 border border-gray-200 rounded-lg">
  <h3 class="text-lg font-semibold mb-3">🔒 Secure By Default</h3>
  <p>Built-in security measures protect both publishers and users while maintaining ad effectiveness.</p>
</div>

<div class="p-6 border border-gray-200 rounded-lg">
  <h3 class="text-lg font-semibold mb-3">🛠 Flexible Customization</h3>
  <p>Adapt formats to match your brand and user experience while maintaining performance standards.</p>
</div>

<div class="p-6 border border-gray-200 rounded-lg">
  <h3 class="text-lg font-semibold mb-3">⚡️ Efficiency & Effectiveness</h3>
  <p>Optimized performance ensures fast loading times and maximum user engagement.</p>
</div>

</div>

## Common Use Cases

### Publishers

- **News & Media Sites** - Implement non-intrusive high-impact formats that maintain reading flow
- **E-commerce Platforms** - Showcase promotional content without disrupting the shopping experience
- **Content Publishers** - Monetize content with engaging, brand-safe advertising formats

### Advertisers & Agencies

- **Brand Awareness Campaigns** - Create memorable experiences with Topscroll and Welcome Page formats
- **Product Launches** - Use high-impact formats to generate buzz and drive engagement
- **Programmatic Buying** - Standardized implementation across multiple publisher sites

## Getting Help

### 📚 Documentation Structure

- **Tutorials** - Step-by-step guides for implementation
- **Concepts** - In-depth explanations of core functionality
- **Formats** - Detailed specifications for each ad format
- **Examples** - Working code samples and implementations
- **API Reference** - Complete technical documentation

### 🤝 Community & Support

- **[GitHub Issues](https://github.com/get-advantage/advantage/issues)** - Report bugs and request features
- **[Slack Community](https://join.slack.com/t/get-advantage/shared_invite/zt-2gy6c4z4m-4~pIuwRfe8eqPM5H7iV9MQ)** - Connect with other developers and get help
- **[Contributing Guide](../about/contributions.md)** - Learn how to contribute to the project

### 🔧 Development Resources

- **[API Documentation](../api/)** - Complete TypeScript API reference
- **[GitHub Repository](https://github.com/get-advantage/advantage)** - Source code and examples
- **[Changelog](./changelog.md)** - Track updates and new features

## Next Steps

<div class="flex flex-col sm:flex-row gap-4 my-8">
  <a href="./tutorial/publisher" class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
    Start as Publisher
    <svg class="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
    </svg>
  </a>
  
  <a href="./tutorial/creative" class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
    Start as Creative
    <svg class="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
    </svg>
  </a>
</div>

Ready to transform your advertising experience? Choose your path above and start building with Advantage today!
