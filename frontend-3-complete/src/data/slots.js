// ==========================================================================
// Данные для страницы выбора даты и времени.
//
// Здесь три набора слотов:
//   SERVER_DATA     — стартовый ответ сервера при открытии страницы
//   SLOTS_EVEN_DAY  — слоты для чётных дней
//   SLOTS_ODD_DAY   — слоты для нечётных дней
//
// Зачем три набора, а не один:
// когда появится backend, слоты будут приходить с сервера отдельно
// на каждую дату. Сейчас мы имитируем это поведение: у чётных
// и нечётных дней слоты разные, чтобы вы увидели, что данные
// действительно меняются при клике на другой день.
//
// TODO: когда появится backend — все три константы исчезнут,
// а на их место придёт fetch из /api/slots?date=...
// ==========================================================================

// SERVER_DATA — стартовый ответ сервера при открытии страницы.
//
// today — сегодняшняя дата по мнению сервера. Используется в календаре:
//   - чтобы подсветить «сегодня»,
//   - чтобы запретить выбирать дни раньше этой даты.
//
// slots — слоты на сегодня. Показываются сразу при открытии страницы,
// чтобы пользователь не видел пустой экран.
//
// Обрати внимание на формат даты: { day, month, year }. Месяц —
// 0-индексный, как в объекте Date: 9 = октябрь. Это внутренний
// формат проекта, он используется во всех местах, где речь про дату.
export const SERVER_DATA = {
  today: { day: 17, month: 9, year: 2026 },
  slots: [
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: false },
    { time: "11:30", available: true },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: false },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "19:30", available: true },
  ],
};

// SLOTS_EVEN_DAY — слоты для чётных дней (2, 4, 6, ..., 30).
//
// Отличаются от нечётных тем, что часть слотов занята:
// 12:00 и 13:00 — unavailable. Это чтобы вы, кликая по дням,
// видели: «а данные-то разные приходят».
//
// TODO: в реальном проекте эти данные приходят с сервера
// для конкретной даты. Массив исчезнет.
export const SLOTS_EVEN_DAY = [
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: true },
  { time: "11:30", available: true },
  { time: "12:00", available: false },
  { time: "13:00", available: false },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "19:30", available: true },
];

// SLOTS_ODD_DAY — слоты для нечётных дней (1, 3, 5, ..., 31).
//
// Здесь тоже два недоступных слота, но другие: 11:00 и 16:00.
// Так пользователь видит, что данные меняются в зависимости
// от дня, а не всегда одни и те же.
//
// TODO: то же — заменится на fetch к серверу.
export const SLOTS_ODD_DAY = [
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: false },
  { time: "11:30", available: true },
  { time: "12:00", available: true },
  { time: "13:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: false },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "19:30", available: true },
];