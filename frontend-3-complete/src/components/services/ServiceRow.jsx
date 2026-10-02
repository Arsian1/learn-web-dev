// ServiceRow — одна строка со списком услуги на странице выбора.
//
// Используется в ServicesList.jsx, который перебирает все услуги
// выбранной категории и рендерит по одной строке на каждую.
//
// Пропсы:
//   service  — объект услуги { id, title, desc, duration, price }
//   onSelect — колбэк, вызывается при клике на кнопку «Выбрать»
export default function ServiceRow({ service, onSelect }) {
  // Форматируем цену один раз, чтобы не делать этого в JSX.
  // service.price — число (например, 3200).
  // toLocaleString("ru-RU") превращает его в "3 200"
  //   (с неразрывным пробелом между тысячами).
  // Плюс " ₽" — получаем "3 200 ₽".
  //
  // В проекте есть функция formatPrice в data/price.js, которая
  // делает то же самое. Здесь используется toLocaleString
  // напрямую — как самый простой пример. Если понадобится
  // единообразие, легко заменить на formatPrice(service.price).
  const formattedPrice = service.price.toLocaleString("ru-RU") + " ₽";

  return (
    // Корневой <div> строки.
    //
    // data-service={service.id} — оставлен для отладки и на случай,
    // если понадобится достать id из DOM через event.target.closest().
    // Но в нашем коде ServiceRow работает через onSelect напрямую,
    // без data-атрибутов.
    <div className="service-row" data-service={service.id}>
      {/* Левая часть — текст услуги: название и описание. */}
      <div className="info">
        {/* Название. Может быть длинным, поэтому в CSS задан
            перенос строки или ограничение по ширине. */}
        <span className="title">{service.title}</span>

        {/* Описание услуги. Мелкий серый текст под названием. */}
        <span className="desc">{service.desc}</span>
      </div>

      {/* Правая часть — мета-данные: длительность и цена.
          В CSS это flex-контейнер с gap, чтобы элементы
          стояли в ряд и не слипались. */}
      <div className="meta">
        {/* Длительность. duration — число минут (60),
            дописываем " мин" для читаемости. */}
        <span className="duration">{service.duration} мин</span>

        {/* Цена. formattedPrice — строка "3 200 ₽",
            подготовленная выше. */}
        <span className="price">{formattedPrice}</span>
      </div>

      {/* Кнопка «Выбрать».
          onClick={onSelect} — при клике вызывается колбэк,
          переданный из ServicesList. Тот, в свою очередь,
          вызывает onSelectService из ServicesScreen, а тот —
          функцию из App. Цепочка: клик → onSelect → onSelectService
          → handleSelectService в App → сохранение услуги и
          переход на экран выбора даты.

          Обрати внимание: ServiceRow не знает, что произойдёт
          при клике. Он просто сообщает наверх «пользователь выбрал»,
          а решение принимает App. */}
      <button className="select-btn" onClick={onSelect}>
        <span>Выбрать</span>
      </button>
    </div>
  );
}
