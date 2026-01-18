import { Advantage } from "@src/advantage";
import { AdvantageFormatName } from "@src/types";
import logger from "@src/utils/logging";

const advantage = Advantage.getInstance();

advantage.configure({
    formatIntegrations: [
        {
            format: AdvantageFormatName.WelcomePage,
            options: {
                // Set to 0 to test the fix for no-animation close
                closeButtonAnimationDuration: 0,
                autoCloseDuration: 0 // Disable auto-close for manual testing
            },
            setup: () => {
                return new Promise<void>((resolve) => {
                    logger.debug("Setting up WelcomePage format integration");
                    resolve();
                });
            },
            close: () => {
                logger.debug("Closing WelcomePage format");
            },
            reset: () => {
                logger.debug("Resetting WelcomePage format");
            }
        }
    ]
});
