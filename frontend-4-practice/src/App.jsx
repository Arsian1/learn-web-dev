import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchSlots, fetchToday } from './api.js';

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

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

// Каркас страницы: шапка, шаги, подвал. Внутрь main попадает children.
function Layout({ children }) {
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
      {children}
    </div></main>
    <footer className="footer"><div className="footer-content"><div className="footer-col brand-col"><div className="footer-logo">КОНТУР</div><p className="footer-desc">Мужские стрижки. Точное внимание к деталям.</p></div><div className="footer-col"><div className="footer-heading">КОНТАКТЫ</div><p>ул. Садовая, 15, Москва</p><p className="footer-phone">+7 (495) 123-45-67</p></div><div className="footer-col"><div className="footer-heading">РЕЖИМ РАБОТЫ</div><p>Пн–Пт: 9:00 – 21:00</p><p>Сб–Вс: 10:00 – 19:00</p></div></div><div className="footer-bottom"><span>&copy; 2026. Все права защищены.</span><a href="#" className="privacy-link">Политика конфиденциальности</a></div></footer>
  </div>;
}

// Загружает «сегодня» с сервера. Пока грузится — «Загрузка…», при ошибке — сообщение.
export default function App() {
  const [attempt, setAttempt] = useState(0);
  // Результат хранит номер попытки, поэтому loading выводится из состояния,
  // а не выставляется вручную внутри эффекта.
  const [result, setResult] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetchToday()
      .then(({ day, month, year }) => {
        if (!ignore) setResult({ attempt, today: new Date(year, month, day) });
      })
      .catch((err) => {
        if (!ignore) setResult({ attempt, error: err.message });
      });
    return () => { ignore = true; };
  }, [attempt]);

  const current = result?.attempt === attempt ? result : null;

  if (!current) {
    return <Layout><div className="page-status">Загрузка…</div></Layout>;
  }
  if (current.error) {
    return <Layout><div className="page-status slots-error" role="alert">
      <span>Не удалось загрузить данные: {current.error}</span>
      <button type="button" className="btn btn-primary" onClick={() => setAttempt(a => a + 1)}>Повторить</button>
    </div></Layout>;
  }
  return <Layout><BookingPage today={current.today} /></Layout>;
}

function BookingPage({ today }) {
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [slotsResult, setSlotsResult] = useState(null);
  const isFirstLoad = useRef(true);
  const cells = useMemo(() => makeCalendar(year, month), [year, month]);

  // Слоты грузятся при первом рендере и при каждой смене дня.
  useEffect(() => {
    let ignore = false;
    const key = `${selectedDate.getTime()}#${attempt}`;
    fetchSlots(selectedDate)
      .then(({ date, slots }) => {
        // Защита от гонок: ответ должен быть именно на выбранный день.
        const actual = date.day === selectedDate.getDate()
          && date.month === selectedDate.getMonth()
          && date.year === selectedDate.getFullYear();
        if (ignore || !actual) return;
        setSlotsResult({ key, slots });
        // Как раньше: при открытии страницы предвыбираем 14:00 (или первое свободное время).
        if (isFirstLoad.current) {
          isFirstLoad.current = false;
          setSelectedTime(
            slots.some(s => s.time === '14:00' && s.available)
              ? '14:00'
              : slots.find(s => s.available)?.time ?? null
          );
        }
      })
      .catch((err) => {
        if (!ignore) setSlotsResult({ key, error: err.message });
      });
    return () => { ignore = true; };
  }, [selectedDate, attempt]);

  // Три состояния: loading / error / success.
  const currentKey = `${selectedDate.getTime()}#${attempt}`;
  const slotsState = slotsResult?.key !== currentKey
    ? { status: 'loading' }
    : slotsResult.error
      ? { status: 'error', error: slotsResult.error }
      : { status: 'success', slots: slotsResult.slots };

  function changeMonth(delta) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear()); setMonth(next.getMonth());
  }
  function chooseDate(date) {
    if (sameDate(date, selectedDate)) return; // тот же день — повторный запрос не нужен
    setSelectedDate(date); setSelectedTime(null); setAttempt(0);
  }
  const selectedWeekday = DAYS[selectedDate.getDay()];
  const selectedDay = selectedDate.getDate();
  const selectedMonth = MONTHS_GENITIVE[selectedDate.getMonth()];
  let endTime = '';
  if (selectedTime) {
    const [h, m] = selectedTime.split(':').map(Number);
    const end = new Date(selectedDate); end.setHours(h, m + 75, 0, 0);
    endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
  }

  return <>
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
          {slotsState.status === 'loading' && <div className="slots-status">Загрузка слотов…</div>}
          {slotsState.status === 'error' && <div className="slots-status slots-error" role="alert"><span>Не удалось загрузить слоты: {slotsState.error}</span><button type="button" className="btn btn-secondary" onClick={() => setAttempt(a => a + 1)}>Повторить</button></div>}
          {slotsState.status === 'success' && <div className="time-slots-grid">{slotsState.slots.map(slot => <button key={slot.time} type="button" disabled={!slot.available} className={`slot-btn${!slot.available ? ' disabled' : ''}${selectedTime === slot.time ? ' selected' : ''}`} onClick={() => setSelectedTime(slot.time)}>{slot.available ? slot.time : <><span className="slot-time">{slot.time}</span><span className="slot-status">Занято</span></>}</button>)}</div>}
          <div className="time-footer-note">Время указано по Москве. {selectedTime ? `Ваша запись закончится в ${endTime}.` : 'Выберите время для записи.'}</div>
        </section>
      </div>
      <div className="summary-card"><div className="summary-info"><div className="summary-title">{selectedDate ? `${selectedDay} ${selectedMonth}, ${selectedWeekday.toLowerCase()} · ${selectedTime ? `${selectedTime} – ${endTime}` : 'Выберите время'}` : 'Дата и время не выбраны'}</div><div className="summary-sub">Итого: 2 400 &#8381; · Оплата в барбершопе</div></div><div className="summary-actions"><button type="button" className="btn btn-secondary">Назад</button><button type="button" className="btn btn-primary" disabled={!selectedDate || !selectedTime}>Продолжить</button></div></div>
  </>;
}
