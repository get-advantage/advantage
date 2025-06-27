import { addTemplateStyle, removeTemplateStyle } from '../utils';

export default {
  name: 'double-fullscreen',
  requireAdMessage: true,
  onRender: ({ adWrapper, adUnit, adIframe }, templateConfig, globalConfig) => {
    const topBarHeight = templateConfig.topBarHeight || globalConfig.topBarHeight || 0;
    const boundingClientRect = adWrapper.getBoundingClientRect();
    const wrapperLeftMargin = window.getComputedStyle(adWrapper).marginLeft;
    const leftMargin = boundingClientRect.left - parseInt(wrapperLeftMargin, 10);

    // Calculate viewport width and adjusted width
    const viewportWidth = document.documentElement.clientWidth;
    const adjustedWidth = 100 - (leftMargin / viewportWidth * 100);

    const templateStyle = `
      .high-impact-ad-wrapper-double-fullscreen {
        visibility: visible;
        clip-path: polygon(0 0, 100vw 0, 100vw 200vh, 0 200vh);
        -webkit-clip-path: polygon(0 0, 100vw 0, 100vw 200vh, 0 200vh);
        height: 200vh !important;
        overflow: visible;
        position: relative !important;
        padding: 0;
        margin: 0 0 0 -${leftMargin}px !important;
        left: 0;
        top: 0;
        z-index: 1001;
        display: block !important;
        width: ${adjustedWidth}vw !important;
        max-width: 100%;
        box-sizing: border-box;
      }

      .high-impact-ad-unit-double-fullscreen {
        height: 200vh !important;
        left: 0;
        top: 0;
        overflow: hidden;
        position: relative !important;
        width: 100vw !important;
        max-width: 100%;
      }

      .high-impact-ad-iframe-double-fullscreen {
        width: 100vw !important;
        height: calc(100vh - ${topBarHeight}px) !important;
        position: fixed !important;
        top: ${topBarHeight}px !important;
        z-index: 2;
      }
    `;
    addTemplateStyle('double-fullscreen', templateStyle);
    
    // Map to store sentinels by threshold
    const sentinels = new Map();

    // Function to create a sentinel for a specific threshold
    const createSentinel = (threshold) => {
      const sentinel = document.createElement('div');
      sentinel.id = `sentinel-${threshold}`;
      Object.assign(sentinel.style, {
        position: 'absolute',
        width: '100%',
        height: '1px',
        top: `${threshold * 100}%`,
        left: 0,
        pointerEvents: 'none',
        zIndex: -1
      });
      adWrapper.appendChild(sentinel);
      return sentinel;
    };
    
    document.body.classList.add('high-impact-double-fullscreen-rendered');

    let observers = [];
    let observerCallbacks = new Map();

    window.addEventListener('message', (e) => {
      if (e.data.type !== 'high-impact-js') return;
      
      if (e.data.template === 'double-fullscreen' && e.data.src) {
        const adBackground = document.createElement('iframe');
        adBackground.src = e.data.src;
        adBackground.id = 'ad-background';
        Object.assign(adBackground.style, {
          border: '0',
          display: 'block',
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 1,
          maxWidth: '100%',
          boxSizing: 'border-box'
        });
        adIframe.parentElement.insertBefore(adBackground, adIframe);
      }

      if (e.data.action === 'addWaypoint') {
        const threshold = e.data.threshold;
        const callbackId = e.data.callbackId;
        
        if (threshold) {
          // Store the callback information
          observerCallbacks.set(threshold, {
            source: e.source,
            callbackId: callbackId
          });

          // Create a sentinel for this threshold if it doesn't exist
          if (!sentinels.has(threshold)) {
            const sentinel = createSentinel(threshold);
            sentinels.set(threshold, sentinel);
          }
          
          const sentinel = sentinels.get(threshold);
          
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                const callback = observerCallbacks.get(threshold);
                if (callback) {
                  callback.source.postMessage({
                    isIntersecting: entry.isIntersecting,
                    callbackId: callback.callbackId,
                    intersectionRatio: entry.intersectionRatio,
                    threshold: threshold
                  }, '*');
                }
              });
            },
            {
              threshold: [0, 1],
              rootMargin: '0px'
            }
          );

          observer.observe(sentinel);
          observers.push(observer);
        }
      }
    });

    return {
      didRender: true,
      destroy: () => {
        removeTemplateStyle('double-fullscreen');
        observers.forEach((observer) => observer.disconnect());
        sentinels.forEach(sentinel => {
          if (sentinel.parentNode) {
            sentinel.parentNode.removeChild(sentinel);
          }
        });
        sentinels.clear();
        document.body.classList.remove('high-impact-double-fullscreen-rendered');
      }
    };
  },
};