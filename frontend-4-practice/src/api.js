// API-клиент. Все запросы к серверу — здесь.
//
// Компоненты не должны знать про fetch, URL и JSON. Они вызывают
// функцию и получают данные или ошибку. Когда backend переедет
// с JS-имитации на Python — правится только этот файл.

// Общая обёртка над fetch.
// Делает запрос, проверяет статус, парсит JSON.
async function request(url) {
  const response = await fetch(url);

  // 2xx — всё хорошо. Иначе — кидаем ошибку с текстом от сервера.
  if (!response.ok) {
    let message = `HTTP error ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.error) message = data.error;
    } catch (e) {
      // Тело не JSON — оставляем базовый текст.
    }
    throw new Error(message);
  }

  return response.json();
}

// GET /api/booking/today
// Возвращает «сегодня» по мнению сервера: { day, month, year }.
// Месяц — 0-индексный, как в new Date().
export async function fetchToday() {
  return request("/api/booking/today");
}

// GET /api/slots?day=&month=&year=
// Возвращает слоты для указанной даты.
// Формат ответа: { date: { day, month, year }, slots: [{ time, available }] }.
//
// date в ответе — та же дата, что пришла в запросе. Нужна,
// чтобы понять, к какому дню относятся слоты. Если пользователь
// быстро кликает по дням, ответы могут прийти не в том порядке —
// по этому полю клиент поймёт, какой из них актуальный.
export async function fetchSlots(date) {
  const url = `/api/slots?day=${date.day}&month=${date.month}&year=${date.year}`;
  return request(url);
}
