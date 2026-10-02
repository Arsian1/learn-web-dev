// Запросы по услугам: категории и услуги внутри них.
// Используется на странице выбора услуги.
import { request } from "./http";

// GET /api/categories
// Возвращает массив категорий: { id, name, servicesCount }.
export async function fetchCategories() {
  return request("/api/categories");
}

// GET /api/categories/:id/services
// Возвращает массив услуг категории: { id, title, desc, duration, price }.
export async function fetchServicesByCategory(categoryId) {
  return request(`/api/categories/${categoryId}/services`);
}
