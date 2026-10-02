// CategoryItem — одна плашка категории.
//
// Пропсы:
//   category      — объект { id, name }.
//   isActive      — true, если эта категория сейчас выбрана.
//   servicesCount — число услуг в категории (для бейджа справа).
//   onClick       — колбэк при клике. Вызывается без аргументов:
//                   id уже замкнут в родителе (в Sidebar).
export default function CategoryItem({
  category,
  isActive,
  servicesCount,
  onClick,
}) {
  return (
    <div
      // Собираем классы: базовый + модификатор active, если
      // категория выбрана. Например: "category-item active".
      className={`category-item ${isActive ? "active" : ""}`}
      // data-id — на всякий случай, если понадобится достать
      // id из DOM. Сейчас не используется.
      data-id={category.id}
      onClick={onClick}
    >
      <span className="cat-name">{category.name}</span>

      {/* Бейдж с числом услуг. Например, «Маникюр» [8]. */}
      <div className="count-badge">
        <span>{servicesCount}</span>
      </div>
    </div>
  );
}
