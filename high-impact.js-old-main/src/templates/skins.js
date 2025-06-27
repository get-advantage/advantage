import { addTemplateStyle, removeTemplateStyle } from '../utils';
import { log } from '../debug';

export default {
  name: 'skins',
  requireAdMessage: true,
  onRender: ({ adWrapper, adUnit, adIframe, adMessageData }, templateConfig, globalConfig) => {
    const zIndex = templateConfig.zIndex || globalConfig.zIndex || 1000002;
    const contentWrapper = document.querySelector(templateConfig.contentWrapperSelector);
    
    // Validate required configuration
    if (!contentWrapper) {
      log('[high-impact.js] Skins template: contentWrapperSelector not found');
      return;
    }
    
    const topAdHeight = parseInt(templateConfig.topAdHeight) || 0;
    const topBarHeight = parseInt(globalConfig.topBarHeight) || 0;
    let scrollHeight = templateConfig.scrollTo.section || parseInt(templateConfig.scrollTo.height) || parseInt(globalConfig.scrollTo);
    const addPushdownElementToSideBanners = templateConfig.addPushdownElementToSideBanners || [];
    
    if (typeof scrollHeight === 'string') {
      const section = document.querySelector(scrollHeight);
      scrollHeight = `${section.offsetTop + section.offsetHeight + topBarHeight}`;
    } else {
      scrollHeight = scrollHeight + topBarHeight;
    }

    // Add pushdown elements to side banners if configured
    if (addPushdownElementToSideBanners.length > 0) {
      addPushdownElementToSideBanners.forEach((selector) => {
        const banners = document.querySelectorAll(selector);
        banners.forEach((banner) => {
          if (!banner) return;
          
          // Create and insert pushdown element
          const pushdownElement = document.createElement('div');
          pushdownElement.classList.add('pushdown-sidebanner');
          banner.insertBefore(pushdownElement, banner.firstChild);
          pushdownElement.style.height = `${scrollHeight}px`;
        });
      });
    }

    const createAdIframe = (src, id) => {
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.id = id;
      return iframe;
    };
    
    // Process ad message data if available
    if (adMessageData) {
      // Validate ad message data
      if (adMessageData.sender !== 'high-impact-js' || adMessageData.template !== 'skins') {
        log('Skins template: Invalid ad message data');
        return;
      }
      
      // Validate required banner URLs
      if (!adMessageData.src || !adMessageData.src.leftBanner || !adMessageData.src.rightBanner) {
        log('Skins template: Missing banner URLs in ad message data');
        return;
      }
      
      // Create main wallpaper container
      const adWallpaper = document.createElement('div');
      adWallpaper.id = 'high-impact-adwallpaper';
      contentWrapper.parentNode.insertBefore(adWallpaper, contentWrapper);

      // Create left banner container
      const adWallpaperLeft = document.createElement('div');
      adWallpaperLeft.classList.add('high-impact-adWallpaper-sides');
      adWallpaper.appendChild(adWallpaperLeft);

      // Create right banner container
      const adWallpaperRight = document.createElement('div');
      adWallpaperRight.classList.add('high-impact-adWallpaper-sides');
      adWallpaper.appendChild(adWallpaperRight);

      // Create and append left banner iframe
      const leftBanner = createAdIframe(adMessageData.src.leftBanner, 'high-impact-adWallpaper-sides-left');
      adWallpaperLeft.appendChild(leftBanner);
    
      // Create and append right banner iframe
      const rightBanner = createAdIframe(adMessageData.src.rightBanner, 'high-impact-adWallpaper-sides-right');
      adWallpaperRight.appendChild(rightBanner);

      /**
       * Updates the width of the side banners based on the content wrapper width
       * Called on initial render and window resize
       */
      const updateDivWidth = () => {
        const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
        const calculatedWidth = (document.documentElement.clientWidth - contentWrapper.clientWidth) / 2;
        adWallpaperLeft.style.width = `${calculatedWidth}px`;
        adWallpaperRight.style.width = `${calculatedWidth + scrollWidth}px`;
        rightBanner.style.width = `${calculatedWidth + scrollWidth}px`;
        leftBanner.style.width = `${calculatedWidth}px`;
      };
      
      // Initial width calculation
      updateDivWidth();
      
      // Store event handlers for proper cleanup
      const eventHandlers = {
        resize: updateDivWidth,
        scroll: null
      };
      
      // Update widths on window resize
      window.addEventListener('resize', eventHandlers.resize);

      const hasTopscroll = document.querySelector('[class*="topscroll"]');
      let topscrollIframeHeight = 0;
      if (hasTopscroll) {
        let topscrollIframe = [...document.querySelectorAll('iframe')]
        .map((iframe) => iframe.closest('[id*="topscroll"], [class*="topscroll"]'))
        .find((el) => el);
        if (topscrollIframe) {
          topscrollIframeHeight = topscrollIframe.offsetHeight;
        }

        /**
         * Handle integration with topscroll template if present
         * Add special styles to handle the interaction between skins and topscroll
         */
        const adWallpaperParent = adWallpaper.parentElement;
        adWallpaperParent.classList.add('adWallpaper-parent-element');
        const styleSkinsWithTopscroll = document.createElement('style');
        styleSkinsWithTopscroll.innerHTML = `
          html.adnm-topscroll:not(.adnm-topscroll-fixed) #high-impact-adwallpaper {
            position: absolute !important;
          }
          body.high-impact-topscroll-rendered:not(.high-impact-topscroll-is-hidden) #high-impact-adwallpaper {
            top: 0px !important;
          }
          body.high-impact-topscroll-rendered:not(.high-impact-topscroll-is-hidden) #high-impact-adwallpaper iframe#high-impact-adWallpaper-sides-left {
            position: sticky !important;
            top: 0px !important;
          }
          body.high-impact-topscroll-rendered:not(.high-impact-topscroll-is-hidden) #high-impact-adwallpaper iframe#high-impact-adWallpaper-sides-right {
            position: sticky !important;
            top: 0px !important;
          }
          body.high-impact-skins-rendered.high-impact-topscroll-rendered:not(.high-impact-skins-scrolled) .adWallpaper-parent-element {
            position: relative !important;
          }
          body.high-impact-topscroll-is-hidden.high-impact-skins-scrolled .adWallpaper-parent-element {
            position: unset !important;
          }
        `;
        
        // Add the styles to the document
        document.head.appendChild(styleSkinsWithTopscroll);
      }

      /**
       * Handle scroll events to adjust the position of banners
       * Changes banner position from sticky to absolute when scrolled past the ad height
       */
      const handleScroll = () => {
        const adWallpaperHeight = adWallpaper.offsetHeight;
        let scrollOffset = window.scrollY;
        
        // Check if user has scrolled past the threshold where we want the ad to start scrolling
        // We need to ensure this only triggers when the user has actually scrolled down
        if (scrollOffset > 0 && scrollOffset + topBarHeight >= scrollHeight) {
          // Switch to absolute positioning when scrolled past the threshold
          // This allows the ad to scroll up with the page
          adWallpaper.style.position = 'absolute';
          adWallpaper.style.top = `${scrollHeight}px`;
          rightBanner.style.position = 'absolute';
          rightBanner.style.top = '0';
          leftBanner.style.position = 'absolute';
          leftBanner.style.top = '0';
          contentWrapper.style.marginTop = 'unset';
          document.body.classList.add('high-impact-skins-scrolled');
        } else {
          // Use sticky positioning when within the threshold
          // This keeps the ad fixed at the top of the viewport
          adWallpaper.style.position = 'sticky';
          adWallpaper.style.top = `${topBarHeight}px`;
          rightBanner.style.position = 'fixed';
          rightBanner.style.top = `${topBarHeight}px`;
          leftBanner.style.position = 'fixed';
          leftBanner.style.top = `${topBarHeight}px`;
          contentWrapper.style.marginTop = `-${scrollHeight}px`;
          document.body.classList.remove('high-impact-skins-scrolled');
        }
      };
      
      // Store and attach scroll event handler
      eventHandlers.scroll = handleScroll;
      window.addEventListener('scroll', eventHandlers.scroll);
      
      // Initial position check
      handleScroll();
    }

    /**
     * Define the CSS styles for the skins template
     * Using template literals for dynamic values based on configuration
     */
    const templateStyle = `
      .high-impact-ad-wrapper-skins {
        visibility: visible;
        clip-path: polygon(0 0, 100vw 0, 100vw ${topAdHeight}px, 0 ${topAdHeight}px);
        overflow: visible;
        padding: 0;
        position: relative !important;
        left: 0;
        z-index: ${zIndex};
        display: inline-block !important;
        width: 100% !important;
        height: auto !important;
      }
      .high-impact-ad-unit-skins {
        height: ${topAdHeight}px !important;
        width: 100% !important;
        border: 0px;
        margin: auto;
        text-align: center;
        position: relative !important;
      }
      .high-impact-ad-iframe-skins {
        width: 100% !important;
        height: 100% !important;
        position: absolute !important;
        vertical-align: bottom;
        display: block;
        color-scheme: auto;
      }
      .high-impact-skins-rendered #high-impact-adwallpaper {
        position: sticky;
        padding: 0px;
        left: 0;
        width: 100vw !important;
        height: ${scrollHeight}px !important;
        clip-path: polygon(0 0, 100vw 0, 100vw ${scrollHeight}px, 0 ${scrollHeight}px);
        visibility: visible;
        overflow: visible;
        display: flex !important;
        justify-content: space-between !important;
      }
      .high-impact-skins-rendered .high-impact-adWallpaper-sides {
        overflow: hidden;
        height: ${scrollHeight}px !important;
      }
      .high-impact-skins-rendered .high-impact-adWallpaper-sides>iframe {
        height: calc(100vh - ${topBarHeight}px) !important;
        position: fixed;
        border: 0;
        z-index: 1;
      }
      
      .high-impact-skins-scrolled .high-impact-adWallpaper-sides>iframe {
        position: absolute;
      }
      .high-impact-skins-rendered #high-impact-adWallpaper-sides-left {
        left: 0 !important;
      }
      .high-impact-skins-rendered #high-impact-adWallpaper-sides-right {
        right: 0 !important;
      }
    `;
    
    // Add the template styles to the document
    addTemplateStyle('skins', templateStyle);

    // Add class to body to indicate the skins template is rendered
    document.body.classList.add('high-impact-skins-rendered');

    return {
      didRender: true,
      destroy: () => {
        document.body.classList.remove('high-impact-skins-rendered');
        removeTemplateStyle('skins');
        
        // Remove event listeners
        if (eventHandlers.resize) {
          window.removeEventListener('resize', eventHandlers.resize);
        }
        
        if (eventHandlers.scroll) {
          window.removeEventListener('scroll', eventHandlers.scroll);
        }
      },
    };
  },
};
