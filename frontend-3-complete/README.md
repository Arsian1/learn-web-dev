# ÉLAIRE — салон услуг (React)

Учебный проект: сайт салона красоты с онлайн-записью на React.
Используется на лекции и как справочник для самостоятельной работы.

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

Vite напишет адрес — обычно `http://localhost:5173`.
Откройте его в браузере.

---

## Что внутри

Четыре экрана, переключаются через `useState` в `App.jsx`:

| Экран | Компонент | Что показывает |
|---|---|---|
| Главная | `HomeScreen` | Промо, популярные услуги, мастера |
| Выбор услуг | `ServicesScreen` | Категории слева, услуги справа |
| Выбор даты и времени | `BookingScreen` | Календарь + слоты времени |
| Подтверждение | `ConfirmationScreen` | Детали визита + форма + модалка |

---

## Структура

```
src/
├── components/
│   ├── common/         # общие: Header, Footer, StepIndicator, Modal
│   ├── services/       # компоненты страницы услуг
│   ├── booking/        # компоненты страницы календаря
│   └── confirmation/   # компоненты страницы подтверждения
│
├── screens/            # четыре экрана приложения
│   ├── HomeScreen.jsx
│   ├── ServicesScreen.jsx
│   ├── BookingScreen.jsx
│   └── ConfirmationScreen.jsx
│
├── data/               # данные и утилиты
│   ├── services.js     # каталог услуг по категориям
│   ├── slots.js        # слоты времени
│   ├── popularServices.js
│   ├── masters.js
│   ├── date.js         # работа с датами
│   └── price.js        # форматирование цены
│
├── styles/             # стили по экранам
│   ├── common.css
│   ├── home.css
│   ├── services.css
│   ├── booking.css
│   ├── confirmation.css
│   └── modal.css
│
├── images/             # картинки
│
├── App.jsx             # корневой компонент
└── main.jsx            # точка входа
```

---

## Где что искать

- **Навигация между экранами** — `src/App.jsx`. Здесь `screen` (какой экран показать) и `booking` (что выбрал пользователь).
- **Календарь** — `src/screens/BookingScreen.jsx` и `src/components/booking/`. Состоит из `Calendar`, `CalendarHeader`, `CalendarGrid`, `TimeSlots`, `BookingBottomBar`.
- **Форма** — `src/components/confirmation/ContactForm.jsx`.
- **Модалка** — `src/components/common/Modal.jsx` (обёртка) и `src/components/confirmation/ConfirmationModal.jsx` (содержимое).
- **Работа с датами** — `src/data/date.js`.
- **Форматирование цены** — `src/data/price.js`.

---

## Что можно скопировать в свой проект

- **`src/data/date.js`** — работа с датами и массивы месяцев/дней недели.
- **`src/data/price.js`** — форматирование цены.

Эти файлы не зависят ни от React, ни от данных салона. Копируйте и используйте.

Компоненты (`CalendarGrid`, `TimeSlots` и т.д.) — смотрите как пример. Разметка у вас будет своя, но принципы одни и те же.

---

## Стек

React 18, Vite, обычный CSS. Без роутера, стейт-менеджера, UI-кита.
