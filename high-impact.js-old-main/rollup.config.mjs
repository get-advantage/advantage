import terser from "@rollup/plugin-terser";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";

export default {
  input: "src/main.js",
  output: [
    {
      file: "dist/high-impact.js",
      format: "cjs",
      inlineDynamicImports: true,
    },
    {
      file: "dist/high-impact.min.js",
      format: "iife",
      name: "version",
      plugins: [terser()],
      inlineDynamicImports: true,
    },
  ],
  plugins: [dynamicImportVars({})],
};
