// Точка входа React-приложения.
//
// Этот файл запускается первым. Его подключает index.html.
// Здесь создаётся корень React-дерева и монтируется компонент App.
//
// Больше в этом файле ничего не трогаем — вся работа будет
// внутри App и его дочерних компонентов.
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
