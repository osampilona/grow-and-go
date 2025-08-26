// hero.ts
import { heroui } from "@heroui/theme";

// Customize HeroUI tokens so component color props (e.g., Tabs color="warning")
// use your own brand hexes. Adjust the hex values below as desired.
export default heroui({
  themes: {
    light: {
      colors: {
        // Brand blue
        primary: {
          DEFAULT: "#2B7FFF", // requested brand blue
          foreground: "#FFFFFF",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#4FA0FF",
          500: "#2B7FFF",
          600: "#1F68E5",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        // Brand yellow (used when color="warning")
        warning: {
          DEFAULT: "#FFE020", // requested brand yellow
          foreground: "#1F2937", // slate-800 for contrast
          50: "#FFFBEB",
          100: "#FFF5B2",
          200: "#FFE97A",
          300: "#FFE34D",
          400: "#FFE026",
          500: "#FFE020",
          600: "#E6C900",
          700: "#CCA900",
          800: "#B38F00",
          900: "#8F6E00",
        },
      },
    },
    dark: {
      colors: {
        primary: {
          DEFAULT: "#2B7FFF",
          foreground: "#0B1220",
        },
        warning: {
          DEFAULT: "#FFE020",
          foreground: "#0B1220",
        },
      },
    },
  },
});
