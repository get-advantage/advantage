import {
    sendMessageAndOpenChannel,
    sendMessageAndAwaitResponse
} from "../../utils/messaging";
import {
    AdvantageMessage,
    AdvantageMessageAction,
    AdvantageFormatName
} from "../../types";
export { AdvantageMessageAction, AdvantageFormatName };
import logger from "../../utils/logging";

/**
 * AdvantageCreativeMessenger is the class that should be used in creative ads to communicate with Advantage on the publisher side. This class is used to request formats and other information from the parent website.
 * @public
 *
 * @example
 * Here's an example on how to request a format from the parent website and then start the ad when the format is confirmed:
 *
 * ::: code-group
 * ```typescript
 * const advantageMessenger = new AdvantageCreativeMessenger();
 * const session = await advantageMessenger.startSession();
 *
 * if (session) {
 *  // Request the midscroll format
 *  const response = await advantageMessenger.sendMessage({
 *      action: AdvantageMessageAction.REQUEST_FORMAT,
 *      format: AdvantageFormatName.Midscroll
 *  });
 *  // The format is confirmed, start the ad
 *  if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
 *      document.body.classList.add("midscroll");
 *  }
 * } else {
 *      console.log("Session failed to start");
 * }
 * ```
 * ```javascript
 * const advantageMessenger = new AdvantageCreativeMessenger();
 * advantageMessenger.startSession().then((confirmed) => {
 *  if (confirmed) {
 *      advantageMessenger.sendMessage({
 *          action: "REQUEST_FORMAT",
 *          format: "MIDSCROLL"
 *      }).then((response) => {
 *          if (response.action === "FORMAT_CONFIRMED") {
 *              // The format is confirmed, start the ad
 *              document.body.classList.add("midscroll");
 *          }
 *      });
 *  } else {
 *     console.log("Session failed to start");
 *  }
 * });
 * ```
 */
export class AdvantageCreativeMessenger {
    #messageChannel: MessageChannel | null = null;
    #sessionID: string;
    #validSession = false;
    #broadcastChannel: BroadcastChannel | null = null;

    constructor() {
        // check if its a sessionId in the URL, if not create a new one
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get("sessionId");
        if (sessionId) {
            this.#sessionID = sessionId;
            this.#validSession = true;
        } else {
            // Create a new session ID
            // This is a random string that will be used to identify the session
            this.#sessionID = Math.random().toString(36).substring(2, 15);
        }
    }

    async startSession(): Promise<boolean> {
        try {
            const { messageChannel, reply } = await sendMessageAndOpenChannel({
                type: "ADVANTAGE",
                action: AdvantageMessageAction.START_SESSION,
                sessionID: this.#sessionID
            });
            this.#messageChannel = messageChannel;
            this.#validSession =
                reply.action === AdvantageMessageAction.CONFIRM_SESSION;
            return this.#validSession;
        } catch (e) {
            this.#validSession = false;
            return false;
        }
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
            logger.error("Error sending message", e);
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

    setupWaypoints(waypoints: HTMLElement[]): { disconnect: () => void } {
        if (!this.#validSession) {
            throw new Error("There is no valid session to send messages to.");
        }

        this.#broadcastChannel = new BroadcastChannel(this.#sessionID);

        // Setup Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const waypointId = (entry.target as HTMLElement).dataset.id;
                const isIntersecting = entry.isIntersecting;

                // Broadcast waypoint status
                this.#broadcastChannel!.postMessage({
                    type: "waypoint",
                    waypointId,
                    isIntersecting
                });
            });
        });

        // Observe each waypoint
        waypoints.forEach((waypoint) => observer.observe(waypoint));

        return {
            disconnect: () => {
                observer.disconnect();
                this.#broadcastChannel!.close();
            }
        };
    }

    listenToWaypoints(
        onWaypointTrigger: (waypointId: string, isIntersecting: boolean) => void
    ): { disconnect: () => void } {
        if (!this.#validSession) {
            throw new Error("No valid session available.");
        }

        // Create a new BroadcastChannel for this context
        this.#broadcastChannel = new BroadcastChannel(this.#sessionID);

        const listener = (event: MessageEvent) => {
            const { waypointId, isIntersecting } = event.data;
            if (waypointId !== undefined && isIntersecting !== undefined) {
                onWaypointTrigger(waypointId, isIntersecting);
            }
        };

        //this.#broadcastChannel.onmessage = listener;
        this.#broadcastChannel.addEventListener("message", (event) => {
            listener(event);
        });

        return {
            disconnect: () => this.#broadcastChannel!.close()
        };
    }
}
