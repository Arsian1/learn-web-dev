// Реэкспорт всех API-функций.
//
// Зачем: чтобы в компонентах не писать длинные пути
// (../api/servicesApi, ../api/bookingApi), а импортировать
// всё из одного места.
//
// Пример использования:
//   import { fetchCategories, fetchToday } from "../api";
export * from "./servicesApi";
export * from "./homeApi";
export * from "./bookingApi";
