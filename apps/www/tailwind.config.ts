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
    extend: {
      ...baseConfig.theme.extend,
      colors: {
        ...baseConfig.theme.extend.colors,
      },
    },
  },
} satisfies Config;
