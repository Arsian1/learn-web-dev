import { useState, useEffect } from "react";
import MasterCard from "./MasterCard";
import { LoadingState, EmptyState } from "../common/LoadingState";
import { fetchMasters } from "../../api";

// OurMasters — секция «Наши мастера» на главной.
// Данные приходят с сервера через API.
function OurMasters() {
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMasters();
        setMasters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section className="our-masters">
      <div className="section-header">
        <span className="section-tag">Наша гордость</span>
        <h2 className="section-title">Наши мастера</h2>
      </div>

      <div className="masters-grid">
        {loading && <LoadingState message="Загрузка мастеров..." />}

        {!loading && error && <EmptyState message={`Ошибка: ${error}`} />}

        {!loading &&
          !error &&
          masters.map(function (master) {
            return <MasterCard key={master.id} master={master} />;
          })}
      </div>
    </section>
  );
}

export default OurMasters;
