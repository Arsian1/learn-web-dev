// App — корневой компонент приложения.
//
// Здесь живёт вся логика страницы:
//   - какие категории услуг есть,
//   - какая категория сейчас выбрана,
//   - какой список услуг показать справа.
//
// App — единственное место, где хранится состояние. Все остальные
// компоненты — «презентационные»: они получают данные через пропсы
// и просто отображают их.
import { useState } from "react";

// Компоненты страницы.
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import ServicesList from "./components/ServicesList";
import StepIndicator from "./components/StepIndicator";

// Данные: категории услуг и услуги внутри каждой категории.
//
// Структура — массив категорий, у каждой категории — свой массив
// услуг. Такая вложенность удобна: сначала показываем категории
// в сайдбаре, потом по выбранной категории берём её services.
//
// TODO: когда появится сервер, массив заменится на fetch.
// Структура объектов сохранится.
const servicesData = [
  {
    id: 100,
    name: "Стрижки и укладки",
    services: [
      {
        id: 1,
        title: "Стрижка женская",
        desc: "Моделирование формы с учетом типа волос.",
        duration: 60,
        price: 4500,
      },
      {
        id: 2,
        title: "Укладка феном",
        desc: "Объемная укладка с фиксацией.",
        duration: 40,
        price: 2800,
      },
      {
        id: 3,
        title: "Кератиновое выпрямление",
        desc: "Восстановление и гладкость до 3 месяцев.",
        duration: 120,
        price: 8500,
      },
      {
        id: 4,
        title: "Стрижка мужская",
        desc: "Стильная мужская стрижка любой сложности.",
        duration: 40,
        price: 3200,
      },
      {
        id: 5,
        title: "Окрашивание тонирование",
        desc: "Мягкое тонирование без повреждения структуры.",
        duration: 90,
        price: 5800,
      },
    ],
  },
  {
    id: 200,
    name: "Маникюр и педикюр",
    services: [
      {
        id: 6,
        title: "Японский эстетический маникюр P.Shine",
        desc: "Идеальная чистота линий, сертифицированные премиум препараты.",
        duration: 50,
        price: 3200,
      },
      {
        id: 7,
        title: "Комбинированный маникюр с покрытием гель-лак Luxio",
        desc: "Идеальная чистота линий, сертифицированные премиум препараты.",
        duration: 60,
        price: 3800,
      },
      {
        id: 8,
        title: "Аппаратный премиум педикюр KART",
        desc: "Идеальная чистота линий, сертифицированные премиум препараты.",
        duration: 80,
        price: 5500,
      },
      {
        id: 9,
        title: "Укрепление ногтей и IBX-терапия",
        desc: "Идеальная чистота линий, сертифицированные премиум препараты.",
        duration: 30,
        price: 1800,
      },
      {
        id: 10,
        title: "Экспресс маникюр и педикюр в 4 руки",
        desc: "Идеальная чистота линий, сертифицированные премиум препараты.",
        duration: 90,
        price: 7800,
      },
    ],
  },
  {
    id: 300,
    name: "Брови и ресницы",
    services: [
      {
        id: 11,
        title: "Коррекция бровей воском",
        desc: "Четкая форма с учетом анатомии лица.",
        duration: 30,
        price: 1200,
      },
      {
        id: 12,
        title: "Окрашивание бровей хной",
        desc: "Стойкий цвет до 3 недель.",
        duration: 40,
        price: 1800,
      },
      {
        id: 13,
        title: "Ламинирование ресниц",
        desc: "Эффект распахнутого взгляда на 6-8 недель.",
        duration: 60,
        price: 3500,
      },
      {
        id: 14,
        title: "Ботокс для ресниц",
        desc: "Восстановление и укрепление ресниц.",
        duration: 45,
        price: 2800,
      },
    ],
  },
  {
    id: 400,
    name: "Спа-процедуры",
    services: [
      {
        id: 15,
        title: 'SPA-программа "Релакс"',
        desc: "Массаж лица и зоны декольте с аромамаслами.",
        duration: 90,
        price: 6500,
      },
      {
        id: 16,
        title: "Обертывание шоколадное",
        desc: "Питание и увлажнение кожи.",
        duration: 60,
        price: 4200,
      },
      {
        id: 17,
        title: "Пилинг тела с солями Мёртвого моря",
        desc: "Глубокое очищение и регенерация.",
        duration: 50,
        price: 3800,
      },
      {
        id: 18,
        title: "Массаж спины классический",
        desc: "Расслабляющий массаж для снятия напряжения.",
        duration: 60,
        price: 4500,
      },
    ],
  },
];

function App() {
  // activeCategoryId — id категории, которая сейчас выбрана.
  // Изначально 100 — то есть первая категория («Стрижки и укладки»).
  //
  // Число 100 — не магия, а конкретный id из массива servicesData.
  // Если порядок категорий изменится, надо будет поменять
  // и начальное значение.
  const [activeCategoryId, setActiveCategoryId] = useState(100);

  // Находим активную категорию по её id.
  // .find возвращает первый элемент, у которого совпал id,
  // или undefined, если ничего не нашли.
  const activeCategory = servicesData.find(
    (cat) => cat.id === activeCategoryId
  );

  // Если категория найдена — берём её services. Если нет —
  // пустой массив, чтобы ServicesList не упал при обращении
  // к .length и .map.
  const services = activeCategory ? activeCategory.services : [];

  // Клик по категории в сайдбаре.
  // Меняем активный id — React перерисует компонент,
  // activeCategory пересчитается, и справа появится новый список.
  function handleCategoryClick(categoryId) {
    setActiveCategoryId(categoryId);
  }

  return (
    <div className="page">
      <Header />

      {/* .main-booking-flow — горизонтальный flex:
          сайдбар слева, список услуг справа. */}
      <main className="main-booking-flow">
        {/* Сайдбар со списком категорий.
            Пропсы:
              categories       — массив категорий из данных;
              activeCategoryId — какую подсветить;
              onCategoryClick  — что делать при клике. */}
        <Sidebar
          categories={servicesData}
          activeCategoryId={activeCategoryId}
          onCategoryClick={handleCategoryClick}
        />

        {/* Правая часть: индикатор шагов и список услуг. */}
        <section className="services-list">
          <StepIndicator />
          <ServicesList services={services} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
