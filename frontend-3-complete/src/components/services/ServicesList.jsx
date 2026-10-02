// ServiceRow — строка одной услуги. Рендерится для каждой
// услуги в списке.
import ServiceRow from "./ServiceRow";

// EmptyState — компонент-заглушка «данных нет». Показываем его,
// если в категории не оказалось услуг.
//
// Обрати внимание: LoadingState.jsx лежит в соседней папке common/,
// а не в services/. Отсюда двойная точка в пути: ../common/.
import { EmptyState } from "../common/LoadingState";

// ServicesList — список услуг выбранной категории.
//
// Используется в ServicesScreen. Получает массив услуг и колбэк
// onSelectService, который вызывается при клике «Выбрать»
// на любой строке.
//
// Пропсы:
//   services        — массив услуг [{ id, title, desc, duration, price }, ...]
//   onSelectService — колбэк, вызывается с объектом выбранной услуги
export default function ServicesList({ services, onSelectService }) {
  return (
    // .rows — контейнер списка. Стили (вертикальная раскладка,
    // gap между строками, min-width) — в services.css.
    <div className="rows">
      {/* Если услуг нет — показываем заглушку.
          Тернарник: условие ? «если да» : «если нет».

          services.length === 0 — пустой массив.
          Значит, в категории нет услуг или категория пустая.
          Показываем <EmptyState /> — компонент-заглушку
          с сообщением.

          Иначе — рендерим список. */}
      {services.length === 0 ? (
        <EmptyState message="В этой категории пока нет услуг" />
      ) : (
        // Перебираем массив услуг и рендерим строки.
        //
        // services.map((service) => (...)) — стрелочная функция,
        // возвращает JSX. React развернёт массив в набор строк.
        //
        // key={service.id} — уникальный ключ для React.
        // id услуги уникален и не меняется — идеальный ключ.
        //
        // onSelect={() => onSelectService(service)} — обёртка.
        // Почему не onSelect={onSelectService}? Потому что
        // onSelectService ждёт объект услуги, а не событие.
        // Если передать функцию напрямую, при клике React вызовет
        // её с event — и наверху получится event вместо service.
        //
        // Обёртка () => onSelectService(service) замыкает
        // именно эту услугу. Каждая строка «помнит» свою.
        services.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
            onSelect={() => onSelectService(service)}
          />
        ))
      )}
    </div>
  );
}
