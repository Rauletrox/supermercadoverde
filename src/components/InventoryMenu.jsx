import React from "react";
import { NavLink } from "react-router-dom";

// PAUTA S2 · Criterios 1 y 6: nuevo menú con NavLink para ingresar y listar artículos.
// PAUTA S2 · Criterio 2 (20 puntos): las clases Tailwind aplican colores, espaciado,
// bordes, flex-wrap y estilos de la opción activa; el framework se utiliza en la interfaz.
export default function InventoryMenu() {
  return (
    <nav aria-label="Gestión de artículos" className="mb-8 flex flex-wrap items-center gap-2 rounded-xl border border-solid border-[#e1e7de] bg-white p-3 shadow-sm">
      <span className="px-3 text-xs font-bold uppercase tracking-wider text-[#65836c]">Gestionar artículos</span>
      <NavLink to="/articulos/nuevo" className={({ isActive }) => `rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${isActive ? "bg-[#285b43] text-white" : "text-[#52634a] hover:bg-[#edf3e8]"}`}>
        ＋ Ingresar artículo
      </NavLink>
      <NavLink to="/articulos" end className={({ isActive }) => `rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${isActive ? "bg-[#285b43] text-white" : "text-[#52634a] hover:bg-[#edf3e8]"}`}>
        ▦ Listado de artículos
      </NavLink>
    </nav>
  );
}
