function Hero({ onCtaServiceClick }) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(/images/hero-salon.png)`,
      }}
    >
      <div className="hero-text-container">
        <h1 className="hero-title">Запланируйте время для себя</h1>
        <p className="hero-desc">
          Эксклюзивное пространство заботы о красоте и вашем умиротворении.
          Доверьте свой образ лучшим мастерам столицы.
        </p>
      </div>

      <div className="hero-ctas">
        <button className="cta-service" onClick={onCtaServiceClick}>
          Записаться на услугу
        </button>
        <button className="cta-master">Выбрать мастера</button>
      </div>
    </section>
  );
}

export default Hero;
