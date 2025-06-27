import { Advantage } from "@src/advantage";
import localConfig from "./config";

/* 
This example demonstrates the High Impact JS compatibility layer.
It allows existing High Impact JS code to work seamlessly with Advantage.
*/

// Extend Window interface for High Impact JS
declare global {
    interface Window {
        highImpactJs: any;
        googletag: any;
    }
}

const advantage = Advantage.getInstance();

// Configure Advantage with compatibility layer enabled
advantage.configure(localConfig);

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
    console.log(
        "[High Impact Compatibility Demo] DOM ready, initializing High Impact JS code..."
    );

    // This is existing High Impact JS code that should work without modification
    (window as any).highImpactJs = (window as any).highImpactJs || { cmd: [] };

    (window as any).highImpactJs.cmd.push(function () {
        console.log(
            "[High Impact Compatibility Demo] Configuring High Impact JS..."
        );

        // Set global configuration (exactly as in original High Impact JS)
        (window as any).highImpactJs.setConfig({
            plugins: ["gam"], // Use GAM plugin
            debug: true,
            topBarHeight: 50
        });

        // Configure templates (exactly as in original High Impact JS)
        (window as any).highImpactJs.setTemplateConfig("topscroll", {
            showCloseButton: true,
            peekAmount: "80vh",
            title: "Continue reading",
            fadeOnScroll: true
        });

        (window as any).highImpactJs.setTemplateConfig("midscroll", {
            zIndex: 1000
        });

        // Define ad slots (exactly as in original High Impact JS)
        (window as any).highImpactJs.defineSlot({
            template: "topscroll",
            adUnitId: "/123456/topscroll-ad",
            sizes: [
                [970, 250],
                [728, 90]
            ],
            waitForAdSignal: false
        });

        (window as any).highImpactJs.defineSlot({
            template: "midscroll",
            adUnitId: "/123456/midscroll-ad",
            sizes: [
                [300, 250],
                [320, 50]
            ]
        });

        console.log(
            "[High Impact Compatibility Demo] High Impact JS configuration complete"
        );
    });

    // Listen for High Impact JS events
    window.addEventListener("high-impact-ad-rendered", (event: Event) => {
        const customEvent = event as CustomEvent;
        console.log(
            "[High Impact Compatibility Demo] High Impact Ad Rendered:",
            customEvent.detail
        );

        // Update debug panel
        const debugContent = document.getElementById("debug-content");
        if (debugContent) {
            const timestamp = new Date().toLocaleTimeString();
            debugContent.innerHTML += `<p class="text-green-400">[${timestamp}] Ad rendered: ${customEvent.detail.template} -> ${customEvent.detail.advantageFormat}</p>`;
        }
    });

    // Simulate GAM ad rendering
    setTimeout(() => {
        console.log(
            "[High Impact Compatibility Demo] Simulating GAM ad slot rendering..."
        );

        // Simulate GAM rendering the topscroll ad
        if ((window as any).googletag && (window as any).googletag.pubads) {
            const pubads = (window as any).googletag.pubads();
            if (pubads.addEventListener) {
                // Get the event listeners
                const listeners =
                    pubads._eventListeners?.["slotRenderEnded"] || [];

                // Simulate topscroll ad rendering
                listeners.forEach((callback: any) => {
                    callback({
                        isEmpty: false,
                        slot: {
                            getSlotElementId: () => "/123456/topscroll-ad",
                            getHtml: () => "<div>Topscroll Ad Content</div>",
                            size: [970, 250]
                        },
                        size: [970, 250]
                    });
                });

                // Simulate midscroll ad rendering after delay
                setTimeout(() => {
                    listeners.forEach((callback: any) => {
                        callback({
                            isEmpty: false,
                            slot: {
                                getSlotElementId: () => "/123456/midscroll-ad",
                                getHtml: () =>
                                    "<div>Midscroll Ad Content</div>",
                                size: [300, 250]
                            },
                            size: [300, 250]
                        });
                    });
                }, 2000);
            }
        }
    }, 1000);
});

// Mock GAM (Google Ad Manager) for the demo
if (typeof window !== "undefined") {
    (window as any).googletag = (window as any).googletag || { cmd: [] };
    (window as any).googletag.cmd.push(function () {
        // Mock pubads with event listener storage
        const eventListeners: Record<string, any[]> = {};

        (window as any).googletag.pubads = function () {
            return {
                addEventListener: function (event: string, callback: any) {
                    console.log("[Mock GAM] addEventListener:", event);

                    if (!eventListeners[event]) {
                        eventListeners[event] = [];
                    }
                    eventListeners[event].push(callback);
                },
                getSlots: () => [],
                getSlotIdMap: () => ({}),
                _eventListeners: eventListeners // For demo purposes
            };
        };
    });
}
