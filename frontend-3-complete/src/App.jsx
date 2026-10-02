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
  //   service — выбранная услуга (объект из SERVICES_DATA)
  //   date    — выбранная дата ({ day, month, year })
  //   time    — выбранное время ("12:00")
  // Изначально всё null, потому что пользователь ещё ничего не выбрал.
  //
  // Эти данные передаются из экрана в экран через пропсы. Например,
  // из ServicesScreen услуга «уезжает» в BookingScreen, а из
  // BookingScreen — в ConfirmationScreen. Так мы сохраняем выбор
  // пользователя, не используя localStorage или сервер.
  const [booking, setBooking] = useState({
    service: null,
    date: null,
    time: null,
  });

  // goTo — вспомогательная функция, чтобы переключать экран.
  // Вместо setScreen("booking") пишем goTo("booking") — короче и
  // понятнее, что происходит.
  function goTo(nextScreen) {
    setScreen(nextScreen);
  }

  // Вызывается из ServicesScreen, когда пользователь нажал «Выбрать».
  // Получает объект услуги, сохраняет его в booking и переходит
  // на экран выбора даты.
  //
  // Обрати внимание: { ...booking, service: service } — это копия
  // старого объекта booking, в которой заменено поле service.
  // React требует создавать новый объект, а не мутировать старый,
  // иначе он не поймёт, что состояние изменилось.
  function handleSelectService(service) {
    setBooking({ ...booking, service: service });
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
    setBooking({ service: null, date: null, time: null });
    goTo("home");
  }

  // Рендер. Показываем Header, нужный экран и Footer.
  // Какой именно экран показать — решает переменная screen.
  return (
    <div className="page">
      {/* onLogoClick — клик по логотипу всегда возвращает на главную. */}
      <Header onLogoClick={() => goTo("home")} />

      {/* Главная. Кнопка «Записаться на услугу» ведёт на выбор услуг. */}
      {screen === "home" && (
        <HomeScreen onCtaServiceClick={() => goTo("services")} />
      )}

      {/* Страница услуг.
          onBack — кнопка «Назад», возвращает на главную.
          onSelectService — вызывается при клике «Выбрать» на услуге. */}
      {screen === "services" && (
        <ServicesScreen
          onBack={() => goTo("home")}
          onSelectService={handleSelectService}
        />
      )}

      {/* Страница выбора даты и времени.
          onBack — вернуться на услуги.
          onNext — кнопка «Далее», передаёт дату и время в App. */}
      {screen === "booking" && (
        <BookingScreen
          onBack={() => goTo("services")}
          onNext={handleConfirmDate}
        />
      )}

      {/* Страница подтверждения.
          booking — сюда приходят все данные, выбранные пользователем.
          onBack — вернуться на календарь.
          onFinish — после подтверждения вернуться на главную. */}
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
