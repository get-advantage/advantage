/**
 * Collects all the iframes within a given node and its children.
 * @param node - The node to start collecting iframes from.
 * @returns An array of HTMLIFrameElement objects representing the iframes found.
 */
export const collectIframes = (node: Node): HTMLIFrameElement[] => {
    let iframes: HTMLIFrameElement[] = [];

    // If the node is an element, check if it's an iframe and then traverse its children
    if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;

        // If the element is an iframe, add it to the iframes array
        if (element.tagName === "IFRAME") {
            iframes.push(element as HTMLIFrameElement);
        }

        // Loop through all child nodes
        element.childNodes.forEach((child) => {
            iframes = iframes.concat(collectIframes(child));
        });
    }

    return iframes;
};

/**
 * Traverses the DOM tree starting from a given node and applies a function to each element node.
 * @param node - The starting node for traversal.
 * @param func - The function to be applied to each element node.
 */
export const traverseNodes = (
    node: Node,
    func: (node: HTMLElement) => void
) => {
    // If the node is an element, apply func and traverse its children
    if (node.nodeType === Node.ELEMENT_NODE) {
        func(node as HTMLElement);
        // Loop through all child nodes
        for (let child of node.childNodes) {
            traverseNodes(child, func);
        }
    }
};

/**
 * Checks if the browser supports adopting style sheets.
 */
export const supportsAdoptingStyleSheets =
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype;
