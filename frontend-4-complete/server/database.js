// «База данных» приложения. Пока — обычный JS-объект.
// Когда появится настоящий backend (на Python), файл исчезнет,
// но структура данных сохранится.

export const database = {
  // Категории с услугами.
  // id категорий: 1, 2, 3, 4. id услуг: 1..18 (сквозные).
  categories: [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
  ],

  // Мастера. Поле `image` — путь к картинке в public/images/.
  // Vite отдаёт файлы из public/ по корню — поэтому путь
  // начинается с /images/, а не с /public/images/.
  masters: [
    {
      id: 1,
      name: "Екатерина Милова",
      role: "Топ-стилист по волосам",
      rating: 5.0,
      image: "/images/master-ekaterina.png",
    },
    {
      id: 2,
      name: "Алиса Розен",
      role: "Мастер ногтевой эстетики",
      rating: 4.9,
      image: "/images/master-alisa.png",
    },
    {
      id: 3,
      name: "Даниил Громов",
      role: "Мастер спа & Массажа",
      rating: 4.9,
      image: "/images/master-daniil.png",
    },
  ],

  // Популярные услуги для главной.
  popularServices: [
    {
      id: 1,
      title: "Фирменная стрижка & Уход",
      price: 4500,
      duration: 60,
      image: "/images/service-haircut.png",
    },
    {
      id: 2,
      title: "Эстетический японский маникюр",
      price: 3200,
      duration: 50,
      image: "/images/service-manicure.png",
    },
    {
      id: 3,
      title: "Глубокий спа-уход & Массаж",
      price: 6500,
      duration: 90,
      image: "/images/service-spa.png",
    },
  ],

  // «Сегодня» по мнению сервера. Пока захардкожено, чтобы
  // календарь всегда показывал октябрь 2026.
  today: { day: 17, month: 9, year: 2026 },

  // Слоты для чётных и нечётных дней. Используются функцией
  // getSlotsForDay — она выбирает набор по чётности дня.
  // Клиент этой логики не видит: он просто запрашивает слоты
  // для категории и даты, а сервер сам решает, что отдать.
  // На бэкенде будут храниться какие данные отдать
  // для конкретного для по выбранной категории
  slotsEvenDay: [
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: false },
    { time: "13:00", available: false },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "19:30", available: true },
  ],
  slotsOddDay: [
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: false },
    { time: "11:30", available: true },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: false },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "19:30", available: true },
  ],
};
