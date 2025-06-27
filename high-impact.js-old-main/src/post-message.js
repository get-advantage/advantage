import { log } from './debug.js';

export const listenToHighImpactPostMessages = (handler) => {
  window.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.sender === 'high-impact-js' && data.action === 'AD_RENDERED') {
        let name;
        try {
          name = event.source.name;
        } catch (_) {}
        handler({
          source: event.source,
          iframeName: name,
          adMessageData: data,
        });
      }
    } catch (e) {}
  });
};

export const injectPostMessage = (head) => {
  try {
    // add a postmessage call to the parent window to signal that the ad has been rendered
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      const qem = document.querySelector('[data-jcp-qem-id]');
      let qemId;
      if (qem && qem.dataset) {
        qemId = qem.dataset.jcpQemId;
      }
      let iframeName;
      let origins;
      try {
        iframeName = window.frameElement.name;
      } catch (_) { }
      try {
        origins = Array.from([...location.ancestorOrigins, window.location.origin]);
      } catch (_) { }
      window.top.postMessage(JSON.stringify({
        sender: 'high-impact-js',
        action: 'AD_RENDERED',
        origins: origins,
        qemId: qemId,
        iframeName: iframeName,
      }), '*');
    `;
    head.appendChild(script);
  } catch (e) {
    log('Error applying responsive ad styling - possibly because of safe frame', e);
  }
};
