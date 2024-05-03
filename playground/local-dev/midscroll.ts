import { AdvantageCreativeMessenger } from "@src/advantage";
import { AdvantageMessageAction, AdvantageFormatName } from "@src/types";
import { logger } from "@src/utils/logging";

/* 
This is an example of a midscroll creative ad implementation.
*/

async function main() {
    const advantageMessenger = new AdvantageCreativeMessenger();
    const session = await advantageMessenger.startSession();

    advantageMessenger.onMessage((message) => {
        console.log("The midscroll ad received a message: ", message);
    });

    if (session) {
        const response = await advantageMessenger.sendMessage({
            action: AdvantageMessageAction.REQUEST_FORMAT,
            format: AdvantageFormatName.Midscroll
        });
        if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
            logger.info("Midscroll format is confirmed, starting ad");
            document.body.classList.add("midscroll");
            document.body.style.opacity = "1";
        }
    }
}
main();
