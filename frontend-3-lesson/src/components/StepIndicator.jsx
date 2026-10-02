// StepIndicator — индикатор шагов бронирования.
//
// Три шага: «Выбор услуги», «Дата и время», «Подтверждение».
// Первый шаг — активный, потому что мы находимся на странице
// выбора услуги. Остальные — «пустые» (серые).
//
// Пропсов не принимает — шаги захардкожены в массиве.
// Если понадобится другой набор шагов или другой активный,
// логику можно вынести в пропсы.
export default function StepIndicator() {
  // Массив шагов. Поле active — true для текущего шага.
  // Здесь всегда первый, потому что страница одна.
  const steps = [
    { number: 1, label: "Выбор услуги", active: true },
    { number: 2, label: "Дата и время", active: false },
    { number: 3, label: "Подтверждение", active: false },
  ];

  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div key={step.number} className="step">
          {/* Кружок. Если шаг не активный — добавляем класс empty:
              он делает кружок прозрачным с тонкой рамкой. */}
          <div className={`circle ${!step.active ? "empty" : ""}`}>
            <span>{step.number}</span>
          </div>

          {/* Подпись. Для неактивных — класс light, чтобы текст
              был светлее. */}
          <span className={`step-label ${!step.active ? "light" : ""}`}>
            {step.label}
          </span>

          {/* Соединительная линия. После последнего шага её нет,
              поэтому проверяем index < steps.length - 1. */}
          {index < steps.length - 1 && <div className="step-line"></div>}
        </div>
      ))}
    </div>
  );
}
