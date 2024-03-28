export type ADVANTAGE_MESSAGE = "ADVANTAGE";

export enum AdvantageMessageAction {
    START_SESSION = "START_SESSION",
    CONFIRM_SESSION = "CONFIRM_SESSION",
    REQUEST_FORMAT = "REQUEST_FORMAT",
    FORMAT_CONFIRMED = "FORMAT_CONFIRMED",
    FORMAT_REJECTED = "FORMAT_REJECTED"
}

export enum AdvantageFormatName {
    TopScroll = "topscroll",
    DoubleMidscroll = "doublemidscroll",
    Midscroll = "midscroll"
}

export interface AdvantageChildAd {
    eventSource: MessageEventSource;
    port: MessagePort;
    ad?: HTMLElement;
}

export interface AdvantageConfig {
    configUrlResolver?: () => string;
    formats?: AdvantageFormat[];
    formatIntegrations?: AdvantageFormatIntegration[];
    messageValidator?: (message: MessageEvent) => boolean;
}

export interface IAdvantageWrapper extends HTMLElement {
    container: HTMLElement;
    content: HTMLElement;
    currentFormat: AdvantageFormatName | string | null;
    uiLayer: IAdvantageUILayer;
    applyStylesToAllChildElements: (styles: string) => void;
    insertCSS: (CSS: string) => void;
    resetCSS: () => void;
    reset: () => void;
    close: () => void;
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
    setup: (wrapper: IAdvantageWrapper, ad: HTMLElement) => Promise<void>;
    reset: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => void;
    close?: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => void;
}

export interface AdvantageFormatIntegration {
    name: AdvantageFormatName | string;
    setup: (wrapper: IAdvantageWrapper, ad: HTMLElement) => Promise<void>;
    teardown?: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => void;
    onClose?: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => void;
    onReset?: (wrapper: IAdvantageWrapper, ad?: HTMLElement) => void;
}

export interface AdvantageMessage {
    sessionID: string;
    type: ADVANTAGE_MESSAGE;
    action: AdvantageMessageAction;
    format?: AdvantageFormatName;
}
