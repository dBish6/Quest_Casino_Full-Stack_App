import { defineConfig, mergeConfig, loadEnv } from "vite";
import { defaults } from "../../packages/vite-config";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd());

  return mergeConfig(
    defaults,
    defineConfig({
      server: {
        port: 3000,
        ...(mode === "development" && {
          proxy: {
            "/api": {
              target:"http://localhost:4000",
              changeOrigin: true
            }
          }
        })
      },
      define: {
        // Temporary
        "import.meta.env": JSON.stringify(env)
      },
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
      ssr: {
        noExternal: ["react-router-dom"]
      },
      build: {
        outDir: isSsrBuild ? "build" : "build/public",
        copyPublicDir: !isSsrBuild,
        ...(isSsrBuild && { emptyOutDir: false }),
        rollupOptions: {
          ...(isSsrBuild && {
            output: {
              format: "es",
              entryFileNames: "server.mjs"
            }
          }),
          plugins: [
            typescript({
              outDir: isSsrBuild ? "build" : "build/public",
              exclude: ["**/*.old*", "**/*copy*"]
            })
          ]
        }
      }
    })
  );
});
