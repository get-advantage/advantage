import { Advantage } from "@src/advantage";
import { IAdvantageWrapper } from "@src/types";

// Logger helper
const log = (msg: string) => {
    const el = document.createElement("div");
    el.className = "log-entry";
    el.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    const logs = document.getElementById("logs");
    if (logs) logs.prepend(el);
    console.log(msg);
};

// Define Test Format
const TestFormat = {
    name: "TEST_FORMAT",
    setup: async (wrapper: IAdvantageWrapper) => {
        log("🟢 TEST_FORMAT Setup: Adding 'test-active' class to body");
        document.body.classList.add("test-active");
        wrapper.changeContent(
            '<div style="padding: 20px; background: #b2f5ea; text-align: center; font-weight: bold; color: #234e52;">Test Ad Content (Active)</div>'
        );
    },
    reset: (_wrapper: IAdvantageWrapper) => {
        log("🔴 TEST_FORMAT Reset: Removing 'test-active' class from body");
        document.body.classList.remove("test-active");
    }
};

// Initialize Advantage
const advantage = Advantage.getInstance();
// We need to cast to any because the config type might be strict about format structure
// but for this test we just need the basic hooks.
advantage.configure({
    formats: [TestFormat as any]
});

// UI Logic
const stage1 = document.getElementById("stage")!;
const stage2 = document.getElementById("stage-2")!;
let activeWrapper: IAdvantageWrapper | null = null;

document.getElementById("btn-add")?.addEventListener("click", async () => {
    if (activeWrapper && document.contains(activeWrapper)) {
        log("⚠️ Wrapper already exists in DOM. Remove it first.");
        return;
    }

    log("Creating new AdvantageWrapper...");
    const wrapper = document.createElement(
        "advantage-wrapper"
    ) as IAdvantageWrapper;
    stage1.appendChild(wrapper);
    activeWrapper = wrapper;

    // Force the format to activate it immediately
    try {
        await wrapper.forceFormat("TEST_FORMAT");
        log("Wrapper added and format forced.");
    } catch (e) {
        log("Error forcing format: " + e);
    }
});

document.getElementById("btn-remove")?.addEventListener("click", () => {
    if (!activeWrapper || !document.contains(activeWrapper)) {
        log("⚠️ No wrapper in DOM to remove.");
        return;
    }
    log("Removing wrapper from DOM...");
    activeWrapper.remove();
    // We keep the reference in activeWrapper to potentially re-add it,
    // but for this simple test we can consider it 'gone' from the user perspective.
    // However, for the 'move' test we need the reference.

    // Check status after 200ms (timeout is 100ms)
    setTimeout(() => {
        const hasClass = document.body.classList.contains("test-active");
        if (!hasClass) {
            log("✅ SUCCESS: Body class removed after disconnect.");
        } else {
            log(
                "❌ FAILURE: Body class still present after disconnect timeout!"
            );
        }
    }, 200);
});

document.getElementById("btn-move")?.addEventListener("click", () => {
    if (!activeWrapper || !document.contains(activeWrapper)) {
        log("⚠️ No wrapper in DOM to move.");
        return;
    }
    log("Moving wrapper from Stage 1 to Stage 2 (Synchronous)...");

    // This mimics a reparenting operation: remove then append immediately
    // The disconnectedCallback will fire, setting a timeout.
    // The connectedCallback will fire immediately after, clearing the timeout.
    activeWrapper.remove();
    stage2.appendChild(activeWrapper);

    // Check status after 200ms
    setTimeout(() => {
        const hasClass = document.body.classList.contains("test-active");
        if (hasClass) {
            log("✅ SUCCESS: Body class persisted after move.");
        } else {
            log(
                "❌ FAILURE: Body class removed! Reset was called incorrectly."
            );
        }
    }, 200);
});

document.getElementById("btn-route")?.addEventListener("click", () => {
    log("Simulating Route Change (Clearing Stage 1 & 2)...");
    stage1.innerHTML = "";
    stage2.innerHTML = "";
    activeWrapper = null;

    setTimeout(() => {
        const hasClass = document.body.classList.contains("test-active");
        if (!hasClass) {
            log("✅ SUCCESS: Body class removed after route change.");
        } else {
            log("❌ FAILURE: Body class still present!");
        }
    }, 200);
});
