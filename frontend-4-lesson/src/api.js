// API-клиент. Все запросы к серверу — здесь.
//
// Зачем отдельный файл:
// компоненты не должны знать про fetch, URL, JSON, заголовки.
// Они вызывают функцию и получают данные или ошибку.
//
// Когда backend переедет с JS-имитации на Python — правится
// только этот файл. URL-адреса останутся те же.
//
// Все функции асинхронные (async), возвращают Promise.
// Если сервер ответил не 2xx — кидают Error с понятным текстом.

// GET /api/categories
// Возвращает список категорий с количеством услуг.
// Формат: [{ id, name, servicesCount }, ...].
export async function fetchCategories() {
  try {
    // Отправляем GET-запрос. fetch возвращает Promise.
    const response = await fetch("/api/categories");

    // Проверяем статус: 200–299 — успех. Всё остальное — ошибка.
    // Без этой проверки fetch не падает сам по себе, а мы бы
    // получили в response.json() мусор.
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Парсим JSON. Тоже асинхронно — поэтому await.
    const result = await response.json();
    return result;
  } catch (error) {
    // Логируем и пробрасываем ошибку наверх.
    // Компонент, который вызвал fetchCategories, поймает её
    // в своём try/catch и покажет пользователю.
    console.error("Ошибка загрузки категорий:", error);
    throw error;
  }
}

// GET /api/categories/:id/services
// Возвращает список услуг указанной категории.
// Формат: [{ id, title, desc, duration, price }, ...].
export async function fetchServicesByCategory(categoryId) {
  try {
    // Подставляем id категории в URL.
    const response = await fetch(`/api/categories/${categoryId}/services`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Ошибка загрузки услуг:", error);
    throw error;
  }
}
