// ServiceCard — карточка одной услуги. Рендерится для каждой
// услуги в списке.
import ServiceCard from "./ServiceCard";

// POPULAR_SERVICES — массив популярных услуг из data/.
// Сейчас захардкожен, позже будет приходить с сервера.
// Каждый элемент — объект с полями id, title, price, duration, image.
import { POPULAR_SERVICES } from "../../data/popularServices";

// PopularServices — секция «Популярные услуги» на главной странице.
//
// Структура такая же, как у OurMasters:
//   1. Заголовок секции («Эксклюзивный уход» + «Популярные услуги»).
//   2. Сетка карточек — по одной на каждую услугу.
//
// Презентационный компонент: пропсов не принимает,
// данные берёт из data/popularServices.js.
function PopularServices() {
  return (
    // <section> — семантически отдельный блок страницы.
    // Стили (отступы, фон, ширина) — в home.css.
    <section className="popular-services">
      {/* Заголовок секции. Устроен как в «Наши мастера»:
          маленький цветной тег сверху, крупный h2 снизу. */}
      <div className="section-header">
        <span className="section-tag">Эксклюзивный уход</span>
        <h2 className="section-title">Популярные услуги</h2>
      </div>

      {/* .services-grid — flex-контейнер для карточек.
          Стили задают направление (row), gap 32px, и то, что
          карточки растягиваются по ширине контейнера. */}
      <div className="services-grid">
        {/* Перебираем массив услуг.
            Каждая услуга → одна <ServiceCard />.
            key={service.id} — уникальный идентификатор для React,
            чтобы эффективно обновлять список при перерисовке.

            Обрати внимание: сам PopularServices НЕ знает, как
            выглядит карточка услуги. Он только решает, что
            карточек будет столько, сколько элементов в массиве.
            Всё оформление — внутри ServiceCard. */}
        {POPULAR_SERVICES.map(function (service) {
          return <ServiceCard key={service.id} service={service} />;
        })}
      </div>
    </section>
  );
}

export default PopularServices;
