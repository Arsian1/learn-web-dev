// Точка входа React-приложения.
//
// Этот файл — самый первый, который запускается. Его подключает
// index.html (Vite сам вставляет сюда ссылку). Здесь создаётся
// корень React-дерева и в него монтируется компонент App.
//
// Больше в этом файле ничего не происходит. Всё остальное —
// внутри App и его дочерних компонентов.
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// createRoot находит элемент с id="root" в index.html
// и делает его корнем React-приложения.
// .render(<App />) — говорит React: «отрисуй компонент App
// внутри этого корня».
createRoot(document.getElementById("root")).render(<App />);
