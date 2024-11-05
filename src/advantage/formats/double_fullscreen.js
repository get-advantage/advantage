const FORMAT = "doublefullscreen";
const CREATIVE_BASE_URL = "https://delivered-by-madington.com";

function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function isTopDocumentAccessible() {
    try {
        const doc = window.top.document;
        return true;
    } catch (error) {
        console.error('Cannot access top document:', error);
        return false;
    }
}

function doubleFullscreenStyle(id) {
    let context;
    if (isTopDocumentAccessible()) {
        context = window.top.document;
    } else {
        context = window.document;
    }
    const style = context.createElement("style");
    style.id = `${id}-style`;
    style.innerHTML = `
        [data-doublefullscreen="wrapper"] {
            width: 100vw !important;
            height: 200vh !important;
            overflow: visible;
            position: relative !important;
            margin-left: var(--offset-left, 0px) !important;
            display: block !important;
        }
        [data-doublefullscreen="tall-ad"] {
            width: 100vw !important;
            height: 200vh !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
        }
        [data-doublefullscreen="sticky"] {
            width: 100vw !important;
            height: 100vh !important;
            overflow: visible !important;
            position: sticky !important;
            left: 0 !important;
            top: 0 !important;
        }
        [data-doublefullscreen="sticky"]:after {
            content: "";
            width: 32px;
            height: 32px;
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22.82' height='14.24' viewBox='0 0 22.82 14.24'%3E%3Cpolygon points='2.82 0 0 2.83 11.41 14.24 22.82 2.83 20 0 11.41 8.58 2.82 0' fill='%23fff'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-size: 44% auto;
            background-position: 50% 52%;
            background-color: rgba(0,0,0,0.3);
            border-radius: 32px;
        }
        @media (orientation: portrait) {
          [data-doublefullscreen="sticky"]:after {
              width: 22px;
              height: 22px
          }
        }
        [data-doublefullscreen="short-ad"] {
            position: absolute;
            left: 0;
            top: 0;
            width: inherit !important;
            height: inherit !important;
        }
    `;
    context.head.appendChild(style);
    return style;
}

function createDoubleFullscreenElements(el) {
    if (!el) {
        throw new Error("DoubleFullscreen required elements do not exists");
    }
    const randomId = `doublefullscreen-${generateRandomString(6)}`;
    const style = doubleFullscreenStyle(randomId);
    const stickyContainer = el.parentElement;
    const wrapper = stickyContainer.parentElement;

    // add data attribute to style element
    el.dataset.doublefullscreen = "short-ad";
    stickyContainer.dataset.doublefullscreen = "sticky";
    wrapper.dataset.doublefullscreen = "wrapper";

    return { wrapper, style, randomId };
}

function reportDoubleFullscreenError(error) {
    console.error("DoubleFullscreen failed", error);
    const errorObject = {
        site: window.top.location.hostname,
        format: FORMAT,
        partner: "startsiden",
        error_data: error.message || "unknown error",
    };
    window.navigator.sendBeacon(
        "https://vpfdcwclceuax2giu5vscidice0fdrpy.lambda-url.eu-north-1.on.aws/",
        JSON.stringify(errorObject)
    );
}

function createWaypoint(targetElem, source, data) {
    if (!targetElem || !source || !data) {
        return;

        console.log(targetElem)
    }
    function createObserver(el, th) {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: th,
        };
        const observer = new IntersectionObserver(handleIntersect, options);
        observer.observe(el);
    }

    function handleIntersect(entries) {
        entries.forEach((entry) => {
            source.postMessage(
                JSON.stringify({
                    callbackId: entry.target.dataset.callbackid,
                    isIntersecting: entry.isIntersecting,
                    intersectionRatio: entry.intersectionRatio,
                    isVisible: entry.isVisible,
                }),
                "*"
            );
        });
    }
    var newWP = document.createElement("span");
    newWP.classList.add("waypoint");
    newWP.style.cssText =
        "display: block;width: 10px;height: 10px;position: absolute;left: 50%;z-index: 10;background-color: rgba(255, 255, 255, 0.5);border-radius: 5px;opacity: 0;";
    newWP.dataset.callbackid = data.eventId;
    newWP.style.top =
        data.threshold <= 1 ? `${Math.round(data.threshold * 100)}%` : `${data.threshold}%`;
    targetElem.appendChild(newWP);
    createObserver(newWP, 0.99);
}

// Intercept waypoint message
function onMessage(targetElem, event) {
    console.log('myevent: ', typeof event.data === "object" ? event.data : JSON.parse(event.data))
    try {
        const payload = typeof event.data === "object" ? event.data : JSON.parse(event.data);
        if (payload.action === "addWaypoint") {
            createWaypoint(targetElem, event.source, payload);
        }
    } catch (e) { }
}

// Load ad
function loadAd(targetElem, pathWithoutFileName, fileName = 'index.html', clickTag, gdpr = '', gdprConsent = '', correlator = '') {
    const frame = document.createElement("iframe");
    frame.setAttribute("frameborder", String(0));
    frame.setAttribute("scrolling", "no");
    if (pathWithoutFileName?.includes('deliver.madington')) {
        fileName = 'background.html'
        frame.setAttribute(
            "src",
            `${pathWithoutFileName}${fileName}?clickTag=${clickTag}&gdpr=${gdpr}&gdpr_consent=${gdprConsent}&hs=${correlator}`
            // `${CREATIVE_BASE_URL}${pathWithoutFileName}${fileName}?clickTag=${clickTag}&gdpr=${gdpr}&gdpr_consent=${gdprConsent}`
        );
    } else {
        frame.setAttribute(
            "src",
            `${CREATIVE_BASE_URL}${pathWithoutFileName}${fileName}?clickTag=${clickTag}&gdpr=${gdpr}&gdpr_consent=${gdprConsent}`
        );
    }
    // pass clickTag to ad, ad using window.name to get it
    frame.name = clickTag;

    // Append the ad iframe to the targetElem
    try {
        targetElem.insertAdjacentElement("afterbegin", frame);
    } catch (error) {
        reportDoubleFullscreenError(error);
    }

    return frame;
}

export const PlatformType = {
    MANUAL: "manual",
    STATION: "station"
};

function getConfig(ad) {
    console.log(ad)
    const currScript = getCurrentScript(ad);
    //TODO: Add validation and senibel defaults
    const platform = currScript?.dataset?.partner ? PlatformType?.MANUAL : PlatformType?.STATION;
    console.log(currScript)
    if (currScript?.dataset?.path?.includes('deliver.madington')) {
        const currScriptParentElement = currScript?.parentElement
        console.log(currScriptParentElement)

        return {
            clickTag: currScriptParentElement.dataset.clickTag,
            pathWithoutFileName: currScript.dataset.path,
            partner: currScriptParentElement.dataset.partner,
            tallAd: currScriptParentElement.dataset.tallAd,
            shortAd: currScriptParentElement.dataset.shortAd,
            currentScriptElement: currScript,
            hostName: currScriptParentElement.dataset.hostName,
            gdpr: currScriptParentElement.dataset.gdpr || '',
            gdprConsent: currScriptParentElement.dataset.gdprConsent || '',
            correlator: currScriptParentElement.dataset.correlator || '',
            adunit: currScriptParentElement.dataset.adunit || '',
            platform: platform,
            correlator: currScriptParentElement.dataset.correlator || '',
        }
    } else {
        console.log(currScript.dataset)
        return {
            clickTag: currScript.dataset.clickTag,
            pathWithoutFileName: currScript.dataset.path,
            partner: currScript.dataset.partner,
            tallAd: currScript.dataset.tallAd,
            shortAd: currScript.dataset.shortAd,
            currentScriptElement: currScript,
            hostName: currScript.dataset.hostName,
            gdpr: currScript.dataset.gdpr || '',
            gdprConsent: currScript.dataset.gdprConsent || '',
            adunit: currScript.dataset.adunit || '',
            platform: platform,
            correlator: currScript.dataset.correlator || '',
        }
    }

}

function createDoubleFullscreen(el, setup, onIntersection) {
    try {
        // Get config
        const { pathWithoutFileName, tallAd, shortAd, clickTag, currentScriptElement, gdpr, gdprConsent, correlator } = getConfig(el);

        // Create elements
        const { wrapper, style, randomId } = createDoubleFullscreenElements(el);

        // Style it
        wrapper.classList.add(randomId);

        // Position it
        const offsetLeft = calculateOffsetLeft(wrapper);

        // Listen for messages
        window.top.addEventListener("message", function (event) {
            onMessage(wrapper, event);
        });

        // Load tall ad (the one that is 200vh tall)
        const tallAdElement = loadAd(wrapper, pathWithoutFileName, tallAd, clickTag, gdpr, gdprConsent, correlator);
        tallAdElement.dataset.doublefullscreen = "tall-ad";

        // Load short ad (the one that is 100vh tall)
        const shortAdElement = loadAd(
            currentScriptElement.parentElement,
            pathWithoutFileName,
            shortAd,
            clickTag
        );
        shortAdElement.style.height = "100vh";
        shortAdElement.style.width = "100vw";
        shortAdElement.style.display = "block";

        // Run setup function if provided
        if (typeof setup === "function") {
            setup(wrapper, style.sheet, randomId);
        }

        // Run onIntersection function if provided
        if (typeof onIntersection === "function") {
            const io = new IntersectionObserver(onIntersection, {
                root: null,
                rootMargin: "0px",
                threshold: 0,
            });
            io.observe(wrapper);
        }

        return {
            format: FORMAT,
            randomId,
            wrapper,
            el,
            tallAdElement,
            shortAdElement,
        };
    } catch (error) {
        reportDoubleFullscreenError(error);
    }
}

function getCurrentScript(ad) {
    return (
        ad?.contentWindow.document.currentScript ||
        (function () {
            const scripts = ad?.contentWindow.document.getElementsByTagName("script");
            return scripts[scripts.length - 1];
        })()
    );
}

function calculateOffsetLeft(element) {
    const offsetLeft = element.getBoundingClientRect().left;
    element.style.setProperty(`--offset-left`, `-${offsetLeft}px`);
    return offsetLeft;
}

export {
    createDoubleFullscreen,
    loadAd,
    getConfig,
    getCurrentScript,
    calculateOffsetLeft,
    CREATIVE_BASE_URL,
    createDoubleFullscreenElements,
}