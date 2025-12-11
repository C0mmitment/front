/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF73EF",
        secondary: "#6A6A6A",
      }
    },
  },
  // important: 'html',
  plugins: [],
}
