import type { Config } from "tailwindcss";

import baseConfig from "@kafeasist/tailwind";

export default {
  content: [
    ...baseConfig.content,
    "../../packages/@kafeasist:ui/src/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
  theme: {
    ...baseConfig.theme,
    transparent: "transparent",
    current: "currentColor",
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      ...baseConfig.theme.extend,
      colors: {
        ...baseConfig.theme.extend.colors,
      },
    },
    plugins: [
      ...baseConfig.plugins,
      require("@headlessui/tailwindcss"),
      require("@tailwindcss/forms"),
    ],
  },
} satisfies Config;
