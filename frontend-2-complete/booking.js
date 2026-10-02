// ============================================================
// 1. ДАННЫЕ, КОТОРЫЕ ПРИХОДЯТ С СЕРВЕРА
// ============================================================
//
// Пока данных нет с настоящего сервера, но по структуре они
// выглядят так, как будто пришли оттуда. Когда появится backend,
// весь этот блок заменится на fetch-запросы.
//
// Формат даты — { day, month, year }, месяц 0-индексный
// (0 = январь, 9 = октябрь). Так же работает new Date() в JS,
// поэтому такой формат удобен: не надо ничего конвертировать.
//
// Формат слота — { time, available }. time — строка "10:00",
// available — булево: свободно или занято. Когда сервер отдаёт
// слоты, он присылает и занятые тоже — чтобы на экране было
// видно, что время существует, но недоступно.

// SERVER_DATA — стартовый ответ сервера при открытии страницы.
// today используется, чтобы:
//   - подсветить «сегодня» в календаре,
//   - запретить выбор дней раньше today.
// slots — стартовые слоты (на today), показываются сразу
// при открытии страницы, чтобы пользователь не видел пустой экран.
const SERVER_DATA = {
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

// SLOTS_EVEN_DAY — слоты для чётных дней.
// Нужны, чтобы имитировать «разные данные приходят с сервера
// в разные дни». Когда появится backend, эти константы исчезнут.
// Здесь днём занято 12:00 и 13:00.
const SLOTS_EVEN_DAY = [
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

// SLOTS_ODD_DAY — слоты для нечётных дней.
// Тут занято другое время — 11:00 и 16:00. Разница с чётными днями
// сделана специально: чтобы при клике на разные дни пользователь
// видел, что данные действительно обновляются.
const SLOTS_ODD_DAY = [
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

// ============================================================
// 2. СОСТОЯНИЕ ДЛЯ СТРАНИЦЫ
// ============================================================
//
// Состояние — то, что меняется при действиях пользователя
// и живёт в браузере. С сервера не приходит.
//
// BOOKING_STATE описывает:
//   currentMonth / currentYear — какой месяц и год показаны
//                                 в календаре (не обязательно
//                                 совпадает с выбранной датой,
//                                 потому что пользователь может
//                                 листать месяцы);
//   selectedDay                — какой день выбран;
//   selectedTime               — какое время выбрано (null, если нет).
//
// Один объект, а не четыре отдельные переменные — потому что
// так проще передавать данные между функциями и понятно, что всё
// это относится к одному экрану.
const BOOKING_STATE = {
  currentMonth: 9,
  currentYear: 2026,
  selectedDay: 17,
  selectedTime: null,
};

// ============================================================
// 3. ЛОГИКА ДЛЯ ИМИТАЦИИ РАБОТЫ С СЕРВЕРОМ
// ============================================================
//
// Когда появится backend, эти функции заменятся на fetch-запросы.
// Пока они просто возвращают данные из констант выше или
// сохраняют в localStorage.

// getSlotsForDay — «запрос» слотов на конкретный день.
// Определяет чётность дня и возвращает соответствующий набор.
// Позже превратится в что-то вроде:
//   fetch("/api/slots?date=" + date).then(r => r.json())
// и станет асинхронной.
function getSlotsForDay(day, month, year) {
  const isEven = day % 2 === 0;
  const slots = isEven ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
  return { day: day, month: month, year: year, slots: slots };
}

// saveSelectedDate — сохраняет выбранную дату и время в localStorage.
// Нужна, чтобы данные не потерялись при переходе на следующую
// страницу (confirmation.html). На следующей странице их прочитают
// через loadBooking() — точно такую же операцию с JSON.parse.
//
// Сначала читаем то, что уже лежит в хранилище (там может быть
// выбранная услуга с прошлого шага), потом дописываем поля date и time,
// не стирая остальное.
function saveSelectedDate(date, time) {
  const raw = localStorage.getItem("elair-booking");
  let booking = {};
  if (raw) {
    try {
      booking = JSON.parse(raw);
    } catch (e) {
      booking = {};
    }
  }
  booking.date = date;
  booking.time = time;
  localStorage.setItem("elair-booking", JSON.stringify(booking));
}

// ============================================================
// 4. ЧИСТЫЕ ФУНКЦИИ И ГЛОБАЛЬНЫЕ КОНСТАНТЫ
// ============================================================
//
// Чистые — значит, не зависят ни от DOM, ни от React, ни от
// данных проекта. Принимают аргументы, возвращают результат.
// Такие функции можно копировать в любой другой проект.

// Названия месяцев в именительном падеже — для заголовка
// календаря («Октябрь 2026»).
const MONTHS_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

// Названия месяцев в родительном падеже — для подписи в нижней
// панели («17 октября 2026»).
const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

// Дни недели. Порядок — как у getDay(): 0 = воскресенье.
const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

// compareDates — сравнивает две даты без времени.
// Возвращает -1, 0 или 1:
//   -1 — первая дата раньше,
//    0 — даты равны,
//    1 — первая дата позже.
//
// Внутри превращаем объекты { day, month, year } в Date, потому
// что Date умеет сравниваться операторами < и >, а наши объекты — нет.
function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// isDateSelectable — можно ли выбрать указанный день.
// Раньше today выбирать нельзя — это и проверяет функция.
// Если compareDates вернул 0 или 1 — дата не раньше today,
// значит выбирать можно.
function isDateSelectable(day, month, year) {
  const today = SERVER_DATA.today;
  return compareDates({ day: day, month: month, year: year }, today) >= 0;
}

// buildCalendarGrid — строит сетку календаря для месяца.
//
// На входе — год и месяц (0-индексный).
// На выходе — массив недель, каждая неделя — массив из 7 ячеек.
// Ячейка: { day, otherMonth }.
//   otherMonth: true  → день из соседнего месяца (серый, некликабельный)
//   otherMonth: false → день из текущего месяца
//
// Как работает:
//   1. Определяем, сколько дней в месяце (daysInMonth).
//   2. Определяем, с какого дня недели начинается месяц.
//   3. Считаем сдвиг offset, чтобы неделя начиналась с понедельника.
//   4. Заполняем плоский массив ячейками: дни предыдущего месяца,
//      потом текущего, потом добавляем дни следующего, чтобы
//      последняя неделя была полной.
//   5. Нарезаем массив на недели по 7.
//
// Чистая функция — можно копировать в любой проект.
function buildCalendarGrid(year, month) {
  // Первый день месяца и последний день месяца.
  // new Date(year, month + 1, 0) — «нулевой день следующего месяца»,
  // то есть последний день текущего. Стандартный трюк JavaScript.
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Сколько всего дней: 28, 29, 30 или 31.
  const daysInMonth = lastDay.getDate();

  // День недели первого числа: 0 = воскресенье, 1 = понедельник, ...
  const startDayOfWeek = firstDay.getDay();

  // Сдвиг, чтобы неделя начиналась с понедельника.
  // Если getDay() вернул 0 (воскресенье) — считаем его последним
  // днём недели, сдвигаем на 6. Иначе — на 1 (понедельник = 0).
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  // Сколько дней в предыдущем месяце. Нужно, чтобы нарисовать
  // «хвост» прошлого месяца в начале сетки.
  // new Date(year, month, 0) — последний день предыдущего месяца.
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  // Сюда собираем все ячейки подряд, потом нарежем на недели.
  const cells = [];

  // Дни предыдущего месяца. Идём от конца к началу: offset может быть
  // 0..6. Например, если месяц начинается со среды (offset = 2),
  // то в начале будут 30 и 31 из предыдущего месяца.
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }

  // Дни текущего месяца: 1, 2, 3, ..., 31.
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }

  // Дни следующего месяца. Добавляем столько, чтобы общее число
  // ячеек делилось на 7 без остатка.
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  // Нарезаем плоский массив на недели по 7 ячеек.
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// ============================================================
// 5. ОТРИСОВКА И ОБРАБОТЧИКИ
// ============================================================
//
// Здесь работаем с DOM: ищем элементы через querySelector,
// формируем HTML-строки и вставляем через innerHTML, вешаем
// обработчики через addEventListener.

// renderCalendar — рисует календарь на текущий месяц.
// Обновляет заголовок и сетку дней. После вставки HTML
// вешает обработчик клика на каждый активный день.
function renderCalendar() {
  const monthYearEl = document.querySelector(".month-year");
  const calendarGrid = document.querySelector(".grid-days");

  const year = BOOKING_STATE.currentYear;
  const month = BOOKING_STATE.currentMonth;

  // Заголовок: «Октябрь 2026».
  monthYearEl.textContent = MONTHS_NOMINATIVE[month] + " " + year;

  const weeks = buildCalendarGrid(year, month);
  const today = SERVER_DATA.today;

  // Собираем HTML строками. Это классический подход нативного JS:
  // собираем весь HTML в одну переменную и вставляем через innerHTML.
  // Альтернатива — создавать элементы через createElement, но это
  // более громоздко. innerHTML быстрее писать, но нужно быть
  // осторожным с пользовательскими данными (XSS). У нас данные
  // свои, из констант, поэтому безопасно.
  let html = "";
  weeks.forEach(function (week) {
    html += '<div class="week-row">';
    week.forEach(function (cell) {
      // Собираем классы ячейки по порядку.
      let classes = "day-cell";
      if (cell.otherMonth) classes += " other-month";

      // «Сегодня» — только для дней текущего месяца, и только
      // если совпадают день, месяц и год.
      const isToday =
        !cell.otherMonth &&
        cell.day === today.day &&
        month === today.month &&
        year === today.year;
      if (isToday) classes += " today";

      // «Выбранный» — только для дней текущего месяца.
      const isSelected =
        !cell.otherMonth &&
        cell.day === BOOKING_STATE.selectedDay &&
        month === BOOKING_STATE.currentMonth;
      if (isSelected) classes += " selected";

      // «Недоступный» — дни раньше today.
      const selectable = isDateSelectable(cell.day, month, year);
      if (!cell.otherMonth && !selectable) classes += " disabled";

      // Формируем разметку одной ячейки. data-атрибуты нужны,
      // чтобы потом в обработчике клика понять, на какой день
      // кликнули.
      html +=
        '<div class="' +
        classes +
        '" data-day="' +
        cell.day +
        '" data-other="' +
        cell.otherMonth +
        '">' +
        cell.day +
        "</div>";
    });
    html += "</div>";
  });

  // Вставляем готовый HTML в контейнер.
  calendarGrid.innerHTML = html;

  // Вешаем обработчики только на те дни, которые можно выбрать:
  // не из соседнего месяца и не «disabled». У них уже есть
  // data-day, по которому мы в обработчике поймём, на что кликнули.
  const dayCells = calendarGrid.querySelectorAll(
    ".day-cell:not(.other-month):not(.disabled)"
  );
  dayCells.forEach(function (cell) {
    cell.addEventListener("click", onDayClick);
  });
}

// onDayClick — обработчик клика по дню.
// Меняет выбранный день, сбрасывает выбранное время (потому что
// на новом дне слоты другие) и подгружает слоты для нового дня.
function onDayClick(event) {
  const cell = event.currentTarget;
  const day = parseInt(cell.dataset.day);

  BOOKING_STATE.selectedDay = day;
  // Время сбрасываем: старое время может быть занято на новом дне.
  BOOKING_STATE.selectedTime = null;

  // «Запрашиваем» слоты у сервера (пока — из локальной имитации).
  const response = getSlotsForDay(
    day,
    BOOKING_STATE.currentMonth,
    BOOKING_STATE.currentYear
  );
  SERVER_DATA.slots = response.slots;

  // Перерисовываем всё, что зависит от выбора: календарь
  // (подсветить новый день), слоты, нижнюю панель.
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

// renderTimeSlots — рисует кнопки со слотами времени.
function renderTimeSlots() {
  const timeGrid = document.querySelector(".time-grid");
  const slots = SERVER_DATA.slots;

  // Если слотов нет — показываем заглушку. Инлайн-стиль используется
  // для краткости: это сообщение нужно только тут и больше нигде.
  if (!slots || slots.length === 0) {
    timeGrid.innerHTML =
      '<div style="text-align:center; padding:40px; color:#6B6661; font-size:16px;">' +
      "В этот день нет доступного времени" +
      "</div>";
    return;
  }

  let html = "";
  slots.forEach(function (slot) {
    let classes = "time-slot";
    if (!slot.available) classes += " unavailable";
    if (slot.time === BOOKING_STATE.selectedTime && slot.available) {
      classes += " selected";
    }
    html +=
      '<button class="' +
      classes +
      '" data-time="' +
      slot.time +
      '">' +
      slot.time +
      "</button>";
  });

  timeGrid.innerHTML = html;

  // Обработчики — только на доступные слоты. На занятые клик вешать
  // не надо: они и визуально серые, и в логике не должны срабатывать.
  const slotButtons = timeGrid.querySelectorAll(".time-slot:not(.unavailable)");
  slotButtons.forEach(function (slot) {
    slot.addEventListener("click", onTimeSlotClick);
  });
}

// onTimeSlotClick — обработчик клика по слоту времени.
// Сохраняет выбранное время в состояние и перерисовывает слоты
// (чтобы выделить выбранный) и нижнюю панель.
function onTimeSlotClick(event) {
  const slot = event.currentTarget;
  const time = slot.dataset.time;
  BOOKING_STATE.selectedTime = time;
  renderTimeSlots();
  updateBottomBar();
}

// updateBottomBar — обновляет подпись в нижней панели.
// Показывает выбранную дату и время в формате
// «Пятница, 17 октября 2026 • 12:00».
function updateBottomBar() {
  const valueEl = document.querySelector(".bottom-bar .value");

  const day = BOOKING_STATE.selectedDay;
  const month = BOOKING_STATE.currentMonth;
  const year = BOOKING_STATE.currentYear;

  // new Date нужен, чтобы узнать день недели по дате.
  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[month];

  // Если время ещё не выбрано — показываем заглушку.
  const timePart = BOOKING_STATE.selectedTime
    ? BOOKING_STATE.selectedTime
    : "время не выбрано";

  valueEl.textContent =
    dayName + ", " + day + " " + monthName + " " + year + " • " + timePart;
}

// setupMonthNavigation — вешает обработчики на стрелки «‹» и «›».
// При клике меняет месяц и год, потом перерисовывает календарь.
// Отдельно обрабатываются переходы через границу года:
//   январь назад → декабрь предыдущего года,
//   декабрь вперёд → январь следующего года.
function setupMonthNavigation() {
  const prevBtn = document.querySelector(".calendar-nav-prev");
  const nextBtn = document.querySelector(".calendar-nav-next");

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      BOOKING_STATE.currentMonth -= 1;
      if (BOOKING_STATE.currentMonth < 0) {
        BOOKING_STATE.currentMonth = 11;
        BOOKING_STATE.currentYear -= 1;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      BOOKING_STATE.currentMonth += 1;
      if (BOOKING_STATE.currentMonth > 11) {
        BOOKING_STATE.currentMonth = 0;
        BOOKING_STATE.currentYear += 1;
      }
      renderCalendar();
    });
  }
}

// setupBackButton — кнопка «Назад» ведёт на страницу услуг.
// В React-версии это делает родитель через пропс onBack.
// В нативной вёрстке — просто переход по URL.
function setupBackButton() {
  const backButton = document.querySelector(".booking-back-button");
  if (backButton) {
    backButton.addEventListener("click", function () {
      window.location.href = "services.html";
    });
  }
}

// setupNextButton — кнопка «Далее».
// Проверяет, что время выбрано, сохраняет дату и время
// в localStorage и переходит на страницу подтверждения.
function setupNextButton() {
  const nextBtn = document.querySelector(".booking-next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (!BOOKING_STATE.selectedTime) {
        alert("Пожалуйста, выберите время");
        return;
      }
      saveSelectedDate(
        {
          day: BOOKING_STATE.selectedDay,
          month: BOOKING_STATE.currentMonth,
          year: BOOKING_STATE.currentYear,
        },
        BOOKING_STATE.selectedTime
      );
      window.location.href = "confirmation.html";
    });
  }
}

// setupLogoClick — клик по логотипу ведёт на главную.
function setupLogoClick() {
  const logo = document.querySelector(".booking-logo-text");
  if (logo) {
    logo.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
//
// init() собирает всё вместе: ставит начальное состояние из
// SERVER_DATA, рисует календарь, слоты, нижнюю панель и вешает
// все обработчики. Вызывается один раз — когда DOM готов.

function init() {
  // Начальное состояние берём из SERVER_DATA. Когда появится
  // сервер, здесь будет что-то вроде: await fetch(...) → setState.
  BOOKING_STATE.currentMonth = SERVER_DATA.today.month;
  BOOKING_STATE.currentYear = SERVER_DATA.today.year;
  BOOKING_STATE.selectedDay = SERVER_DATA.today.day;

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();

  // Обработчики вешаем один раз — они не пересоздаются при
  // перерисовке. В отличие от кликов по дням, которые пересоздаются
  // внутри renderCalendar, потому что ячейки дней перерисовываются.
  setupMonthNavigation();
  setupBackButton();
  setupNextButton();
  setupLogoClick();
}

// Запускаем init, когда браузер полностью построил DOM.
// Без этого querySelector в init() не нашёл бы элементы.
document.addEventListener("DOMContentLoaded", function () {
  init();
});
