// CalendarGrid — рисует сетку дней месяца.
//
// Это «презентационный» компонент: сам ничего не хранит и не меняет.
// Ему сказали «нарисуй октябрь 2026, подсвети 17-е, вот что делать
// при клике» — он это и делает. Все решения о том, что считать
// «сегодня» или «выбранным», принимает родитель (BookingScreen).
//
// Сетку недель считает чистая функция buildCalendarGrid из data/date.js.
// Она не зависит от React — принимает год и месяц, возвращает массив
// недель по 7 ячеек. Если захочется протестировать отдельно — можно,
// без всякого React.
import { buildCalendarGrid, isDateSelectable } from "../../data/date";

// Пропсы:
//   year        — год (2026)
//   month       — месяц (0 = январь, 9 = октябрь)
//   selectedDay — выбранный день (17) или null
//   today       — сегодняшняя дата с сервера ({ day, month, year })
//   onDayClick  — колбэк, вызывается с числом (днём месяца)
function CalendarGrid({ year, month, selectedDay, today, onDayClick }) {
  // Получаем массив недель.
  // Пример: [[{day: 28, otherMonth: true}, ..., {day: 4, otherMonth: false}], ...]
  // Каждая неделя — массив из 7 ячеек.
  // Ячейка = { day: число, otherMonth: true/false }.
  // otherMonth = true значит «этот день не из текущего месяца,
  // он из предыдущего или следующего — показываем его серым».
  const weeks = buildCalendarGrid(year, month);

  return (
    <div className="grid-days">
      {/* Проходимся по неделям.
          key={weekIndex} нужен React'у, чтобы эффективно обновлять
          список: он по key понимает, какие элементы остались,
          какие изменились. Для однотипных списков обычно берут id,
          но у нас недели идут по порядку — индекс подойдёт. */}
      {weeks.map(function (week, weekIndex) {
        return (
          <div className="week-row" key={weekIndex}>
            {/* Внутри недели — 7 ячеек. */}
            {week.map(function (cell, cellIndex) {
              // Собираем класс для ячейки вручную, потому что классов
              // может быть несколько (например, "day-cell other-month today").
              // В JSX нельзя писать className="a" + b + "c" — точнее можно,
              // но так нагляднее: сначала собираем строку, потом передаём.

              let classes = "day-cell";

              // День из соседнего месяца — серый, некликабельный.
              if (cell.otherMonth) classes += " other-month";

              // Проверяем, «сегодня» ли это.
              // Только для текущего месяца (!otherMonth) и только
              // если день, месяц и год совпадают с today.
              const isToday =
                !cell.otherMonth &&
                cell.day === today.day &&
                month === today.month &&
                year === today.year;
              if (isToday) classes += " today";

              // Проверяем, выбран ли этот день.
              // Достаточно сверить число — месяц и год уже известны
              // из пропсов, а selectedDay имеет смысл только в
              // контексте текущего месяца.
              const isSelected = !cell.otherMonth && cell.day === selectedDay;
              if (isSelected) classes += " selected";

              // Проверяем, можно ли выбрать эту дату.
              // Функция isDateSelectable смотрит, не раньше ли она today.
              // Если раньше — день «disabled»: не кликается, выглядит
              // приглушённо.
              const selectable = isDateSelectable(cell.day, month, year, today);
              if (!cell.otherMonth && !selectable) classes += " disabled";

              // Обработчик клика на конкретную ячейку.
              // Замыкание: cell и selectable — свои для каждого дня.
              // Если день не из текущего месяца или он disabled —
              // клик игнорируем. Иначе сообщаем родителю, какой день
              // пользователь выбрал.
              function handleClick() {
                if (!cell.otherMonth && selectable) {
                  onDayClick(cell.day);
                }
              }

              // Рендер одной ячейки.
              // key={cellIndex} — уникальный ключ внутри недели.
              // Вместо данных о дате показываем просто число: "17".
              return (
                <div className={classes} key={cellIndex} onClick={handleClick}>
                  {cell.day}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default CalendarGrid;
