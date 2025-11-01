import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],

  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },

  build: {
    outDir: "build", // fallback for safety
    emptyOutDir: true,
  },

  server: {
    port: 5173,
    open: true,
  },

  preview: {
    port: 4173,
  },
});
