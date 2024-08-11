import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      container: {
        center: true,
        screens: {
          "2xl": "1920px",
        },
      },
      screens: {
        "3xl": { min: "1920px" },
        "2xl": { min: "1441px" },
        xl: { max: "1279px" },
        lg: { max: "1024px" },
        md: { max: "767px" },
        sm: { max: "479px" },
        xs: { max: "374px" },
      },
    },
  },
  plugins: [],
};
export default config;
