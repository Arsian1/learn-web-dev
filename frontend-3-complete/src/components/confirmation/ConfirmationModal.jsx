// Импортируем форматирование цены и даты.
//
// formatPrice — 3200 → "3 200 ₽".
// formatDateTimeShort — версия для модалки, чуть короче:
//   { day: 17, month: 9, year: 2026 } + "12:00"
//   → "17 октября 2026, 12:00"
//
// Отличие от formatDateTime (используется в BookingDetails):
// там «в 12:00», здесь «, 12:00». В модалке строка компактнее,
// поэтому без предлога «в».
import { formatPrice } from "../../data/price";
import { formatDateTimeShort } from "../../data/date";

// ConfirmationModal — содержимое модального окна «Запись подтверждена».
//
// ВАЖНО: этот компонент НЕ рисует сам <dialog> и фон. Это делает
// родитель Modal.jsx. ConfirmationModal — только «начинка»:
// иконка, заголовок, строки с деталями, кнопка.
//
// Пропсы:
//   booking — данные записи ({ service, date, time })
//   onClose — колбэк, вызывается при клике на «Отлично!»
function ConfirmationModal({ booking, onClose }) {
  return (
    // Фрагмент <>...</> — чтобы вернуть несколько соседних элементов
    // без лишней обёртки <div>. React требует один корневой элемент,
    // а фрагмент позволяет «склеить» несколько.
    //
    // Почему без обёртки: <div className="modal-content"> уже
    // существует в Modal.jsx — он оборачивает всё, что мы вернём.
    // Если бы мы добавили свой <div>, получилась бы лишняя вложенность.
    <>
      {/* Блок с иконкой-галочкой и заголовком. */}
      <div className="title-block">
        {/* Просто символ галочки в стилизованном кружке.
            Не SVG, не иконка — обычный текст. */}
        <div className="check-icon">✓</div>
        <span className="modal-title">Запись подтверждена</span>
      </div>

      {/* Блок с деталями записи. Похож на BookingDetails на странице,
          но чуть компактнее — другие классы (.row вместо .detail-row,
          другие размеры шрифтов). */}
      <div className="details">
        <div className="row">
          <span className="label">Услуга</span>
          <span className="value">{booking.service.title}</span>
        </div>

        {/* Дата и время — используем короткий формат:
            «17 октября 2026, 12:00» вместо «17 октября 2026 в 12:00».
            Разница небольшая, но в модалке важна компактность. */}
        <div className="row">
          <span className="label">Дата и время</span>
          <span className="value">
            {formatDateTimeShort(booking.date, booking.time)}
          </span>
        </div>

        {/* Мастер — захардкожен. TODO: заменить, когда появится
            выбор мастера. */}
        <div className="row">
          <span className="label">Мастер</span>
          <span className="value">Алиса Розен</span>
        </div>

        <div className="row">
          <span className="label">Длительность</span>
          <span className="value">{booking.service.duration} мин</span>
        </div>

        {/* Разделитель и итоговая строка. Как в BookingDetails,
            но с другими классами: .modal-divider и .total. */}
        <div className="modal-divider"></div>
        <div className="total">
          <span className="total-label">К оплате</span>
          <span className="total-price">
            {formatPrice(booking.service.price)}
          </span>
        </div>
      </div>

      {/* Кнопка «Отлично!». onClick={onClose} — вызывается
          функция, переданная родителем. Что она делает — не наша
          забота. В нашем случае она закрывает модалку и возвращает
          пользователя на главную. */}
      <button className="modal-next-btn" onClick={onClose}>
        Отлично!
      </button>
    </>
  );
}

export default ConfirmationModal;
