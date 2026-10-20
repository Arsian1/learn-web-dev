// vite.config.js
import { defineConfig } from "vite";
import mockApi from "./server/server.js";

export default defineConfig({
  plugins: [mockApi()],
  server: {
    port: 3000,
  },
  root: ".",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
