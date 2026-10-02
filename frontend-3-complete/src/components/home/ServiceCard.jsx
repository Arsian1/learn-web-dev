// ServiceCard — карточка одной популярной услуги на главной.
//
// Показывает: фото, название, цену, длительность.
// Данные приходят одним объектом через проп service.
//
// Пропс:
//   service — объект вида:
//     {
//       id: 1,
//       title: "Фирменная стрижка & Уход",
//       price: 4500,
//       duration: 60,
//       image: "/assets/service-haircut-abc123.png",
//     }
function ServiceCard({ service }) {
  return (
    // <article> — самостоятельная единица контента. Семантически
    // подходит для карточки: это не просто «кусок страницы»,
    // а полноценный объект (услуга), который мог бы существовать
    // и отдельно от списка.
    <article className="service-card">
      {/* Картинка услуги — как фон через background-image.
          Как и в MasterCard: картинка декоративная, и так её
          проще вписать в блок фиксированной высоты (260px в CSS)
          с обрезкой по краям (background-size: cover). */}
      <div
        className="service-card-image"
        style={{ backgroundImage: `url(${service.image})` }}
      ></div>

      {/* Нижняя часть карточки: название и мета-данные. */}
      <div className="service-card-body">
        {/* h3 — третий уровень заголовка. h1 на главной — заголовок
            hero, h2 — «Популярные услуги», h3 — конкретная услуга.
            Логичная иерархия для SEO и скринридеров. */}
        <h3 className="service-card-title">{service.title}</h3>

        {/* Мета-строка: цена слева, длительность справа.
            Между ними flex + justify-content: space-between. */}
        <div className="service-card-meta">
          {/* Цена.
              service.price — число (4500).
              toLocaleString("ru-RU") — форматирует с учётом локали:
              разделяет тысячи неразрывным пробелом.
                4500 → "4 500"
                12500 → "12 500"
              Затем дописываем " ₽" через пробел.
              
              В проекте есть функция formatPrice в data/price.js,
              которая делает то же самое. Здесь она не используется —
              чтобы карточка на главной осталась максимально
              автономной и не тянула зависимости. Если понадобится
              единообразие — легко заменить на formatPrice(service.price). */}
          <span className="price">
            {service.price.toLocaleString("ru-RU")} ₽
          </span>

          {/* Длительность. duration — число минут (60),
              дописываем " мин". */}
          <span className="duration">{service.duration} мин</span>
        </div>
      </div>
    </article>
  );
}

export default ServiceCard;
