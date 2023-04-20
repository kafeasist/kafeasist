/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */
/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef  {{ tailwindConfig: string }} TailwindConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */

const config = {
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  bracketSpacing: true,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    // "prettier-plugin-tailwindcss",
  ],
  tailwindConfig: "./packages/@kafeasist:tailwind",
};

module.exports = config;
