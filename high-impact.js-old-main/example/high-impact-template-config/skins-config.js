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

  window.highImpactJs.setTemplateConfig('skins', {
    contentWrapperSelector: '.site-wrapper',
    topAdHeight: '180px',
    scrollTo: {
      // from top of the content
      section: null, // string with CSS selector
      height: 800, // string with px or % or vh
    },
    addPushdownElementToSideBanners: ['.sidebanner-container'], // array of ids with CSS selectors. Adds an element that pushes down the side banners
  });

  window.highImpactJs.defineSlot({
    template: 'skins',
    adUnitId: 'skins-banner',
    sizes: [[728, 90]],
    waitForAdSignal: false,
    testTagToBeInserted: `;
      <script
        src="https://video.seenthis.se/public/tag-loader/4/loader.js"	
        data-id="9omfpzmP8"	
        data-clicktag="https%3A%2F%2Fseenthis.co%2F"	
        data-src="https://video.seenthis.se/v2/builds/9omfpzmP8/index.html"	
        data-width="100vw"	
        data-height="100vh"	
      ></script>
      <script>
        var p = {
          template: "skins",
          sender: "high-impact-js",
          action: "AD_RENDERED",
          src: {
            leftBanner: "https://video.seenthis.se/v2/builds/9omfpzmP8/index.html?clickTag=%%CLICK_URL_ESC%%https%3A%2F%2Fseenthis.co",
            rightBanner: "https://video.seenthis.se/v2/builds/9omfpzmP8/index.html?clickTag=%%CLICK_URL_ESC%%https%3A%2F%2Fseenthis.co"
          }
        };
        window.top.postMessage(JSON.stringify(p), "*");
      </script>`
    ,
  });
});
