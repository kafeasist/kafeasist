import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#09090b",
        border: "#e2e8f0",
        input: "#e2e8f0",
        muted: {
          DEFAULT: "#f4f4f5",
          foreground: "71717a",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        },
        primary: {
          DEFAULT: "#0f172a",
          foreground: "#f8fafc",
        },
        secondary: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a",
        },
        accent: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a",
        },
        destructive: {
          DEFAULT: "#ff0000",
          foreground: "#f8fafc",
        },
        ring: "#94a3b8",
        radius: "0.5rem",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
