---
pageClass: docs
---

<p class="text-sm text-slate-500"><code>Docs > Key Concepts</code></p>

# Creative

The **Creative** is the advertisement content itself (usually an HTML/JS file). For a creative to become "High Impact," it needs to communicate with the website it is being displayed on.

Advantage uses a **Messaging Protocol** to bridge the gap between the ad (inside an iframe) and the website. This allows the ad to safely request more space, handle scroll events, or trigger full-screen effects.

### How Communication Works

The Advantage and the creative communicate by exchanging asynchronous signals. In the most simplistic overview:

1. <code>[pre-AdVantage]</code> an ad is matched and delivered to a webpages placement.
2. Once in a state to receive information, the creative informs AdVantage that it is ready to receive initialization information.
3. AdVantage initializes and provides the creative with a `init` message.
4. Creative executes, using messaging protocol to request and resive data and event about resize, close event, scroll event etc.

![dark](/message-dark.png)
![light](/message-light.png)
