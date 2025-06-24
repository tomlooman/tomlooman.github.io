import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: "./",
  build: {
    outDir: 'assets/js',
    rollupOptions: {
      input: 'react-src/entry.jsx',
      output: {
        entryFileNames: 'bundle.js',
        assetFileNames: '[name].[ext]',
      },
    },
    cssCodeSplit: true,
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    preprocessorOptions: {
      scss: {
        additionalData: '', // Optional: shared SCSS variables if needed
      },
    },
  },
});
