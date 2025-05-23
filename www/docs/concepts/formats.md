---
pageClass: docs
---

<p class="text-sm text-slate-500"><code>Docs > Key Concepts</code></p>

# Formats

Formats are predefined templates or structures that describe the visual and functional aspects of an advertisement.

Formats focus on:

-   **Visual Presentation:** Outline the aesthetic aspects, such as dimensions, animations, and interactive elements.
-   **Behavioral Functionality**: Describe how the ad behaves in different contexts, like animation on scroll or responsiveness to user interactions.
-   **Content Structure:** Define how content is organized and displayed within the format, ensuring consistency across different implementations.

Formats in Advantage are essentially a definition of how an ad looks and behaves; Such as animation on scroll. The format offer a standardized interface that allows it to be initialized, displayed, and otherwise manipulated by the integration code.

These are the current built-in format identifiers:

```ts
export enum AdvantageFormatName {
    TopScroll = "TOPSCROLL",
    DoubleMidscroll = "DOUBLE_MIDSCROLL",
    Midscroll = "MIDSCROLL",
    WelcomePage = "WELCOME_PAGE"
}
```

## Welcome Page

An impactful format that welcomes users with swift and wide reach. Positioned on top of the site content with a close button to continue to the site offers ample creative freedom, allowing for work with high-resolution materials to ensure a high-quality experience and excellent outcomes.

<span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Width 100%</span> <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Height: 100%</span> <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Close Button</span> <span class="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">Scroll Down Arrow</span>

## Topscroll

The Topscroll is the first users see, making it perfect as a branding format. Positioned at the top of the site, it fills the screen to 70%. This format features a scrolling effect, providing an elegant transition into the site as the user scrolls down.

<span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Width 100%</span> <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Height: 70%</span> <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Parallax Scrolling</span> <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Close Button</span> <span class="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">Scroll Down Arrow</span>

## Midscroll

Midscroll format is defined by its appearance (taking 100% width and height of the viewport) and behavior (content is fixed with a clip path creating a parallax scrolling illusion).

<span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Width 100%</span> <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Height: 100%</span> <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Parallax Scrolling</span>

## Double Midscroll

The Double Midscroll is a responsive, high-impact format that provides a natural presentation of your message through an intuitive and user-friendly scrolling experience. This format becomes visible when the user scrolls past the content and remains visible until the scrolling distance reaches twice the height of the window.

<span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Width 100%</span> <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Height: 200%</span> <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Parallax Scrolling</span>
