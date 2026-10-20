// src/api.js — функции для запросов к серверу.

async function request(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка сервера (${response.status})`);
  }
  return response.json();
}

// GET /api/booking/today -> { day, month, year } (month — 0-индексный)
export function fetchToday() {
  return request('/api/booking/today');
}

// GET /api/slots?day=&month=&year= -> { date, slots }
export function fetchSlots(date) {
  const query = new URLSearchParams({
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  });
  return request(`/api/slots?${query}`);
}
