// useState — чтобы хранить id активной (выбранной) категории.
import { useState } from "react";

// Компоненты страницы: слева сайдбар с категориями,
// справа — список услуг выбранной категории.
import Sidebar from "../components/services/Sidebar";
import ServicesList from "../components/services/ServicesList";

// Индикатор шагов. current={1} — первый шаг.
import StepIndicator from "../components/common/StepIndicator";

// Стили страницы услуг. Здесь только специфичные классы
// (.sidebar, .category-item, .service-row и т.д.).
// Общие стили (header, footer, step-indicator) — в common.css.
import "../styles/services.css";

// Данные: массив категорий с услугами внутри.
import { SERVICES_DATA } from "../data/services";

// ServicesScreen — экран выбора услуги.
//
// Из чего состоит:
//   - Sidebar слева: список категорий;
//   - справа: индикатор шагов и список услуг активной категории.
//
// Состояние здесь только одно — id активной категории.
// Всё остальное (выбранную услугу) держит App, потому что она
// нужна на следующих шагах.
//
// Пропсы:
//   onBack          — колбэк кнопки «Назад». Возвращает на главную.
//   onSelectService — колбэк, вызывается при клике «Выбрать»
//                     на услуге. Передаёт объект услуги наверх в App.
function ServicesScreen({ onBack, onSelectService }) {
  // activeCategoryId — id той категории, которая сейчас открыта.
  //
  // Изначально хотим показать первую категорию из данных.
  // Идея простая: id первой категории — SERVICES_DATA[0].id.
  //
  // Но! Конструкция с проверкой «SERVICES_DATA.length > 0 ? ... : null»
  // здесь временная — она защищает от случая, когда массив пуст
  // (например, данных с сервера пока нет). Тогда activeCategoryId
  // будет null, и в списке услуг появится заглушка.
  //
  // useState(() => ...) — «ленивая инициализация».
  // Функция внутри useState выполнится один раз при первом рендере,
  // и её результат станет начальным значением. Просто useState(100)
  // тоже работал бы, но было бы хардкод-значение. Так — гибче:
  // поменяется порядок категорий — id первой подхватится сам.
  const [activeCategoryId, setActiveCategoryId] = useState(() =>
    SERVICES_DATA.length > 0 ? SERVICES_DATA[0].id : null
  );

  // Находим активную категорию.
  // .find() возвращает первый элемент массива, удовлетворяющий условию.
  // Если ничего не нашли (например, activeCategoryId = null) —
  // вернётся undefined.
  const activeCategory = SERVICES_DATA.find(
    (cat) => cat.id === activeCategoryId
  );

  // Если категория найдена — берём её services. Если нет —
  // пустой массив. Так ServicesList не упадёт при обращении
  // к .length и .map.
  const services = activeCategory ? activeCategory.services : [];

  // Клик по категории в сайдбаре.
  // Sidebar передаёт сюда id категории — сохраняем его в состояние.
  // React перерисует компонент: activeCategoryId изменился,
  // значит activeCategory пересчитается, значит services тоже
  // обновится, и ServicesList отрисует новый список.
  function handleCategoryClick(categoryId) {
    setActiveCategoryId(categoryId);
  }

  return (
    // .main-booking-flow — горизонтальный flex: сайдбар слева,
    // список справа. Стили в services.css.
    <main className="main-booking-flow">
      {/* Сайдбар со списком категорий.
          Пропсы:
            categories       — массив категорий из данных;
            activeCategoryId — какую подсветить;
            onCategoryClick  — что делать при клике;
            onBack           — кнопка «Назад» ведёт на главную. */}
      <Sidebar
        categories={SERVICES_DATA}
        activeCategoryId={activeCategoryId}
        onCategoryClick={handleCategoryClick}
        onBack={onBack}
      />

      {/* Правая часть: индикатор шагов и список услуг.
          Оба элемента — в отдельном <section>, чтобы стили
          .services-list (вертикальная раскладка с gap) применялись
          к обоим. */}
      <section className="services-list">
        <StepIndicator current={1} />
        <ServicesList services={services} onSelectService={onSelectService} />
      </section>
    </main>
  );
}

export default ServicesScreen;
