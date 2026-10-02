// Общая обёртка над fetch.
//
// Делает запрос, проверяет статус, парсит JSON. Всё, что нужно
// от запроса, — в одном месте. Остальные модули вызывают request()
// и не думают про заголовки, статусы и парсинг.
//
// Когда появится backend на Python — здесь ничего не поменяется,
// потому что URL останутся те же (/api/...).
export async function request(url, options) {
  const response = await fetch(url, options);

  // 2xx — всё хорошо. Иначе — кидаем ошибку с текстом от сервера.
  if (!response.ok) {
    let message = `HTTP error ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.error) {
        message = data.error;
      }
    } catch (e) {
      // Тело не JSON — оставляем базовый текст.
    }
    throw new Error(message);
  }

  // Пустой ответ (204) — вернуть null.
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
