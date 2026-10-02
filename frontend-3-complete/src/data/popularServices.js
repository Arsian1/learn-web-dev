// Импортируем картинки услуг как модули.
//
// Vite подставит правильный путь и захеширует имя файла.
// В переменных будут строки вида "/assets/service-haircut-abc123.png".
import serviceHaircut from "../images/service-haircut.png";
import serviceManicure from "../images/service-manicure.png";
import serviceSpa from "../images/service-spa.png";

// POPULAR_SERVICES — массив популярных услуг для главной страницы.
//
// Используется в PopularServices.jsx: там по этому массиву идёт map,
// и для каждой услуги рендерится <ServiceCard />.
//
// Каждая услуга:
//   id       — уникальный идентификатор (key в списках)
//   title    — название услуги
//   price    — цена в рублях (число)
//   duration — длительность в минутах (число)
//   image    — путь к фото, который вернул Vite после импорта
//
// TODO: когда появится backend, массив заменится на fetch
// из /api/popular-services. Структура объектов сохранится,
// и PopularServices.jsx не придётся менять.
export const POPULAR_SERVICES = [
  {
    id: 1,
    title: "Фирменная стрижка & Уход",
    price: 4500,
    duration: 60,
    image: serviceHaircut,
  },
  {
    id: 2,
    title: "Эстетический японский маникюр",
    price: 3200,
    duration: 50,
    image: serviceManicure,
  },
  {
    id: 3,
    title: "Глубокий спа-уход & Массаж",
    price: 6500,
    duration: 90,
    image: serviceSpa,
  },
];