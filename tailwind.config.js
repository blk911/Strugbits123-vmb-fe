/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],

  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        "studio-serif": ['"Cormorant Garamond"', "Georgia", "serif"],
        "studio-sans": ['"Libre Franklin"', "Inter", "system-ui", "sans-serif"],
      },

      colors: {
        primary: "#B88F45",
        "primary-alt": "var(--primary-alt)",
      },

      screens: {
        custom: "64.6875rem",
        xs: "380px",
      },
    },
  },
  plugins: [],
};
