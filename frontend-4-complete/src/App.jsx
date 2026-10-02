// App — корневой компонент всего приложения.
// Здесь хранится состояние: какой экран показать и какие данные
// пользователь выбрал по ходу записи.
//
// В настоящем большом приложении для переключения страниц используют
// react-router (URL меняется — можно переслать ссылку, вернуться назад
// кнопкой браузера). У нас приложение учебное и маленькое, поэтому
// переключение сделано через state: строка "home" / "services" /
// "booking" / "confirmation". Это проще и нагляднее.

import { useState } from "react";

// Общие компоненты — есть на всех экранах.
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// Экраны приложения. Каждый — отдельный компонент верхнего уровня.
import HomeScreen from "./screens/HomeScreen";
import ServicesScreen from "./screens/ServicesScreen";
import BookingScreen from "./screens/BookingScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";

function App() {
  // screen — какой экран сейчас показан.
  // useState("home") значит: при первом рендере показываем главную.
  // setScreen — функция, чтобы переключить экран.
  const [screen, setScreen] = useState("home");

  // booking — данные, которые пользователь выбирает по шагам:
  //   categoryId — id категории выбранной услуги.
  //                Нужен для запроса слотов: слоты на сервере
  //                привязаны к категории.
  //   service    — выбранная услуга (объект с сервера).
  //   date       — выбранная дата ({ day, month, year }).
  //   time       — выбранное время ("12:00").
  // Изначально всё null, потому что пользователь ещё ничего не выбрал.
  const [booking, setBooking] = useState({
    categoryId: null,
    service: null,
    date: null,
    time: null,
  });

  // goTo — вспомогательная функция, чтобы переключать экран.
  function goTo(nextScreen) {
    setScreen(nextScreen);
  }

  // Вызывается из ServicesScreen, когда пользователь нажал «Выбрать».
  // Получает объект { service, categoryId }, сохраняет его в booking
  // и переходит на экран выбора даты.
  //
  // Обрати внимание: { ...booking, ...payload } — это копия
  // старого объекта booking, в которой перезаписаны поля service
  // и categoryId. React требует создавать новый объект, а не
  // мутировать старый, иначе он не поймёт, что состояние изменилось.
  function handleSelectService(payload) {
    setBooking({ ...booking, ...payload });
    goTo("booking");
  }

  // Вызывается из BookingScreen, когда пользователь нажал «Далее».
  // Получает объект { date, time }, дописывает его в booking и
  // переходит на экран подтверждения.
  function handleConfirmDate(payload) {
    setBooking({ ...booking, date: payload.date, time: payload.time });
    goTo("confirmation");
  }

  // Вызывается из ConfirmationScreen, когда пользователь закрыл
  // модалку «Запись подтверждена». Сбрасывает booking в исходное
  // состояние и возвращает на главную.
  function handleFinish() {
    setBooking({
      categoryId: null,
      service: null,
      date: null,
      time: null,
    });
    goTo("home");
  }

  // Рендер. Показываем Header, нужный экран и Footer.
  return (
    <div className="page">
      {/* onLogoClick — клик по логотипу всегда возвращает на главную. */}
      <Header onLogoClick={() => goTo("home")} />

      {/* Главная. Кнопка «Записаться на услугу» ведёт на выбор услуг. */}
      {screen === "home" && (
        <HomeScreen onCtaServiceClick={() => goTo("services")} />
      )}

      {/* Страница услуг. */}
      {screen === "services" && (
        <ServicesScreen
          onBack={() => goTo("home")}
          onSelectService={handleSelectService}
        />
      )}

      {/* Страница выбора даты и времени.
      serviceId — id выбранной услуги. По нему BookingScreen
      запрашивает слоты у сервера. */}
      {screen === "booking" && (
        <BookingScreen
          serviceId={booking.service?.id}
          onBack={() => goTo("services")}
          onNext={handleConfirmDate}
        />
      )}

      {/* Страница подтверждения. */}
      {screen === "confirmation" && (
        <ConfirmationScreen
          booking={booking}
          onBack={() => goTo("booking")}
          onFinish={handleFinish}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
