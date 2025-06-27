import { log } from '../debug.js';

const parseSlot = (slot) => {
  const elementId = slot.getSlotElementId();
  const adWrapper = document.getElementById(elementId);
  if (adWrapper) {
    const [adUnit, adIframe] = adWrapper.querySelectorAll(
      'div[id^="google_ads_iframe_"], iframe[id^="google_ads_iframe_"]'
    );

    const html = slot.getHtml();
    const size = slot.size;
    return {
      adWrapper,
      adUnit,
      adIframe,
      size,
      html,
      elementId,
      plugin: 'gam',
    };
  }
};

export const getSlotFromSource = (source) => {
  const googleIframes = document.querySelectorAll('iframe[id*="google_ads_iframe"]');
  if (!googleIframes) {
    return;
  }

  const isAncestor = (childWindow, frameWindow) => {
    if (frameWindow === childWindow) {
      return true;
    } else if (childWindow === window.top) {
      return false;
    }
    return isAncestor(childWindow.parent, frameWindow);
  }
  const iframeThatMatchesSource = Array.from(googleIframes).find((frame) => isAncestor(source, frame.contentWindow));
  if (!iframeThatMatchesSource) {
    return;
  }
  const slotId = iframeThatMatchesSource.id.replace('google_ads_iframe_', '');
  const slotIdMap = googletag.pubads().getSlotIdMap();
  const slot = slotIdMap[slotId];
  if (!slot) {
    return;
  }
  return parseSlot(slot);
};

export const onAdSlotRendered = (handler) => {
  googletag.cmd.push(() => {
    googletag.pubads().addEventListener('slotRenderEnded', (event) => {
      if (event.isEmpty) {
        return;
      }
      const { slot } = event;
      slot.size = event.size;
      const parsedSlot = parseSlot(slot);
      handler(parsedSlot);
    });
  });
};

export const getRenderedSlots = async () => {
  return new Promise((resolve) => {
    googletag.cmd.push(() => {
      const slots = googletag.pubads().getSlots();
      const parsedSlots = slots.filter((slot) => slot && slot.adIframe && slot.adUnit).map((slot) => parseSlot(slot));
      resolve(parsedSlots.filter((slot) => slot.adIframe && slot.adUnit));
    });
  });
};

export const init = () => {
  window.googletag = window.googletag || { cmd: [] };
  if (!window.googletag.cmd) {
    log('Google tag is defined but no cmd array');
    window.googletag.cmd = [];
  }
};
