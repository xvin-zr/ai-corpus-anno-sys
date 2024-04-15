import type { Config } from "tailwindcss";
import colors, { green, indigo, purple, yellow } from "tailwindcss/colors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",

    // Path to Tremor module
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
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
      cyan: colors.cyan,
      indigo: colors.indigo,
      violet: colors.violet,
      fuchsia: colors.fuchsia,
      tremor: {
        brand: {
          faint: colors.blue[50],
          muted: colors.blue[200],
          subtle: colors.blue[400],
          DEFAULT: colors.blue[500],
          emphasis: colors.blue[700],
          inverted: colors.white,
        },
        background: {
          muted: colors.gray[50],
          subtle: colors.gray[100],
          DEFAULT: colors.white,
          emphasis: colors.gray[700],
        },
        border: {
          DEFAULT: colors.gray[200],
        },
        ring: {
          DEFAULT: colors.gray[200],
        },
        content: {
          subtle: colors.gray[400],
          DEFAULT: colors.gray[500],
          emphasis: colors.gray[700],
          strong: colors.gray[900],
          inverted: colors.white,
        },
      },
      // dark mode
      "dark-tremor": {
        brand: {
          faint: "#0B1229",
          muted: colors.blue[950],
          subtle: colors.blue[800],
          DEFAULT: colors.blue[500],
          emphasis: colors.blue[400],
          inverted: colors.blue[950],
        },
        background: {
          muted: "#131A2B",
          subtle: colors.gray[800],
          DEFAULT: colors.gray[900],
          emphasis: colors.gray[300],
        },
        border: {
          DEFAULT: colors.gray[800],
        },
        ring: {
          DEFAULT: colors.gray[800],
        },
        content: {
          subtle: colors.gray[600],
          DEFAULT: colors.gray[500],
          emphasis: colors.gray[200],
          strong: colors.gray[50],
          inverted: colors.gray[950],
        },
      },
    },

    extend: {
      boxShadow: {
        // light
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-sans-sc)"],
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [
    require("daisyui"),
    require("@tailwindcss/forms"),
    require("@headlessui/tailwindcss"),
  ],
};
export default config;
