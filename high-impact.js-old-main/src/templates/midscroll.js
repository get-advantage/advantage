import { addTemplateStyle, removeTemplateStyle } from '../utils';

export default {
  name: 'midscroll',
  onRender: ({ adWrapper, adUnit, adIframe }, templateConfig, globalConfig) => {
    /* this will get called once per ad unit */
    adWrapper.style = 'width: 100vw;';
    adUnit.style = 'width: 100vw;';
    adIframe.style = 'width: 100vw;';

    const topBarHeight = templateConfig.topBarHeight || globalConfig.topBarHeight || 0;
    const bottomBarHeight = templateConfig.bottomBarHeight || globalConfig.bottomBarHeight || 0;
    const zIndex = templateConfig.zIndex || globalConfig.zIndex || 1000002;
    const boundingClientRect = adWrapper.getBoundingClientRect();
    const wrapperLeftMargin = window.getComputedStyle(adWrapper).marginLeft;
    const leftMargin = boundingClientRect.left - parseInt(wrapperLeftMargin, 10);
    const peekAmount = templateConfig.peekAmount;
    
    // Calculate viewport width and adjusted width
    const viewportWidth = document.documentElement.clientWidth;
    const adjustedWidth = 100 - (leftMargin / viewportWidth * 100);

    const height = peekAmount ? `calc(${peekAmount} - ${topBarHeight}px)` : `calc(100vh - ${topBarHeight}px)`;

    const templateStyle = `
      .high-impact-ad-wrapper-midscroll {
        visibility: visible;
        clip-path: polygon(0 0, 100vw 0, 100vw ${height}, 0 ${height});
        height: ${height} !important;
        overflow: visible;
        padding: 0;
        position: relative !important;
        margin: 0 0 0 -${leftMargin}px !important;
        left: 0;
        top: 0;
        z-index: ${zIndex};
        width: ${adjustedWidth}vw !important;
        min-height: ${height} !important;
      }
      .high-impact-ad-unit-midscroll {
        height: calc(100vh - ${topBarHeight}px - ${bottomBarHeight}px) !important;
        left: 0;
        overflow: hidden;
        position: fixed !important;
        top: ${topBarHeight}px !important;
        width: 100vw !important;
      }
      .high-impact-ad-iframe-midscroll {
        width: 100% !important;
        height: calc(100vh - ${topBarHeight}px - ${bottomBarHeight}px) !important;
      }
    `;
    addTemplateStyle('midscroll', templateStyle);

    document.body.classList.add('high-impact-midscroll-rendered');

    return {
      didRender: true, 
      destroy: () => {
        document.body.classList.remove('high-impact-midscroll-rendered');
        removeTemplateStyle('midscroll');
      }
    };
  },
};
