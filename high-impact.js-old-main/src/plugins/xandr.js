
let tags = [];

const parseTag = (slot) => {
  const elementId = slot.targetId;
  const adWrapper = document.getElementById(slot.targetId);
  if (adWrapper) {
    const [adUnit, adIframe] = adWrapper.querySelectorAll(
      'div[id^="div_utif_"], iframe[id^="utif_"]'
    );

    const html = slot.banner?.content || adIframe.contentDocument.body.innerHTML;
    const size = [slot.width || slot.initialWidth, slot.height || slot.initialHeight];
    return {
      adWrapper,
      adUnit,
      adIframe,
      size,
      html,
      elementId,
      plugin: 'xandr',
    };
  }
};

export const getSlotFromSource = (source) => {
  const xandrIframes = document.querySelectorAll('iframe[id*="utif"]');
  if (!xandrIframes.length) {
    return;
  }

  const isAncestor = (childWindow, frameWindow) => {
    if (frameWindow === childWindow) {
      return true;
    } else if (childWindow === window.top) {
      return false;
    }
    return isAncestor(childWindow.parent, frameWindow);
  };

  const matchingIframe = Array.from(xandrIframes).find((frame) =>
    isAncestor(source, frame.contentWindow)
  );
  if (!matchingIframe) {
    return;
  }

  const tagId = matchingIframe.id.replace('utif_', '').split('_')[0];
  const tag = apntag.getTag(tagId);
  if (!tag) {
    return;
  }
  return parseTag(tag);
};

export const onAdSlotRendered = (handler) => {
  apntag.anq.push(() => {
    apntag.onEvent('adLoaded', (event) => {
      tags.forEach((tag) => {
        event.invCode = tag.invCode;
        const parsedTag = parseTag(event);
        handler(parsedTag);
      });
    });
  });
};

export const getRenderedSlots = async () => {
  return new Promise((resolve) => { 
    apntag.anq.push(() => {
      tags = Object.values(apntag.getTag());
      const parsedTags = tags.filter((tag) => tag && tag.utiframeId && tag.utDivId).map((tag) => parseTag(tag));
      parsedTags.forEach((tag) => {
        apntag.showTag(tag.targetId);
        apntag.loadTags();
      });
      resolve(parsedTags.filter((tag) => tag.utiframeId && tag.utDivId));
    });
  });
};

export const init = () => {
  window.apntag = window.apntag || { anq: [] };
  apntag.anq.push(() => {
    apntag.debug = true;
    apntag.test = true;
  });
};
