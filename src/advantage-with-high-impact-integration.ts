/**
 * Advantage with High Impact JS Integration Config Bundle
 *
 * This entry point combines the Advantage core library with the
 * High Impact JS integration configuration, creating a single bundle
 * that includes both the compatibility layer and responsive ad styling.
 *
 * This is useful for testing and deployment scenarios where you want
 * everything in one file.
 */

// Import everything from the main Advantage entry point
// This ensures all initialization code runs (custom elements, global APIs, etc.)
import { Advantage } from "./advantage/index";
import highImpactConfig from "../high-impact-integration-config";

// Auto-configure Advantage with the High Impact JS integration config
const advantage = Advantage.getInstance();
advantage.configure(highImpactConfig);

// Re-export everything from the main entry point
export * from "./advantage/index";
export { highImpactConfig };

// Also expose on window for UMD builds
if (typeof window !== "undefined") {
    (window as any).Advantage = Advantage;
    (window as any).advantageInstance = advantage;
}
