# ÉLAIRE — салон услуг (React + Vite)

Учебный проект: сайт салона красоты с онлайн-записью на React.
Данные приходят с локального имитационного сервера. Используется
на лекции и как справочник для самостоятельной работы.

---

## Установка

Нужен **Node.js** версии 18 или выше и **npm**.

```bash
node --version
npm --version
```

Если команды не найдены — установите Node.js с [nodejs.org](https://nodejs.org).

---

## Запуск

```bash
npm install     # установить зависимости (один раз)
npm run dev     # запустить dev-сервер
```

Vite напишет адрес — обычно `http://localhost:3000`.
Откройте его в браузере.

Другие команды:

```bash
npm run build     # собрать продакшн-версию в dist/
npm run preview   # посмотреть собранную версию
npm run lint      # проверить код линтером
```

---

## Что внутри

Четыре экрана, переключаются через `useState` в `App.jsx`:

| Экран                | Компонент            | Что показывает                    |
| -------------------- | -------------------- | --------------------------------- |
| Главная              | `HomeScreen`         | Промо, популярные услуги, мастера |
| Выбор услуг          | `ServicesScreen`     | Категории слева, услуги справа    |
| Выбор даты и времени | `BookingScreen`      | Календарь + слоты времени         |
| Подтверждение        | `ConfirmationScreen` | Детали визита + форма + модалка   |

**Все данные приходят с сервера.** Приложение обращается к эндпоинтам
`/api/*`, которые обслуживает локальный имитационный сервер — плагин
Vite. Когда появится настоящий backend (например, на Python), клиент
не изменится — поменяется только адрес сервера.

---

## Структура

```
src/
├── api/                # клиент для работы с сервером
│   ├── http.js         # общая обёртка над fetch
│   ├── servicesApi.js  # категории и услуги
│   ├── homeApi.js      # мастера и популярные услуги
│   ├── bookingApi.js   # today, слоты, отправка записи
│   └── index.js        # реэкспорт всех функций
│
├── components/
│   ├── common/         # общие: Header, Footer, StepIndicator, Modal, LoadingState
│   ├── home/           # Hero, PopularServices, OurMasters, ServiceCard, MasterCard
│   ├── services/       # Sidebar, CategoryItem, ServicesList, ServiceRow
│   ├── booking/        # Calendar, CalendarHeader, CalendarGrid, TimeSlots, BookingBottomBar
│   └── confirmation/   # BookingDetails, ContactForm, ConfirmationModal
│
├── screens/            # четыре экрана приложения
│   ├── HomeScreen.jsx
│   ├── ServicesScreen.jsx
│   ├── BookingScreen.jsx
│   └── ConfirmationScreen.jsx
│
├── data/               # чистые функции, не завязанные на сервер
│   ├── date.js         # работа с датами, массивы месяцев и дней недели
│   └── price.js        # форматирование цены
│
├── styles/             # стили по экранам
│   ├── common.css      # общие: Header, Footer, StepIndicator, page
│   ├── home.css
│   ├── services.css
│   ├── booking.css
│   ├── confirmation.css
│   └── modal.css
│
├── App.jsx             # корневой компонент
└── main.jsx            # точка входа
```

---

## Серверная часть

Сервер — это плагин Vite. Он перехватывает запросы к `/api/*`
и отдаёт JSON. Всё остальное пропускает к Vite — чтобы отдавались
HTML, CSS, JS и картинки.

```
server/
├── database.js         # «база данных» — все категории, услуги, мастера, слоты
├── server.js           # API-эндпоинты (плагин Vite)
├── types.js            # заглушка типов (JSDoc)
└── bookings.txt        # файл, куда пишутся записи (одна строка = одна запись)
```

Подключён в `vite.config.js`:

```js
import apiMiddleware from "./server/server.js";

export default defineConfig({
  plugins: [react(), apiMiddleware()],
});
```

### Эндпоинты

| Метод | URL                                         | Что возвращает                       |
| ----- | ------------------------------------------- | ------------------------------------ |
| GET   | `/api/categories`                           | Список категорий с количеством услуг |
| GET   | `/api/categories/:id/services`              | Услуги одной категории               |
| GET   | `/api/services/:id/slots?day=&month=&year=` | Слоты на дату для услуги             |
| GET   | `/api/booking/today`                        | «Сегодня» по мнению сервера          |
| GET   | `/api/masters`                              | Мастера для главной                  |
| GET   | `/api/popular-services`                     | Популярные услуги для главной        |
| POST  | `/api/booking`                              | Сохранить запись                     |

Проверить их можно прямо в браузере:

```
http://localhost:3000/api/categories
http://localhost:3000/api/services/1/slots?day=17&month=9&year=2026
http://localhost:3000/api/booking/today
```

POST проверяется через консоль браузера или Postman.

### Что пишется в `bookings.txt`

Каждая отправка формы на странице подтверждения добавляет одну строку
в `server/bookings.txt`. Формат — JSON. Тело запроса:

```json
{
  "serviceId": 1,
  "date": { "day": 17, "month": 9, "year": 2026 },
  "time": "12:00",
  "name": "Анна Петрова",
  "phone": "+7 (999) 123-45-67",
  "comment": "Пожелания по дизайну"
}
```

Объект услуги целиком не передаётся — только `serviceId`. Сервер сам
знает, что за услуга скрывается за этим id.

### Что можно менять в сервере

- **Задержка ответа** — константа `DELAY_MS` в `server.js`. Стоит `500` мс,
  чтобы на клиенте было видно состояние «Загрузка…». Поменяй на `0` для
  мгновенных ответов или на `1500`, чтобы загрузка была заметнее.
- **Данные** — все категории, услуги, мастера, слоты лежат в `server/database.js`.
  Правь там.
- **Путь к файлу записей** — константа `BOOKINGS_FILE` в `server.js`.

---

## Картинки

Все картинки лежат в `public/images/`. Vite отдаёт файлы из `public/`
по корню — то есть `public/images/hero-salon.png` доступен как
`/images/hero-salon.png`.

Импортов картинок в JS нет — пути передаются строками. Так делает
настоящий backend: файлы лежат статикой, а сервер отдаёт ссылки.

Список картинок:

```
public/images/
├── hero-salon.png
├── master-ekaterina.png
├── master-alisa.png
├── master-daniil.png
├── service-haircut.png
├── service-manicure.png
└── service-spa.png
```

---

## Как устроена работа с сервером

Пример — загрузка категорий в `ServicesScreen.jsx`:

```jsx
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategories();
      setCategories(data);
      if (data.length > 0) setActiveCategoryId(data[0].id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);
```

Три состояния: **загрузка** → **ошибка** или **данные**.
Пока идёт запрос — показываем `LoadingState`, при ошибке — `EmptyState`,
после — данные.

Такая схема повторяется на всех экранах:

- **`ServicesScreen`** — загрузка категорий.
- **`ServicesList`** — загрузка услуг по выбранной категории.
- **`BookingScreen`** — загрузка `today` и слотов.
- **`PopularServices`** и **`OurMasters`** — загрузка для главной.
- **`ConfirmationScreen`** — отправка POST при подтверждении.

---

## Где что искать

- **Навигация между экранами** — `src/App.jsx`. Здесь `screen` (какой экран
  показать) и `booking` (что выбрал пользователь: услуга, дата, время).
- **Запросы к серверу** — `src/api/`. Каждый домен — в своём файле.
- **Календарь** — `src/screens/BookingScreen.jsx` и `src/components/booking/`.
- **Форма подтверждения** — `src/components/confirmation/ContactForm.jsx`.
- **Модалка** — `src/components/common/Modal.jsx` (обёртка)
  и `src/components/confirmation/ConfirmationModal.jsx` (содержимое).
- **Работа с датами** — `src/data/date.js`.
- **Форматирование цены** — `src/data/price.js`.
- **Данные сервера** — `server/database.js`.
- **Эндпоинты** — `server/server.js`.

---

## Что можно скопировать в свой проект

- **`src/data/date.js`** — работа с датами и массивы месяцев/дней недели.
- **`src/data/price.js`** — форматирование цены.

Эти файлы не зависят ни от React, ни от данных салона. Копируйте и используйте.

Компоненты (`CalendarGrid`, `TimeSlots` и т.д.) — смотрите как пример.
Разметка у вас будет своя, но принципы одни и те же.

---

## Стек

React 18, Vite, обычный CSS. Без роутера, стейт-менеджера, UI-кита.
Сервер — плагин Vite на Node.js, данные хранятся в памяти, записи — в файле.
