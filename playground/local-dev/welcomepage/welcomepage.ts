import { AdvantageCreativeMessenger } from "@src/advantage/messaging/creative-side";
import { AdvantageMessageAction, AdvantageFormatName } from "@src/types";
import logger from "@src/utils/logging";

/* 
This is an example of a welcomepage creative ad implementation.
*/

async function main() {
    const advantageMessenger = new AdvantageCreativeMessenger();
    const session = await advantageMessenger.startSession();

    advantageMessenger.onMessage((message) => {
        logger.debug("The welcomepage ad received a message: ", message);
    });

    if (session) {
        const response = await advantageMessenger.sendMessage({
            action: AdvantageMessageAction.REQUEST_FORMAT,
            format: AdvantageFormatName.WelcomePage
        });
        if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
            logger.info("Welcome format is confirmed, starting ad");
            document.body.style.opacity = "1";
        }
    }
}
main();
