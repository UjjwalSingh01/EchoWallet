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
      fontFamily: {
        roboto: "Roboto",
        "roboto-flex": "'Roboto Flex', sans-serif",
        "otomanopee-one": "'Otomanopee One', sans-serif",
        "noto-sans-math": "'Noto Sans Math', sans-serif",
        "rounded-mplus-1c": "'Rounded Mplus 1c', sans-serif",
        montserrat: "'Montserrat', sans-serif",
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
