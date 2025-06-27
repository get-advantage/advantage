import { log } from './debug.js';

// Function to safely add template style
export const addTemplateStyle = (templateName, styleContent) => {
  // First, look for the shared style tag
  let styleElement = document.head.querySelector('style#style-high-impact-js-templates');

  // Create it if it doesn't exist
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'style-high-impact-js-templates';
    document.head.appendChild(styleElement);
  }

  // Check if this template's style are already present
  const hastemplateStyle = Array.from(styleElement.sheet?.cssRules || []).some(
    (rule) => rule.selectorText && rule.selectorText.includes(templateName)
  );

  // Only add style if they don't already exist
  if (!hastemplateStyle) {
    // Use a try-catch block to handle any potential errors
    try {
      // Append the new style using textContent
      styleElement.textContent += styleContent;
      return true;
    } catch (error) {
      log(`Failed to add style for ${templateName}:`, error);
    }
  }

  return true;
};

export const removeTemplateStyle = (templateName) => {
  let styleElement = document.head.querySelector('style#style-high-impact-js-templates');

  if (styleElement) {
    const rules = Array.from(styleElement.sheet?.cssRules || []);

    rules.forEach((rule, i) => {
      if (rules[i].selectorText && rules[i].selectorText.includes(templateName)) {
        styleElement.sheet.deleteRule(i);
        return true;
      }
    });
  }
}
