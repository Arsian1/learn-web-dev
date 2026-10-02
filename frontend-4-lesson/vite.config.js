// Конфигурация Vite.
//
// Vite — сборщик и dev-сервер. Здесь можно включать плагины,
// настраивать порт, указывать папки для сборки.
import { defineConfig } from "vite";
import apiMiddleware from "./server/server.js";

export default defineConfig({
  // Плагины. apiMiddleware — наш собственный, он поднимает
  // мини-сервер с эндпоинтами /api/*.
  plugins: [apiMiddleware()],

  // Порт dev-сервера. По умолчанию Vite берёт 5173,
  // мы поменяли на 3000 — чтобы адрес был короче.
  server: {
    port: 3000,
  },

  // Корень проекта. "." — значит «текущая папка».
  // Vite будет искать index.html здесь.
  root: ".",

  // Настройки сборки. Только для `npm run build`.
  build: {
    outDir: "dist", // куда положить собранный проект
    assetsDir: "assets", // подпапка для картинок, стилей, скриптов
  },
});
