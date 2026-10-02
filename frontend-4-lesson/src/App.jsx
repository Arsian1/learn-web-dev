// App — корневой компонент приложения.
//
// Здесь живёт вся логика страницы:
//   - какие категории услуг есть,
//   - какая категория сейчас выбрана,
//   - что показать справа: загрузку, ошибку или список услуг.
//
// В этой версии данные приходят с сервера. Категории запрашиваются
// один раз при открытии страницы. Услуги запрашиваются отдельным
// компонентом ServicesList при смене активной категории.
//
// Что изменилось по сравнению с версией без сервера:
//   - данные больше не захардкожены в App, а приходят через fetchCategories();
//   - появились три состояния: loading, error, categories;
//   - во время загрузки показывается заглушка «Загрузка...»;
//   - если категории не загрузились — показывается сообщение об ошибке.

import { useState, useEffect } from "react";
import { fetchCategories } from "./api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import ServicesList from "./components/ServicesList";
import StepIndicator from "./components/StepIndicator";

function App() {
  // activeCategoryId — id выбранной категории.
  // Изначально null: пока категории не загрузились, выбирать нечего.
  // Как только категории придут — поставим id первой.
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // categories — массив категорий с сервера.
  // Изначально пустой. Заполнится, когда придёт ответ.
  const [categories, setCategories] = useState([]);

  // loading — идёт ли загрузка. Пока true — показываем заглушку.
  // Изначально true, потому что запрос стартует сразу при открытии.
  const [loading, setLoading] = useState(true);

  // error — текст ошибки, если запрос упал. Иначе null.
  const [error, setError] = useState(null);

  // Загрузка категорий с сервера.
  // После успешной загрузки автоматически выбираем первую категорию,
  // чтобы справа не было пустого экрана.
  async function loadCategories() {
    try {
      // Сбрасываем ошибку перед новым запросом.
      // Нужно, если функцию вызовут повторно (например, кнопкой «Обновить»).
      setError(null);

      const data = await fetchCategories();
      setCategories(data);

      // Ставим первую категорию активной.
      // data[0]?.id || null — если массив пуст, вернём null.
      const firstCategoryId = data[0]?.id || null;
      if (firstCategoryId) {
        setActiveCategoryId(firstCategoryId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      // finally выполняется всегда — и при успехе, и при ошибке.
      // Снимаем флаг загрузки, чтобы показать результат.
      setLoading(false);
    }
  }

  // useEffect с пустым массивом зависимостей [] значит:
  // «выполнить один раз, когда компонент появился на странице».
  useEffect(() => {
    loadCategories();
  }, []);

  // Клик по категории в сайдбаре. Меняем активный id —
  // ServicesList увидит изменение и перезапросит услуги.
  function handleCategoryClick(categoryId) {
    setActiveCategoryId(categoryId);
  }

  // Если идёт загрузка и категорий ещё нет — показываем заглушку.
  // Внутри заглушки остаются Header и Footer, чтобы страница
  // не «прыгала»: шапка и подвал на месте, меняется только середина.
  if (loading && categories.length === 0) {
    return (
      <div className="page">
        <Header />
        <div style={{ textAlign: "center", padding: "40px", flex: 1 }}>
          Загрузка...
        </div>
        <Footer />
      </div>
    );
  }

  // Если ошибка и данных так и нет — показываем сообщение.
  // Проверка categories.length === 0 нужна, чтобы не затирать
  // уже загруженные данные при повторной ошибке.
  if (error && categories.length === 0) {
    return (
      <div className="page">
        <Header />
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#e74c3c",
            flex: 1,
          }}
        >
          Ошибка: {error}
        </div>
        <Footer />
      </div>
    );
  }

  // Данные загрузились — рендерим нормальный экран.
  return (
    <div className="page">
      <Header />

      <main className="main-booking-flow">
        {/* Сайдбар со списком категорий.
            onCategoryClick — колбэк, вызывается с id категории. */}
        <Sidebar
          categories={categories}
          activeCategoryId={activeCategoryId}
          onCategoryClick={handleCategoryClick}
        />

        <section className="services-list">
          <StepIndicator />

          {/* ServicesList сам грузит услуги по activeCategoryId.
              Это сделано, чтобы App не занимался двумя разными
              запросами. Логика загрузки услуг — рядом с тем,
              что эти данные отображает. */}
          <ServicesList activeCategoryId={activeCategoryId} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
