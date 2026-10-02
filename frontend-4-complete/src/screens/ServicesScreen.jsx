import { useState, useEffect } from "react";
import Sidebar from "../components/services/Sidebar";
import ServicesList from "../components/services/ServicesList";
import StepIndicator from "../components/common/StepIndicator";
import { LoadingState, EmptyState } from "../components/common/LoadingState";
import { fetchCategories } from "../api";
import "../styles/services.css";

// ServicesScreen — экран выбора услуги.
//
// Загружает список категорий с сервера при открытии.
// Держит activeCategoryId — id выбранной категории.
// Прокидывает данные в Sidebar и ServicesList.
//
// Услуги грузит не этот компонент, а ServicesList — потому что
// при смене категории надо перезапрашивать данные, а логика
// запроса — это забота ServicesList.
//
// Пропсы:
//   onBack          — кнопка «Назад», возвращает на главную.
//   onSelectService — колбэк при клике «Выбрать» на услуге.
function ServicesScreen({ onBack, onSelectService }) {
  // categories — список категорий с сервера.
  const [categories, setCategories] = useState([]);

  // activeCategoryId — id выбранной категории.
  // Изначально null: пока категории не загрузились, выбирать нечего.
  // Как только они придут — поставим первую.
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // loading и error — состояния загрузки.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка категорий при открытии экрана.
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCategories();
        setCategories(data);

        // Сразу выбираем первую категорию, чтобы не было
        // пустого экрана справа. Если данных нет — оставляем null,
        // ServicesList покажет заглушку.
        if (data.length > 0) {
          setActiveCategoryId(data[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Клик по категории в сайдбаре.
  function handleCategoryClick(categoryId) {
    setActiveCategoryId(categoryId);
  }

  // Пока грузятся категории — показываем заглушку.
  if (loading) {
    return (
      <main className="main-booking-flow">
        <LoadingState message="Загрузка категорий..." />
      </main>
    );
  }

  // Если не удалось загрузить — сообщение об ошибке.
  if (error) {
    return (
      <main className="main-booking-flow">
        <EmptyState message={`Ошибка: ${error}`} />
      </main>
    );
  }

  return (
    <main className="main-booking-flow">
      <Sidebar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryClick={handleCategoryClick}
        onBack={onBack}
      />

      <section className="services-list">
        <StepIndicator current={1} />
        <ServicesList
          activeCategoryId={activeCategoryId}
          onSelectService={(service) =>
            onSelectService({ service, categoryId: activeCategoryId })
          }
        />
      </section>
    </main>
  );
}

export default ServicesScreen;
