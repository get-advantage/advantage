export function setDimensionsUntilAdvantageAdSlot(
    ad?: HTMLElement,
    inclusive: boolean = true
) {
    function setDimensionsTo100Percent(
        element: HTMLElement | null,
        level: number = 0
    ) {
        if (element && element.style && typeof element.style === "object") {
            const indent = "  ".repeat(level);
            /*
            console.log(
                `${indent}🎯 SETTING DIMENSIONS: ${element.tagName}${
                    element.id ? `#${element.id}` : ""
                }${element.className ? `.${element.className}` : ""}`
            );
            console.log(
                `${indent}   Before: width=${
                    element.style.width || "auto"
                }, height=${element.style.height || "auto"}`
            );
            */

            // Use important to override any inline styles that might be set
            element.style.setProperty("height", "100%", "important");
            element.style.setProperty("width", "100%", "important");

            // Additional properties to ensure fullscreen behavior
            element.style.setProperty("min-height", "100%", "important");
            element.style.setProperty("min-width", "100%", "important");
            element.style.setProperty("max-height", "none", "important");
            element.style.setProperty("max-width", "none", "important");
            element.style.setProperty("box-sizing", "border-box", "important");
            /*
            console.log(
                `${indent}   After: width=${element.style.width}, height=${element.style.height}`
            );
            */
            // For iframes, also remove HTML width/height attributes that override CSS
            if (element.tagName === "IFRAME") {
                const hadWidth = element.hasAttribute("width");
                const hadHeight = element.hasAttribute("height");
                element.removeAttribute("width");
                element.removeAttribute("height");
                /*
                console.log(
                    `${indent}   Removed HTML attributes: width=${hadWidth}, height=${hadHeight}`
                );
                */
                // Additional iframe-specific styling
                element.style.setProperty("border", "none", "important");
                element.style.setProperty("display", "block", "important");
            }
        }
    }
    /*
    console.log(
        "🎯 START: setDimensionsUntilAdvantageAdSlot called with:",
        ad?.tagName,
        ad?.id
    );
    */
    if (ad && ad instanceof HTMLElement) {
        let parent = ad.parentElement;
        let level = 0;
        setDimensionsTo100Percent(ad, level);
        level++;

        while (parent && level < 20) {
            // Add safety limit
            /*
            console.log(
                `  ${"  ".repeat(level)}🔍 CHECKING PARENT ${level}: ${
                    parent.tagName
                }${parent.id ? `#${parent.id}` : ""}${
                    parent.slot ? ` slot="${parent.slot}"` : ""
                }`
            );
            */
            if (parent.slot === "advantage-ad-slot") {
                /*
                console.log(
                    `  ${"  ".repeat(level)}✅ FOUND advantage-ad-slot!`
                );
                */
                if (inclusive) {
                    setDimensionsTo100Percent(parent, level);
                }
                break;
            }
            setDimensionsTo100Percent(parent, level);
            parent = parent.parentElement;
            level++;
        }

        if (level >= 20) {
            /*
            console.log(
                "⚠️ SAFETY LIMIT: Stopped after 20 levels to prevent infinite loop"
            );
            */
        }
    }

    //console.log("🎯 END: setDimensionsUntilAdvantageAdSlot completed");
}

export function resetDimensionsUntilAdvantageAdSlot(
    ad?: HTMLElement,
    inclusive: boolean = true
) {
    function resetDimensions(element: HTMLElement | null) {
        if (element && element.style && typeof element.style === "object") {
            element.style.height = "";
            element.style.width = "";
        }
    }

    if (ad && ad instanceof HTMLElement) {
        // loop through the parent elements of the ad to find advantage-ad-slot
        let parent = ad.parentElement;
        resetDimensions(ad);
        while (parent) {
            if (parent.slot === "advantage-ad-slot") {
                if (inclusive) {
                    resetDimensions(parent);
                }
                break;
            }
            resetDimensions(parent);
            parent = parent.parentElement;
        }
    }
}

export function createIframe(
    src: string,
    id: string,
    className?: string,
    styles?: string
): HTMLIFrameElement {
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.id = id;
    if (className) {
        iframe.className = className;
    }
    if (styles) {
        iframe.style.cssText = styles;
    }
    iframe.setAttribute(
        "sandbox",
        "allow-scripts allow-same-origin allow-popups"
    );
    iframe.setAttribute("scrolling", "no");
    return iframe;
}
