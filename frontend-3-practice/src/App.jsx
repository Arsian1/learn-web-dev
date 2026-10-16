import { useMemo, useState } from 'react';

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const SLOT_TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:30', '16:00', '17:00'];

// Разные расписания для разных календарных дней.
const SLOT_PATTERNS = [
  '10101111', '11010101', '01101011', '10110110',
  '11001011', '01110101', '10101101', '01011110',
  '11100101', '01011011', '10111001', '01101110',
];
function getSlotsForDate(date) {
  const dayNumber = Math.floor(dateOnly(date).getTime() / 86400000);
  const pattern = SLOT_PATTERNS[((dayNumber % SLOT_PATTERNS.length) + SLOT_PATTERNS.length) % SLOT_PATTERNS.length];
  return SLOT_TIMES.map((time, index) => ({ time, available: pattern[index] === '1' }));
}
const dateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDate = (a, b) => a && b && dateOnly(a).getTime() === dateOnly(b).getTime();

function makeCalendar(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  const prevLast = new Date(year, month, 0).getDate();
  for (let i = offset - 1; i >= 0; i--) cells.push({ day: prevLast - i, offset: -1, other: true });
  for (let day = 1; day <= daysInMonth; day++) cells.push({ day, offset: 0, other: false });
  let next = 1;
  while (cells.length % 7) cells.push({ day: next++, offset: 1, other: true });
  return cells;
}

export default function App() {
  const today = useMemo(() => dateOnly(new Date()), []);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const initialSlots = getSlotsForDate(today);
  const [selectedTime, setSelectedTime] = useState(
    initialSlots.some(slot => slot.time === '14:00' && slot.available)
      ? '14:00'
      : initialSlots.find(slot => slot.available)?.time ?? null
  );
  const slots = useMemo(() => selectedDate ? getSlotsForDate(selectedDate) : [], [selectedDate]);
  const cells = useMemo(() => makeCalendar(year, month), [year, month]);

  function changeMonth(delta) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear()); setMonth(next.getMonth());
  }
  function chooseDate(date) { setSelectedDate(date); setSelectedTime(null); }
  const selectedWeekday = selectedDate ? DAYS[selectedDate.getDay()] : '';
  const selectedDay = selectedDate?.getDate();
  const selectedMonth = selectedDate ? MONTHS_GENITIVE[selectedDate.getMonth()] : '';
  let endTime = '';
  if (selectedTime) {
    const [h, m] = selectedTime.split(':').map(Number);
    const end = new Date(selectedDate); end.setHours(h, m + 75, 0, 0);
    endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
  }

  return <div className="page">
    <header className="header"><div className="header-content">
      <div className="logo-block"><span className="logo-icon">&#x2694;</span><span className="logo-title">КОНТУР</span><span className="logo-subtitle">БАРБЕРШОП</span></div>
      <nav className="nav"><a href="#" className="nav-link">Услуги</a><a href="#" className="nav-link">Галерея</a><a href="#" className="nav-link">Команда</a><a href="#" className="nav-link">Отзывы</a><a href="#" className="nav-link">Контакты</a></nav>
      <div className="header-phone">+7 (495) 123-45-67</div>
    </div></header>
    <div className="steps-bar"><div className="steps-container">
      <div className="step completed"><span className="step-icon">✓</span><span className="step-text">Мастер</span></div><div className="step-line"></div>
      <div className="step completed"><span className="step-icon">✓</span><span className="step-text">Услуги</span></div><div className="step-line"></div>
      <div className="step active"><span className="step-number">3</span><span className="step-text">Дата и время</span></div><div className="step-line"></div>
      <div className="step"><span className="step-number">4</span><span className="step-text">Ваши данные</span></div><div className="step-line"></div>
      <div className="step"><span className="step-number">5</span><span className="step-text">Подтверждение</span></div>
    </div></div>
    <main className="main-wrapper"><div className="content-container">
      <div className="step-header"><div className="step-subtitle">ОНЛАЙН-ЗАПИСЬ · ШАГ 3 ИЗ 4</div><h1 className="step-title">Когда вам удобно?</h1><p className="step-description">Показываем свободное время Дмитрия для выбранных услуг на 1 ч 15 мин.</p></div>
      <div className="booking-grid">
        <section className="card calendar-card"><div className="calendar-header"><h2 className="month-title">{MONTHS[month]} {year}</h2><div className="calendar-arrows"><button className="arrow-btn" type="button" aria-label="Предыдущий месяц" onClick={() => changeMonth(-1)}>&lsaquo;</button><button className="arrow-btn" type="button" aria-label="Следующий месяц" onClick={() => changeMonth(1)}>&rsaquo;</button></div></div>
          <div className="weekdays-grid">{WEEKDAYS.map(d => <span key={d}>{d}</span>)}</div>
          <div className="days-grid">{cells.map((cell, i) => {
            const date = new Date(year, month + cell.offset, cell.day);
            const disabled = cell.other || dateOnly(date) < today;
            const selected = !cell.other && sameDate(date, selectedDate);
            return disabled ? <span key={i} className="day dimmed">{cell.day}</span> : <button key={i} type="button" className={`day available${selected ? ' selected' : ''}`} onClick={() => chooseDate(date)} aria-pressed={selected}>{cell.day}</button>;
          })}</div>
          <div className="calendar-legend"><span className="legend-dot"></span> Доступные даты для записи</div>
        </section>
        <section className="card time-card"><h2 className="time-title">Доступное время</h2><div className="time-date">{selectedDate ? `${selectedWeekday}, ${selectedDay} ${selectedMonth}` : 'Выберите дату'}</div>
          <div className="time-slots-grid">{slots.map(slot => <button key={slot.time} type="button" disabled={!slot.available} className={`slot-btn${!slot.available ? ' disabled' : ''}${selectedTime === slot.time ? ' selected' : ''}`} onClick={() => setSelectedTime(slot.time)}>{slot.available ? slot.time : <><span className="slot-time">{slot.time}</span><span className="slot-status">Занято</span></>}</button>)}</div>
          <div className="time-footer-note">Время указано по Москве. {selectedTime ? `Ваша запись закончится в ${endTime}.` : 'Выберите время для записи.'}</div>
        </section>
      </div>
      <div className="summary-card"><div className="summary-info"><div className="summary-title">{selectedDate ? `${selectedDay} ${selectedMonth}, ${selectedWeekday.toLowerCase()} · ${selectedTime ? `${selectedTime} – ${endTime}` : 'Выберите время'}` : 'Дата и время не выбраны'}</div><div className="summary-sub">Итого: 2 400 &#8381; · Оплата в барбершопе</div></div><div className="summary-actions"><button type="button" className="btn btn-secondary">Назад</button><button type="button" className="btn btn-primary" disabled={!selectedDate || !selectedTime}>Продолжить</button></div></div>
    </div></main>
    <footer className="footer"><div className="footer-content"><div className="footer-col brand-col"><div className="footer-logo">КОНТУР</div><p className="footer-desc">Мужские стрижки. Точное внимание к деталям.</p></div><div className="footer-col"><div className="footer-heading">КОНТАКТЫ</div><p>ул. Садовая, 15, Москва</p><p className="footer-phone">+7 (495) 123-45-67</p></div><div className="footer-col"><div className="footer-heading">РЕЖИМ РАБОТЫ</div><p>Пн–Пт: 9:00 – 21:00</p><p>Сб–Вс: 10:00 – 19:00</p></div></div><div className="footer-bottom"><span>&copy; 2026. Все права защищены.</span><a href="#" className="privacy-link">Политика конфиденциальности</a></div></footer>
  </div>;
}
