/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],

  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },

      colors: {
        primary: "#FF92A5",
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
