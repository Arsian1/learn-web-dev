// Серверный API для Vite.
//
// Работает как плагин Vite: перехватывает запросы к /api/* и отдаёт
// JSON. Всё остальное пропускает дальше — чтобы Vite отдавал HTML,
// CSS, JS и картинки.
//
// Когда появится настоящий backend на Python — этот файл исчезнет,
// а клиент продолжит обращаться к тем же URL (/api/...).
// Единственное, что изменится — порт и адрес сервера.
import { database } from "./database.js";

// Плагин Vite. Возвращает объект с хуком configureServer,
// который вызывается, когда Vite поднимает dev-сервер.
export default function apiMiddleware() {
  return {
    name: "api-middleware",
    configureServer(server) {
      console.log("API Middleware загружен");

      // middleware — функция, встроенная в цепочку обработки запросов.
      // Каждый middleware может: обработать запрос сам или пропустить
      // его дальше через next().
      server.middlewares.use((req, res, next) => {
        // Не /api/* — пропускаем дальше, пусть Vite обрабатывает.
        if (!req.url.startsWith("/api/")) {
          return next();
        }

        // Разрешаем кросс-доменные запросы, иначе браузер
        // заблокирует fetch с другого адреса.
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        );
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Preflight (OPTIONS). Браузер сначала спрашивает разрешение,
        // и только потом шлёт настоящий запрос. Отвечаем 200 «всё ок».
        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          res.end();
          return;
        }

        // GET /api/categories — список категорий с количеством услуг.
        if (req.url === "/api/categories" || req.url === "/api/categories/") {
          try {
            const categories = getCategories();
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(categories));
            console.log(`Отправлены категории: ${categories.length}`);
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }

        // GET /api/categories/:id/services — услуги одной категории.
        // Искусственная задержка 1000 мс, чтобы на клиенте было
        // видно состояние «Загрузка…».
        const servicesMatch = req.url.match(
          /^\/api\/categories\/(\d+)\/services$/
        );
        if (servicesMatch) {
          const categoryId = parseInt(servicesMatch[1]);

          try {
            const services = getServicesByCategory(categoryId);

            setTimeout(() => {
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify(services));
              console.log(
                `Отправлены услуги для категории ${categoryId}: ${services.length}`
              );
            }, 1000);
          } catch (error) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }

        // Неизвестный URL — 404.
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({ error: `API endpoint not found: ${req.url}` })
        );
      });
    },
  };
}

// Возвращает категории без услуг — только с их количеством.
// Клиенту для сайдбара не нужен весь список услуг, хватит числа.
function getCategories() {
  return database.categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    servicesCount: cat.services.length,
  }));
}

// Возвращает услуги указанной категории.
// Если категории нет — кидает ошибку, которую ловит обработчик выше.
function getServicesByCategory(categoryId) {
  const category = database.categories.find((cat) => cat.id === categoryId);
  if (!category) {
    throw new Error(`Категория с ID ${categoryId} не найдена`);
  }
  return category.services;
}
