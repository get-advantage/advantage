/**
 * Moves an element into a wrapper structure and creates a new slot in the wrapper structure.
 * The wrapper structure is inserted into the DOM before the element.
 * If the function is passed an array of formats that should not be allowed for this wrapper, it adds an attribute to the wrapper structure.
 * If the function is passed an array of formats that should be allowed for this wrapper, it adds an attribute to the wrapper structure.
 * @param target - The target element or selector string.
 * @param excludedFormats - An optional array of excluded formats.
 * @param allowedFormats - An optional array of allowed formats.
 */
export function advantageWrapAdSlotElement(
    target: HTMLElement | string,
    excludedFormats?: string[],
    allowedFormats?: string[]
) {
    let element: HTMLElement | null;

    // Check if target is an HTMLElement or a selector string
    if (typeof target === "string") {
        element = document.querySelector(target);
    } else {
        element = target;
    }

    // If the element is not found, retry with a deferred approach
    if (!element) {
        // If target is a string selector, retry after DOM is ready and with a short delay
        if (typeof target === "string") {
            const retry = () => {
                const found = document.querySelector(target) as HTMLElement;
                if (found) {
                    advantageWrapAdSlotElement(
                        found,
                        excludedFormats,
                        allowedFormats
                    );
                } else {
                    console.warn("Target element not found:", target);
                }
            };
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", retry, {
                    once: true
                });
            } else {
                // DOM is loaded but element may not be rendered yet (e.g. React/SPA)
                setTimeout(retry, 100);
            }
        } else {
            console.warn("Target element not found.");
        }
        return;
    }

    // Create the wrapper structure
    const advantageWrapper = document.createElement("advantage-wrapper");

    // Add forbidden/excluded formats if provided
    if (excludedFormats && excludedFormats.length > 0) {
        const formats = excludedFormats.join(", ");
        advantageWrapper.setAttribute("exclude-formats", formats);
    }

    // Add allowed formats if provided
    if (allowedFormats && allowedFormats.length > 0) {
        const formats = allowedFormats.join(", ");
        advantageWrapper.setAttribute("allowed-formats", formats);
    }

    const slotDiv = document.createElement("div");
    slotDiv.setAttribute("slot", "advantage-ad-slot");

    // Insert the wrapper structure into the DOM
    element.parentNode?.insertBefore(advantageWrapper, element);

    // Move the target element into the wrapper structure
    advantageWrapper.appendChild(slotDiv);
    slotDiv.appendChild(element);
}
