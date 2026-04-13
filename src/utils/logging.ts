type LogLevel = "log" | "info" | "error";

class Logger {
    private debugMode: boolean;
    private style: string =
        "color: #f3f1ff; font-weight: bold; background-color: #6b04fd; padding: 2px; border-radius: 2px;";

    constructor() {
        this.debugMode =
            new URLSearchParams(window.location.search).has("adv_debug") ||
            new URLSearchParams(window.location.search).has("debugHighImpact");
    }

    private formatMessage(level: LogLevel): string {
        const timestamp = new Date().toISOString();
        return `${timestamp} [${level.toUpperCase()}] %cADVANTAGE`;
    }

    private log(level: LogLevel, message: any, ...optionalParams: any) {
        if (this.debugMode) {
            console[level](
                this.formatMessage(level),
                this.style,
                `- ${message}`,
                ...optionalParams
            );
            if (level === "error") {
                console.trace();
            }
        }
    }

    debug(message: any, ...optionalParams: any) {
        this.log("log", message, ...optionalParams);
    }

    info(message: any, ...optionalParams: any) {
        this.log("info", message, ...optionalParams);
    }

    error(message: any, ...optionalParams: any) {
        this.log("error", message, ...optionalParams);
    }

    /**
     * Enables debug mode for logging.
     */
    enableDebugMode() {
        this.debugMode = true;
    }
}

const logger = new Logger();
export default logger;
