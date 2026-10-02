// CategoryItem — одна плашка категории в сайдбаре.
//
// С сервера категория приходит с полем servicesCount — это число
// услуг в категории. Клиенту не надо знать массив услуг, чтобы
// показать счётчик.
//
// Пропсы:
//   category  — объект { id, name, servicesCount }.
//   isActive  — true, если эта категория сейчас выбрана.
//   onClick   — колбэк при клике, вызывается без аргументов.
function CategoryItem({ category, isActive, onClick }) {
  return (
    <div
      className={`category-item ${isActive ? "active" : ""}`}
      data-id={category.id}
      onClick={onClick}
    >
      <span className="cat-name">{category.name}</span>
      <div className="count-badge">
        <span>{category.servicesCount}</span>
      </div>
    </div>
  );
}

export default CategoryItem;
