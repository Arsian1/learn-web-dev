// CategoryItem — одна плашка категории в сайдбаре.
//
// Используется в Sidebar.jsx, который перебирает все категории
// и рендерит по одной плашке на каждую.
//
// Пропсы:
//   category      — объект категории { id, name }
//   isActive      — true, если эта категория сейчас выбрана
//   servicesCount — число услуг в категории (для бейджа справа)
//   onClick       — колбэк, вызывается с id категории при клике
export default function CategoryItem({
  category,
  isActive,
  servicesCount,
  onClick,
}) {
  // Обёртка над onClick.
  //
  // Родитель передаёт onClick без параметра — «что-то сделать
  // при клике». А CategoryItem знает id категории и подставляет
  // его при вызове. Так родителю не нужно самому замыкать id
  // в стрелочную функцию — он просто передаёт onClick={handleClick},
  // а внутри уже вызывается с нужным id.
  function onClickInner() {
    onClick(category.id);
  }

  return (
    // Корневой <div>.
    //
    // className собирается из базового "category-item" и модификатора
    // "active", если категория сейчас выбрана. Например, для активной
    // категории: "category-item active".
    //
    // data-id={category.id} — оставлен на всякий случай, чтобы можно
    // было достать id из DOM, если понадобится. Сейчас код работает
    // через onClickInner и на data-id не полагается.
    //
    // onClick={onClickInner} — обёртка, которая знает category.id.
    <div
      className={`category-item ${isActive ? "active" : ""}`}
      data-id={category.id}
      onClick={onClickInner}
    >
      {/* Название категории, например «Маникюр и педикюр». */}
      <span className="cat-name">{category.name}</span>

      {/* Бейдж с числом услуг. Например: «Маникюр и педикюр» [8].
          Круглая плашка справа от названия. */}
      <div className="count-badge">
        <span>{servicesCount}</span>
      </div>
    </div>
  );
}
