import { AdvantageProtocol } from "../advantage-ad/advantage-protocol";
import { AdvantageMessageAction, AdvantageFormatName } from "../types";

async function main() {
    const advantageProtocol = new AdvantageProtocol();
    const sessionStarted = await advantageProtocol.startSession();

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
        console.log("received a message: ", message);
    });

    if (sessionStarted) {
        const response = await advantageProtocol.sendMessage({
            action: AdvantageMessageAction.REQUEST_FORMAT,
            format: AdvantageFormatName.TopScroll
        });
        console.log("response: ", response);
    }

    document.querySelector("#ad")?.addEventListener("click", () => {
        console.log("ad clicked");
    });
}
main();
