import { defineSlot, setTemplateConfig, setConfig, cmd, getSlotConfig, getTemplateConfig, getConfig } from './api.js';
import { log, addDebugAttribute, injectTestTagInAdWrapper } from './debug.js';
import { getTemplate } from './templates/index.js';
import { applyResponsiveAdStylingToAdWrapper } from './responsive.js';
import { listenToHighImpactPostMessages } from './post-message.js';

const shouldIgnore = (html) => {
  if (window.highImpactJs.config.ignoreSlotOn) {
    return window.highImpactJs.config.ignoreSlotOn(html);
  }
  return false;
};

const onAdResponsiveSignal = (options) => {
  log('Got Ad signal');
  const { adMessageData } = options;
  for (const plugin of Object.values(window.highImpactJs.plugins)) {
    let slot;
    if (plugin.getSlotFromSource && options && options.source) {
      slot = plugin.getSlotFromSource(options.source);
      log('Got slot from source');
    }
    if (slot) {
      onAdSlotRendered({
        ...slot,
        fromAdResponsiveSignal: true,
        adMessageData,
      });
    }
  }
};

const setDivClasses = ({ adWrapper, adUnit, adIframe }, templateName) => {
  adWrapper.classList.add(`high-impact-ad-wrapper-${templateName}`);
  adUnit.classList.add(`high-impact-ad-unit-${templateName}`);
  adIframe.classList.add(`high-impact-ad-iframe-${templateName}`);
  document.body.classList.add('high-impact-ad-rendered');
};

const removeDivClasses = ({ adWrapper, adUnit, adIframe }, templateName) => {
  adWrapper.classList.remove(`high-impact-ad-wrapper-${templateName}`);
  adUnit.classList.remove(`high-impact-ad-unit-${templateName}`);
  adIframe.classList.remove(`high-impact-ad-iframe-${templateName}`);
};

const onAdSlotRendered = (options) => {
  const {
    adWrapper,
    adUnit,
    adIframe,
    size,
    html,
    elementId,
    fromAdResponsiveSignal = false,
  } = options;
  const config = getSlotConfig(elementId);

  if (!config) {
    log(`No config found for ${elementId}`);
    return;
  }
  
  if (config.rendered) {
    if (fromAdResponsiveSignal) {
      log(`Already rendered ${elementId} - skipping`);
      return;
    } else {
      log(`Already rendered ${elementId} - running cleanup`);
      removeDivClasses({ adWrapper, adUnit, adIframe }, config.template);
      config.rendered.destroy();
      config.rendered = false;
    }
  } else {
    injectTestTagInAdWrapper(adWrapper, config);
  }

  if (config.sizes && config.sizes.length > 0) {
    const sizeExistInConfig = config.sizes.some((s) => JSON.stringify(s) === JSON.stringify(size));
    if (!sizeExistInConfig) {
      log(`Size ${size} not in config for ${elementId} - ${config.sizes.join(', ')}`);
      return;
    }
  }

  const template = getTemplate(config.template);
  if (template.requireAdMessage) {
    config.waitForAdSignal = true;
  }
  if (config.waitForAdSignal && !fromAdResponsiveSignal) {
    return;
  }

  if (shouldIgnore(html)) {
    return;
  }
  // Get template based on config
  const globalConfig = getConfig();
  const templateConfig = getTemplateConfig(config.template);
  // Call template.onRender(options);
  const rendered = template.onRender(options, templateConfig, globalConfig);
  if (rendered) {
    setDivClasses({ adWrapper, adUnit, adIframe }, config.template);
    config.rendered = rendered;
    addDebugAttribute(adWrapper, globalConfig.debug, true);
    addDebugAttribute(adUnit, globalConfig.debug);
    addDebugAttribute(adIframe);
    applyResponsiveAdStylingToAdWrapper(adWrapper, config);
    window.dispatchEvent(
      new CustomEvent('high-impact-ad-rendered', {
        detail: {
          size: {
            width: adIframe.width,
            height: adIframe.height,
          },
          template: config.template,
        },
      })
    );
  }
};

const importPlugins = async (plugins = []) => {
  // Loop through plugins array (array of strings)
  // import plugin from plugins folder
  const imported = {};
  for (const plugin of plugins) {
    try {
      imported[plugin] = await import(`./plugins/${plugin}.js`);
      // Do something with the imported module, e.g., execute a function or access variables.
      log(`${plugin} imported successfully!`);
    } catch (error) {
      log(`Failed to import ${plugin}:`, error);
    }
  }
  return imported;
};

const setupPlugins = async (plugins = []) => {
  // Loop through plugins array (array of strings)
  // import plugin from plugins folder
  const imported = await importPlugins(plugins);
  for (const plugin of Object.values(imported)) {
    if (plugin.init) {
      plugin.init();
    }
    if (plugin.getRenderedSlots) {
      const renderedSlot = await plugin.getRenderedSlots();
      renderedSlot.forEach((slot) => {
        if (slot.getResponseInformation) {
          const responseInformation = slot.getResponseInformation();
          if (responseInformation.lineItemId) {
            onAdSlotRendered(slot);
          }
        }
      });
    }
    if (plugin.onAdSlotRendered) {
      plugin.onAdSlotRendered(onAdSlotRendered);
    }
  }
  return imported;
};

export default () => {
  return new Promise(async (resolve, reject) => {
    // Set defaults
    window.highImpactJs = window.highImpactJs || { cmd: [] };

    if (window.highImpactJs.initialized) {
      reject('Already initialized');
      return;
    }

    log('high-impact.js init');
    window.highImpactJs.initialized = true;

    window.highImpactJs.templateConfig = window.highImpactJs.templateConfig || {};
    window.highImpactJs.config = window.highImpactJs.config || {};

    // Assign functions
    window.highImpactJs.defineSlot = defineSlot;
    //window.highImpactJs.closeSlot = closeSlot;
    window.highImpactJs.setTemplateConfig = setTemplateConfig;
    window.highImpactJs.setConfig = setConfig;

    // check if window.highImpactJs exist and window.highImpactJs.cmd is an array with length > 0
    if (window.highImpactJs && Array.isArray(window.highImpactJs.cmd) && window.highImpactJs.cmd.length > 0) {
      // loop through the commands
      while (window.highImpactJs.cmd.length) {
        const item = window.highImpactJs.cmd.shift();
        // check if the command is a function
        if (typeof item === 'function') {
          // call the function
          await item();
        }
      }
    }

    window.highImpactJs.cmd = cmd;

    if (!window.highImpactJs.config.plugins) {
      window.highImpactJs.config.plugins = ['gam'];
    }

    if (window.highImpactJs.config.plugins) {
      window.highImpactJs.plugins = await setupPlugins(window.highImpactJs.config.plugins);
    }

    listenToHighImpactPostMessages(onAdResponsiveSignal);
    
    resolve();
  });
};
