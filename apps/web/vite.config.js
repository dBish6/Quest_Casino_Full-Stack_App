import { mergeConfig, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { defaults } from "@qc/vite-config";

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), "");

  return mergeConfig(
    defaults,
    defineConfig({
      server: {
        port: 3000,
        proxy: {
          "/api": {
            target: mode === "production" ? "" : "http://localhost:4000",
            changeOrigin: true,
            secure: mode === "production",
            // ws: true
          }
        },
      },
      // define: {
      //   __APP_ENV__: JSON.stringify(env.APP_ENV),
      // },
      css: {
        modules: {
          localsConvention: "camelCaseOnly",
          generateScopedName:
            mode === "production"
              ? "[hash:base64:8]"
              : "[local]_[hash:base64:5]"
        }
      },
      plugins: [react()],
      build: {
        outDir: "build/client"
      }
    })
  );
});
