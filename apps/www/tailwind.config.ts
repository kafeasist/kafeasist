import baseConfig from "@kafeasist/tailwind";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
} satisfies Config;
