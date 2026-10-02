// Серверный API для Vite.
//
// Работает как плагин Vite: перехватывает запросы к /api/* и отдаёт
// JSON. Всё остальное пропускает дальше — чтобы Vite отдавал HTML,
// CSS, JS и картинки.
//
// Когда появится настоящий backend на Python — этот файл исчезнет,
// а клиент продолжит обращаться к тем же URL (/api/...).
import { database } from "./database.js";

// Задержка ответа, имитирует сеть.
// 0    — отвечать мгновенно (удобно при разработке)
// 500  — полсекунды (видно «Загрузка…»)
// 1500 — медленно
const DELAY_MS = 500;

// Промис-обёртка для setTimeout — чтобы использовать await.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Отправка JSON-ответа с нужным статусом и CORS-заголовками.
function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.end(JSON.stringify(data));
}

export default function apiMiddleware() {
  return {
    name: "api-middleware",
    configureServer(server) {
      console.log("API middleware загружен");

      server.middlewares.use(async (req, res, next) => {
        // Не /api/* — пропускаем дальше, пусть Vite обрабатывает.
        if (!req.url.startsWith("/api/")) {
          return next();
        }

        // CORS-preflight (OPTIONS).
        // Браузер сначала спрашивает разрешение, и только потом
        // шлёт настоящий запрос.
        if (req.method === "OPTIONS") {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          res.statusCode = 204;
          res.end();
          return;
        }

        // ------------------------------------------------------------------
        // GET /api/booking/today
        //
        // «Сегодня» по мнению сервера.
        // Формат: { day, month, year }. Месяц — 0-индексный.
        // ------------------------------------------------------------------
        if (req.method === "GET" && req.url === "/api/booking/today") {
          await delay(DELAY_MS);
          return sendJson(res, 200, database.today);
        }

        // ------------------------------------------------------------------
        // GET /api/slots?day=&month=&year=
        //
        // Слоты на указанную дату.
        // day   — число месяца (1–31).
        // month — месяц, 0-индексный (0 = январь, 9 = октябрь).
        // year  — год (2026).
        //
        // Возвращаем объект с двумя полями:
        //   date  — та же дата, что пришла в запросе.
        //           Нужна клиенту, чтобы понять, к какому дню
        //           относятся слоты. Если пользователь быстро
        //           кликает по дням, ответы могут прийти
        //           не в том порядке — по этому полю клиент
        //           поймёт, какой из них актуальный.
        //   slots — массив слотов [{ time, available }].
        // ------------------------------------------------------------------
        const slotsMatch = req.url.match(/^\/api\/slots/);
        if (req.method === "GET" && slotsMatch) {
          await delay(DELAY_MS);
          const url = new URL(req.url, "http://localhost");
          const day = parseInt(url.searchParams.get("day"));
          const month = parseInt(url.searchParams.get("month"));
          const year = parseInt(url.searchParams.get("year"));

          // Проверяем, что дата пришла полностью.
          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return sendJson(res, 400, {
              error: "Нужны параметры day, month, year",
            });
          }

          // Имитация: чётный день — один набор, нечётный — другой.
          // Клиент этой логики не видит.
          const isEven = day % 2 === 0;
          const slots = isEven ? database.slotsEvenDay : database.slotsOddDay;

          return sendJson(res, 200, {
            date: { day, month, year },
            slots,
          });
        }

        // Всё остальное — 404.
        return sendJson(res, 404, { error: `Не найдено: ${req.url}` });
      });
    },
  };
}