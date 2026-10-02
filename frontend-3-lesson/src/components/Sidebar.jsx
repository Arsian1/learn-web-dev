import CategoryItem from "./CategoryItem";

// Sidebar — список категорий слева.
//
// Перебирает массив категорий и рендерит для каждой CategoryItem.
//
// Пропсы:
//   categories       — массив категорий [{ id, name, services }, ...].
//   activeCategoryId — id выбранной категории.
//   onCategoryClick  — колбэк, вызывается с id категории при клике.
export default function Sidebar({
  categories,
  activeCategoryId,
  onCategoryClick,
}) {
  return (
    <aside className="sidebar">
      {/* Верхняя строка: кнопка «Назад» и заголовок.
          Кнопка пока без обработчика — переходов нет. */}
      <div className="title-with-back">
        <button className="back-button">←</button>
        <span className="categories-title">Категории</span>
      </div>

      {/* Перебираем категории и рендерим плашку для каждой.
          key={category.id} — уникальный ключ для React,
          чтобы эффективно обновлять список. */}
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          // Считаем количество услуг прямо здесь и передаём
          // отдельным пропом. CategoryItem не знает, что внутри
          // категории есть массив services.
          servicesCount={category.services.length}
          // isActive — булево. Сравниваем id категории
          // с активным. У выбранной — true, у остальных — false.
          isActive={category.id === activeCategoryId}
          // Передаём функцию с замыканием на id категории.
          // Она вызовется, когда пользователь кликнет.
          onClick={() => onCategoryClick(category.id)}
        />
      ))}
    </aside>
  );
}
