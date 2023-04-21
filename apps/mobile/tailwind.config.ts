import baseConfig from "@kafeasist/tailwind";
import { type Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
