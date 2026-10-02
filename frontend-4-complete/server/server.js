// ==========================================================================
// Серверный API для Vite.
//
// Работает как плагин Vite: перехватывает запросы к /api/* и отдаёт JSON.
// Всё остальное пропускает дальше — чтобы Vite отдавал статику.
//
// Когда появится настоящий backend на Python — этот файл исчезнет,
// а клиент продолжит обращаться к тем же URL (/api/...).
// Единственное, что изменится — порт и адрес сервера.
// ==========================================================================

import fs from "node:fs";
import path from "node:path";
import { database } from "./database.js";

// ==========================================================================
// КОНФИГУРАЦИЯ СЕРВЕРА
//
// Здесь собраны настройки, которые можно менять.
// Если что-то поменяешь — перезапусти dev-сервер (Ctrl+C и снова npm run dev),
// чтобы Vite перечитал файл.
// ==========================================================================

// Путь к файлу, куда пишутся записи.
// Одна строка = одна запись. Формат — JSON.
const BOOKINGS_FILE = path.resolve("server/bookings.txt");

// Искусственная задержка ответа, имитирует работу сети.
// Нужна, чтобы на клиенте было видно состояние «Загрузка…».
// 500 — полсекунды. Можно поставить:
//   0    — отвечать мгновенно (удобно, когда верстаешь)
//   100  — быстрая имитация
//   500  — как сейчас (по умолчанию)
//   1500 — медленно, видно каждый шаг
const DELAY_MS = 500;

// ==========================================================================
// СЛУЖЕБНЫЕ ФУНКЦИИ
//
// Не трогай их без необходимости. Они делают всю «скучную» работу:
// задержку, отправку JSON, чтение тела POST-запроса.
// ==========================================================================

// Промис-обёртка для setTimeout — чтобы использовать await.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Отправка JSON-ответа с нужным статусом и CORS-заголовками.
// CORS-заголовки нужны, чтобы браузер не блокировал запрос
// с другого адреса (например, если клиент откроется не через Vite).
function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.end(JSON.stringify(data));
}

// Чтение тела POST-запроса. Оно приходит стримом — собираем по кускам.
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

// ==========================================================================
// ОСНОВНОЙ ПЛАГИН
// ==========================================================================

export default function apiMiddleware() {
  return {
    name: "api-middleware",
    configureServer(server) {
      console.log("API middleware загружен");

      server.middlewares.use(async (req, res, next) => {
        // Не /api/* — пропускаем дальше, пусть Vite обрабатывает.
        // Это позволяет страницам, стилям и картинкам работать как обычно.
        if (!req.url.startsWith("/api/")) {
          return next();
        }

        // ------------------------------------------------------------------
        // CORS-preflight (OPTIONS)
        //
        // Браузер перед «настоящим» POST-запросом сначала отправляет
        // OPTIONS — спрашивает разрешение. Мы отвечаем 204 «всё ок».
        // ------------------------------------------------------------------
        if (req.method === "OPTIONS") {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          res.statusCode = 204;
          res.end();
          return;
        }

        // ------------------------------------------------------------------
        // GET /api/categories
        //
        // Список категорий с количеством услуг в каждой.
        // Категория отдаётся без массива услуг — только счётчик.
        // Так быстрее и клиенту хватает для сайдбара.
        // ------------------------------------------------------------------
        if (req.method === "GET" && req.url === "/api/categories") {
          await delay(DELAY_MS);
          const categories = database.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            servicesCount: cat.services.length,
          }));
          return sendJson(res, 200, categories);
        }

        // ------------------------------------------------------------------
        // GET /api/categories/:id/services
        //
        // Услуги одной категории.
        // :id — id категории (число).
        // ------------------------------------------------------------------
        const servicesMatch = req.url.match(
          /^\/api\/categories\/(\d+)\/services$/
        );
        if (req.method === "GET" && servicesMatch) {
          await delay(DELAY_MS);
          const categoryId = parseInt(servicesMatch[1]);
          const category = database.categories.find((c) => c.id === categoryId);
          if (!category) {
            return sendJson(res, 404, { error: "Категория не найдена" });
          }
          return sendJson(res, 200, category.services);
        }

        // ------------------------------------------------------------------
        // GET /api/masters
        //
        // Список мастеров для главной страницы.
        // ------------------------------------------------------------------
        if (req.method === "GET" && req.url === "/api/masters") {
          await delay(DELAY_MS);
          return sendJson(res, 200, database.masters);
        }

        // ------------------------------------------------------------------
        // GET /api/popular-services
        //
        // Популярные услуги для главной страницы.
        // ------------------------------------------------------------------
        if (req.method === "GET" && req.url === "/api/popular-services") {
          await delay(DELAY_MS);
          return sendJson(res, 200, database.popularServices);
        }

        // ------------------------------------------------------------------
        // GET /api/booking/today
        //
        // «Сегодня» по мнению сервера. Нужно, чтобы календарь знал,
        // какой месяц показывать и какие дни блокировать.
        // ------------------------------------------------------------------
        if (req.method === "GET" && req.url === "/api/booking/today") {
          await delay(DELAY_MS);
          return sendJson(res, 200, database.today);
        }

        // ------------------------------------------------------------------
        // GET /api/services/:id/slots?day=&month=&year=
        //
        // Слоты на конкретную дату для конкретной услуги.
        // :id       — id услуги (не категории!).
        // day       — число месяца (1–31).
        // month     — месяц, 0-индексный (0 = январь, 9 = октябрь).
        // year      — год (2026).
        //
        // Почему по услуге, а не по категории: в реальной жизни слоты
        // зависят от мастера, который выполняет услугу, и от её
        // длительности. Категория — это просто группировка для каталога.
        //
        // Сейчас мы это не моделируем — просто отдаём разные наборы
        // для чётных и нечётных дней. Но URL и параметр уже правильные:
        // клиент присылает id услуги.
        // ------------------------------------------------------------------
        const slotsMatch = req.url.match(/^\/api\/services\/(\d+)\/slots/);
        if (req.method === "GET" && slotsMatch) {
          await delay(DELAY_MS);
          const url = new URL(req.url, "http://localhost");
          const serviceId = parseInt(slotsMatch[1]);
          const day = parseInt(url.searchParams.get("day"));
          const month = parseInt(url.searchParams.get("month"));
          const year = parseInt(url.searchParams.get("year"));

          // Проверяем, что дата пришла полностью.
          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return sendJson(res, 400, {
              error: "Нужны параметры day, month, year",
            });
          }

          // Ищем услугу по id среди всех категорий.
          let foundService = null;
          for (const category of database.categories) {
            const service = category.services.find((s) => s.id === serviceId);
            if (service) {
              foundService = service;
              break;
            }
          }

          if (!foundService) {
            return sendJson(res, 404, { error: "Услуга не найдена" });
          }

          // Имитация: чётный день — один набор слотов, нечётный — другой.
          const isEven = day % 2 === 0;
          const slots = isEven ? database.slotsEvenDay : database.slotsOddDay;

          // Возвращаем слоты вместе с датой, к которой они относятся.
          // Дата в ответе нужна клиенту для защиты от гонок: если
          // пользователь быстро кликает по дням, ответы могут прийти
          // не в том порядке, и клиент по этому полю поймёт,
          // к какому дню относятся слоты.
          return sendJson(res, 200, {
            date: { day, month, year },
            slots,
          });
        }

        // ------------------------------------------------------------------
        // POST /api/booking
        //
        // Сохранить запись.
        // Тело — JSON с данными записи. Мы просто пишем его в файл
        // одной строкой. Никакой валидации, никакой БД — это нужно,
        // чтобы показать: данные ушли на сервер и их можно прочитать.
        // ------------------------------------------------------------------
        if (req.method === "POST" && req.url === "/api/booking") {
          try {
            const raw = await readBody(req);
            const booking = JSON.parse(raw);
            const line = JSON.stringify(booking) + "\n";
            fs.appendFileSync(BOOKINGS_FILE, line, "utf-8");
            console.log("Запись сохранена:", booking);
            return sendJson(res, 200, { ok: true });
          } catch (err) {
            return sendJson(res, 400, { error: "Некорректные данные" });
          }
        }

        // ------------------------------------------------------------------
        // Всё остальное — 404.
        // ------------------------------------------------------------------
        return sendJson(res, 404, { error: `Не найдено: ${req.url}` });
      });
    },
  };
}
