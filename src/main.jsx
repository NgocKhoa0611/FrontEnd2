import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Providers from "../redux/Providers.jsx";


createRoot(document.getElementById("root")).render(
  <Providers>
    <App />
  </Providers>
);