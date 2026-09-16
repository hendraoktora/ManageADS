import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#EAF3F5",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#111827",
          foreground: "#FFFFFF",
        },
        lime: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#D5F639",
          400: "#c7f023",
          500: "#a9db15",
          600: "#86b30f",
        },
        accent: {
          blue: "#88CDF6",
          blueDark: "#5AAEE0",
          lime: "#D5F639",
          dark: "#141A22",
        },
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "28px",
        "4xl": "36px",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(0, 0, 0, 0.04)",
        bento: "0 14px 35px -10px rgba(18, 38, 63, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
