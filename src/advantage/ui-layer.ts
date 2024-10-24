/**
 * Represents the UI layer for an Advantage high-impact format.
 * This class extends the HTMLElement class and provides methods for manipulating the UI content and styles.
 * @noInheritDoc
 */
export class AdvantageUILayer extends HTMLElement {
    #root: ShadowRoot;
    #styleSheet: CSSStyleSheet | HTMLStyleElement;
    #container: HTMLDivElement;
    #content: HTMLDivElement;
    slotName = "advantage-ui-content";
    /**
     * Creates an instance of AdvantageUILayer.
     * Attaches a shadow root to the element and initializes the necessary elements.
     */
    constructor() {
        super();
        if (document.adoptedStyleSheets != undefined) {
            this.#styleSheet = new CSSStyleSheet();
        } else {
            this.#styleSheet = document.createElement(
                "style"
            ) as HTMLStyleElement;
        }
        this.#root = this.attachShadow({ mode: "open" });
        if (document.adoptedStyleSheets != undefined) {
            this.#root.adoptedStyleSheets = [this.#styleSheet as CSSStyleSheet];
        } else {
            this.#root.appendChild(this.#styleSheet as HTMLStyleElement);
        }
        this.#container = document.createElement("div");
        this.#container.id = "container";
        this.#content = document.createElement("div");
        this.#content.id = "content";
        this.#container.appendChild(this.#content);
        this.#root.append(this.#container);
    }

    /**
     * Changes the content of the UI layer.
     * @param content - The new content to be displayed. It can be either a string or an HTMLElement.
     */
    changeContent(content: string | HTMLElement) {
        if (typeof content === "string") {
            this.#content.innerHTML = content;
        } else {
            this.#content.innerHTML = "";
            this.#content.appendChild(content);
        }
    }

    /**
     * Inserts CSS styles into the UI layer.
     * @param CSS - The CSS styles to be inserted.
     */
    insertCSS(CSS: string) {
        if (document.adoptedStyleSheets != undefined) {
            (this.#styleSheet as CSSStyleSheet).replaceSync(CSS);
        } else {
            (this.#styleSheet as HTMLStyleElement).textContent = CSS;
        }
    }
}
