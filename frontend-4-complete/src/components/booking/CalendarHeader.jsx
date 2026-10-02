// CalendarHeader — верхняя часть календаря:
// название месяца, год и две кнопки со стрелками «‹» и «›».
//
// Простой презентационный компонент. Он ничего не решает про
// переключение — просто вызывает onPrevMonth / onNextMonth, когда
// пользователь нажал стрелку. Что именно произойдёт (какой месяц
// станет текущим) — решает родитель (BookingScreen).
//
// Отсюда и «месяц + год» — это то, что родитель передал в пропсах.
import { MONTHS_NOMINATIVE } from "../../data/date";

// Пропсы:
//   year         — год (2026)
//   month        — месяц (0 = январь, 9 = октябрь)
//   onPrevMonth  — колбэк, вызывается при клике на «‹»
//   onNextMonth  — колбэк, вызывается при клике на «›»
function CalendarHeader({ year, month, onPrevMonth, onNextMonth }) {
  return (
    <div className="calendar-header">
      {/* Название месяца и год.
          MONTHS_NOMINATIVE — массив вида ["Январь", "Февраль", ...],
          month — индекс от 0. Значит, MONTHS_NOMINATIVE[9] = "Октябрь".
          Получается «Октябрь 2026». */}
      <span className="month-year">
        {MONTHS_NOMINATIVE[month]} {year}
      </span>

      {/* Кнопки навигации.
          onClick={onPrevMonth} — при клике вызовется функция,
          переданная сверху. Скорее всего, она уменьшит currentMonth
          на 1 и перерисует календарь. Но этот компонент про такое
          не знает — просто дёргает колбэк. */}
      <div className="calendar-nav">
        <button className="calendar-nav-prev" onClick={onPrevMonth}>
          ‹
        </button>
        <button className="calendar-nav-next" onClick={onNextMonth}>
          ›
        </button>
      </div>
    </div>
  );
}

export default CalendarHeader;
