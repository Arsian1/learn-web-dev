// Footer — подвал сайта.
//
// Содержит бренд с описанием, две колонки ссылок,
// разделительную линию и нижнюю строку с копирайтом.
// Пропсов не принимает.
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="brand-name">ÉLAIRE</span>
          <span className="brand-desc">
            Пространство красоты и гармонии в самом сердце города. Дарим моменты
            заботы о себе и подчеркиваем вашу уникальность.
          </span>
        </div>

        {/* Две колонки ссылок.
            Ширина задана inline-стилем, потому что она разная
            у каждой колонки. В CSS такие точечные размеры
            обычно не выносят. */}
        <div className="footer-links-row">
          <div className="links-col" style={{ width: "147px" }}>
            <span className="col-title">Услуги</span>
            <a href="#">Стрижки & Укладки</a>
            <a href="#">Маникюр & Педикюр</a>
            <a href="#">Спа & Массаж</a>
          </div>
          <div className="links-col" style={{ width: "188px" }}>
            <span className="col-title">Контакты</span>
            <a href="#">+7 (495) 123-45-67</a>
            <a href="#">ул. Пречистенка, 12, Москва</a>
            <a href="#">ежедневно: 10:00 - 22:00</a>
          </div>
        </div>
      </div>

      <div className="footer-line"></div>

      <div className="footer-bottom">
        <span className="copy">
          © 2026 ÉLAIRE Beauty & Wellness. Все права защищены.
        </span>
        <span className="legal">
          Политика конфиденциальности • Публичная оферта
        </span>
      </div>
    </footer>
  );
}
