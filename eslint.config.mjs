import unjs from "eslint-config-unjs";

export default unjs({
  ignores: [
    // ignore paths
    "compare-versions",
    "semver",
  ],
  rules: {
    // rule overrides
    "unicorn/no-static-only-class": "off",
    "unicorn/no-null": "off",
  },
  markdown: {
    rules: {
      // markdown rule overrides
    },
  },
});
