// CategoryItem — одна плашка категории.
//
// Пропсы:
//   category  — объект { id, name, servicesCount }.
//   isActive  — true, если эта категория сейчас выбрана.
//   onClick   — колбэк при клике (id уже замкнут в Sidebar).
//
// Что изменилось по сравнению с версией без сервера:
//   - поле servicesCount приходит с сервера, а не считается
//     из category.services.length;
//   - больше нет пропса servicesCount — он внутри category.
export default function CategoryItem({ category, isActive, onClick }) {
  return (
    <div
      // Классы: базовый + "active", если категория выбрана.
      className={`category-item ${isActive ? "active" : ""}`}
      data-id={category.id}
      onClick={onClick}
    >
      <span className="cat-name">{category.name}</span>

      {/* Бейдж с числом услуг. Число берём прямо из категории. */}
      <div className="count-badge">
        <span>{category.servicesCount}</span>
      </div>
    </div>
  );
}
