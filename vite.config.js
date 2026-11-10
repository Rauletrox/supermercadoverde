import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Las rutas relativas permiten publicar en / o en /nombre-del-repositorio/.
  // HashRouter mantiene las páginas internas después del símbolo #.
  base: "./",
  // Criterios Semana 02 · Criterio 2: integra el framework Tailwind CSS en la compilación con Vite.
  plugins: [tailwindcss()],
});
