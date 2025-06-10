import { sendMessageAndOpenChannel, ADVANTAGE } from "./messaging";

describe("sendMessageAndOpenChannel", () => {
    let messageChannelHandlers: ((event: any) => void)[] = [];

    beforeEach(() => {
        messageChannelHandlers = [];

        // Create a more complete window mock
        const mockDocument = {
            querySelector: jest.fn().mockReturnValue(null)
        };

        const mockLocation = {
            ancestorOrigins: [],
            origin: "http://localhost"
        };

        // Create the top window that will receive the postMessage
        const mockTopWindow = {
            document: mockDocument,
            location: mockLocation,
            ucTagData: undefined,
            parent: null as any,
            top: null as any,
            postMessage: jest.fn() // This will be spied on in individual tests
        };

        // Set up circular references for top window
        mockTopWindow.parent = mockTopWindow;
        mockTopWindow.top = mockTopWindow;

        // Create current window that references the top window
        const mockCurrentWindow = {
            document: mockDocument,
            location: mockLocation,
            ucTagData: undefined,
            parent: mockTopWindow,
            top: mockTopWindow,
            postMessage: jest.fn()
        };

        // Ensure that `window` and `window.top` are properly set up
        global.window = mockCurrentWindow as any;

        // This is crucial - the function calls window.top?.postMessage() directly
        // So we need to ensure window.top points to our mocked top window
        (global.window as any).top = mockTopWindow;

        // Mock the MessageChannel constructor - new instance created for each attempt
        class MockMessageChannel {
            port1 = {
                set onmessage(handler: any) {
                    if (handler) {
                        messageChannelHandlers.push(handler);
                    }
                },
                postMessage: jest.fn()
            };
            port2 = {
                set onmessage(_handler: any) {
                    // Port2 is transferred, so we don't need to track its handler
                },
                postMessage: jest.fn()
            };
        }
        global.MessageChannel = MockMessageChannel as any;
    });

    it("should send a message and open a message channel", async () => {
        // Prepare test data
        const message = { sessionID: "1234", type: ADVANTAGE };
        const retryInterval = 100;
        const maxAttempts = 25;

        // Create a spy on window.top.postMessage to capture the actual call
        const postMessageSpy = jest.spyOn(global.window.top!, "postMessage");

        // Execute the function
        const resultPromise = sendMessageAndOpenChannel(
            message,
            retryInterval,
            maxAttempts
        );

        // Wait a bit for the first message to be sent
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Verify postMessage was called
        expect(postMessageSpy).toHaveBeenCalledTimes(1);
        expect(postMessageSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                sessionID: "1234",
                type: ADVANTAGE,
                origins: ["http://localhost"]
            }),
            "*",
            expect.any(Array)
        );

        // Clean up
        postMessageSpy.mockRestore();

        // Simulate receiving a response on the first channel created
        if (messageChannelHandlers.length > 0) {
            messageChannelHandlers[0]({
                data: {
                    type: ADVANTAGE,
                    sessionID: "1234"
                }
            });
        }

        const result = await resultPromise;

        // Assert the result
        expect(result).toHaveProperty("reply");
        expect(result).toHaveProperty("messageChannel");
        expect(result.reply).toEqual(
            expect.objectContaining({
                type: ADVANTAGE,
                sessionID: "1234"
            })
        );
        expect(result.messageChannel).toEqual(expect.any(Object));
    });

    it("should fail to receive a reply and reject the promise", async () => {
        // Prepare test data
        const message = { sessionID: "5678", type: ADVANTAGE };
        const retryInterval = 50;
        const maxAttempts = 3;

        // Create a spy on window.top.postMessage to capture the actual call
        const postMessageSpy = jest.spyOn(global.window.top!, "postMessage");

        jest.useFakeTimers();

        // Execute the function
        const promise = sendMessageAndOpenChannel(
            message,
            retryInterval,
            maxAttempts
        );

        // Advance timers to simulate the passage of time and retries
        // The function sends immediately, then retries after each interval
        jest.advanceTimersByTime(retryInterval * (maxAttempts - 1) + 100);

        jest.useRealTimers();

        // Expect the promise to reject
        await expect(promise).rejects.toThrow(
            "Max attempts reached without response"
        );

        // Verify postMessage was called the expected number of times (initial + retries)
        expect(postMessageSpy).toHaveBeenCalledTimes(maxAttempts);

        // Clean up
        postMessageSpy.mockRestore();
    });
});
