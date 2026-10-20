// server/server.js — плагин Vite: имитационный сервер, перехватывает /api/*.
import { today, getSlots } from './database.js';

// Задержка «сети». Пока она идёт, на странице видно «Загрузка…». 0 — мгновенные ответы.
const DELAY_MS = 700;

// Демо-ошибка: на 13-е число любого месяца /api/slots отвечает 500.
// Нужна, чтобы проверить сценарий «сервер вернул ошибку». null — отключить.
const FAIL_DAY = 13;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function isValidDate({ day, month, year }) {
  if (![day, month, year].every(Number.isInteger)) return false;
  const d = new Date(year, month, day);
  return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
}

async function handler(req, res, next) {
  if (!req.url.startsWith('/api/')) return next();

  const url = new URL(req.url, 'http://localhost');
  await delay(DELAY_MS);

  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Метод не поддерживается' });
  }

  if (url.pathname === '/api/booking/today') {
    return sendJson(res, 200, today);
  }

  if (url.pathname === '/api/slots') {
    const params = {
      day: Number(url.searchParams.get('day')),
      month: Number(url.searchParams.get('month')),
      year: Number(url.searchParams.get('year')),
    };
    if (!isValidDate(params)) {
      return sendJson(res, 400, { error: 'Некорректная дата' });
    }
    if (FAIL_DAY !== null && params.day === FAIL_DAY) {
      return sendJson(res, 500, { error: 'Внутренняя ошибка сервера' });
    }
    return sendJson(res, 200, { date: params, slots: getSlots(params) });
  }

  return sendJson(res, 404, { error: 'Эндпоинт не найден' });
}

export default function mockApi() {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}
