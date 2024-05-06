export function setDimensionsUntilAdvantageAdSlot(ad: HTMLElement | null) {
    function setDimensionsTo100Percent(element: HTMLElement | null) {
        if (element) {
            element.style.height = "100%";
            element.style.width = "100%";
        }
    }

    if (ad) {
        // loop through the parent elements of the ad to find advantage-ad-slot
        let parent = ad.parentElement;
        setDimensionsTo100Percent(ad);
        while (parent) {
            setDimensionsTo100Percent(parent);
            if (parent.slot === "advantage-ad-slot") {
                break;
            }
            parent = parent.parentElement;
        }
    }
}

export function resetDimensionsUntilAdvantageAdSlot(ad: HTMLElement | null) {
    function resetDimensions(element: HTMLElement | null) {
        if (element) {
            element.style.height = "";
            element.style.width = "";
        }
    }

    if (ad) {
        // loop through the parent elements of the ad to find advantage-ad-slot
        let parent = ad.parentElement;
        resetDimensions(ad);
        while (parent) {
            resetDimensions(parent);
            if (parent.slot === "advantage-ad-slot") {
                break;
            }
            parent = parent.parentElement;
        }
    }
}
