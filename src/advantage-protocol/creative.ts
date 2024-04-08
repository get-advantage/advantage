import {
    sendMessageAndOpenChannel,
    sendMessageAndAwaitResponse
} from "../utils/messaging";
import { AdvantageMessage, AdvantageMessageAction } from "../types";

export class AdvantageProtocol {
    #messageChannel: MessageChannel | null = null;
    #sessionID: string;
    #validSession = false;

    constructor() {
        this.#sessionID = Math.random().toString(36).substring(2, 15);
    }

    async startSession(): Promise<boolean> {
        const { messageChannel, reply } = await sendMessageAndOpenChannel({
            type: "ADVANTAGE",
            action: AdvantageMessageAction.START_SESSION,
            sessionID: this.#sessionID
        });
        this.#messageChannel = messageChannel;
        this.#validSession =
            reply.action === AdvantageMessageAction.CONFIRM_SESSION;
        return this.#validSession;
    }

    async sendMessage(message: Partial<AdvantageMessage>) {
        if (!this.#validSession || !this.#messageChannel) {
            throw new Error("There is no valid session to send messages to.");
        }
        try {
            const response = await sendMessageAndAwaitResponse(
                {
                    ...message,
                    sessionID: this.#sessionID,
                    type: "ADVANTAGE"
                },
                this.#messageChannel,
                1000
            );

            return response;
        } catch (e) {
            console.error("Error sending message", e);
        }
    }

    onMessage(callback: (message: AdvantageMessage) => void) {
        if (!this.#messageChannel) {
            throw new Error("No message port available");
        }
        this.#messageChannel.port1.addEventListener(
            "message",
            (event: MessageEvent) => {
                callback(event.data as AdvantageMessage);
            }
        );
    }
}
