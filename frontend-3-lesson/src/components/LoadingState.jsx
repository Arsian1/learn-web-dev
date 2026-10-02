// LoadingState и EmptyState — две заглушки.
//
// Используются там, где ещё нет данных или их вообще не будет.
// Оба компонента одинаковые — отличаются только смыслом.
// LoadingState — «данные загружаются».
// EmptyState — «данных нет».
//
// Инлайн-стили здесь уместны: три свойства, короткий текст.
// Выносить их в CSS-файл ради двух компонентов не имеет смысла.

export function LoadingState({ message }) {
  return (
    <div style={{ textAlign: "center", padding: "40px", color: "#6B6661" }}>
      {message}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div style={{ textAlign: "center", padding: "40px", color: "#6B6661" }}>
      {message}
    </div>
  );
}
