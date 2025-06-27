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

  window.highImpactJs.setTemplateConfig('topscroll', {
    title: 'Scroll down to publisher.com',
    arrowUrl: '../assets/chevrons-down.svg',
  });

  window.highImpactJs.defineSlot({
    template: 'topscroll',
    sizes: [[728, 90]],
    adUnitId: 'topscroll-banner',
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
