// useState — чтобы хранить значения формы, состояние отправки
// и признак открытой модалки.
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

// Отправка записи на сервер. POST /api/booking.
import { postBooking } from "../api";

// Стили страницы подтверждения и модалки.
import "../styles/confirmation.css";
import "../styles/modal.css";

// ConfirmationScreen — финальный экран бронирования.
//
// Показывает детали визита (что выбрано на прошлых шагах) и форму
// контактных данных. При отправке формы — шлёт данные на сервер
// через POST /api/booking. Если сервер ответил ok, открывает
// модалку «Запись подтверждена».
//
// Пропсы:
//   booking  — { categoryId, service, date, time }.
//              Всё, что пользователь выбрал на прошлых шагах.
//   onBack   — кнопка «Назад», возвращает на календарь.
//   onFinish — после закрытия модалки. Сбрасывает booking
//              в App и возвращает на главную.
function ConfirmationScreen({ booking, onBack, onFinish }) {
  // ==========================================================================
  // Состояние формы
  // ==========================================================================
  // Значения всех трёх полей храним одним объектом.
  // Изменение любого поля — обновление одного объекта через spread.
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    comment: "",
  });

  // isModalOpen — открыта ли модалка «Запись подтверждена».
  // false при первом рендере. Становится true только после успешной
  // отправки на сервер.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // sending — идёт ли отправка на сервер. Пока true — форма
  // заблокирована, кнопка показывает «Отправка...».
  const [sending, setSending] = useState(false);

  // sendError — текст ошибки отправки. null, если всё ок.
  const [sendError, setSendError] = useState(null);

  // ==========================================================================
  // Обработчики
  // ==========================================================================

  // Универсальный обработчик изменений в форме.
  // Работает для всех трёх полей — потому что у каждого <input>
  // есть атрибут name, и мы читаем его из event.target.name.
  //
  // { ...formValues, [name]: value } — копия объекта formValues,
  // в которой поле name заменено на value.
  function handleFormChange(name, value) {
    setFormValues({ ...formValues, [name]: value });
  }

  // Отправка формы.
  //
  // 1. Собираем payload: данные брони + поля формы.
  // 2. Шлём POST на /api/booking.
  // 3. Если ok — открываем модалку.
  // 4. Если ошибка — сохраняем её текст, показываем в форме.
  async function handleFormSubmit() {
    try {
      setSending(true);
      setSendError(null);

      const payload = {
        serviceId: booking.service?.id,
        date: booking.date,
        time: booking.time,
        name: formValues.name,
        phone: formValues.phone,
        comment: formValues.comment,
      };

      await postBooking(payload);
      setIsModalOpen(true);
    } catch (err) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  }

  // Закрытие модалки.
  // Делает две вещи: скрывает модалку и вызывает onFinish из App,
  // который сбрасывает booking и возвращает на главную.
  function handleModalClose() {
    setIsModalOpen(false);
    onFinish();
  }

  // ==========================================================================
  // Рендер
  // ==========================================================================

  return (
    <main className="confirmation-layout">
      <div className="header-row">
        <div className="title-with-back">
          <button className="back-button" onClick={onBack}>
            ←
          </button>
          <span className="page-title">Подтверждение записи</span>
        </div>
        <StepIndicator current={3} />
      </div>

      <div className="centered-card">
        <BookingDetails booking={booking} />
        <ContactForm
          values={formValues}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          sending={sending}
          error={sendError}
        />
      </div>

      <Modal open={isModalOpen}>
        <ConfirmationModal booking={booking} onClose={handleModalClose} />
      </Modal>
    </main>
  );
}

export default ConfirmationScreen;
