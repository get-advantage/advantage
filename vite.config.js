// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: [
                resolve(__dirname, "src/advantage/index.ts"),
                resolve(__dirname, "src/advantage-ad/advantage-protocol.ts")
            ],
            formats: ["es", "cjs"],
            // the proper extensions will be added
            fileName: (format, entryName) => `${entryName}.${format}.js`
        }
    }
});
