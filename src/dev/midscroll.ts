import { AdvantageProtocol } from "../advantage-ad/advantage-protocol";
import { AdvantageMessageAction, AdvantageFormatName } from "../types";
import { logger } from "../utils/logging";

async function main() {
    const advantageProtocol = new AdvantageProtocol();
    const session = await advantageProtocol.startSession();
    advantageProtocol.onMessage((message) => {
        //console.log("received a message: ", message);
    });
    if (session) {
        const response = await advantageProtocol.sendMessage({
            action: AdvantageMessageAction.REQUEST_FORMAT,
            format: AdvantageFormatName.Midscroll
        });
        if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
            logger.info("Midscroll format is confirmed, starting ad");
            document.body.style.opacity = "1";
        }
    }
}
main();
