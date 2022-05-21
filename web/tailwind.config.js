const colors = require("tailwindcss/colors")
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.fuchsia["600"],
        "primary-light": colors.fuchsia["400"],
      },
      maxWidth: {
        "main-content": "975px",
      },
      boxShadow: {
        "insta": "0 0 5px 1px rgba( .1, .1, .1 ,.0975)"
      }
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      // Add a `third` variant, ie. `third:pb-0`
      addVariant('child', '& > *')
    })
  ]
}
