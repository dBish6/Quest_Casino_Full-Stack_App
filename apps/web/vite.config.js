import { mergeConfig, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { defaults } from "../../packages/vite-config";

export default defineConfig(({ mode }) => {
  return mergeConfig(
    defaults,
    defineConfig({
      server: {
        port: 3000,
        proxy: {
          "/api": {
            target: mode === "production" ? "" : "http://localhost:4000",
            changeOrigin: true,
            secure: false,
            ws: true,
          },
        },
      },
      css: {
        modules: {
          localsConvention: "camelCaseOnly",
          generateScopedName:
            mode === "production"
              ? "[hash:base64:2]"
              : "[local]_[hash:base64:2]",
        },
      },
      plugins: [react()],
      build: {
        outDir: "build/client",
      },
    })
  );
});
