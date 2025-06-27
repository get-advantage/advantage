async function initHighImpactJsMessageTopscroll() {
    console.log("Topscroll with original High Impact JS message script loaded");

    // Show the ad
    window.document.body.style.opacity = "1";

    // Wait a bit for the ad to be visible
    setTimeout(() => {
        // Send the original High Impact JS message format
        const message: any = {
            sender: "high-impact-js",
            action: "AD_RENDERED",
            origins: [] as string[],
            qemId: null,
            iframeName: null
        };

        // Try to get iframe name
        try {
            message.iframeName = (window.frameElement as any)?.name;
        } catch (_) {}

        // Try to get origins
        try {
            message.origins = Array.from([
                ...(location as any).ancestorOrigins,
                window.location.origin
            ]);
        } catch (_) {}

        console.log("Sending original High Impact JS message:", message);

        // Send as JSON string (original format)
        window.top?.postMessage(JSON.stringify(message), "*");
    }, 2000); // Wait 2 seconds before sending message
}

initHighImpactJsMessageTopscroll();
