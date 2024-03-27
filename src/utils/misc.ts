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
