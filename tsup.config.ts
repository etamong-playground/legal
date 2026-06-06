import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  treeshake: true,
  // styles.css is a separate, opt-in export — copy it verbatim into dist.
  onSuccess: "cp src/styles.css dist/styles.css",
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
