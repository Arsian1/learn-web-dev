// ============================================================
// 3. ЛОГИКА ДЛЯ ИМИТАЦИИ РАБОТЫ С СЕРВЕРОМ
// ============================================================
//
// На этой странице данных с сервера нет: всё приходит из
// localStorage, куда их сохранила предыдущая страница (booking.html).
// Здесь только одна функция — прочитать сохранённую бронь.

// loadBooking — читает сохранённую бронь из localStorage.
// Возвращает объект вида { service, date, time } или null,
// если данных нет (пользователь не прошёл предыдущие шаги).
//
// JSON.parse может выбросить ошибку, если данные повреждены
// (например, кто-то залез в localStorage и что-то поменял).
// Поэтому оборачиваем в try/catch — если парсинг не удался,
// возвращаем null. Так страница не упадёт.
function loadBooking() {
  const raw = localStorage.getItem("elair-booking");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// ============================================================
// 4. ЧИСТЫЕ ФУНКЦИИ
// ============================================================
//
// Не зависят от DOM. Можно скопировать в любой проект.

// Названия месяцев в родительном падеже — для подписи
// «17 октября 2026».
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

// formatPrice — превращает число в строку с валютой.
// 3200 → "3 200 ₽". toLocaleString сам расставляет разряды
// по правилам русской локали (неразрывный пробел между тысячами).
function formatPrice(price) {
  return price.toLocaleString("ru-RU") + " ₽";
}

// formatDateTime — формат для страницы подтверждения:
// «17 октября 2026 в 12:00». Используется в блоке деталей визита.
function formatDateTime(date, time) {
  const monthName = MONTHS_GENITIVE[date.month];
  return date.day + " " + monthName + " " + date.year + " в " + time;
}

// formatDateTimeShort — формат для модалки: «17 октября 2026, 12:00».
// Отличается от предыдущей функции только разделителем:
// в модалке места меньше, поэтому запятая вместо «в».
function formatDateTimeShort(date, time) {
  const monthName = MONTHS_GENITIVE[date.month];
  return date.day + " " + monthName + " " + date.year + ", " + time;
}

// ============================================================
// 5. ОТРИСОВКА И ОБРАБОТЧИКИ
// ============================================================
//
// Работаем с DOM: находим элементы, подставляем данные, вешаем
// обработчики. Данные приходят из booking, который достали
// из localStorage на этапе init.

// renderBookingDetails — заполняет блок «Детали вашего визита»
// на странице. Берём строки через querySelectorAll и по индексу
// подставляем в каждую нужное значение.
//
// Почему по индексу, а не через классы: строки одинаковые
// по разметке, различаются только содержимым. Индекс проще,
// чем придумывать каждой строке уникальный класс.
//
// rows[0] — услуга,
// rows[1] — дата и время,
// rows[2] — мастер (захардкожен в HTML, не трогаем),
// rows[3] — длительность.
function renderBookingDetails(booking) {
  const rows = document.querySelectorAll(".booking-info .detail-row");
  rows[0].querySelector(".value").textContent = booking.service.title;
  rows[1].querySelector(".value").textContent = formatDateTime(
    booking.date,
    booking.time
  );
  rows[3].querySelector(".value").textContent =
    booking.service.duration + " мин";

  // Итоговая цена. Селектор идёт от .booking-info — чтобы не задеть
  // похожие элементы из модалки (там свои .total-price).
  document.querySelector(".booking-info .total-row .price").textContent =
    formatPrice(booking.service.price);
}

// renderModalDetails — то же самое, но для содержимого модалки.
// Классы другие: .confirmation-modal .details .row и .total-price.
// Данные те же — дата, услуга, длительность, цена. Просто в
// другом формате даты (short) и с другими классами.
function renderModalDetails(booking) {
  const rows = document.querySelectorAll(".confirmation-modal .details .row");
  rows[0].querySelector(".value").textContent = booking.service.title;
  rows[1].querySelector(".value").textContent = formatDateTimeShort(
    booking.date,
    booking.time
  );
  rows[3].querySelector(".value").textContent =
    booking.service.duration + " мин";

  document.querySelector(".confirmation-modal .total-price").textContent =
    formatPrice(booking.service.price);
}

// openConfirmationModal — открывает модалку.
//
// Используем нативный метод showModal() — он делает диалог
// модальным: блокирует остальную страницу, добавляет ::backdrop,
// включает закрытие по Esc. Это правильный способ работы
// с <dialog> (в отличие от простого атрибута open).
function openConfirmationModal() {
  const modal = document.getElementById("confirmationModal");
  if (modal) modal.showModal();
}

// closeModalAndGoHome — закрывает модалку и возвращает на главную.
//
// Заодно чистим localStorage: запись завершена, черновик больше
// не нужен. Если этого не сделать — при следующем заходе на
// страницу подтверждения пользователь увидел бы старую бронь.
function closeModalAndGoHome() {
  const modal = document.getElementById("confirmationModal");
  if (modal) modal.close();
  localStorage.removeItem("elair-booking");
  window.location.href = "index.html";
}

// setupContactForm — вешает обработчик на отправку формы.
//
// event.preventDefault() — обязательно: без него браузер
// попытается отправить форму и перезагрузить страницу.
// Мы этого не хотим — вместо отправки открываем модалку.
function setupContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    openConfirmationModal();
  });
}

// setupModalButton — кнопка «Отлично!» в модалке.
// Закрывает модалку и переходит на главную.
function setupModalButton() {
  const btn = document.querySelector(".modal-next-btn");
  if (!btn) return;
  btn.addEventListener("click", function () {
    closeModalAndGoHome();
  });
}

// setupBackButton — кнопка «Назад» на странице подтверждения.
// Возвращает пользователя на шаг назад — к выбору даты и времени.
function setupBackButton() {
  const backButton = document.querySelector(".confirmation-back-button");
  if (backButton) {
    backButton.addEventListener("click", function () {
      window.location.href = "booking.html";
    });
  }
}

// setupLogoClick — клик по логотипу ведёт на главную.
// На этой странице у логотипа свой класс — .confirmation-logo-text.
// Так сделано, чтобы стили не пересекались с другими страницами
// (см. историю с префиксами классов).
function setupLogoClick() {
  const logo = document.querySelector(".confirmation-logo-text");
  if (logo) {
    logo.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }
}

// redirectIfNoBooking — «защита от дурака».
//
// Если пользователь попал на страницу подтверждения без
// выбранной услуги, даты или времени — отправляем его обратно
// на страницу услуг. Такое может случиться, если открыть
// confirmation.html напрямую (по ссылке, из закладок, при
// перезагрузке с очищенным localStorage).
//
// Проверяем три поля: service, date, time. Если хоть одно
// отсутствует — редирект. Если всё есть — возвращаем booking,
// чтобы его можно было использовать в init().
function redirectIfNoBooking() {
  const booking = loadBooking();
  if (!booking || !booking.service || !booking.date || !booking.time) {
    window.location.href = "services.html";
    return null;
  }
  return booking;
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
//
// init() собирает всё вместе:
//   1. проверяет, есть ли бронь (иначе — редирект на услуги),
//   2. заполняет детали визита на странице,
//   3. заполняет содержимое модалки,
//   4. вешает обработчики на форму, кнопки и логотип.

function init() {
  const booking = redirectIfNoBooking();
  // Если booking нет — redirectIfNoBooking уже сделал redirect.
  // Прерываем init, чтобы не работать с null.
  if (!booking) return;

  renderBookingDetails(booking);
  renderModalDetails(booking);
  setupContactForm();
  setupModalButton();
  setupBackButton();
  setupLogoClick();
}

// Запускаем init после загрузки DOM.
// К этому моменту все элементы на странице есть, и querySelector
// сможет их найти.
document.addEventListener("DOMContentLoaded", function () {
  init();
});
