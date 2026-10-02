// Запросы для главной страницы: мастера и популярные услуги.
import { request } from "./http";

// GET /api/masters
// Возвращает массив мастеров: { id, name, role, rating }.
export async function fetchMasters() {
  return request("/api/masters");
}

// GET /api/popular-services
// Возвращает массив популярных услуг: { id, title, price, duration }.
export async function fetchPopularServices() {
  return request("/api/popular-services");
}
