import { sendMessageAndOpenChannel, ADVANTAGE } from "./messaging";

describe("sendMessageAndOpenChannel", () => {
    it("should send a message and open a message channel", async () => {
        // Prepare test data
        const message = { sessionID: "1234", type: ADVANTAGE }; // Include necessary properties
        const retryInterval = 100;
        const maxAttempts = 25;

        // Mock the window.postMessage method
        const mockPostMessage = jest.fn();
        const mockOnMessageHandlers: any[] = [];
        global.window = {
            top: {
                postMessage: (
                    message: any,
                    targetOrigin: any,
                    transfer: any[]
                ) => {
                    mockPostMessage(message, targetOrigin, transfer);
                    // Trigger the onmessage callback
                    transfer.forEach(() => {
                        mockOnMessageHandlers.forEach((handler) =>
                            handler({ data: message })
                        );
                    });
                }
            }
        } as any;

        // Mock the MessageChannel constructor
        class MockMessageChannel {
            port1 = {
                set onmessage(handler: any) {
                    if (handler) {
                        mockOnMessageHandlers.push(handler);
                    }
                },
                postMessage: jest.fn()
            };
            port2 = {
                set onmessage(handler: any) {
                    if (handler) {
                        mockOnMessageHandlers.push(handler);
                    }
                },
                postMessage: jest.fn()
            };
        }
        global.MessageChannel = MockMessageChannel as any;

        // Execute the function
        const resultPromise = sendMessageAndOpenChannel(
            message,
            retryInterval,
            maxAttempts
        );

        // Since this function involves retries and intervals, we need to advance timers
        jest.useFakeTimers();
        jest.advanceTimersByTime(retryInterval * maxAttempts);
        jest.useRealTimers();

        const result = await resultPromise;

        // Assert the result
        expect(result).toHaveProperty("reply");
        expect(result).toHaveProperty("messageChannel");
        expect(result.reply).toEqual(expect.any(Object));
        expect(result.messageChannel).toEqual(expect.any(MessageChannel));
        // Verify that window.postMessage was called
        expect(mockPostMessage).toHaveBeenCalled();
    });
    it("should fail to receive a reply and reject the promise", async () => {
        // Prepare test data
        const message = { sessionID: "1234", type: ADVANTAGE }; // Include necessary properties
        const retryInterval = 100;
        const maxAttempts = 25;

        // Mock the window.postMessage method
        const mockPostMessage = jest.fn();
        const mockOnMessageHandlers: any[] = [];
        global.window = {
            top: {
                postMessage: (
                    message: any,
                    targetOrigin: any,
                    transfer: any[]
                ) => {
                    mockPostMessage(message, targetOrigin, transfer);
                    // Trigger the onmessage callback
                    transfer.forEach(() => {
                        mockOnMessageHandlers.forEach((handler) =>
                            handler({ data: message })
                        );
                    });
                }
            }
        } as any;

        // Mock the MessageChannel constructor
        class MockMessageChannel {
            port1 = {
                onmessage: null, // Ensure no message is ever received
                postMessage: jest.fn()
            };
            port2 = {
                onmessage: null,
                postMessage: jest.fn()
            };
        }
        global.MessageChannel = MockMessageChannel as any;

        // Execute the function
        jest.useFakeTimers(); // Start controlling timers

        const promise = sendMessageAndOpenChannel(
            message,
            retryInterval,
            maxAttempts
        );
        // Advance timers to simulate the passage of time and retries
        jest.advanceTimersByTime(retryInterval * maxAttempts);
        jest.useRealTimers(); // Restore real timers

        // Expect the promise to reject
        await expect(promise).rejects.toThrow(
            "Max attempts reached without response"
        );

        // Advance timers to simulate the passage of time and retries
        expect(mockPostMessage).toHaveBeenCalledTimes(maxAttempts);
    });
});
