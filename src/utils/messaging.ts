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

    const getTargetWindow = (currentWindow: Window = window) => {
        let targetWindow: Window = currentWindow;
        try {
            while (currentWindow !== window.top && currentWindow.document) {
                targetWindow = currentWindow;
                currentWindow = currentWindow.parent;
            }
        } catch (error) {
            return targetWindow;
        }
        return targetWindow;
    };

    const createMessageContext = (
        targetWindow: Window,
        message: Partial<AdvantageMessage>
    ) => {
        const avic = targetWindow.document
            .querySelector("[id^=avic_]")
            ?.id.replace("avic_", "");
        const qemid =
            targetWindow.document.querySelector<HTMLElement>(
                "[data-jcp-qem-id]"
            )?.dataset.jcpQemId;
        const targetingMap = targetWindow.ucTagData?.targetingMap;
        const origins = Array.from([
            ...(targetWindow.location.ancestorOrigins || []),
            targetWindow.location.origin
        ]);
        const backgroundAdURL = location.href;

        return {
            ...message,
            gqid: avic || qemid,
            targetingMap: targetingMap,
            origins: origins,
            backgroundAdURL: backgroundAdURL
        };
    };

    return new Promise((resolve, reject) => {
        // Define a function that we'll call to send the message
        const sendMessage = (messageWithContext: Partial<AdvantageMessage>) => {
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

            window.top?.postMessage(messageWithContext, "*", [channel.port2]);
        };

        // try to find direct child window under top window
        const targetWindow = getTargetWindow();
        const messageWithContext = createMessageContext(targetWindow, message);

        // Send the first message
        sendMessage(messageWithContext);

        // Set up the retry interval
        const retryIntervalRef = setInterval(() => {
            if (attempts < maxAttempts && !replyReceived) {
                sendMessage(messageWithContext);
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
