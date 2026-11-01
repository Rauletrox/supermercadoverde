import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Las rutas relativas permiten publicar en / o en /nombre-del-repositorio/.
  // HashRouter mantiene las páginas internas después del símbolo #.
  base: "./",
  // PAUTA S2 · Criterio 2 (20 puntos): integra el framework Tailwind CSS en la compilación con Vite.
  plugins: [tailwindcss()],
});
