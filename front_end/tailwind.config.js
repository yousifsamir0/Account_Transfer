/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#01031a',
        secondary: '#eed999',
        gold: {
          500: '#FFD700',
          600: '#FFC107',
          700: '#FFB300',
        },
      }
    },
  },
  plugins: [],
}

