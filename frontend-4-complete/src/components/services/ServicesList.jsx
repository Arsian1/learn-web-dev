import { useState, useEffect } from "react";
import ServiceRow from "./ServiceRow";
import { LoadingState, EmptyState } from "../common/LoadingState";
import { fetchServicesByCategory } from "../../api";

// ServicesList — список услуг выбранной категории.
//
// Сам грузит услуги с сервера: как только меняется activeCategoryId,
// запускается новый запрос. Так проще, чем грузить услуги
// в ServicesScreen: логика запроса и её состояния живут рядом
// с тем, что эти данные отображает.
//
// Пропсы:
//   activeCategoryId — id категории, услуги которой надо загрузить.
//   onSelectService  — колбэк при клике «Выбрать» на услуге.
function ServicesList({ activeCategoryId, onSelectService }) {
  // services — массив услуг текущей категории.
  const [services, setServices] = useState([]);

  // loading и error — состояния загрузки.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка услуг при смене категории.
  // useEffect следит за activeCategoryId: если он изменился —
  // запускается новый запрос. При первом рендере тоже сработает.
  useEffect(() => {
    // Если категория ещё не выбрана — ничего не грузим.
    if (!activeCategoryId) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchServicesByCategory(activeCategoryId);
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [activeCategoryId]);

  // Пока грузятся услуги — заглушка.
  if (loading) {
    return (
      <div className="rows rows-loading">
        <LoadingState message="Загрузка услуг..." />
      </div>
    );
  }

  // Ошибка загрузки.
  if (error) {
    return (
      <div className="rows rows-loading">
        <EmptyState message={`Ошибка: ${error}`} />
      </div>
    );
  }

  // Услуг нет — показываем заглушку.
  if (services.length === 0) {
    return (
      <div className="rows rows-loading">
        <EmptyState message="В этой категории пока нет услуг" />
      </div>
    );
  }

  // Данные пришли — рендерим строки.
  return (
    <div className="rows">
      {services.map(function (service) {
        return (
          <ServiceRow
            key={service.id}
            service={service}
            onSelect={() => onSelectService(service)}
          />
        );
      })}
    </div>
  );
}

export default ServicesList;
