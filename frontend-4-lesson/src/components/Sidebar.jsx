import CategoryItem from "./CategoryItem";

// Sidebar — список категорий слева.
//
// Перебирает массив категорий и рендерит для каждой CategoryItem.
//
// Пропсы:
//   categories       — массив категорий с сервера [{ id, name, servicesCount }].
//   activeCategoryId — id выбранной категории.
//   onCategoryClick  — колбэк, вызывается с id категории при клике.
//
// Что изменилось по сравнению с версией без сервера:
//   - больше не считает servicesCount — это число приходит с сервера;
//   - categories приходят не из App напрямую, а из ответа API.
export default function Sidebar({
  categories,
  activeCategoryId,
  onCategoryClick,
}) {
  return (
    <aside className="sidebar">
      <div className="title-with-back">
        <button className="back-button">←</button>
        <span className="categories-title">Категории</span>
      </div>

      {/* Перебираем категории и рендерим плашку для каждой.
          key={category.id} — уникальный ключ для React. */}
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isActive={category.id === activeCategoryId}
          // Замыкаем id категории в стрелочную функцию.
          // Так при клике наверх уйдёт именно этот id.
          onClick={() => onCategoryClick(category.id)}
        />
      ))}
    </aside>
  );
}
