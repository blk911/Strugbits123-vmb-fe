/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

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
        'xl1000': {'max': '1000px'},
      },
    },
  },
  plugins: [],
};
