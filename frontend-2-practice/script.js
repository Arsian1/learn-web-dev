const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const DAYS_OF_WEEK = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
];

const DEFAULT_SLOTS = [
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '12:00', available: true },
  { time: '13:00', available: false },
  { time: '14:00', available: true },
  { time: '15:30', available: true },
  { time: '16:00', available: true },
  { time: '17:00', available: true }
];

const today = new Date();

const state = {
  currentYear: today.getFullYear(),
  currentMonth: today.getMonth(),
  selectedDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  selectedTime: '14:00'
};

function compareDates(d1, d2) {
  const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  if (date1 < date2) return -1;
  if (date1 > date2) return 1;
  return 0;
}

function isDateSelectable(dayDate, todayDate) {
  return compareDates(dayDate, todayDate) >= 0;
}

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true, monthOffset: -1 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false, monthOffset: 0 });
  }
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true, monthOffset: 1 });
    nextDay++;
  }

  return cells;
}

function renderCalendar() {
  const monthTitle = document.querySelector('.month-title');
  const daysGrid = document.querySelector('.days-grid');

  if (monthTitle) {
    monthTitle.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
  }

  const cells = buildCalendarGrid(state.currentYear, state.currentMonth);
  daysGrid.innerHTML = '';

  cells.forEach((cell) => {
    const cellDate = new Date(state.currentYear, state.currentMonth + cell.monthOffset, cell.day);
    const isSelectable = isDateSelectable(cellDate, today);
    const isSelected = state.selectedDate && compareDates(cellDate, state.selectedDate) === 0;

    if (cell.otherMonth || !isSelectable) {
      const span = document.createElement('span');
      span.className = 'day dimmed';
      span.textContent = cell.day;
      daysGrid.appendChild(span);
    } else {
      const button = document.createElement('button');
      button.className = `day available${isSelected ? ' selected' : ''}`;
      button.textContent = cell.day;
      button.addEventListener('click', (e) => onDayClick(e, cellDate));
      daysGrid.appendChild(button);
    }
  });
}

function renderTimeSlots() {
  const timeDate = document.querySelector('.time-date');
  const slotsGrid = document.querySelector('.time-slots-grid');

  if (!state.selectedDate) {
    timeDate.textContent = 'Выберите дату';
    slotsGrid.innerHTML = '';
    return;
  }

  const dayOfWeek = DAYS_OF_WEEK[state.selectedDate.getDay()];
  const dayNum = state.selectedDate.getDate();
  const monthGenitive = MONTHS_GENITIVE[state.selectedDate.getMonth()];

  timeDate.textContent = `${dayOfWeek}, ${dayNum} ${monthGenitive}`;
  slotsGrid.innerHTML = '';

  DEFAULT_SLOTS.forEach((slot) => {
    const button = document.createElement('button');
    const isSelected = state.selectedTime === slot.time;

    if (!slot.available) {
      button.className = 'slot-btn disabled';
      button.disabled = true;
      button.innerHTML = `
        <span class="slot-time">${slot.time}</span>
        <span class="slot-status">Занято</span>
      `;
    } else {
      button.className = `slot-btn${isSelected ? ' selected' : ''}`;
      button.textContent = slot.time;
      button.addEventListener('click', (e) => onTimeSlotClick(e, slot.time));
    }

    slotsGrid.appendChild(button);
  });
}

function updateBottomBar() {
  const summaryTitle = document.querySelector('.summary-title');
  const nextBtn = document.querySelector('.btn-primary');

  if (state.selectedDate && state.selectedTime) {
    const dayOfWeek = DAYS_OF_WEEK[state.selectedDate.getDay()].toLowerCase();
    const dayNum = state.selectedDate.getDate();
    const monthGenitive = MONTHS_GENITIVE[state.selectedDate.getMonth()];

    const [hours, minutes] = state.selectedTime.split(':').map(Number);
    const endTimeDate = new Date(state.selectedDate);
    endTimeDate.setHours(hours + 1, minutes + 15);
    const endHours = String(endTimeDate.getHours()).padStart(2, '0');
    const endMinutes = String(endTimeDate.getMinutes()).padStart(2, '0');

    summaryTitle.textContent = `${dayNum} ${monthGenitive}, ${dayOfWeek} · ${state.selectedTime} – ${endHours}:${endMinutes}`;
    if (nextBtn) nextBtn.disabled = false;
  } else if (state.selectedDate) {
    const dayOfWeek = DAYS_OF_WEEK[state.selectedDate.getDay()].toLowerCase();
    const dayNum = state.selectedDate.getDate();
    const monthGenitive = MONTHS_GENITIVE[state.selectedDate.getMonth()];

    summaryTitle.textContent = `${dayNum} ${monthGenitive}, ${dayOfWeek} · Выберите время`;
    if (nextBtn) nextBtn.disabled = true;
  } else {
    summaryTitle.textContent = 'Дата и время не выбраны';
    if (nextBtn) nextBtn.disabled = true;
  }
}

function onDayClick(e, date) {
  state.selectedDate = date;
  state.selectedTime = null; 

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(e, time) {
  state.selectedTime = time;

  renderTimeSlots();
  updateBottomBar();
}

function setupMonthNavigation() {
  const arrows = document.querySelectorAll('.arrow-btn');
  const prevBtn = arrows[0];
  const nextBtn = arrows[1];

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (state.currentMonth === 0) {
        state.currentMonth = 11;
        state.currentYear--;
      } else {
        state.currentMonth--;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (state.currentMonth === 11) {
        state.currentMonth = 0;
        state.currentYear++;
      } else {
        state.currentMonth++;
      }
      renderCalendar();
    });
  }
}

function init() {
  setupMonthNavigation();
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

document.addEventListener('DOMContentLoaded', init);