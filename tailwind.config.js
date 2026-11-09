/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./*.js", "./src/**/*.{html,js}"],
  theme: {
    screens: {
      sm: "360px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
    },
    extend: {
      // tailwind.config.js -> theme.extend.colors
      colors: {
        ground: "#E5E2D9", 
        surface: "#F2EFE9",
        ink: "#181C24", 
        muted: "#5B6475", 
        line: "#264653", 
       
        brand: {
          DEFAULT: "#E65100", 
          light: "#DDD8CB",
          dark: "#B23F00",
        },
        attribute: {
          vaccine: "#15803D", 
          data: "#1D4ED8",
          virus: "#B91C1C",
        },
      },
    },
  },
  plugins: [],
};
