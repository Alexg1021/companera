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
          dark: "#085041",
          muted: "#E1F5EE",
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
