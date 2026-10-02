// ============================================================
// 1. ДАННЫЕ, КОТОРЫЕ ПРИХОДЯТ С СЕРВЕРА
// ============================================================
//
// TODO: Позже эти данные будут загружаться через запрос к серверу.
// Сейчас захардкожены, чтобы страница работала без backend.
//
// Структура: массив категорий, у каждой категории — свой массив
// услуг. Такая вложенность удобна для отрисовки: сначала рисуем
// категории в сайдбаре, потом по выбранной категории берём
// её services и рендерим список.
//
// Каждая услуга: id, title, desc, duration, price.
// Каждая категория: id, name, services.

const SERVICES_DATA = [
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
        // Двойные кавычки внутри строки → снаружи одинарные.
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

// ============================================================
// 2. СОСТОЯНИЕ ДЛЯ СТРАНИЦЫ
// ============================================================
//
// На этой странице отдельного состояния нет. Всё берётся из DOM:
//   - активная категория помечается классом .active на элементе;
//   - список услуг перерисовывается при клике.
//
// Это отличается от страницы календаря, где есть BOOKING_STATE.
// Но по сути состояние здесь тоже есть — просто оно хранится
// в DOM (какая категория активна), а не в переменной. Такой подход
// нормально работает для простых случаев, но хуже масштабируется.
// В React-версии состояние переехало в useState.

// ============================================================
// 3. ЛОГИКА ДЛЯ ИМИТАЦИИ РАБОТЫ С СЕРВЕРОМ
// ============================================================
//
// Сейчас данные берутся из SERVICES_DATA напрямую.
// Когда появится backend, эти функции заменятся на fetch.

// findCategoryById — ищет категорию по id.
// Обычный линейный поиск: перебираем массив, сравниваем id,
// возвращаем первый подходящий. Если ничего не нашли — null.
function findCategoryById(id) {
  for (let i = 0; i < SERVICES_DATA.length; i++) {
    const category = SERVICES_DATA[i];
    if (category.id === id) {
      return category;
    }
  }
  return null;
}

// findServiceById — ищет услугу по id среди всех категорий.
// Двойной цикл: сначала по категориям, внутри — по услугам.
// Используется на этой странице, чтобы по id из data-атрибута
// найти саму услугу и сохранить её в localStorage.
//
// В React-версии эта функция не нужна: услуга сразу передаётся
// в колбэк onSelect, и id не приходится искать обратно.
function findServiceById(id) {
  for (let i = 0; i < SERVICES_DATA.length; i++) {
    const category = SERVICES_DATA[i];
    for (let j = 0; j < category.services.length; j++) {
      const service = category.services[j];
      if (service.id === id) {
        return service;
      }
    }
  }
  return null;
}

// saveSelectedService — сохраняет выбранную услугу в localStorage.
//
// Нужно только для многостраничного приложения: данные должны
// «дожить» до следующей страницы (booking.html). Сохраняем не всю
// услугу, а только нужные поля — чтобы не тащить лишнее.
//
// TODO: Позже может уйти на сервер как черновик брони.
function saveSelectedService(service) {
  const booking = {
    service: {
      id: service.id,
      title: service.title,
      duration: service.duration,
      price: service.price,
    },
  };
  localStorage.setItem("elair-booking", JSON.stringify(booking));
}

// ============================================================
// 4. ЧИСТЫЕ ФУНКЦИИ
// ============================================================
//
// Не зависят от DOM и от данных проекта. Можно копировать
// в любой другой проект.

// formatPrice — превращает число в строку с валютой.
// 3200 → "3 200 ₽". toLocaleString сам расставляет разряды
// по правилам русской локали.
function formatPrice(price) {
  return price.toLocaleString("ru-RU") + " ₽";
}

// ============================================================
// 5. ОТРИСОВКА И ОБРАБОТЧИКИ
// ============================================================
//
// Работаем с DOM: формируем HTML, вставляем через innerHTML,
// после вставки вешаем обработчики на новые элементы.

// renderCategories — рисует список категорий в сайдбаре.
// Первая категория сразу помечается активной — чтобы при открытии
// страницы был показан не пустой экран, а услуги первой категории.
function renderCategories() {
  const sidebar = document.querySelector(".sidebar");
  SERVICES_DATA.forEach(function (category, index) {
    // index === 0 → первая категория → isActive = true.
    const categoryDiv = renderCategoryItem(category, index === 0);
    sidebar.appendChild(categoryDiv);
  });
}

// renderCategoryItem — создаёт DOM-элемент для одной категории.
//
// Здесь используем document.createElement, а не innerHTML — потому
// что возвращаем один элемент, который потом добавляем через
// appendChild. Так удобнее, когда нужно создать несколько
// элементов одного типа в цикле.
//
// data-id нужен, чтобы в обработчике клика понять, по какой
// категории кликнули. Раньше мы бы навесили onClick с замыканием,
// но здесь используется делегирование через dataset.
function renderCategoryItem(category, isActive) {
  const activeClass = isActive ? "active" : "";
  const count = category.services.length;
  const categoryDiv = document.createElement("div");
  categoryDiv.dataset.id = category.id;
  categoryDiv.className = "category-item " + activeClass;
  categoryDiv.innerHTML =
    '<span class="cat-name">' +
    category.name +
    "</span>" +
    '<div class="count-badge"><span>' +
    count +
    "</span></div>";
  return categoryDiv;
}

// renderServices — рисует список услуг выбранной категории.
//
// Находит контейнер .services-list .rows и вставляет туда HTML.
// Если категория не найдена или пустая — показывает заглушку.
// После вставки вешает обработчики на кнопки «Выбрать».
function renderServices(categoryId) {
  const servicesContainer = document.querySelector(".services-list .rows");
  const category = findCategoryById(categoryId);

  // Заглушка на случай пустой категории или несуществующего id.
  // Инлайн-стиль — потому что блок короткий и используется только тут.
  if (!category || !category.services || category.services.length === 0) {
    servicesContainer.innerHTML =
      '<div style="text-align: center; padding: 40px; color: #6B6661; font-size: 16px;">' +
      "В этой категории пока нет услуг" +
      "</div>";
    return;
  }

  // Собираем HTML всех строк.
  let html = "";
  category.services.forEach(function (service) {
    html += renderServiceItem(service);
  });

  // Вставляем одним куском — быстрее, чем по одной строке.
  servicesContainer.innerHTML = html;
}

// renderServiceItem — возвращает HTML-строку для одной услуги.
//
// Используется шаблонная строка (`...`) — так удобнее, чем
// конкатенация через +, особенно когда внутри много разметки.
//
// data-service нужен, чтобы при клике «Выбрать» понять,
// какая услуга выбрана. Обработчик найдёт строку через closest,
// достанет id из dataset, потом через findServiceById
// найдёт саму услугу.
function renderServiceItem(service) {
  const formattedPrice = formatPrice(service.price);
  return `
    <div class="service-row" data-service="${service.id}">
      <div class="info">
        <span class="title">${service.title}</span>
        <span class="desc">${service.desc}</span>
      </div>
      <div class="meta">
        <span class="duration">${service.duration} мин</span>
        <span class="price">${formattedPrice}</span>
      </div>
      <button class="select-btn"><span>Выбрать</span></button>
    </div>
  `;
}

// setupCategoryListeners — вешает обработчики на категории в сайдбаре.
//
// При клике:
//   1. снимаем .active со всех категорий,
//   2. ставим .active на кликнутую,
//   3. перерисовываем список услуг.
//
// querySelectorAll вызывается один раз — в момент инициализации.
// Категории с тех пор не пересоздаются, поэтому повторно
// вызывать эту функцию не надо.
function setupCategoryListeners() {
  const categoryItems = document.querySelectorAll(".category-item");

  function onCategoryItemClick(event) {
    // Снимаем активность со всех.
    categoryItems.forEach(function (cat) {
      cat.classList.remove("active");
    });

    // Находим кликнутую и достаём id из data-атрибута.
    const clickedItem = event.currentTarget;
    const categoryId = parseInt(clickedItem.dataset.id);

    // Ставим .active и перерисовываем список услуг.
    clickedItem.classList.add("active");
    renderServices(categoryId);
  }

  categoryItems.forEach(function (item) {
    item.addEventListener("click", onCategoryItemClick);
  });
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
//
// init() вызывается один раз при загрузке страницы и делает:
//   1. Рисует категории в сайдбаре.
//   2. Рисует услуги первой категории (id 100).
//   3. Вешает обработчики на категории.
//   4. Вешает обработчики на логотип и кнопку «Назад».

function init() {
  renderCategories();
  // 100 — id первой категории («Стрижки и укладки»).
  // Хардкод допустим, потому что мы точно знаем структуру данных.
  // В React-версии вместо хардкода берётся SERVICES_DATA[0].id —
  // это гибче, если порядок категорий изменится.
  renderServices(100);
  setupCategoryListeners();
}

// Ждём, пока браузер построит DOM, потом запускаем init.
document.addEventListener("DOMContentLoaded", function () {
  init();
});
