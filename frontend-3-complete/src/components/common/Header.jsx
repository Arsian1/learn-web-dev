// Header — шапка сайта. Есть на всех экранах.
//
// Содержит:
//   - логотип ÉLAIRE (кликабельный, ведёт на главную),
//   - навигацию с четырьмя пунктами,
//   - кнопку «Войти».
//
// Компонент получает один проп — onLogoClick. Это колбэк, который
// вызывается при клике по логотипу. Сам Header не знает, куда
// переходить — он просто сообщает наверх, что произошёл клик.
// Что делать дальше — решает родитель (App).
export default function Header({ onLogoClick }) {
  return (
    // Корневой элемент — <header>. Класс .header, стили в common.css.
    <header className="header">
      {/* Логотип. Обёртка <div className="logo"> нужна только для
          выравнивания внутри flex-контейнера — сам .logo стилей
          почти не несёт. */}
      <div className="logo">
        {/* Кликабельный логотип.
            onClick={onLogoClick} — при клике вызывается функция,
            которую передал родитель. Если родитель передал
            функцию «перейти на главную» — будет переход.
            Если ничего не передал — onLogoClick = undefined,
            и React просто не повесит обработчик. Это безопасно. */}
        <span className="logo-text" onClick={onLogoClick}>
          ÉLAIRE
        </span>
      </div>

      {/* Навигация. Пункт «Услуги» помечен классом active —
          потому что на макете он подчёркнут и выглядит активным.
          Остальные три пункта — без active. */}
      <nav className="nav-links">
        <div className="nav-item active">
          <a href="#">Услуги</a>
        </div>
        <div className="nav-item">
          <a href="#">Мастера</a>
        </div>
        <div className="nav-item">
          <a href="#">Отзывы</a>
        </div>
        <div className="nav-item">
          <a href="#">Контакты</a>
        </div>
      </nav>

      {/* Кнопка «Войти». Пока без обработчика — экрана авторизации
          у нас нет. Когда появится — повесим onClick и колбэк
          сверху, по такому же принципу, как у логотипа. */}
      <button className="login-button">
        <span>Войти</span>
      </button>
    </header>
  );
}
