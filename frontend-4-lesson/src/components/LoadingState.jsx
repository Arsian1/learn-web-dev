// LoadingState и EmptyState — две заглушки.
//
// Используются, когда данных нет: LoadingState — пока грузится,
// EmptyState — когда данных не будет (пустой список, ошибка).
//
// Что изменилось по сравнению с версией без сервера:
//   - раньше компоненты были заготовкой, теперь реально используются
//     в ServicesList и App.
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
