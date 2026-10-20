// server/database.js — «база данных» имитационного сервера.
// Месяц везде 0-индексный (0 = январь, 9 = октябрь).

// «Сегодня» отдаёт сервер, а не браузер.
export const today = { day: 20, month: 9, year: 2026 };

const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:30', '16:00', '17:00'];

// Слот — это { time, available }.
const build = (pattern) =>
  TIMES.map((time, index) => ({ time, available: pattern[index] === '1' }));

// Два набора слотов: сервер выбирает один из них по чётности дня.
export const slotsSets = [build('10101111'), build('01110101')];

export function getSlots({ day, month, year }) {
  const dayNumber = Math.floor(Date.UTC(year, month, day) / 86400000);
  return slotsSets[dayNumber % slotsSets.length];
}
