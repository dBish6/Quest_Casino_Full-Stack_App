import { mergeConfig, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { defaults } from "../../packages/vite-config";

export default defineConfig(({ mode }) =>
  mergeConfig(
    defaults,
    defineConfig({
      server: {
        port: 3000,
        proxy: {
          // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
          // "/api": {
          //   target: "http://jsonplaceholder.typicode.com",
          //   changeOrigin: true,
          //   rewrite: (path) => path.replace(/^\/api/, ""),
          // },
          // Using the proxy instance
          "/api": {
            target: "http://jsonplaceholder.typicode.com",
            changeOrigin: true,
            configure: (proxy, options) => {
              // proxy will be an instance of 'http-proxy'
            },
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
  )
);
