import ServiceRow from "./ServiceRow";
import { EmptyState } from "./LoadingState";

// ServicesList — список услуг выбранной категории.
//
// Пропс:
//   services — массив услуг [{ id, title, desc, duration, price }, ...].
export default function ServicesList({ services }) {
  return (
    <div className="rows">
      {/* Если услуг нет — показываем заглушку.
          Тернарник: условие ? «если да» : «если нет». */}
      {services.length === 0 ? (
        <EmptyState message="В этой категории пока нет услуг" />
      ) : (
        // Перебираем услуги и рендерим строку для каждой.
        // key={service.id} — уникальный ключ. id услуги
        // уникален и не меняется — идеальный ключ.
        services.map((service) => (
          <ServiceRow key={service.id} service={service} />
        ))
      )}
    </div>
  );
}
