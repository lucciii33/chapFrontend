import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/daisyui/**/*.js", // Incluir DaisyUI en el contenido
  ],
  theme: {
    extend: {}, // Extensiones mínimas
  },
  plugins: [require("daisyui")], // Agregar DaisyUI como plugin
  daisyui: {
    themes: ["light", "dark"], // Mantener temas básicos
  },
};

export default config;
