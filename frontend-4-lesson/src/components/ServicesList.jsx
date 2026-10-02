import { useState, useEffect } from "react";
import ServiceRow from "./ServiceRow";
import { EmptyState, LoadingState } from "./LoadingState";
import { fetchServicesByCategory } from "../api";

// ServicesList — список услуг выбранной категории.
//
// САМ грузит услуги с сервера — как только меняется activeCategoryId.
// Это сделано, чтобы логика загрузки лежала рядом с тем, что эти
// данные отображает. App не занимается двумя разными запросами.
//
// Пропс:
//   activeCategoryId — id категории, услуги которой надо показать.
//
// Что изменилось по сравнению с версией без сервера:
//   - принимает не готовый массив services, а только id категории;
//   - сам делает запрос через fetchServicesByCategory;
//   - появились состояния loading и error;
//   - пока грузит — показывает LoadingState, при ошибке — EmptyState.
export default function ServicesList({ activeCategoryId }) {
  // services — массив услуг текущей категории.
  const [services, setServices] = useState([]);

  // loading — идёт ли загрузка. Изначально true: запрос стартует сразу.
  const [loading, setLoading] = useState(true);

  // error — текст ошибки, если запрос упал.
  const [error, setError] = useState(null);

  // Загрузка услуг по категории.
  async function loadServices(categoryId) {
    // Перед запросом сбрасываем состояние:
    // — включаем «Загрузка...», чтобы при смене категории
    //   пользователь увидел свежий индикатор, а не старые услуги;
    // — очищаем старую ошибку.
    setLoading(true);
    setError(null);

    try {
      const data = await fetchServicesByCategory(categoryId);
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // useEffect следит за activeCategoryId. Как только он изменился —
  // грузим новые услуги. При первом рендере тоже сработает.
  useEffect(() => {
    loadServices(activeCategoryId);
  }, [activeCategoryId]);

  // Пока грузим — показываем заглушку.
  if (loading) {
    return (
      <div className="rows">
        <LoadingState message="Загрузка услуг..." />
      </div>
    );
  }

  // Ошибка — сообщение.
  if (error) {
    const message = `Произошла ошибка ${error.message}`;
    return (
      <div className="rows">
        <EmptyState message={message} />
      </div>
    );
  }

  // Данные пришли — либо список, либо заглушка «нет услуг».
  return (
    <div className="rows">
      {services.length === 0 ? (
        <EmptyState message="В этой категории пока нет услуг" />
      ) : (
        services.map((service) => (
          <ServiceRow key={service.id} service={service} />
        ))
      )}
    </div>
  );
}
