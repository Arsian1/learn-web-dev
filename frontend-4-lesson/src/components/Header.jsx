// Header — шапка сайта.
//
// Содержит логотип, навигацию и кнопку «Войти».
// Пропсов не принимает — просто разметка.
//
// Что изменилось по сравнению с версией без сервера:
//   - ничего. Шапка одинаковая.
export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-text">ÉLAIRE</span>
      </div>
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
