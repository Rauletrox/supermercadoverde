import { ROUTES } from "../constants/inventory.js";
import React from "react";
import { NavLink } from "react-router";

export default function Navigation() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      <NavLink to={ROUTES.HOME} end>
        <span>▦</span> Inventario
      </NavLink>
      <NavLink to={ROUTES.ABOUT}>
        <span>♧</span> Quiénes somos
      </NavLink>
      <NavLink to={ROUTES.STORES}>
        <span>⌖</span> Nuestras tiendas
      </NavLink>
    </nav>
  );
}
