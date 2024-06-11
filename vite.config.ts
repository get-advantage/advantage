// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import noBundlePlugin from "vite-plugin-no-bundle";

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
            exclude: ["node_modules/**", "playground/**"]
        }),
        tsconfigPaths(),
        noBundlePlugin()
    ],

    build: {
        sourcemap: true,
        lib: {
            entry: [resolve(__dirname, "src/advantage/index.ts")],
            formats: ["es", "cjs"]
        },
        copyPublicDir: false
    }
});
