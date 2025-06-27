import { addTemplateStyle, removeTemplateStyle } from '../utils';

export default {
  name: 'takeover',
  onRender: ({ adWrapper, adUnit, adIframe }, templateConfig, globalConfig) => {
    const topBarHeight = templateConfig.topBarHeight ?? globalConfig.topBarHeight ?? 0;
    const zIndex = templateConfig.zIndex || globalConfig.zIndex || 1000002;
    const peekAmount = templateConfig.peekAmount;
    const height = peekAmount ? `calc(${peekAmount} - ${topBarHeight}px)` : `calc(100vh - ${topBarHeight}px)`;

    if (templateConfig.topBarHtml) {
      const topBar = document.createElement('div');
      topBar.style.cursor = 'pointer';
      topBar.classList.add('high-impact-takeover-top-bar');
      topBar.addEventListener('click', () => {
        window.scrollTo(0, 0);
        adWrapper.style.display = 'none';
      });
      topBar.innerHTML = templateConfig.topBarHtml;
      adWrapper.insertBefore(topBar, adUnit);
    }

    const templateStyle = `
      .high-impact-takeover-top-bar {
        height: ${topBarHeight}px;
      }
      .high-impact-ad-wrapper-takeover {
        max-height: 100vh;
        height: 100vh !important;
        margin: 0;
        padding: 0;
        z-index: ${zIndex};
        display: block;
        background-color: #fff;
        position: fixed;
      }
      .high-impact-ad-unit-takeover {
        width: 100vw !important;
        height: ${height} !important;
      }
      .high-impact-ad-iframe-takeover {
        position: fixed !important;
        left: 0;
        z-index: 1;
        width: 100% !important;
        height: ${height} !important;
        clip: rect(auto, auto, auto, auto);
      }
    `;
    addTemplateStyle('takeover', templateStyle);


    document.body.classList.add('high-impact-takeover-rendered');

    return {
      didRender: true,
      destroy: () => {
        document.body.classList.remove('high-impact-takeover-rendered');
        removeTemplateStyle('takeover');
      },
    };
  },
};
