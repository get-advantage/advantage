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
    Midscroll = "MIDSCROLL"
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
    currentFormat: AdvantageFormatName | string | null;
    uiLayer: IAdvantageUILayer;
    contentNodes: Node[];
    morphIntoFormat: (format: AdvantageFormatName | string) => Promise<void>;
    applyStylesToAllChildElements: (styles: string) => void;
    insertCSS: (CSS: string) => void;
    resetCSS: () => void;
    reset: () => void;
    close: () => void;
    changeContent: (content: string | HTMLElement) => void;
    simulateFormat: (format: AdvantageFormatName | string) => Promise<void>;
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
        adIframe?: HTMLElement
    ) => Promise<void>;
    reset: (wrapper: IAdvantageWrapper, adIframe?: HTMLElement) => void;
    close?: (wrapper: IAdvantageWrapper, adIframe?: HTMLElement) => void;
    simulate?: (wrapper: IAdvantageWrapper) => void;
}

export interface AdvantageFormatIntegration {
    format: AdvantageFormatName | string;
    setup: (
        wrapper: IAdvantageWrapper,
        adIframe?: HTMLElement
    ) => Promise<void>;
    teardown?: (wrapper: IAdvantageWrapper, adIframe?: HTMLElement) => void;
    onClose?: (wrapper: IAdvantageWrapper, adIframe?: HTMLElement) => void;
    onReset?: (wrapper: IAdvantageWrapper, adIframe?: HTMLElement) => void;
}

export interface AdvantageMessage {
    sessionID: string;
    type: ADVANTAGE_MESSAGE;
    action: AdvantageMessageAction;
    format?: AdvantageFormatName;
}
