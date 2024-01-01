import type { Config } from "tailwindcss";

import baseConfig from "@kafeasist/tailwind";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
} satisfies Config;
