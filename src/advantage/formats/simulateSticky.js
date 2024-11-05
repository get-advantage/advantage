export const simulateSticky = (stickyElement, wrapper) => {
    window.top.addEventListener("scroll", function () {
        var stickyElementRect = stickyElement.getBoundingClientRect();
        var wrapperRect = wrapper.getBoundingClientRect();

        var maxScroll = wrapperRect.bottom - stickyElementRect.height;
        if (wrapperRect.top <= 0 && wrapperRect.bottom >= stickyElementRect.height) {
            stickyElement.style.setProperty("position", "absolute", "important");
            stickyElement.style.setProperty("top", `${-wrapperRect.top}px`, "important");
            stickyElement.style.setProperty("transition", "all 0.05s ease", "important");
        } else if (window.scrollY >= maxScroll) {
            stickyElement.style.setProperty("top", `${stickyElementRect.height}px`, "important");
        } else {
            stickyElement.style.setProperty("top", `0px`, "important");
        }
    });

}