import { mergeConfig, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { defaults } from "../../packages/vite-config";

export default mergeConfig(
  defaults,
  defineConfig({
    server: {
      // middlewareMode: true,
      // middlewareMode: "ssr",
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
    ssr: {},
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
        generateScopedName: "[local]_[hash:base64:2]",
      },
    },
    // css: {
    //   // postcss: postcssConfig,
    //   modules: {
    //     localsConvention: "camelCaseOnly",
    //     // generateScopedName: import.meta.env.PROD
    //     //   ? "[hash:base64:2]"
    //     //   : "[local]_[hash:base64:2]",
    //   },
    // },
    plugins: [react()],
    build: {
      outDir: "build/client",
    },
    // build: {
    //   target: "node", // Set the build target to Node.js
    //   outDir: "build", // Output directory for the built files
    //   rollupOptions: {
    //     input: {
    //       main: path.resolve(__dirname, "./app/front-end/src/index.html"), // Adjust the path to your entry point
    //     },
    //     // Externalize dependencies for SSR
    //     external: ["react", "react-dom", "react-router-dom"],
    //   },
    // },
    // optimizeDeps: {
    //   // Explicitly specify the dependencies needed for SSR
    //   include: ["react", "react-dom", "react-router-dom"],
    // },
  })
);
