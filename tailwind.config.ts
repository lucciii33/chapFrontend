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
    themes: ["dark"], // 👈 Solo el tema dark
    darkTheme: "dark",
  },
};

export default config;
