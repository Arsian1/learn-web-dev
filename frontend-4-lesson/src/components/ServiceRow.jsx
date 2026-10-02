// ServiceRow — одна строка услуги.
//
// Пропс:
//   service — объект { id, title, desc, duration, price }.
//
// Что изменилось по сравнению с версией без сервера:
//   - ничего. Компонент не знает, откуда пришли данные —
//     из локального массива или с сервера. Формат тот же.
export default function ServiceRow({ service }) {
  // Форматируем цену: 3200 → "3 200 ₽".
  const formattedPrice = service.price.toLocaleString("ru-RU") + " ₽";

  return (
    <div className="service-row" data-service={service.id}>
      <div className="info">
        <span className="title">{service.title}</span>
        <span className="desc">{service.desc}</span>
      </div>

      <div className="meta">
        <span className="duration">{service.duration} мин</span>
        <span className="price">{formattedPrice}</span>
      </div>

      <button className="select-btn">
        <span>Выбрать</span>
      </button>
    </div>
  );
}
