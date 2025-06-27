import { addTemplateStyle, removeTemplateStyle } from '../utils';

export default {
  name: 'sitebar',
  onRender: ({ adWrapper, adUnit, adIframe }, templateConfig, globalConfig) => {
    const topBarHeight = templateConfig.topBarHeight || globalConfig.topBarHeight || '105px';
    const adWrapperRect = adWrapper.getBoundingClientRect();
    
    // Calculate width based on horizontal space
    const horizontalBasedWidth = `calc((100vw - ${adWrapperRect.left * 2 - adWrapperRect.right + 20}px) / 2)`;
    // Calculate width based on vertical space
    const verticalBasedWidth = `calc((100vh - ${topBarHeight}px)/2)`;
    // Use the smaller of the two values
    const responsiveWidth = `min(${horizontalBasedWidth}, ${verticalBasedWidth})`;
    
    const templateStyle = `
      .high-impact-ad-wrapper-sitebar {
        aspect-ratio: 1 / 2 !important;
        width: ${responsiveWidth} !important;
        height: auto !important;
      }

      .high-impact-ad-unit-sitebar {
        width: 100% !important;
        height: 100% !important;
        border: 0pt none;
      }

      .high-impact-ad-iframe-sitebar {
        width: 100% !important;
        border: 0pt none;
        position: relative !important;
        vertical-align: bottom;
        max-width: 100%;
        max-height: 100%;
      }
    `;
    addTemplateStyle('sitebar', templateStyle);

    document.body.classList.add('high-impact-sitebar-rendered');

    return {
      didRender: true,
      destroy: () => {
        document.body.classList.remove('high-impact-sitebar-rendered');
        removeTemplateStyle('sitebar');
      }
    };
  },
};