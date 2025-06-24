import { useState, useRef, useEffect } from "react";
import {
    AdvantageWrapper,
    withAdvantageConfig,
    AdvantageWrapperRef
} from "../../../src/react/AdvantageWrapper";
import { Advantage } from "../../../src/advantage";
import { advantageConfig } from "./config.ts";

type AdFormat = "WELCOME_PAGE" | "TOPSCROLL" | "MIDSCROLL";

// Simple hook to initialize Advantage
const useAdvantage = () => {
    useEffect(() => {
        // Initialize and configure Advantage - this handles all messaging automatically
        const advantage = Advantage.getInstance();
        advantage.configure(advantageConfig);

        console.log("� Advantage configured and ready!", advantage);
    }, []);
};

// Hook to dynamically load and execute scripts
// const useScriptLoader = (scriptUrl: string | null, containerId: string) => {
//     useEffect(() => {
//         if (!scriptUrl) return;

//         const container = document.getElementById(containerId);
//         if (!container) return;

//         // Clear any existing content/scripts in the container
//         container.innerHTML = '';

//         // Create and append the script element
//         const script = document.createElement('script');
//         script.type = 'module';
//         script.src = scriptUrl;

//         // Optional: Add error handling
//         script.onerror = () => {
//             console.error(`Failed to load script: ${scriptUrl}`);
//         };

//         script.onload = () => {
//             console.log(`Successfully loaded script: ${scriptUrl}`);
//         };

//         container.appendChild(script);

//         // Cleanup function to remove the script when component unmounts or scriptUrl changes
//         return () => {
//             if (container.contains(script)) {
//                 container.removeChild(script);
//             }
//         };
//     }, [scriptUrl, containerId]);
// };

function App() {
    const [selectedFormat, setSelectedFormat] = useState<AdFormat>("TOPSCROLL");
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const [eventLog, setEventLog] = useState<string[]>([]);
    const wrapperRef = useRef<AdvantageWrapperRef>(null);

    // Initialize Advantage - this handles all messaging automatically
    useAdvantage();

    // Helper to get ad script URL based on format - using local mock ads to avoid CORS
    const getAdScriptUrl = (format: AdFormat) => {
        let src = "";
        switch (format) {
            case "WELCOME_PAGE":
                src =
                    "https://delivered-by-madington.com/misc/advantage/welcomepage.js?gdpr=${GDPR}&gdpr_consent=${GDPR_CONSENT}&click=%%c1;cpdir=";
                break;
            case "TOPSCROLL":
                src =
                    "https://delivered-by-madington.com/misc/advantage/topscroll.js?gdpr=${GDPR}&gdpr_consent=${GDPR_CONSENT}&click=%%c1;cpdir=";
                break;
            case "MIDSCROLL":
                src =
                    "https://delivered-by-madington.com/misc/advantage/midscroll.js?gdpr=${GDPR}&gdpr_consent=${GDPR_CONSENT}&click=%%c1;cpdir=";
                break;
            default:
                return "";
        }
        return src;
    };
    // Create the HOC-wrapped component - using type assertion for React 18.3 compatibility
    const MyDemoConfigAd = withAdvantageConfig(
        AdvantageWrapper,
        advantageConfig
    ) as any;

    // Cast AdvantageWrapper for React compatibility
    const AdvantageWrapperCompat = AdvantageWrapper as any;

    // Get the current ad script URL
    const adScriptUrl = getAdScriptUrl(selectedFormat);

    // Use the script loader hook - this will dynamically inject and execute the script
    // useScriptLoader(
    //     isAdLoaded ? adScriptUrl : null,
    //     `ad-slot-${selectedFormat.toLowerCase()}`
    // );

    console.log(adScriptUrl, "myDemoConfigAd");

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setEventLog((prev) => [
            `[${timestamp}] ${message}`,
            ...prev.slice(0, 9)
        ]);
    };

    const handleFormatChange = (format: AdFormat) => {
        console.log(format);
        setSelectedFormat(format);
        setIsAdLoaded(false);
        addLog(`Format changed to: ${format}`);
    };

    const handleLoadAd = () => {
        setIsAdLoaded(true);
        addLog(`🚀 Loading ${selectedFormat} ad...`);
        addLog(`📄 Ad script: ${getAdScriptUrl(selectedFormat)}`);
        addLog(
            `📨 Publisher-side messaging: AdvantageWrapper will handle communication automatically`
        );
        addLog(`✅ ${selectedFormat} ad loaded successfully`);
    };

    const handleReset = () => {
        setIsAdLoaded(false);
        addLog("🔄 Ad reset");
        addLog(`📨 Publisher-side messaging: Reset completed`);
    };

    const handleFormatConfirmed = (detail: any) => {
        addLog(`✅ Format confirmed: ${detail?.format || "unknown"}`);
        addLog(
            `📨 Publisher-side messaging: Format request handled successfully`
        );
    };

    const handleClose = () => {
        addLog("❌ Ad closed by user");
        addLog(`📨 Publisher-side messaging: Close event received`);
        handleReset();
    };

    return (
        <div>
            {/* Welcome Page Format - Full Screen Overlay */}
            {selectedFormat === "WELCOME_PAGE" && isAdLoaded && (
                <AdvantageWrapperCompat
                    ref={wrapperRef}
                    allowedFormats={["WELCOME_PAGE"]}
                    onFormatConfirmed={handleFormatConfirmed}
                    onClose={handleClose}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: 1000,
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >
                    <iframe
                        id="ad-slot-welcome_page"
                        slot="advantage-ad-slot"
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            display: "flex"
                        }}
                        ref={(el) => {
                            if (el && isAdLoaded) {
                                // Clear previous content
                                el.contentDocument?.open();
                                el.contentDocument?.write(
                                    "<!DOCTYPE html><html><head></head><body></body></html>"
                                );
                                el.contentDocument?.close();

                                // Inject the script tag
                                const script =
                                    el.contentDocument?.createElement("script");
                                if (script) {
                                    script.type = "module";
                                    script.src = getAdScriptUrl(selectedFormat);

                                    // Create and inject the style tag
                                    const style =
                                        el.contentDocument?.createElement(
                                            "style"
                                        );
                                    if (style) {
                                        style.textContent = `
                                            body {
                                                margin: 0;
                                                overflow: hidden;
                                                padding: 0;
                                                background-color: transparent;
                                            }
                                        `;
                                        el.contentDocument?.head.appendChild(
                                            style
                                        );
                                    }

                                    el.contentDocument?.body.appendChild(
                                        script
                                    );
                                }
                            }
                        }}
                    ></iframe>
                </AdvantageWrapperCompat>
            )}

            <div className="container">
                <header className="header">
                    <h1>🚀 React Advantage Wrapper Demo</h1>
                    <p>
                        Simple demo showing how to use the AdvantageWrapper
                        React component
                    </p>
                </header>

                {/* Controls */}
                <div className="controls">
                    <h3>Ad Controls</h3>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>Format: </label>
                        {(
                            [
                                "WELCOME_PAGE",
                                "TOPSCROLL",
                                "MIDSCROLL"
                            ] as AdFormat[]
                        ).map((format) => (
                            <button
                                key={format}
                                className={`button ${
                                    selectedFormat === format ? "active" : ""
                                }`}
                                onClick={() => handleFormatChange(format)}
                            >
                                {format.replace("_", " ")}
                            </button>
                        ))}
                    </div>

                    <div>
                        <button
                            className="button"
                            onClick={handleLoadAd}
                            disabled={isAdLoaded}
                        >
                            {isAdLoaded ? "Ad Loaded" : "Load Ad"}
                        </button>
                        <button
                            className="button"
                            onClick={handleReset}
                            disabled={!isAdLoaded}
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* TopScroll Format - Sticky at top */}
                {selectedFormat === "TOPSCROLL" && isAdLoaded && (
                    <MyDemoConfigAd
                        ref={wrapperRef}
                        allowedFormats={["TOPSCROLL"]}
                        onFormatConfirmed={handleFormatConfirmed}
                        onClose={handleClose}
                        style={{
                            position: "sticky",
                            top: 0,
                            width: "100%",
                            zIndex: 100,
                            marginBottom: "20px"
                        }}
                    >
                        <iframe
                            id="ad-slot-welcome_page"
                            slot="advantage-ad-slot"
                            style={{
                                width: "100vw",
                                height: "80vh",
                                border: "none",
                                display: "flex"
                            }}
                            ref={(el) => {
                                if (el && isAdLoaded) {
                                    // Clear previous content
                                    el.contentDocument?.open();
                                    el.contentDocument?.write(
                                        "<!DOCTYPE html><html><head></head><body></body></html>"
                                    );
                                    el.contentDocument?.close();

                                    // Inject the script tag
                                    const script =
                                        el.contentDocument?.createElement(
                                            "script"
                                        );
                                    if (script) {
                                        script.type = "module";
                                        script.src =
                                            getAdScriptUrl(selectedFormat);
                                        el.contentDocument?.body.appendChild(
                                            script
                                        );
                                    }

                                    const style =
                                        el.contentDocument?.createElement(
                                            "style"
                                        );
                                    if (style) {
                                        style.textContent = `
                                            body {
                                                margin: 0;
                                                overflow: hidden;
                                                padding: 0;
                                                background-color: transparent;
                                            }
                                        `;
                                        el.contentDocument?.head.appendChild(
                                            style
                                        );
                                    }
                                }
                            }}
                        />
                    </MyDemoConfigAd>
                )}

                {/* Sample Content */}
                <article className="article">
                    <h2>Sample News Article</h2>
                    <p
                        style={{
                            color: "#666",
                            fontSize: "14px",
                            marginBottom: "20px"
                        }}
                    >
                        Published {new Date().toLocaleDateString()} | Demo
                        Content
                    </p>

                    <p>
                        This is a sample news article to demonstrate how the
                        Advantage React wrapper integrates with real content.
                        The ads are positioned contextually within the content
                        flow.
                    </p>

                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                    </p>

                    {/* MidScroll Format - In content */}
                    {selectedFormat === "MIDSCROLL" && isAdLoaded && (
                        <div style={{ margin: "40px 0" }}>
                            <MyDemoConfigAd
                                ref={wrapperRef}
                                allowedFormats={["MIDSCROLL"]}
                                onFormatConfirmed={handleFormatConfirmed}
                                onClose={handleClose}
                                style={{ width: "100%" }}
                            >
                                <iframe
                                    id="ad-slot-welcome_page"
                                    slot="advantage-ad-slot"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        border: "none",
                                        display: "flex"
                                    }}
                                    ref={(el) => {
                                        if (el && isAdLoaded) {
                                            // Clear previous content
                                            el.contentDocument?.open();
                                            el.contentDocument?.write(
                                                "<!DOCTYPE html><html><head></head><body></body></html>"
                                            );
                                            el.contentDocument?.close();

                                            // Inject the script tag
                                            const script =
                                                el.contentDocument?.createElement(
                                                    "script"
                                                );
                                            if (script) {
                                                script.type = "module";
                                                script.src =
                                                    getAdScriptUrl(
                                                        selectedFormat
                                                    );
                                                el.contentDocument?.body.appendChild(
                                                    script
                                                );
                                            }

                                            const style =
                                                el.contentDocument?.createElement(
                                                    "style"
                                                );
                                            if (style) {
                                                style.textContent = `
                                            body {
                                                margin: 0;
                                                overflow: hidden;
                                                padding: 0;
                                                background-color: transparent;
                                            }
                                        `;
                                                el.contentDocument?.head.appendChild(
                                                    style
                                                );
                                            }
                                        }
                                    }}
                                />
                            </MyDemoConfigAd>
                        </div>
                    )}

                    <h3>More Content</h3>
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate
                        velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                    <p>
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                </article>

                {/* Event Log */}
                <div className="controls">
                    <h3>Event Log</h3>
                    <div
                        style={{
                            background: "#f8f9fa",
                            border: "1px solid #dee2e6",
                            borderRadius: "4px",
                            padding: "10px",
                            maxHeight: "200px",
                            overflowY: "auto",
                            fontFamily: "monospace",
                            fontSize: "12px"
                        }}
                    >
                        {eventLog.length === 0 ? (
                            <div style={{ color: "#666", fontStyle: "italic" }}>
                                No events yet. Select a format and load an ad to
                                see events.
                            </div>
                        ) : (
                            eventLog.map((log, index) => (
                                <div
                                    key={index}
                                    style={{ marginBottom: "2px", color: "#000" }}
                                >
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
