import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {},
  plugins: [react()],
  build: {
    outDir: "build/client",
  },
});
