import type { Config } from "tailwindcss";
import { designTokens } from "./src/lib/design-tokens";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...designTokens.colors,
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      spacing: designTokens.spacing,
      borderRadius: designTokens.borderRadius,
      fontFamily: designTokens.typography.fontFamily,
      fontSize: designTokens.typography.fontSize,
      boxShadow: designTokens.shadows,
      transitionDuration: designTokens.animation.duration,
      transitionTimingFunction: designTokens.animation.easing,
    },
  },
  plugins: [],
} satisfies Config;