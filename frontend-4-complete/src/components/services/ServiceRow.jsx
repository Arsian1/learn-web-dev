// ServiceRow — одна строка услуги в списке.
//
// Пропсы:
//   service  — объект { id, title, desc, duration, price }.
//   onSelect — колбэк при клике на «Выбрать».
function ServiceRow({ service, onSelect }) {
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
      <button className="select-btn" onClick={onSelect}>
        <span>Выбрать</span>
      </button>
    </div>
  );
}

export default ServiceRow;
