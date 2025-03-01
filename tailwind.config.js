/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ff8a8a',
          DEFAULT: '#e74c3c',
          dark: '#c0392b',
        }
      }
    },
  },
  plugins: [],
}