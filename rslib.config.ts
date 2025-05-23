import { defineConfig } from "@rslib/core";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";

export default defineConfig({
  lib: [
    {
      format: "esm",
      bundle: true,
      autoExternal: {
        dependencies: false,
      },
      syntax: ["last 2 versions", "> 1%"],
      dts: {
        bundle: true,
      },
    },
  ],
  source: {
    entry: {
      index: "./src/index.ts",
    },
  },
  plugins: [pluginNodePolyfill()],
});
