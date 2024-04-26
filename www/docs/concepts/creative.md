---
pageClass: docs
---

<p class="text-sm text-slate-500"><code>Docs > Key Concepts</code></p>

# Creative

The interaction between a creative (the advertisement content itself) and an [Format](formats.md) on publisher sites, is a nuanced process that enables dynamic, efficient, and standardize process.

AdVantage utilize a messaging protocol for managing ad interactions in a secure container. AdVantage and the creative communicate by excanging asynchronous signals that maintain a custom messaging protocol. In the most simplistic overview of how it works, the steps are as follows:

1. <code>[pre-AdVantage]</code> an ad is matched and delivered to a webpages placement.
2. Once in a state to receive information, the creative informs AdVantage that it is ready to receive initialization information.
3. AdVantage initializes and provides the creative with a `init` message.
4. Creative executes, using messaging protocol to request and resive data and event about resize, close event, scroll event etc.

![dark](/message-dark.png)
![light](/message-light.png)
