export type ADVANTAGE_MESSAGE = "ADVANTAGE";

export enum AdvantageMessageAction {
    START_SESSION = "START_SESSION",
    CONFIRM_SESSION = "CONFIRM_SESSION",
    REQUEST_FORMAT = "REQUEST_FORMAT",
    FORMAT_CONFIRMED = "FORMAT_CONFIRMED",
    FORMAT_REJECTED = "FORMAT_REJECTED"
}

export enum AdvantageFormatName {
    TopScroll = "TOPSCROLL",
    DoubleMidscroll = "DOUBLE_MIDSCROLL",
    Midscroll = "MIDSCROLL",
    WelcomePage = "WELCOME_PAGE"
}

export interface AdvantageAd {
    eventSource: MessageEventSource;
    port: MessagePort;
    iframe?: HTMLElement;
}

export interface AdvantageConfig {
    configUrlResolver?: () => string;
    formats?: AdvantageFormat[];
    formatIntegrations?: AdvantageFormatIntegration[];
    messageValidator?: (
        parentElement: HTMLElement | IAdvantageWrapper,
        message: MessageEvent<any>
    ) => boolean;
}

export interface IAdvantageWrapper extends HTMLElement {
    container: HTMLElement;
    content: HTMLElement;
    currentFormat?: AdvantageFormatName | string;
    uiLayer: IAdvantageUILayer;
    contentNodes: Node[];
    allowedFormats: string[] | null;
    morphIntoFormat: (
        format: AdvantageFormatName | string,
        message?: AdvantageMessage
    ) => Promise<void>;
    forceFormat: (
        format: AdvantageFormatName | string,
        iframe?: HTMLIFrameElement,
        options?: any
    ) => Promise<void>;
    applyStylesToAllChildElements: (styles: string) => void;
    insertCSS: (CSS: string) => void;
    resetCSS: () => void;
    reset: () => void;
    close: () => void;
    changeContent: (content: string | HTMLElement) => void;
    simulateFormat: (format: AdvantageFormatName | string) => Promise<void>;
    animateClose: () => void;
    setAllowedFormats: (formats: string[]) => void;
    clearAllowedFormats: () => void;
}

export interface IAdvantageUILayer extends HTMLElement {
    changeContent: (content: string | HTMLElement) => void;
    insertCSS: (CSS: string) => void;
    getSlottedElement: (selector: string) => HTMLElement | null;
    getAllSlottedElements: (selector: string) => HTMLElement[];
    querySlottedElements: (selector: string) => HTMLElement[];
}

export interface AdvantageFormat {
    name: AdvantageFormatName | string;
    description: string;
    setup: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLElement,
        options?: AdvantageFormatOptions
    ) => Promise<void>;
    reset: (wrapper: IAdvantageWrapper, adIframe?: HTMLElement) => void;
    close?: (wrapper: IAdvantageWrapper, adIframe?: HTMLElement) => void;
    simulate?: (wrapper: IAdvantageWrapper) => void;
}

export interface AdvantageFormatOptions {
    closeButton?: boolean;
    closeButtonText?: string;
    closeButtonAnimationDuration?: number;
    downArrow?: boolean;
    height?: number;
    sessionID?: string;
    /**
     * The duration in seconds before the format closes automatically.
     * If set to 0, the format will not close automatically.
     *
     * @type {number}
     * @defult 12
     */
    autoCloseDuration?: number;
    /**
     * You can customize this item to replace the default site title.
     * When set to `false`, title will be hidden. Useful when you have customize `continueToLabel`.
     *
     * @type {(string | boolean)}
     * @default window.location.hostname
     */
    siteTitle?: string | boolean;
    /**
     * Logo file to display in Welcome page header bar, right before the `continueToLabel`. Accepts a path string to the image.
     * If not set, current sites favicon will be displayed.
     * If set to `false`, logo will be hidden.
     *
     * @type {string | boolean}
     * @default https://icons.duckduckgo.com/ip3/[hostname].ico
     */
    logo?: string;
    scrollBackToTop?: boolean;
    adLabel?: string;
    /**
     * Can be used to customize the label of the continue to site
     * @defaul Continue to */
    continueToLabel?: string;
    /**
     * URL to the background ad. Only used in the Double Midscroll format.
     * This is set from the foreground ad.
     */
    backgroundAdURL?: string;
    allowedOrigins?: string[];
    dangerouslyAllowAllOrigins?: boolean;
}

export interface AdvantageFormatIntegration {
    format: AdvantageFormatName | string;
    options?: AdvantageFormatOptions;
    setup: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLIFrameElement | HTMLElement
    ) => Promise<void>;
    teardown?: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLIFrameElement | HTMLElement
    ) => void;
    close?: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLIFrameElement | HTMLElement
    ) => void;
    reset?: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLIFrameElement | HTMLElement
    ) => void;
    /** @deprecated use close */
    onClose?: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLIFrameElement | HTMLElement
    ) => void;
    /** @deprecated use reset */
    onReset?: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLIFrameElement | HTMLElement
    ) => void;
}

export interface AdvantageMessage {
    sessionID: string;
    type: ADVANTAGE_MESSAGE;
    action: AdvantageMessageAction;
    format?: AdvantageFormatName;
    origins?: string[];
    gqid?: string;
    targetingMap?: { [key: string]: string[] };
    backgroundAdURL?: string;
}
