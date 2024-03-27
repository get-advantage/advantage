// TODO: Implement logging with different levels
let isDebugMode = true;

export function debugLog(...messages: any[]) {
    if (isDebugMode) {
        console.log("ADVANTAGE DEBUG:", ...messages);
        console.trace("Stack trace");
    }
}

export function infoLog(...messages: any[]) {
    if (isDebugMode) {
        console.info("🤠 ADVANTAGE: ", ...messages);
    }
}

export function warnLog(...messages: string[]) {
    if (isDebugMode) {
        console.warn("⚠️ ADVANTAGE WARNING:", ...messages);
    }
}

export function errorLog(...messages: any[]) {
    console.error("ADVANTAGE ERROR:", ...messages);
    console.trace("Stack trace");
}

export const logger = {
    debug: debugLog,
    info: infoLog,
    warn: warnLog,
    error: errorLog
};
