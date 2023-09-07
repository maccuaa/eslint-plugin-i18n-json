import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import formatter from "@maccuaa/eslint-plugin-i18n-json/dist/formatter";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "./src",
  plugins: [
    eslint(),
    eslint({
      include: "src/i18n/*.json",
      formatter,
    }),
    react(),
  ],
});
