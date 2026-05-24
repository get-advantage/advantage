---
pageClass: docs
---

<style>
.path-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: 2.5rem 0;
}
@media (min-width: 768px) {
  .path-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.path-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: border-color 0.2s;
  background: var(--vp-c-bg-soft);
}
.dark .path-card {
  border-color: #3f3f46;
}
.path-card:hover {
  border-color: #6b04fd;
}
.icon-box {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: white;
  background-color: #6b04fd;
  transition: background-color 0.2s;
  text-decoration: none !important;
}
.btn-primary:hover {
  background-color: #5b03d6;
}
</style>

<p class="text-sm text-slate-500"><code>Docs > Get started</code></p>

# Welcome to Advantage

<div class="tip custom-block" style="padding-top: 8px">
  ℹ️ Advantage is still in <code>BETA</code>. Big changes might happen in the near future.
</div>

Advantage is a unified, secure, and standardized platform for high-impact display advertising.
**Choose the path that best fits your role to get started.**

<div class="path-grid">

  <!-- Publisher AdOps Path -->
  <div class="path-card">
    <div class="icon-box" style="background-color: #f3e8ff;">
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width: 1.5rem; height: 1.5rem; color: #9333ea;" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
    </div>
    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; margin-top: 0;">Publisher (AdOps)</h3>
    <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem; flex-grow: 1;">
      The fastest way to get Advantage running on your site. No complex build tools required.
    </p>
    <a href="./tutorial/publisher#quick-start-cdn" class="btn-primary" style="background-color: #9333ea;">
      Quick Start Guide
    </a>
  </div>

  <!-- Publisher Developer Path -->
  <div class="path-card">
    <div class="icon-box" style="background-color: #dbeafe;">
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width: 1.5rem; height: 1.5rem; color: #2563eb;" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
    </div>
    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; margin-top: 0;">Publisher (Dev)</h3>
    <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem; flex-grow: 1;">
      Full control and customization. Integrate via NPM and leverage our comprehensive API.
    </p>
    <a href="./tutorial/publisher#advanced-implementation-npm" class="btn-primary" style="background-color: #2563eb;">
      Developer Guide
    </a>
  </div>

  <!-- Creative Path -->
  <div class="path-card">
    <div class="icon-box" style="background-color: #dcfce7;">
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width: 1.5rem; height: 1.5rem; color: #16a34a;" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
    </div>
    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; margin-top: 0;">Creatives</h3>
    <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem; flex-grow: 1;">
      Build ads that work everywhere. Learn how to use our messaging protocol for high-impact ads.
    </p>
    <a href="./tutorial/creative" class="btn-primary" style="background-color: #16a34a;">
      Creative Guide
    </a>
  </div>

</div>

## Explore More

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <a href="./concepts/formats" class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 transition-colors">
    <strong>🎯 Core Concepts</strong><br>
    <span class="text-sm text-gray-500">Learn about Formats, Wrappers, and the Messaging Protocol.</span>
  </a>
  <a href="./formats/topscroll" class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 transition-colors">
    <strong>🛠 Available Formats</strong><br>
    <span class="text-sm text-gray-500">Specs for Topscroll, Midscroll, Welcome Page and more.</span>
  </a>
  <a href="./examples/hello-world" class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 transition-colors">
    <strong>💡 Developer Tools</strong><br>
    <span class="text-sm text-gray-500">MCP Server and ready-to-use code examples.</span>
  </a>
  <a href="../api/" class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 transition-colors">
    <strong>🔧 API Reference</strong><br>
    <span class="text-sm text-gray-500">Complete TypeScript API documentation.</span>
  </a>
</div>

## Community & Support

-   **[GitHub Issues](https://github.com/get-advantage/advantage/issues)** - Report bugs and request features
-   **[Slack Community](https://join.slack.com/t/get-advantage/shared_invite/zt-2gy6c4z4m-4~pIuwRfe8eqPM5H7iV9MQ)** - Connect with other developers and get help
-   **[Contributing Guide](../about/contributions.md)** - Learn how to contribute to the project
