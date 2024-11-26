import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false, // Desactiva el reset global de estilos
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        blue: {
          500: "#1D4ED8", // Azul primario
        },
        yellow: {
          500: "#D97706", // Amarillo secundario
        },
      },
    },
  },
  plugins: [],
};

export default config;
