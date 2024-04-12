// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: [resolve(__dirname, "src/advantage/index.ts")],
            formats: ["es", "cjs"],
            // the proper extensions will be added
            fileName: (format, entryName) => {
                if (entryName === "index" && format === "es") {
                    return "advantage.js";
                }
                if (entryName === "advantage-protocol" && format === "es") {
                    return "advantage-creative.js";
                }
                if (entryName === "index" && format === "cjs") {
                    return "advantage.cjs.js";
                }
                if (entryName === "advantage-protocol" && format === "cjs") {
                    return "advantage-creative.cjs.js";
                }

                return `${entryName}.${format}.js`;
            }
        }
    }
});
