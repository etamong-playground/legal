import { defineConfig } from "tsup";

export default defineConfig({
  // src/helpers.ts is a second entry: pure date math (type-only model import,
  // erased at build) so a non-React runtime (e.g. a Cloudflare Function serving
  // the public legal hub) can import it without pulling in React.
  entry: ["src/index.ts", "src/helpers.ts"],
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
