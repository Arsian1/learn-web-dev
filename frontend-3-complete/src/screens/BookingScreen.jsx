// Импортируем useState — без него не получится хранить состояние.
import { useState } from "react";

// Компоненты календаря. Верхний Calendar собирает из трёх подкомпонентов:
// CalendarHeader (заголовок и стрелки), CalendarGrid (сетка дней),
// и внутри Calendar есть ещё дни-ячейки. TimeSlots — сетка слотов времени.
import Calendar from "../components/booking/Calendar";
import TimeSlots from "../components/booking/TimeSlots";

// Нижняя панель с выбранной датой и кнопкой «Далее».
import BookingBottomBar from "../components/booking/BookingBottomBar";

// Индикатор шагов. Из common/, потому что используется на трёх экранах.
import StepIndicator from "../components/common/StepIndicator";

// Данные с «сервера»: сегодняшняя дата и стартовые слоты.
// Позже заменится на fetch.
import { SERVER_DATA } from "../data/slots";

// Функция-имитация запроса слотов на конкретный день.
// Сейчас — по чётности выбирает массив из slots.js.
// Позже — заменится на fetch.
import { getSlotsForDay } from "../data/date";

// Стили этой страницы. Подключаются при рендере BookingScreen.
// common.css уже подключён в main.jsx глобально, поэтому отдельные
// классы (.header, .footer, .step-indicator) здесь не дублируются.
import "../styles/booking.css";

// BookingScreen — экран выбора даты и времени.
//
// Здесь живёт всё состояние, которое относится к этому шагу:
// какой месяц показан в календаре, какая дата выбрана, какое время,
// и какие слоты сейчас показаны.
//
// Пропсы:
//   onBack — колбэк кнопки «Назад». Возвращает на экран услуг.
//   onNext — колбэк кнопки «Далее». Передаёт выбранную дату и время
//            наверх, в App.
function BookingScreen({ onBack, onNext }) {
  // today — дата с сервера. Раньше неё выбирать нельзя.
  // Берём один раз из SERVER_DATA. Не в useState, потому что
  // это константа, она не меняется.
  const today = SERVER_DATA.today;

  // ==========================================================================
  // Состояние страницы
  //
  // Пять useState — пять независимых кусков данных.
  // Вместе они описывают, что сейчас видит и чего ждёт пользователь.
  // ==========================================================================

  // currentMonth — какой месяц показан в календаре.
  // Изначально — месяц из today (то есть октябрь, потому что
  // today.month = 9).
  // Может отличаться от выбранного дня: пользователь мог
  // перелистнуть на декабрь, но выбранным остаётся 17 октября.
  const [currentMonth, setCurrentMonth] = useState(today.month);

  // currentYear — год, показанный в календаре. Аналогично.
  const [currentYear, setCurrentYear] = useState(today.year);

  // selectedDay — какой день выбран. Может быть не в том месяце,
  // что показан в календаре. Например, пользователь листает декабрь,
  // а selectedDay = 17 (выбран ещё в октябре).
  const [selectedDay, setSelectedDay] = useState(today.day);

  // selectedTime — какое время выбрано. null означает «пока не выбрано».
  // Это состояние сбрасывается при клике на новый день — потому что
  // на новом дне слоты другие, и предыдущий выбор уже не актуален.
  const [selectedTime, setSelectedTime] = useState(null);

  // slots — массив слотов на выбранный день. Изначально — слоты
  // на сегодня (из SERVER_DATA). При клике на другой день
  // подгружаются заново через getSlotsForDay.
  const [slots, setSlots] = useState(SERVER_DATA.slots);

  // ==========================================================================
  // Обработчики
  // ==========================================================================

  // Клик по дню в календаре.
  // Меняет selectedDay, сбрасывает выбранное время и подгружает
  // новые слоты для этого дня.
  function handleDayClick(day) {
    setSelectedDay(day);
    // Сбрасываем время: на новом дне могут быть другие слоты,
    // старое время не имеет смысла.
    setSelectedTime(null);
    // «Запрашиваем» слоты у сервера (пока — из локальной имитации).
    setSlots(getSlotsForDay(day));
  }

  // Клик по слоту времени. Просто сохраняет выбранное время.
  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  // Стрелка «‹» — месяц назад.
  // Если это был январь (currentMonth === 0), то переходим
  // на декабрь предыдущего года.
  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  // Стрелка «›» — месяц вперёд.
  // Если это был декабрь (currentMonth === 11), переходим
  // на январь следующего года.
  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  // Кнопка «Далее» в нижней панели.
  function handleNext() {
    // Проверяем, что время выбрано. Без него дальше идти нельзя —
    // на экране подтверждения нужно и дата, и время.
    if (!selectedTime) {
      alert("Пожалуйста, выберите время");
      return;
    }

    // Отправляем выбранные данные наверх, в App.
    // App сохранит их в booking и переключит экран
    // на ConfirmationScreen.
    onNext({
      date: { day: selectedDay, month: currentMonth, year: currentYear },
      time: selectedTime,
    });
  }

  // ==========================================================================
  // Рендер
  // ==========================================================================

  return (
    // .booking-layout — вертикальная раскладка: шапка, панели, нижняя полоса.
    <main className="booking-layout">
      {/* Верхняя строка: заголовок с кнопкой «Назад» и шаги справа. */}
      <div className="header-row">
        <div className="title-with-back">
          <button className="back-button" onClick={onBack}>
            ←
          </button>
          <span className="page-title">Выбор даты и времени</span>
        </div>
        <StepIndicator current={2} />
      </div>

      {/* Две панели рядом: календарь слева, слоты справа.
          Каждая панель — отдельный компонент со своими пропсами.
          BookingScreen не лезет во внутренности ни одной из них. */}
      <div className="panels">
        <Calendar
          // Что показать в календаре (какой месяц).
          year={currentYear}
          month={currentMonth}
          // Кого подсветить и что сравнить с today.
          selectedDay={selectedDay}
          today={today}
          // Что делать при клике на день и стрелки.
          onDayClick={handleDayClick}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        <TimeSlots
          // Какие слоты показать и какой из них выбран.
          slots={slots}
          selectedTime={selectedTime}
          // Что делать при клике на слот.
          onTimeClick={handleTimeClick}
        />
      </div>

      {/* Нижняя панель: показываем, что выбрано, и кнопка «Далее». */}
      <BookingBottomBar
        day={selectedDay}
        month={currentMonth}
        year={currentYear}
        selectedTime={selectedTime}
        onNext={handleNext}
      />
    </main>
  );
}

export default BookingScreen;
