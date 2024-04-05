import { AdvantageMessage, ADVANTAGE_MESSAGE } from "../types";

export const ADVANTAGE = "ADVANTAGE" as ADVANTAGE_MESSAGE;

export function sendMessageAndOpenChannel(
    message: Partial<AdvantageMessage>,
    retryInterval: number = 100,
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

            // Post the message
            window.top?.postMessage(message, "*", [channel.port2]);
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
