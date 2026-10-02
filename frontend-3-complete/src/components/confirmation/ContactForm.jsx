// ContactForm — форма контактных данных на странице подтверждения.
//
// Поля: имя, телефон, комментарий. Имя и телефон обязательные —
// об этом говорит звёздочка в подписи, но настоящей валидации
// пока нет (TODO на будущее).
//
// Ключевая особенность: это «управляемая форма» (controlled form).
// Значения всех полей живут не в DOM, а в состоянии родителя —
// в ConfirmationScreen, в useState. Форма только читает их через
// проп values и сообщает об изменениях через onChange. Родитель
// обновляет состояние — и снова передаёт вниз.
//
// Пропсы:
//   values   — объект { name, phone, comment } с текущими значениями полей
//   onChange — колбэк (name, value), вызывается при любом изменении поля
//   onSubmit — колбэк, вызывается при отправке формы
function ContactForm({ values, onChange, onSubmit }) {
  // Универсальный обработчик изменений.
  // Работает для всех трёх полей — потому что у каждого <input>
  // есть атрибут name, и мы читаем его из event.target.name.
  //
  // event.target — тот элемент, в котором произошло событие.
  // event.target.name — значение атрибута name ("name", "phone", "comment").
  // event.target.value — то, что ввёл пользователь.
  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    // Не обновляем состояние сами — сообщаем наверх, что изменилось.
    // Родитель решит, как это применить.
    onChange(name, value);
  }

  // Обработчик отправки формы.
  //
  // event.preventDefault() — обязательно. По умолчанию браузер
  // попытается отправить форму и перезагрузить страницу. Нам это
  // не нужно: мы хотим обработать отправку в JS (открыть модалку).
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    // onSubmit={handleSubmit} — функция сработает при отправке
    // формы: это может быть клик по кнопке type="submit" или
    // нажатие Enter внутри поля ввода.
    <form className="contact-form" onSubmit={handleSubmit}>
      <span className="form-title">Контактные данные</span>

      {/* Поле «Имя».
          htmlFor="name" — связывает подпись с полем id="name".
          При клике на label фокус перейдёт в поле. Это важно
          для доступности (accessibility). */}
      <div className="input-group">
        <label htmlFor="name">Ваше имя *</label>
        <input
          type="text"
          id="name"
          name="name" // нужен для handleChange
          placeholder="Анна Петрова"
          value={values.name} // значение из состояния родителя
          onChange={handleChange} // обработчик изменений
        />
      </div>

      {/* Поле «Телефон».
          type="tel" — на мобильных браузер покажет цифровую
          клавиатуру с символами +, -, (, ) — удобнее, чем обычная. */}
      <div className="input-group">
        <label htmlFor="phone">Номер телефона *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+7 (999) 123-45-67"
          value={values.phone}
          onChange={handleChange}
        />
      </div>

      {/* Поле «Комментарий». Textarea — многострочное поле.
          В React тоже управляемое: value + onChange, как у input.
          В отличие от HTML, тут нельзя писать текст между тегами —
          он бы конфликтовал с value. */}
      <div className="input-group">
        <label htmlFor="comment">Комментарий к записи</label>
        <textarea
          id="comment"
          name="comment"
          placeholder="Например, пожелания по дизайну или аллергии"
          value={values.comment}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Кнопка отправки.
          type="submit" — при клике вызывается onSubmit формы.
          Класс .confirmation-next-btn — стиль кнопки из confirmation.css. */}
      <button type="submit" className="confirmation-next-btn">
        Подтвердить запись
      </button>
    </form>
  );
}

export default ContactForm;
