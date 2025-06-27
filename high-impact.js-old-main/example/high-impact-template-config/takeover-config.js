/* setup high impact */
window.highImpactJs = window.highImpactJs || { cmd: [] };
window.highImpactJs.cmd.push(() => {
  window.highImpactJs.setConfig({
    topBarHeight: 76,
    bottomBarHeight: 0,
    plugins: ['gam'],
    ignoreSlotOn: (html) => {
      if (html && html.includes('adnm-')) {
        return true;
      }
      return false;
    },
    zIndex: 1000001,
    width: '30%',
    padding: '40px',
    scrollTo: '2526px',
  });

  window.highImpactJs.setTemplateConfig('takeover', {
    zIndex: 1000003,
    topBarHtml:
      '<div style="height: 76px; background-color: white; color: black; display: flex; justify-content: center; align-items: center;">Gå vidare till Publisher</div>',
  });

  window.highImpactJs.defineSlot({
    template: 'takeover',
    sizes: [[728, 90]],
    adUnitId: 'takeover-banner',
    waitForAdSignal: false, // This will wait with styling until the ad sends a postmessage
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
