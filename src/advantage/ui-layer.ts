export class AdvantageUILayer extends HTMLElement {
    #root: ShadowRoot;
    #styleElem: HTMLStyleElement;
    #container: HTMLDivElement;
    #slotUIContent: HTMLSlotElement;

    constructor() {
        super();
        this.#root = this.attachShadow({ mode: "open" });
        this.#styleElem = document.createElement("style");
        this.#root.append(this.#styleElem);
        this.#container = document.createElement("div");
        this.#container.id = "container";
        // Create the first slot, this is for advantage-content
        this.#slotUIContent = document.createElement("slot");
        this.#slotUIContent.name = "advantage-ui-content";
        this.#container.appendChild(this.#slotUIContent);
        this.#root.append(this.#container);
    }

    changeContent(content: string | HTMLElement) {
        this.#slotUIContent.innerHTML = "";
        if (typeof content === "string") {
            this.#slotUIContent.innerHTML = content;
            return;
        }
        this.#slotUIContent.appendChild(content);
    }

    insertCSS(CSS: string) {
        this.#styleElem.textContent = CSS;
    }

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
