// Импортируем три секции главной страницы.
// Каждая — отдельный компонент, отвечает за свой блок контента.
import Hero from "../components/home/Hero";
import PopularServices from "../components/home/PopularServices";
import OurMasters from "../components/home/OurMasters";

// Стили главной. Подключаются здесь — при рендере HomeScreen.
// Внутри — секции hero, popular-services, our-masters.
// Общие стили (header, footer, page) — в common.css,
// подключены глобально в main.jsx.
import "../styles/home.css";

// HomeScreen — главная страница приложения.
//
// По сути — просто «сборка» из трёх секций, идущих одна за другой:
//   1. Hero — большая секция с фоном и двумя кнопками вверху.
//   2. PopularServices — три карточки популярных услуг.
//   3. OurMasters — три карточки мастеров.
//
// Своего состояния у HomeScreen нет — вся логика внутри секций
// или в App. Здесь только композиция.
//
// Пропс:
//   onCtaServiceClick — колбэк, который Hero вызывает при клике
//                       на «Записаться на услугу». Прокидывается
//                       наверх в App, где переключается экран.
function HomeScreen({ onCtaServiceClick }) {
  return (
    // <main> — основной контент страницы. Один на страницу.
    // Внутри — три <section>, каждая со своим смыслом.
    <main className="home">
      {/* Hero — самая верхняя секция с фоном и заголовком.
          Получает колбэк, чтобы передать его на кнопку
          «Записаться на услугу». */}
      <Hero onCtaServiceClick={onCtaServiceClick} />

      {/* PopularServices — блок с тремя популярными услугами.
          Не принимает пропсов: данные берёт из data/popularServices.js.
          Если понадобится получать их с сервера — здесь появится
          useState + useEffect. */}
      <PopularServices />

      {/* OurMasters — блок с тремя мастерами.
          Тоже без пропсов, данные из data/masters.js. */}
      <OurMasters />
    </main>
  );
}

export default HomeScreen;
