// Запросы для страницы календаря и подтверждения.
import { request } from "./http";

// GET /api/booking/today
// Возвращает «сегодня» по мнению сервера: { day, month, year }.
export async function fetchToday() {
  return request("/api/booking/today");
}

// GET /api/services/:id/slots?day=&month=&year=
// Возвращает слоты для услуги и даты.
// Формат: { date: { day, month, year }, slots: [{ time, available }] }.
//
// date в ответе нужна клиенту для защиты от гонок: если пользователь
// быстро кликает по дням, ответы могут прийти не в том порядке.
export async function fetchSlots(serviceId, date) {
  const url =
    `/api/services/${serviceId}/slots` +
    `?day=${date.day}&month=${date.month}&year=${date.year}`;
  return request(url);
}

// POST /api/booking
// Отправляет запись на сервер.
// Тело: { service, date, time, name, phone, comment }.
export async function postBooking(booking) {
  return request("/api/booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });
}
