// This code moves an element into a wrapper structure
// and creates a new slot in the wrapper structure.
// The wrapper structure is inserted into the DOM before the element.
// The code also adds an attribute to the wrapper structure
// if the function is passed an array of allowed formats.
// The element is passed to the function as a selector string.
// The code is used to wrap ad slots.

export function advantageWrapAdSlotElement(
    target: HTMLElement | string,
    excludedFormats?: string[]
) {
    let element: HTMLElement | null;

    // Check if target is an HTMLElement or a selector string
    if (typeof target === "string") {
        element = document.querySelector(target);
    } else {
        element = target;
    }

    // If the element is not found, exit the function
    if (!element) {
        console.warn("Target element not found.");
        return;
    }

    // Create the wrapper structure
    const advantageWrapper = document.createElement("advantage-wrapper");

    // Add forbidden/excluded formats if provided
    if (excludedFormats && excludedFormats.length > 0) {
        const formats = excludedFormats.join(", ");
        advantageWrapper.setAttribute("exclude-formats", formats);
    }

    const slotDiv = document.createElement("div");
    slotDiv.setAttribute("slot", "advantage-ad-slot");

    // Insert the wrapper structure into the DOM
    element.parentNode?.insertBefore(advantageWrapper, element);

    // Move the target element into the wrapper structure
    advantageWrapper.appendChild(slotDiv);
    slotDiv.appendChild(element);
}
