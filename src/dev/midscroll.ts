import { AdvantageProtocol } from "../advantage-ad/advantage-protocol";
import { AdvantageMessageAction, AdvantageFormatName } from "../types";

async function main() {
    const advantageProtocol = new AdvantageProtocol();
    const confirmed = await advantageProtocol.startSession();
    advantageProtocol.onMessage((message) => {
        console.log("received a message: ", message);
    });
    if (confirmed) {
        const response = await advantageProtocol.sendMessage({
            action: AdvantageMessageAction.REQUEST_FORMAT,
            format: AdvantageFormatName.Midscroll
        });
        console.log("response: ", response);
    }
}
main();
