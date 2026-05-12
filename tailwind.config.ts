import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1D9E75",
          navy: "#1A2E4A",
          teal: "#1D9E75",
          "teal-light": "#E1F5EE",
          "teal-dark": "#085041",
          muted: "#E1F5EE",
          dark: "#085041",
        },
        status: {
          "urgent-bg": "#FCEBEB",
          "urgent-text": "#A32D2D",
          "upcoming-bg": "#FAEEDA",
          "upcoming-text": "#854F0B",
          "current-bg": "#EAF3DE",
          "current-text": "#3B6D11",
        },
      },
      maxWidth: {
        phone: "390px",
      },
    },
  },
  plugins: [],
};
export default config;
