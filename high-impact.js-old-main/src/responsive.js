import { log } from './debug.js';

export const applyResponsiveAdStylingToAdWrapper = (containerElement, config = {}) => {
  try {
    const iframe = containerElement.querySelector('iframe');
    const iframeContent = iframe.contentDocument || iframe.contentWindow.document;

    if (iframeContent.head) {
      applyResponsiveAdStyling(iframeContent.head);
    }
  } catch (e) {
    log('Error applying responsive ad styling - possibly because of safe frame', e);
  }
};

export const applyResponsiveAdStyling = (head) => {
  try {
    // Custom styling element for inside of the ad container
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      html, body, adfm-ad, #sf_align, .adform-adbox, .adform-adbox img {width: 100% !important; height: 100% !important; object-fit: cover;} iframe[data-contents*='adform']{width: 100vw !important;height: 100vh !important;}
      [target='_blank'] img[src*='adnxs']{object-fit: cover !important;width: 100% !important;height: 100% !important;position: fixed;}
      .banner {height: 0px !important;} .GoogleActiveViewClass, .GoogleActiveViewElement {transform: translate(calc(-50% + 50vw), 0); width: 100vw !important; height: 100vh !important; display: block;} .GoogleActiveViewClass img, .GoogleActiveViewElement img {width: 100vw !important; height: 100vh !important; object-fit: cover !important;} .GoogleActiveViewClass iframe {width: 100vw !important; height: 100vh !important;}.dcmads {width: 100%!important; height: 100% !important;}
      iframe[src*='net/sadbundle/']{width: 100vw !important;height: 100vh !important;}
    `;
    head.appendChild(style);
  } catch (e) {
    log('Error applying responsive ad styling - possibly because of safe frame', e);
  }
};
