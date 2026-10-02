// Calendar — «обёртка» для календаря. Сам по себе он ничего
// не считает и не хранит. Его задача — собрать вместе два
// подкомпонента и распределить между ними пропсы:
//
//   CalendarHeader — заголовок с месяцем и стрелками «‹» «›»
//   CalendarGrid   — сетка дней месяца
//
// Почему так разбито:
// каждый подкомпонент занимается своим делом. Заголовок знает,
// как показывать месяц и куда вешать стрелки. Сетка знает, как
// строить календарь и обрабатывать клики по дням. Родителю не
// нужно думать о внутренностях — он просто передаёт данные вниз.
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

// Пропсы:
//   year         — текущий отображаемый год (2026)
//   month        — текущий отображаемый месяц (0 = январь, 9 = октябрь)
//   selectedDay  — выбранный пользователем день месяца (17) — нужен,
//                  чтобы подсветить его в сетке
//   today        — дата с сервера ({ day, month, year }) — нужна,
//                  чтобы подсветить «сегодня» и запретить прошлые дни
//   onDayClick   — колбэк, вызывается при клике на день
//   onPrevMonth  — колбэк, вызывается при клике на «‹»
//   onNextMonth  — колбэк, вызывается при клике на «›»
function Calendar({
  year,
  month,
  selectedDay,
  today,
  onDayClick,
  onPrevMonth,
  onNextMonth,
}) {
  return (
    // .calendar-box — белая карточка с календарём.
    // Стили (ширина, отступы, границы) — в booking.css.
    <div className="calendar-box">
      {/* Заголовок календаря: месяц, год и стрелки.
          Пропсы year и month — чтобы показать «Октябрь 2026».
          onPrevMonth и onNextMonth — колбэки, которые Calendar
          просто «прокидывает» наверх, ничего не делая с ними сам. */}
      <CalendarHeader
        year={year}
        month={month}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />

      {/* Внутри — сетка дней.
          Сначала строка с названиями дней недели (статичная),
          потом сама сетка (CalendarGrid). */}
      <div className="days-grid-container">
        {/* Заголовки дней недели. Всегда одинаковые — захардкожены.
            Порядок с понедельника, потому что в России так принято
            и так в макете. */}
        <div className="days-labels">
          <span>Пн</span>
          <span>Вт</span>
          <span>Ср</span>
          <span>Чт</span>
          <span>Пт</span>
          <span>Сб</span>
          <span>Вс</span>
        </div>

        {/* Сетка дней. CalendarGrid сам вызывает buildCalendarGrid(),
            получает массив недель и рисует их.
            Ему передаём всё, что нужно для рендера:
              year, month         — какой месяц рисуем
              selectedDay, today  — кого подсветить
              onDayClick          — что делать при клике на день */}
        <CalendarGrid
          year={year}
          month={month}
          selectedDay={selectedDay}
          today={today}
          onDayClick={onDayClick}
        />
      </div>
    </div>
  );
}

export default Calendar;
