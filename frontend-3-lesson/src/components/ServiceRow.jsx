// ServiceRow — одна строка со списком услуги.
//
// Пропс:
//   service — объект { id, title, desc, duration, price }.
export default function ServiceRow({ service }) {
  // Форматируем цену: 3200 → "3 200 ₽".
  // toLocaleString("ru-RU") разделяет тысячи неразрывным пробелом.
  const formattedPrice = service.price.toLocaleString("ru-RU") + " ₽";

  return (
    <div className="service-row" data-service={service.id}>
      {/* Левая часть — название и описание услуги. */}
      <div className="info">
        <span className="title">{service.title}</span>
        <span className="desc">{service.desc}</span>
      </div>

      {/* Правая часть — длительность и цена. */}
      <div className="meta">
        <span className="duration">{service.duration} мин</span>
        <span className="price">{formattedPrice}</span>
      </div>

      {/* Кнопка «Выбрать». Пока без обработчика —
          на этой странице переходов нет. */}
      <button className="select-btn">
        <span>Выбрать</span>
      </button>
    </div>
  );
}
