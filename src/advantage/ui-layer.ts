/**
 * Represents the UI layer for an Advantage high-impact format.
 * This class extends the HTMLElement class and provides methods for manipulating the UI content and styles.
 * @noInheritDoc
 */
export class AdvantageUILayer extends HTMLElement {
    #root: ShadowRoot;
    #styleElem: HTMLStyleElement;
    #container: HTMLDivElement;
    #slotUIContent: HTMLSlotElement;

    /**
     * Creates an instance of AdvantageUILayer.
     * Attaches a shadow root to the element and initializes the necessary elements.
     */
    constructor() {
        super();
        this.#root = this.attachShadow({ mode: "open" });
        this.#styleElem = document.createElement("style");
        this.#root.append(this.#styleElem);
        this.#container = document.createElement("div");
        this.#container.id = "container";
        this.#slotUIContent = document.createElement("slot");
        this.#slotUIContent.name = "advantage-ui-content";
        this.#container.appendChild(this.#slotUIContent);
        this.#root.append(this.#container);
    }

    /**
     * Changes the content of the UI layer.
     * @param content - The new content to be displayed. It can be either a string or an HTMLElement.
     */
    changeContent(content: string | HTMLElement) {
        this.#slotUIContent.innerHTML = "";
        if (typeof content === "string") {
            this.#slotUIContent.innerHTML = content;
            return;
        }
        this.#slotUIContent.appendChild(content);
    }

    /**
     * Inserts CSS styles into the UI layer.
     * @param CSS - The CSS styles to be inserted.
     */
    insertCSS(CSS: string) {
        this.#styleElem.textContent = CSS;
    }

    /**
     * Queries the slotted elements that match the specified selector.
     * @param selector - The CSS selector to match against the slotted elements.
     * @returns An array of matching elements.
     */
    querySlottedElements(selector: string) {
        // Get all nodes assigned to the slot
        const assignedNodes = this.#slotUIContent.assignedNodes({
            flatten: true
        });
        const matchingElements: Node[] = [];
        // Iterate through each assigned node
        assignedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                // If the node itself matches the selector, add it to the results
                if (
                    (node as Element).matches &&
                    (node as Element).matches(selector)
                ) {
                    matchingElements.push(node);
                }
                // Additionally, search within the node for matching elements
                matchingElements.push(
                    ...(node as Element).querySelectorAll(selector)
                );
            }
        });

        return matchingElements;
    }
}
