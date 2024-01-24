import type { Config } from "tailwindcss";
import colors, { green, purple, yellow } from "tailwindcss/colors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      blue: {
        "50": "#eff6ff",
        "100": "#dbeafe",
        "200": "#bfdbfe",
        "300": "#93c5fd",
        "400": "#60a5fa",
        "500": "#3b82f6",
        "600": "#2563eb",
        "700": "#1d4ed8",
        "800": "#1e40af",
        "900": "#1e3a8a",
        "950": "#172554",
        bupt: "#003399",
      },
      "v-error": {
        lighter: "#f7d4d6",
        light: "#ff1a1a",
        DEFAULT: "#e00",
        dark: "#c50000",
      },
      "v-success": {
        lighter: "#d3e5ff",
        light: "#3291ff",
        DEFAULT: "#0070f3",
        dark: "#0761d1",
      },
      "v-warning": {
        lighter: "#ffefcf",
        light: "#f7b955",
        DEFAULT: "#f5a623",
        dark: "#c27b00",
      },
      smalt: {
        "50": "#ebf6ff",
        "100": "#d1ecff",
        "200": "#aedfff",
        "300": "#76cdff",
        "400": "#35b0ff",
        "500": "#0787ff",
        "600": "#0061ff",
        "700": "#0048ff",
        "800": "#003bd7",
        "900": "#003399",
        "950": "#062365",
      },
      zinc: colors.zinc,
      sky: colors.sky,
      black: colors.black,
      green: colors.green,
      purple: colors.purple,
      yellow,
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-sans-sc)"],
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
};
export default config;
