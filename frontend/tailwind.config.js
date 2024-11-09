/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkslateblue: "#162350",
        white: "#fff",
        deepskyblue: "#2bc9f4",
        snow: "#fffafa",
      },
      spacing: {},
      fontFamily: {
        roboto: "Roboto",
        "roboto-flex": "'Roboto Flex'",
        "otomanopee-one": "'Otomanopee One'",
        "noto-sans-math": "'Noto Sans Math'",
        "rounded-mplus-1c": "'Rounded Mplus 1c'",
      },
    },
    fontSize: {
      "7xl": "26px",
      "3xl": "22px",
      base: "16px",
      inherit: "inherit",
    },
  },
  corePlugins: {
    preflight: false,
  },
};
