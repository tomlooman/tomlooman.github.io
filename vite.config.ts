import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'assets/js',
    rollupOptions: {
      input: 'react-src/entry.jsx',
      output: {
        entryFileNames: 'bundle.js',
      },
    },
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
});
