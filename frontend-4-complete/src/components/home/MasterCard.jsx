// MasterCard — карточка одного мастера на главной странице.
//
// Показывает:
//   - фото мастера (задано через background-image),
//   - имя,
//   - специализацию,
//   - рейтинг в виде пяти звёзд + числовое значение.
//
// Презентационный компонент. Получает объект master через проп
// и просто раскладывает его поля по разметке.
//
// Пропс:
//   master — объект вида:
//     {
//       id: 1,
//       name: "Екатерина Милова",
//       role: "Топ-стилист по волосам",
//       rating: 5.0,
//       image: "/assets/master-ekaterina-abc123.png",
//     }
function MasterCard({ master }) {
  // Готовим массив классов для пяти звёзд.
  //
  // Math.floor(master.rating) — сколько полных звёзд.
  // Например, рейтинг 4.9 → 4 полных звезды.
  // Если было бы 5.0 → 5 полных.
  //
  // Массив stars формируем заранее, чтобы в JSX не считать.
  // Пять элементов — потому что звёзд всегда пять.
  const fullStars = Math.floor(master.rating);

  const stars = [];
  for (let i = 0; i < 5; i++) {
    // Первые fullStars звёзд — с классом "star".
    // Остальные — "star star-empty" (пустая звезда, светлый фон).
    //
    // Тернарник i < fullStars ? "star" : "star star-empty"
    // возвращает нужную строку классов.
    stars.push(i < fullStars ? "star" : "star star-empty");
  }

  return (
    // <article> — семантически правильный тег для карточки:
    // это самостоятельная единица контента, её можно переиспользовать
    // (например, в списке или в отдельной выдаче).
    <article className="master-card">
      {/* Картинка мастера — как фон через background-image.
          Почему не <img>: картинка декоративная, и при разных
          пропорциях она красиво заполнит блок через
          background-size: cover (это в CSS). С <img> пришлось бы
          возиться с object-fit и обёртками. */}
      <div
        className="master-card-image"
        style={{ backgroundImage: `url(${master.image})` }}
      ></div>

      <div className="master-card-body">
        {/* Имя и роль. */}
        <div className="master-info">
          {/* h3 — заголовок третьего уровня. На главной
              h1 — заголовок hero, h2 — «Популярные услуги»
              и «Наши мастера», h3 — имя мастера. Логичная иерархия. */}
          <h3 className="master-name">{master.name}</h3>
          <span className="master-role">{master.role}</span>
        </div>

        {/* Ряд со звёздами и числовым рейтингом. */}
        <div className="stars">
          {/* Перебираем массив классов и рендерим 5 <span>.
              key={index} — потому что других уникальных полей
              у звезды нет. Для статичного массива из 5 элементов
              индекс — допустимый ключ. */}
          {stars.map(function (className, index) {
            return <span key={index} className={className}></span>;
          })}

          {/* Числовой рейтинг.
              toFixed(1) — округление до одного знака после запятой.
              4.9 → "4.9", 5.0 → "5.0". Без toFixed(1) JavaScript
              показал бы "5" для целых и "4.9" для дробных — некрасиво. */}
          <span className="rating">{master.rating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}

export default MasterCard;
