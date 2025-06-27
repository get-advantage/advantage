import { addTemplateStyle, removeTemplateStyle } from '../utils';

export default {
  name: 'topscroll',
  onRender: ({ adWrapper, adUnit, adIframe }, templateConfig, globalConfig) => {
    const topBarHeight = templateConfig.topBarHeight || globalConfig.topBarHeight || 0;
    const zIndex = templateConfig.zIndex || globalConfig.zIndex || 1000002;
    const peekAmount = templateConfig.peekAmount;
    const dynamic100ViewHeight = `100dvh`;
    const dvhIsSupported = CSS.supports(`height: ${dynamic100ViewHeight}`);
    const height = peekAmount ? `calc(${peekAmount} - ${topBarHeight}px)` : `calc(100vh - ${topBarHeight}px)`;

    const templateStyle = `
      .high-impact-ad-wrapper-topscroll {
        max-height: ${height};
        clip-path: polygon(0 0, 100vw 0, 100vw ${height}, 0 ${height});
        -webkit-clip-path: polygon(0 0, 100vw 0, 100vw ${height}, 0 ${height});
        margin: 0;
        padding: 0;
        position: relative;
        z-index: ${zIndex};
        display: block;
        height: ${height} !important;
      }
      .high-impact-ad-unit-topscroll {
        width: 100% !important;
        height: ${height} !important;
      }
      .high-impact-ad-iframe-topscroll {
        position: fixed !important;
        left: 0;
        z-index: 1;
        width: 100% !important;
        height: ${height} !important;
        clip: rect(auto, auto, auto, auto);
      }
    `;
    addTemplateStyle('topscroll', templateStyle);

    const scrollAwayAdslot = () => {
      const scrollAmount = adWrapper.getBoundingClientRect().bottom;
      window.scrollTo({
        top: scrollAmount,
        behavior: 'smooth',
      });
    };

    /*
            Additional elements on top of ad
        */

    const bottomContentArea = document.createElement('div');
    bottomContentArea.style.position = 'absolute';
    bottomContentArea.style.bottom = 0;
    bottomContentArea.style.left = 0;
    bottomContentArea.style.width = '100%';
    bottomContentArea.style.zIndex = 999999999;
    bottomContentArea.style.display = 'flex';
    bottomContentArea.style.alignItems = 'center';
    bottomContentArea.style.justifyContent = 'center';
    bottomContentArea.style.flexDirection = 'column';
    bottomContentArea.style.pointerEvents = 'none';

    const title = document.createElement('span');
    title.style.fontSize = '18px';
    title.style.fontWeight = '400';
    title.style.color = 'white';
    title.style.textShadow = '1px 1px 1px rgba(0,0,0,0.5)';
    title.style.marginBottom = '10px';
    title.textContent = templateConfig.title;

    bottomContentArea.appendChild(title);

    if (templateConfig.arrowUrl && templateConfig.arrowUrl.length > 0) {
      const arrow = document.createElement('img');
      arrow.style.width = '38px';
      arrow.style.height = '38px';
      arrow.style.marginLeft = '10px';
      arrow.style.marginBottom = '10px';
      arrow.src = templateConfig.arrowUrl;
      arrow.addEventListener('click', () => {
        scrollAwayAdslot();
      });
      arrow.style.pointerEvents = 'auto';
      bottomContentArea.appendChild(arrow);
    }

    if (templateConfig.showCloseButton) {
      const closeButton = document.createElement('button');
      closeButton.style.position = 'absolute';
      closeButton.style.top = '10px';
      closeButton.style.left = '10px';
      closeButton.style.width = '30px';
      closeButton.style.height = '30px';
      closeButton.style.backgroundColor = 'rgba(0,0,0,0.5)';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '50%';
      closeButton.style.fontSize = '20px';
      closeButton.style.cursor = 'pointer';
      closeButton.textContent = 'X';

      closeButton.style.zIndex = zIndex + 1;
      closeButton.addEventListener('click', () => {
        scrollAwayAdslot();
      });
      adWrapper.appendChild(closeButton);
    }

    adWrapper.appendChild(bottomContentArea);

    const fadeOnScroll = templateConfig.fadeOnScroll;

    // Setup intersection observer and change opacity of bottomContentArea
    // based on percent visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // get intersection ratio in percentage
          if (fadeOnScroll) {
            adWrapper.style.opacity = entry.intersectionRatio;
          }
          if (entry.intersectionRatio === 0) {
            // set class on ad wrapper to high-impact-topscroll-is-hidden
            document.body.classList.add('high-impact-topscroll-is-hidden');
          } else {
            // remove class on ad wrapper to high-impact-topscroll-is-hidden
            document.body.classList.remove('high-impact-topscroll-is-hidden');
          }
        });
      },
      {
        // in steps of 0.01
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    );
    observer.observe(adWrapper);

    document.body.classList.add('high-impact-topscroll-rendered');

    return {
      didRender: true,
      destroy: () => {
        document.body.classList.remove('high-impact-topscroll-rendered');
        observer.disconnect();
        removeTemplateStyle('topscroll');
      },
    };
  },
};
