import { AdvantageCreativeMessenger } from "../src/advantage";
import { AdvantageMessageAction, AdvantageFormatName } from "../src/types";
import { logger } from "../src/utils/logging";

async function main() {
    const advantageMessenger = new AdvantageCreativeMessenger();
    const session = await advantageMessenger.startSession();

    advantageMessenger.onMessage((message) => {
        console.log("The custom ad received a message: ", message);
    });

    if (session) {
        const response = await advantageMessenger.sendMessage({
            action: AdvantageMessageAction.REQUEST_FORMAT,
            format: AdvantageFormatName.TopScroll
        });
        if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
            logger.info(
                "Top scroll format is confirmed in the custom ad, starting ad"
            );
            document.body.style.opacity = "1";
        }
        if (response?.action === AdvantageMessageAction.FORMAT_REJECTED) {
            logger.warn("Top scroll format was rejected");
        }
    }
}
main();
