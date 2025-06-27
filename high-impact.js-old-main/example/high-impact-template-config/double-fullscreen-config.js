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
  });

  window.highImpactJs.defineSlot({
    template: 'double-fullscreen',
    sizes: [[728, 90]],
    adUnitId: 'double-fullscreen-banner',
    testTagToBeInserted: `
      <style>
        .ad-text {
          justify-content: center;
          align-items: center;
          height: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 45px;
          text-align: center;
          color: black;
          line-height: normal;
          position: absolute;
        }
      </style>

      <div id="parent" style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;">
        <iframe
          src="https://video.seenthis.se/v2/builds/9omfpzmP8/index.html"
          style="width: 100%; height: 100%; border: none;"
        >
        </iframe>
        <div id="first" style="display: none;" class="ad-text">First text that becomes visible on 25% waypoint.</div>
        <div id="second" style="display: none;" class="ad-text">Second text that becomes visible on 75% waypoint.</div>
      </div>
      
      <script>
        var callbacks = {};
        var parentAd = document.getElementById('parent');
        var firstForegroundAd = document.getElementById('first');
        var secondForegroundAd = document.getElementById('second');

        window.addEventListener("message", function (e) {
          e.origin || e.originalEvent.origin;
          if (e.data) {
            var a = e.data;
            if (a && a.callbackId && callbacks[a.callbackId]) {
              callbacks[a.callbackId](a, a.callbackId);
            }
          }
        });
      
        function addWaypoint(waypointConfig, callback) {
          waypointConfig.action = "addWaypoint";
          waypointConfig.callbackId = btoa(Math.random()).substring(0, 12);
          waypointConfig.frame = window.name;
          waypointConfig.type = 'high-impact-js';
          waypointConfig.template = 'double-fullscreen';
          callbacks[waypointConfig.callbackId] = callback;
          window.parent.postMessage(waypointConfig, "*");
          return waypointConfig.callbackId;
        }
      
        addWaypoint(
          {
            threshold: 0.25,
          },
          function (response, callbackId) {
            if (response.isIntersecting) {
              firstForegroundAd.style.display = "flex";
              parentAd.style.display = "flex";
              secondForegroundAd.style.display = "none";
            } else {
              firstForegroundAd.style.display = "none";
            }
          }
        );
        addWaypoint(
          {
            threshold: 0.75,
          },
          function (response, callbackId) {
            if (response.isIntersecting) {
              firstForegroundAd.style.display = "none";
              secondForegroundAd.style.display = "flex";
            } else {
              secondForegroundAd.style.display = "none";
            }
          }
        );

        window.top.postMessage(JSON.stringify({sender: 'high-impact-js', action: 'AD_RENDERED', template: 'double-fullscreen', 'src': 'https://video.seenthis.se/v2/builds/TbR1gAvuhA/index.html'}), '*')
      </script>`,
  });
});
