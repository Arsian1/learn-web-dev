// useState — чтобы хранить значения формы и признак открытой модалки.
import { useState } from "react";

// Индикатор шагов. current={3} — это третий шаг.
import StepIndicator from "../components/common/StepIndicator";

// Универсальная обёртка для модальных окон. Внутрь передадим
// ConfirmationModal — содержимое.
import Modal from "../components/common/Modal";

// Блок «Детали вашего визита»: услуга, дата, мастер, длительность, цена.
import BookingDetails from "../components/confirmation/BookingDetails";

// Форма контактных данных: имя, телефон, комментарий.
import ContactForm from "../components/confirmation/ContactForm";

// Содержимое модалки: иконка-галочка, заголовок, детали, кнопка «Отлично!».
import ConfirmationModal from "../components/confirmation/ConfirmationModal";

// Стили страницы подтверждения и модалки. Подключаются здесь,
// потому что используются только на этом экране.
import "../styles/confirmation.css";
import "../styles/modal.css";

// ConfirmationScreen — финальный экран бронирования.
//
// Показывает: детали визита (что выбрано на прошлых шагах),
// форму контактных данных, и при отправке формы — модалку
// «Запись подтверждена».
//
// Пропсы:
//   booking  — данные брони, собранные на прошлых шагах:
//              { service, date, time }
//   onBack   — колбэк кнопки «Назад». Возвращает на календарь.
//   onFinish — колбэк после закрытия модалки. Сбрасывает booking
//              в App и возвращает на главную.
function ConfirmationScreen({ booking, onBack, onFinish }) {
  // ==========================================================================
  // Состояние формы
  //
  // Значения всех трёх полей храним одним объектом. Так удобнее:
  // изменение любого поля — это обновление одного объекта
  // (через spread), а не трёх отдельных useState.
  //
  // Изначально все поля пустые. В отличие от нативного варианта,
  // где значения были захардкожены в HTML, здесь мы управляем
  // формой полностью через React.
  // ==========================================================================
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    comment: "",
  });

  // isModalOpen — открыта ли модалка подтверждения.
  // false при первом рендере. Становится true, когда пользователь
  // нажал «Подтвердить запись» и форма прошла «валидацию» (пока
  // валидации нет — просто открывается).
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ==========================================================================
  // Обработчики
  // ==========================================================================

  // Универсальный обработчик изменений в форме.
  // Приходит из ContactForm с двумя аргументами: имя поля и его новое значение.
  //
  // { ...formValues, [name]: value } — копия объекта formValues,
  // в которой поле name заменено на value.
  //
  // [name]: value — это вычисляемый ключ. Если name = "phone",
  // то в объекте обновится поле phone. Удобно, потому что одна
  // функция обслуживает все три поля.
  function handleFormChange(name, value) {
    setFormValues({ ...formValues, [name]: value });
  }

  // Отправка формы. Сейчас просто открывает модалку.
  // TODO: добавить валидацию (имя и телефон обязательны)
  // и отправку данных на сервер.
  function handleFormSubmit() {
    setIsModalOpen(true);
  }

  // Закрытие модалки.
  // Делает две вещи: скрывает модалку и вызывает onFinish из App,
  // который сбрасывает booking и возвращает на главную.
  //
  // Почему onFinish вызывается сразу после закрытия, а не по
  // отдельной кнопке на главной — потому что закрытие модалки
  // и есть финал сценария. Пользователь завершил запись.
  function handleModalClose() {
    setIsModalOpen(false);
    onFinish();
  }

  // ==========================================================================
  // Рендер
  // ==========================================================================

  return (
    <main className="confirmation-layout">
      {/* Верхняя строка: заголовок с кнопкой «Назад» и третий шаг. */}
      <div className="header-row">
        <div className="title-with-back">
          <button className="back-button" onClick={onBack}>
            ←
          </button>
          <span className="page-title">Подтверждение записи</span>
        </div>
        <StepIndicator current={3} />
      </div>

      {/* Центральная белая карточка с двумя блоками:
            BookingDetails — детали визита (что выбрано);
            ContactForm    — форма контактных данных. */}
      <div className="centered-card">
        <BookingDetails booking={booking} />
        <ContactForm
          values={formValues}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
        />
      </div>

      {/* Модалка подтверждения.
          Modal — общая обёртка (dialog + затемнение + modal-content).
          ConfirmationModal — содержимое (иконка, заголовок, детали, кнопка).

          open={isModalOpen} — Modal рендерит содержимое, только когда
          open === true. Когда isModalOpen станет false — модалка
          исчезнет из DOM.

          Внутрь передаётся ConfirmationModal, который получает
          booking (чтобы показать данные) и onClose (для кнопки). */}
      <Modal open={isModalOpen}>
        <ConfirmationModal booking={booking} onClose={handleModalClose} />
      </Modal>
    </main>
  );
}

export default ConfirmationScreen;
