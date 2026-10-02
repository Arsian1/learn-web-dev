// Импортируем картинки мастеров как модули.
//
// В Vite картинку можно импортировать прямо в JS — сборщик сам
// найдёт файл, скопирует в итоговую сборку и подставит правильный
// путь. В переменной masterEkaterina окажется строка вроде
// "/assets/master-ekaterina-abc123.png" — с хешем для кеширования.
//
// Путь "../../images/master-ekaterina.png" — это подъём
// из src/data/ в src/, потом в images/. Папка images лежит
// рядом с components и data — на одном уровне.
import masterEkaterina from "../images/master-ekaterina.png";
import masterAlisa from "../images/master-alisa.png";
import masterDaniil from "../images/master-daniil.png";

// MASTERS — массив мастеров для секции «Наши мастера» на главной.
//
// Используется в OurMasters.jsx: там по этому массиву идёт map,
// и для каждого мастера рендерится <MasterCard />.
//
// Каждый мастер:
//   id     — уникальный идентификатор (используется как key в списках)
//   name   — имя мастера
//   role   — специализация
//   rating — рейтинг от 0 до 5 (число с плавающей точкой)
//   image  — путь к фото, который вернул Vite после импорта
//
// TODO: когда появится backend, массив заменится на fetch
// из /api/masters. Структура объектов при этом не изменится —
// если сервер отдаёт те же поля, компоненты трогать не придётся.
export const MASTERS = [
  {
    id: 1,
    name: "Екатерина Милова",
    role: "Топ-стилист по волосам",
    rating: 5.0,
    image: masterEkaterina,
  },
  {
    id: 2,
    name: "Алиса Розен",
    role: "Мастер ногтевой эстетики",
    rating: 4.9,
    image: masterAlisa,
  },
  {
    id: 3,
    name: "Даниил Громов",
    role: "Мастер спа & Массажа",
    rating: 4.9,
    image: masterDaniil,
  },
];
