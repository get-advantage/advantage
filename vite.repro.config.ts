import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    build: {
        lib: {
            entry: resolve(__dirname, "repro-bug.ts"),
            name: "ReproBug",
            fileName: "repro-bug",
            formats: ["umd"]
        },
        outDir: "dist/repro",
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: "repro-bug.js"
            }
        }
    }
});
