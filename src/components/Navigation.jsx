import React from "react";
import { NavLink } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      <NavLink to="/" end>
        <span>▦</span> Inventario
      </NavLink>
      <NavLink to="/quienes-somos">
        <span>♧</span> Quiénes somos
      </NavLink>
      <NavLink to="/tiendas">
        <span>⌖</span> Nuestras tiendas
      </NavLink>
    </nav>
  );
}
