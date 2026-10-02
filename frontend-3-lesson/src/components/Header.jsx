// Header — шапка сайта.
//
// Содержит логотип, навигацию и кнопку «Войти».
// Никаких пропсов не принимает — просто разметка.
// Ничего не делает при кликах — потому что на странице
// нет переходов.
export default function Header() {
  return (
    <header className="header">
      {/* Логотип. Обычно кликабельный, но здесь без обработчика. */}
      <div className="logo">
        <span className="logo-text">ÉLAIRE</span>
      </div>

      {/* Навигация. Пункт «Услуги» помечен классом active —
          потому что по макету он выделен подчёркиванием. */}
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

      <button className="login-button">
        <span>Войти</span>
      </button>
    </header>
  );
}
