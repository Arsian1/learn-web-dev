// TimeSlots — блок «Доступное время».
//
// Показывает сетку слотов на выбранный день. Для каждого слота:
//   - доступен ли он (иначе серый, некликабельный),
//   - выбран ли он (тогда тёмный фон).
//
// Презентационный компонент: сам ничего не хранит. Получает массив
// слотов и колбэк onTimeClick, который вызывается при клике по
// доступному слоту. Что дальше делать с выбранным временем — решает
// родитель (BookingScreen).
//
// Пропсы:
//   slots        — массив слотов вида [{ time: "10:00", available: true }, ...]
//   selectedTime — выбранное время строкой ("12:00") или null
//   onTimeClick  — колбэк, вызывается со строкой времени
function TimeSlots({ slots, selectedTime, onTimeClick }) {
  return (
    // .time-box — белая карточка с заголовком и сеткой слотов.
    <div className="time-box">
      <span className="time-title">Доступное время</span>

      <div className="time-grid">
        {/* Если слотов нет — показываем заглушку.
            Проверяем два условия:
              !slots             — массив вообще не пришёл (например, undefined);
              slots.length === 0 — массив пустой.
            Тогда рисуем сообщение. Иначе — перебираем слоты. */}
        {!slots || slots.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6B6661",
              fontSize: "16px",
            }}
          >
            В этот день нет доступного времени
          </div>
        ) : (
          // Перебираем слоты. key={slot.time} — время уникально
          // внутри одного дня, подойдёт как ключ.
          slots.map(function (slot) {
            // Собираем строку классов. Может быть:
            //   "time-slot"                       — обычный доступный слот
            //   "time-slot unavailable"           — занятый (серый)
            //   "time-slot selected"              — выбранный (тёмный)
            let classes = "time-slot";

            // Занятый слот — серый и некликабельный.
            if (!slot.available) classes += " unavailable";

            // Выбранный слот — только если он доступен. Если
            // selectedTime случайно указывает на занятый слот —
            // не подсвечиваем (такого в норме не бывает, но
            // страховка не помешает).
            if (slot.time === selectedTime && slot.available) {
              classes += " selected";
            }

            // Обработчик клика.
            // Замыкание: slot — свой для каждой итерации map,
            // поэтому handleClick «помнит», к какому слоту привязан.
            // Если слот занят — клик игнорируем.
            function handleClick() {
              if (slot.available) {
                onTimeClick(slot.time);
              }
            }

            // Рендер одной кнопки-слота.
            // key={slot.time} — уникальный идентификатор для React.
            // className={classes} — сформированные выше стили.
            // onClick={handleClick} — что делать при клике.
            // Внутри кнопки — время: "10:00", "12:00" и т.д.
            return (
              <button className={classes} key={slot.time} onClick={handleClick}>
                {slot.time}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TimeSlots;
