import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import apiMiddleware from "./server/server.js";

export default defineConfig({
  plugins: [react(), apiMiddleware()],
  server: {
    port: 3000,
  },
});
