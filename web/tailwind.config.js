const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.sky["500"],
        "primary-light": colors.sky["400"],
      },
      maxWidth: {
        "main-content": "975px",
      },
      boxShadow: {
        "insta": "0 0 5px 1px rgba( .1, .1, .1 ,.0975)"
      }
    },
  },
  plugins: [],
}
