// Импортируем две вспомогательные функции.
//
// formatPrice — превращает число в строку с валютой:
//   3200 → "3 200 ₽" (с неразрывным пробелом между разрядами).
//
// formatDateTime — собирает дату и время в одну строку:
//   { day: 17, month: 9, year: 2026 } + "12:00" → "17 октября 2026 в 12:00".
//
// Обе функции живут в data/ и не зависят от React — их можно
// переиспользовать в любом другом компоненте.
import { formatPrice } from "../../data/price";
import { formatDateTime } from "../../data/date";

// BookingDetails — блок «Детали вашего визита» на странице
// подтверждения. Показывает таблицу: услуга, дата, мастер,
// длительность, итоговая цена.
//
// Презентационный компонент. Всё, что нужно — получает через проп
// booking. Ничего не хранит, ничего не вычисляет, кроме форматирования.
//
// Пропс:
//   booking — объект с полями:
//     service — выбранная услуга ({ id, title, duration, price })
//     date    — выбранная дата ({ day, month, year })
//     time    — выбранное время ("12:00")
function BookingDetails({ booking }) {
  return (
    // .booking-info — секция с заголовком и строками деталей.
    // Стили в confirmation.css.
    <div className="booking-info">
      {/* Заголовок блока. */}
      <span className="section-title">Детали вашего визита</span>

      {/* .details-grid — вертикальный список строк.
          Каждая .detail-row — «лейбл слева, значение справа». */}
      <div className="details-grid">
        {/* Услуга. booking.service.title — строка из объекта услуги. */}
        <div className="detail-row">
          <span className="label">Услуга</span>
          <span className="value">{booking.service.title}</span>
        </div>

        {/* Дата и время. Здесь вызывается функция formatDateTime,
            которая берёт две части (date и time) и склеивает их
            в человекочитаемую строку. Без неё пришлось бы писать
            тот же код в JSX — а он не короткий. */}
        <div className="detail-row">
          <span className="label">Дата и время</span>
          <span className="value">
            {formatDateTime(booking.date, booking.time)}
          </span>
        </div>

        {/* Мастер. Пока захардкожен — выбор мастера ещё не реализован.
            Когда появится, здесь будет booking.master.name или подобное.
            TODO: заменить на данные из booking. */}
        <div className="detail-row">
          <span className="label">Мастер</span>
          <span className="value">Алиса Розен</span>
        </div>

        {/* Длительность. duration — число (минут), добавляем «мин». */}
        <div className="detail-row">
          <span className="label">Длительность</span>
          <span className="value">{booking.service.duration} мин</span>
        </div>

        {/* Разделительная линия. Тег <hr> — семантически правильный
            для горизонтального разделителя. class делает его тонким
            и светлым. Стили — в confirmation.css. */}
        <hr className="detail-divider" />

        {/* Итоговая строка. Отличается от обычных detail-row:
            лейбл жирный, цена крупная и акцентного цвета.
            Поэтому отдельный класс .total-row, а не .detail-row. */}
        <div className="total-row">
          <span className="label">К оплате в салоне</span>
          <span className="price">{formatPrice(booking.service.price)}</span>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;
