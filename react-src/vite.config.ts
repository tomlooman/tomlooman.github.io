import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "assets/js",
    emptyOutDir: false,
    cssCodeSplit: true,
    rollupOptions: {
    input: resolve(__dirname, "entry.jsx"),
      output: {
        entryFileNames: "bundle.js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: (assetInfo) => {
          // Put CSS directly in assets/js
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "[name].[ext]";
          }
          // other assets (images/fonts) go to assets/
          return "assets/[name].[ext]";
        },
      }
    },
  },
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
    preprocessorOptions: {
      scss: {
        additionalData: "",
      },
    },
  },
});
