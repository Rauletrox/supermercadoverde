import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// Montaje de la aplicación React en el contenedor HTML de index.html.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
