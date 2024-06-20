import { AdvantageMessage, ADVANTAGE_MESSAGE } from "../types";

export const ADVANTAGE = "ADVANTAGE" as ADVANTAGE_MESSAGE;

/**
 * Sends a message and opens a message channel to receive the reply.
 * @param message - The message to send.
 * @param retryInterval - The interval (in milliseconds) between retry attempts. Default is 100ms.
 * @param maxAttempts - The maximum number of retry attempts. Default is 25.
 * @returns A promise that resolves with the reply and the message channel.
 */
export function sendMessageAndOpenChannel(
    message: Partial<AdvantageMessage>,
    retryInterval: number = 200,
    maxAttempts: number = 25
): Promise<{ reply: AdvantageMessage; messageChannel: MessageChannel }> {
    let attempts = 0;
    let replyReceived = false;

    return new Promise((resolve, reject) => {
        // Define a function that we'll call to send the message
        const sendMessage = () => {
            attempts++;
            // Create a new MessageChannel for each attempt
            const channel = new MessageChannel();

            // Define the response listener
            channel.port1.onmessage = (event: MessageEvent) => {
                // Check if this is the response we're waiting for
                if (
                    event.data.type === ADVANTAGE &&
                    event.data.sessionID === message.sessionID
                ) {
                    replyReceived = true;

                    resolve({
                        reply: event.data as AdvantageMessage,
                        messageChannel: channel
                    });
                }
            };

            // Send the message up through each parent window until the top is reached
            let currentWindow: Window & typeof globalThis =
                window.parent as Window & typeof globalThis;
            do {
                currentWindow.postMessage(message, "*", [channel.port2]);
                currentWindow = currentWindow.parent as Window &
                    typeof globalThis;
            } while (currentWindow !== window.top);
        };

        // Send the first message
        sendMessage();

        // Set up the retry interval
        const retryIntervalRef = setInterval(() => {
            if (attempts < maxAttempts && !replyReceived) {
                sendMessage();
            } else {
                // Clean up and reject promise
                clearInterval(retryIntervalRef);
                if (!replyReceived) {
                    reject(new Error("Max attempts reached without response"));
                }
            }
        }, retryInterval);
    });
}

/**
 * Sends a message and awaits a response.
 *
 * @param message - The message to send.
 * @param messageChannel - The message channel to use for communication.
 * @param timeout - The timeout in milliseconds.
 * @returns A promise that resolves with the response message.
 */
export function sendMessageAndAwaitResponse(
    message: Partial<AdvantageMessage>,
    messageChannel: MessageChannel,
    timeout: number
): Promise<AdvantageMessage> {
    return new Promise((resolve, reject) => {
        const timeoutID = setTimeout(() => {
            reject(new Error("Timeout reached without response"));
        }, timeout);

        const responseListener = (event: MessageEvent) => {
            if (
                event.data.type === ADVANTAGE &&
                event.data.sessionID === message.sessionID
            ) {
                clearTimeout(timeoutID);
                messageChannel.port1.removeEventListener(
                    "message",
                    responseListener
                );
                resolve(event.data as AdvantageMessage);
            }
        };

        messageChannel.port1.onmessage = responseListener;
        messageChannel.port1.postMessage(message);
    });
}
