/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./views/**/*.ejs",
    "./public/css/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#fe424d',
      },
      fontFamily: {
        sans: ['"Roboto Slab"', 'serif'],
      },
    },
  },
  plugins: [],
}
