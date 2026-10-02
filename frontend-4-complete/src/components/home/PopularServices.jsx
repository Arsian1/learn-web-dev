import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { LoadingState, EmptyState } from "../common/LoadingState";
import { fetchPopularServices } from "../../api";

// PopularServices — секция «Популярные услуги» на главной.
//
// Данные приходят с сервера через API. Пока грузятся — показываем
// заглушку «Загрузка…». Если ошибка — сообщение об ошибке.
function PopularServices() {
  // services — массив популярных услуг, изначально пустой.
  const [services, setServices] = useState([]);

  // loading — идёт ли загрузка.
  const [loading, setLoading] = useState(true);

  // error — текст ошибки, если что-то пошло не так.
  const [error, setError] = useState(null);

  // Загрузка данных при первом рендере.
  // useEffect с пустым массивом зависимостей [] означает:
  // «выполнить один раз, когда компонент появился на странице».
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPopularServices();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section className="popular-services">
      <div className="section-header">
        <span className="section-tag">Эксклюзивный уход</span>
        <h2 className="section-title">Популярные услуги</h2>
      </div>

      <div className="services-grid">
        {loading && <LoadingState message="Загрузка услуг..." />}

        {!loading && error && <EmptyState message={`Ошибка: ${error}`} />}

        {!loading &&
          !error &&
          services.map(function (service) {
            return <ServiceCard key={service.id} service={service} />;
          })}
      </div>
    </section>
  );
}

export default PopularServices;
