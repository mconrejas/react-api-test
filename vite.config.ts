import { defineConfig } from "vitest/config.js";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  root: "./",
  css: {
    modules: {
      localsConvention: "camelCase",
    },
    preprocessorOptions: {
      scss: {
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./jest.setup.ts",
  },
});

