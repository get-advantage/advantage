import { AdvantageProtocol } from "../advantage-ad/advantage-protocol";
import { AdvantageMessageAction, AdvantageFormatName } from "../types";
import { logger } from "../utils/logging";

/* 
This is an example of a midscroll creative ad implementation.
*/

async function main() {
    document.querySelector("button")?.addEventListener("click", async () => {
        const advantageProtocol = new AdvantageProtocol();
        const session = await advantageProtocol.startSession();
        advantageProtocol.onMessage((message) => {
            console.log("The midscroll ad received a message: ", message);
        });
        if (session) {
            const response = await advantageProtocol.sendMessage({
                action: AdvantageMessageAction.REQUEST_FORMAT,
                format: AdvantageFormatName.Midscroll
            });
            if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
                logger.info("Midscroll format is confirmed, starting ad");
                document.body.classList.add("midscroll");
                document.body.style.opacity = "1";
            }
        }
    });
}
main();
