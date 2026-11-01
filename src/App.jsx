import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { InventoryProvider, useInventory } from "./context/InventoryContext";
import InventoryMenu from "./components/InventoryMenu";
import NewArticle from "./pages/NewArticle";
import Articles from "./pages/Articles";
import Navigation from "./components/Navigation";
import Inventory from "./pages/Inventory";
import About from "./pages/About";
import Stores from "./pages/Stores";
import NotFound from "./pages/NotFound";

// Criterios Semana 02 - Criterio 1 (40 puntos): navegación con React Router y gestión global de estado.
// InventoryProvider comparte el inventario entre las rutas; HashRouter y Routes resuelven la navegación.
export default function App() {
  return (
    <InventoryProvider>
      <HashRouter>
        <header className="header">
          <Link to="/" className="brand">
            <span className="brand-icon">✳</span>
            <span>
              mercado<span className="brand-light">verde</span>
              <small>FRESCO. CERCANO. NUESTRO.</small>
            </span>
          </Link>
          <span className="header-label">
            <span className="live-dot" /> Panel de administración
          </span>
        </header>
        <main>
          <InventoryMenu />
          {/* Criterios Semana 02 - Criterio 6: rutas independientes para ingresar y listar artículos. */}
          <Routes>
            <Route path="/articulos/nuevo" element={<NewArticle />} />
            <Route path="/articulos" element={<Articles />} />
            <Route path="/" element={<Inventory />} />
            <Route path="/quienes-somos" element={<About />} />
            <Route path="/tiendas" element={<Stores />} />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </main>
        <footer>
          <span>© {new Date().getFullYear()} Mercado Verde</span>
          <span>Proyecto académico · Raúl Zúñiga · Datos de demostración</span>
        </footer>
        <Navigation />
        <InventoryMessage />
      </HashRouter>
    </InventoryProvider>
  );
}


function InventoryMessage() {
  const { message, dismissMessage } = useInventory();
  return message && (
    <div className="toast" role="status">
      {message}
      <button aria-label="Cerrar mensaje" onClick={dismissMessage}>×</button>
    </div>
  );
}
