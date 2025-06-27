/* setup high impact */
window.highImpactJs = window.highImpactJs || { cmd: [] };

window.highImpactJs.cmd.push(() => {
  window.highImpactJs.setConfig({
    plugins: ['xandr'],
  });
  window.highImpactJs.defineSlot({
    sizes: [[728,90]],
    targetId: 'banner-topscroll', // a unique div ID in the body of the page.
    template: 'topscroll',
    testTagToBeInserted: `
      <script
        src="https://video.seenthis.se/public/tag-loader/4/loader.js"	
        data-id="9omfpzmP8"	
        data-clicktag="https%3A%2F%2Fseenthis.co%2F"	
        data-src="https://video.seenthis.se/v2/builds/9omfpzmP8/index.html"	
        data-width="100vw"	
        data-height="100vh"	
      ></script>`,
  });
});
