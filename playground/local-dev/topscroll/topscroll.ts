import { AdvantageCreativeMessenger } from "@src/advantage/messaging/creative-side";
import { AdvantageMessageAction, AdvantageFormatName } from "@src/types";
import logger from "@src/utils/logging";
/* 
This is an example of a topscroll creative ad implementation.
*/
async function main() {
    const advantageMessenger = new AdvantageCreativeMessenger();
    const session = await advantageMessenger.startSession();

    advantageMessenger.onMessage((message) => {
        logger.debug("A topscroll ad received a message: ", message);
    });

    if (session) {
        const response = await advantageMessenger.sendMessage({
            action: AdvantageMessageAction.REQUEST_FORMAT,
            format: AdvantageFormatName.TopScroll
        });
        if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
            logger.info("Top scroll format is confirmed, starting ad");
            document.body.style.opacity = "1";
        }
        if (response?.action === AdvantageMessageAction.FORMAT_REJECTED) {
            logger.info("Top scroll format was rejected");
        }
    }
}
main();
