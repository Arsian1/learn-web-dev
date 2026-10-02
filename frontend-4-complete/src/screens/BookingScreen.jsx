import { useState, useEffect } from "react";
import Calendar from "../components/booking/Calendar";
import TimeSlots from "../components/booking/TimeSlots";
import BookingBottomBar from "../components/booking/BookingBottomBar";
import StepIndicator from "../components/common/StepIndicator";
import { LoadingState, EmptyState } from "../components/common/LoadingState";
import { fetchToday, fetchSlots } from "../api";
import "../styles/booking.css";

// BookingScreen — экран выбора даты и времени.
//
// Данные приходят с сервера:
//   - today — «сегодня» по мнению сервера. Нужно, чтобы календарь
//             знал, какой месяц показывать и какие дни блокировать.
//   - slots — слоты на выбранный день для выбранной услуги.
//             Запрашиваются при открытии и при смене дня.
//
// Пропсы:
//   serviceId — id услуги, для которой запрашиваем слоты.
//   onBack     — колбэк кнопки «Назад».
//   onNext     — колбэк кнопки «Далее».
function BookingScreen({ serviceId, onBack, onNext }) {
  // ==========================================================================
  // Состояние загрузки данных с сервера
  // ==========================================================================

  // today — «сегодня» по мнению сервера. null, пока не загрузилось.
  const [today, setToday] = useState(null);

  // loadingToday — идёт ли загрузка today. Пока true — показываем заглушку
  // на всю страницу, потому что без today календарь бессмысленный.
  const [loadingToday, setLoadingToday] = useState(true);

  // errorToday — ошибка загрузки today.
  const [errorToday, setErrorToday] = useState(null);

  // ==========================================================================
  // Состояние страницы (то, что выбрал пользователь)
  // ==========================================================================

  // currentMonth / currentYear — какой месяц показан в календаре.
  // Изначально null. Реальные значения поставим, когда придёт today.
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);

  // selectedDay — выбранный день месяца.
  const [selectedDay, setSelectedDay] = useState(null);

  // selectedTime — выбранное время ("12:00" или null).
  const [selectedTime, setSelectedTime] = useState(null);

  // ==========================================================================
  // Состояние слотов
  // ==========================================================================

  // slots — массив слотов на выбранный день.
  const [slots, setSlots] = useState([]);

  // loadingSlots — идёт ли загрузка слотов. Пока true — в TimeSlots
  // показываем заглушку.
  const [loadingSlots, setLoadingSlots] = useState(true);

  // errorSlots — ошибка загрузки слотов.
  const [errorSlots, setErrorSlots] = useState(null);

  // ==========================================================================
  // Загрузка today при открытии страницы
  // ==========================================================================
  useEffect(() => {
    async function load() {
      try {
        setLoadingToday(true);
        setErrorToday(null);
        const data = await fetchToday();
        setToday(data);

        // Ставим начальный месяц, год и день из today.
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDay(data.day);
      } catch (err) {
        setErrorToday(err.message);
      } finally {
        setLoadingToday(false);
      }
    }

    load();
  }, []);

  // ==========================================================================
  // Загрузка слотов при смене дня (или при первой загрузке today)
  // ==========================================================================
  //
  // useEffect следит за selectedDay и serviceId. Пока selectedDay = null
  // (today ещё не пришёл) — ничего не делаем. Как только появятся оба
  // параметра — запрашиваем слоты.
  //
  // При клике на другой день selectedDay меняется → useEffect срабатывает
  // заново → слоты перезагружаются.
  useEffect(() => {
    // Если ещё нет дня или услуги — ждём.
    if (!selectedDay || !serviceId  || !currentMonth || !currentYear) {
      return;
    }

    async function load() {
      try {
        setLoadingSlots(true);
        setErrorSlots(null);
        const response = await fetchSlots(serviceId , {
          day: selectedDay,
          month: currentMonth,
          year: currentYear,
        });
        setSlots(response.slots);
      } catch (err) {
        setErrorSlots(err.message);
      } finally {
        setLoadingSlots(false);
      }
    }

    load();
  }, [selectedDay, currentMonth, currentYear, serviceId]);

  // ==========================================================================
  // Обработчики
  // ==========================================================================

  // Клик по дню. Меняем выбранный день, сбрасываем время.
  // Слоты подгрузятся автоматически — за это отвечает useEffect выше.
  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedTime(null);
  }

  // Клик по слоту — сохраняем время.
  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  // Стрелка «‹» — месяц назад.
  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  // Стрелка «›» — месяц вперёд.
  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  // Кнопка «Далее».
  function handleNext() {
    if (!selectedTime) {
      alert("Пожалуйста, выберите время");
      return;
    }
    onNext({
      date: { day: selectedDay, month: currentMonth, year: currentYear },
      time: selectedTime,
    });
  }

  // ==========================================================================
  // Рендер
  // ==========================================================================

  // Пока грузится today — показываем заглушку на всю страницу.
  // Без today мы не знаем, какой месяц показывать.
  if (loadingToday) {
    return (
      <main className="booking-layout">
        <LoadingState message="Загрузка..." />
      </main>
    );
  }

  // Ошибка загрузки today — сообщение об ошибке.
  if (errorToday) {
    return (
      <main className="booking-layout">
        <EmptyState message={`Ошибка: ${errorToday}`} />
      </main>
    );
  }

  // today загрузился, состояние инициализировано — можно рендерить
  // полноценный экран.
  return (
    <main className="booking-layout">
      <div className="header-row">
        <div className="title-with-back">
          <button className="back-button" onClick={onBack}>
            ←
          </button>
          <span className="page-title">Выбор даты и времени</span>
        </div>
        <StepIndicator current={2} />
      </div>

      <div className="panels">
        <Calendar
          year={currentYear}
          month={currentMonth}
          selectedDay={selectedDay}
          today={today}
          onDayClick={handleDayClick}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {/* TimeSlots — либо заглушка (загрузка / ошибка),
            либо список слотов. */}
        {loadingSlots && (
          <div className="time-box">
            <span className="time-title">Доступное время</span>
            <LoadingState message="Загрузка слотов..." />
          </div>
        )}

        {!loadingSlots && errorSlots && (
          <div className="time-box">
            <span className="time-title">Доступное время</span>
            <EmptyState message={`Ошибка: ${errorSlots}`} />
          </div>
        )}

        {!loadingSlots && !errorSlots && (
          <TimeSlots
            slots={slots}
            selectedTime={selectedTime}
            onTimeClick={handleTimeClick}
          />
        )}
      </div>

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
