import { AdvantageProtocol } from "../advantage-protocol/creative";
import { AdvantageMessageAction, AdvantageFormatName } from "../types";
import { logger } from "../utils/logging";
/* 
This is an example of a topscroll creative ad implementation.
*/
async function main() {
    const advantageProtocol = new AdvantageProtocol();
    const session = await advantageProtocol.startSession();

    /*
    advantageProtocol.startSession().then((confirmed) => {
        if (confirmed) {
            console.log("Session started");
            advantageProtocol.sendMessage({
                action: AdvantageMessageAction.REQUEST_FORMAT,
                format: AdvantageFormatName.TopScroll
            }).then((response) => {
                console.log("response: ", response);
            });
        } else {
            console.log("Session failed to start");
        }
    });
    */

    advantageProtocol.onMessage((message) => {
        console.log("A topscroll ad received a message: ", message);
    });

    if (session) {
        const response = await advantageProtocol.sendMessage({
            action: AdvantageMessageAction.REQUEST_FORMAT,
            format: AdvantageFormatName.TopScroll
        });
        if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
            logger.info("Top scroll format is confirmed, starting ad");
            document.body.style.opacity = "1";
        }
        if (response?.action === AdvantageMessageAction.FORMAT_REJECTED) {
            logger.warn("Top scroll format was rejected");
        }
    }
}
main();
