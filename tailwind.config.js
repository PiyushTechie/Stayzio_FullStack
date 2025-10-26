/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./views/**/*.ejs",       // Scan all EJS files in the views folder
    "./public/css/**/*.css"   // Optional: scan your CSS if using @apply
  ],
  darkMode: 'class',          // Enable dark mode via 'class'
  theme: {
    extend: {
      colors: {
        'brand-red': '#fe424d',   // Custom brand color
      },
    },
  },
  plugins: [],
}
