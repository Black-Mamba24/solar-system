import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: "#05070d",
        panel: "rgba(10, 16, 28, 0.72)",
        sun: "#f8c45c",
        orbit: "#53d5e8",
        mars: "#c66b4e",
        earth: "#4fb3d8"
      },
      borderRadius: {
        ui: "8px"
      }
    }
  },
  plugins: []
};

export default config;
