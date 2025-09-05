/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust to your project
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--primary)",
        "primary-alt": "var(--primary-alt)",
      },
    },
  },
  plugins: [],
};