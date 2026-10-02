// CategoryItem — одна плашка категории. Рендерится для каждой
// категории в списке.
import CategoryItem from "./CategoryItem";

// Sidebar — левая колонка со списком категорий на странице услуг.
//
// Используется в ServicesScreen. Показывает:
//   - кнопку «Назад» и заголовок «Категории»,
//   - список категорий (по одной плашке на каждую).
//
// Пропсы:
//   categories       — массив категорий [{ id, name, services }, ...]
//   activeCategoryId — id активной (выбранной) категории
//   onCategoryClick  — колбэк, вызывается с id категории при клике
//   onBack           — колбэк, вызывается при клике на «←»
export default function Sidebar({
  categories,
  activeCategoryId,
  onCategoryClick,
  onBack,
}) {
  return (
    // <aside> — семантический тег для боковой панели.
    // Скринридеры понимают: «это не основное содержимое,
    // а дополнительный блок сбоку».
    <aside className="sidebar">
      {/* Верхняя строка: кнопка «Назад» + заголовок «Категории». */}
      <div className="title-with-back">
        {/* Кнопка «Назад».
            onClick={onBack} — вызывается функция из App,
            которая переводит экран обратно на главную. */}
        <button className="back-button" onClick={onBack}>
          ←
        </button>
        <span className="categories-title">Категории</span>
      </div>

      {/* Перебираем категории и рендерим плашку для каждой.
          В отличие от ServicesList, здесь нет проверки «если пусто» —
          предполагаем, что категории всегда есть. Если понадобится,
          можно добавить заглушку, как в списке услуг. */}
      {categories.map((category) => (
        // key={category.id} — уникальный ключ для React.
        <CategoryItem
          key={category.id}
          category={category}
          // Считаем число услуг прямо здесь и передаём отдельным
          // пропом. CategoryItem про внутреннее устройство
          // категории не знает — ему нужно только число
          // для бейджа в углу плашки.
          servicesCount={category.services.length}
          // isActive — булево значение. Сравниваем id категории
          // с текущим активным. У выбранной — true, у остальных — false.
          // Внутри CategoryItem из этого получается класс "active",
          // который подсвечивает плашку тёмно-зелёным.
          isActive={category.id === activeCategoryId}
          // Передаём onCategoryClick как есть — без замыкания id.
          // Внутри CategoryItem есть обёртка onClickInner, которая
          // сама подставит category.id при вызове. Так родителю
          // не нужно делать () => onCategoryClick(category.id).
          onClick={onCategoryClick}
        />
      ))}
    </aside>
  );
}
