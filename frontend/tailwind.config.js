/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"], // English font
        arabic: ["Cairo", "sans-serif"], // Arabic font
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
  variants: {
    extend: {},
  },
};
