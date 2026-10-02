// ContactForm — форма контактных данных на странице подтверждения.
//
// Поля: имя, телефон, комментарий. Имя и телефон обязательные —
// об этом говорит звёздочка в подписи, но настоящей валидации
// пока нет (TODO на будущее).
//
// Управляемая форма: значения всех полей живут не в DOM, а в
// состоянии родителя — в ConfirmationScreen, в useState.
//
// Пропсы:
//   values   — { name, phone, comment } — текущие значения полей.
//   onChange — колбэк (name, value) при изменении поля.
//   onSubmit — колбэк при отправке формы.
//   sending  — идёт ли отправка. Если true — поля и кнопка
//              недоступны, кнопка показывает «Отправка...».
//   error    — текст ошибки отправки. Показывается под полями.
function ContactForm({ values, onChange, onSubmit, sending, error }) {
  // Универсальный обработчик изменений.
  // Работает для всех трёх полей — потому что у каждого <input>
  // есть атрибут name.
  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    onChange(name, value);
  }

  // Обработчик отправки формы.
  // event.preventDefault() — обязательно: без него браузер
  // попытается отправить форму и перезагрузить страницу.
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <span className="form-title">Контактные данные</span>

      <div className="input-group">
        <label htmlFor="name">Ваше имя *</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Анна Петрова"
          value={values.name}
          onChange={handleChange}
          disabled={sending}
        />
      </div>

      <div className="input-group">
        <label htmlFor="phone">Номер телефона *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+7 (999) 123-45-67"
          value={values.phone}
          onChange={handleChange}
          disabled={sending}
        />
      </div>

      <div className="input-group">
        <label htmlFor="comment">Комментарий к записи</label>
        <textarea
          id="comment"
          name="comment"
          placeholder="Например, пожелания по дизайну или аллергии"
          value={values.comment}
          onChange={handleChange}
          disabled={sending}
        ></textarea>
      </div>

      {/* Сообщение об ошибке отправки. Появляется под полями,
          если сервер вернул ошибку. При успешной отправке
          остаётся null — блока не видно. */}
      {error && <div className="form-error">Ошибка: {error}</div>}

      <button
        type="submit"
        className="confirmation-next-btn"
        disabled={sending}
      >
        {sending ? "Отправка..." : "Подтвердить запись"}
      </button>
    </form>
  );
}

export default ContactForm;
