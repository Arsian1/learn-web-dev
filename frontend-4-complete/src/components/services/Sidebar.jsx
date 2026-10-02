import CategoryItem from "./CategoryItem";

// Sidebar — список категорий слева.
//
// Пропсы:
//   categories       — массив категорий с сервера.
//   activeCategoryId — id выбранной категории.
//   onCategoryClick  — колбэк при клике, вызывается с id категории.
//   onBack           — колбэк кнопки «Назад», возвращает на главную.
function Sidebar({ categories, activeCategoryId, onCategoryClick, onBack }) {
  return (
    <aside className="sidebar">
      <div className="title-with-back">
        <button className="back-button" onClick={onBack}>
          ←
        </button>
        <span className="categories-title">Категории</span>
      </div>

      {categories.map(function (category) {
        return (
          <CategoryItem
            key={category.id}
            category={category}
            isActive={category.id === activeCategoryId}
            onClick={() => onCategoryClick(category.id)}
          />
        );
      })}
    </aside>
  );
}

export default Sidebar;
