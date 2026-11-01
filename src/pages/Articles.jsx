import React from "react";
import Inventory from "./Inventory";

// Criterios Semana 02 - Criterio 6 (40 puntos): página dedicada al listado de todos los artículos.
// Reutiliza Inventory sin el resumen; inicialmente no hay filtros y se muestra la lista completa.
// Los datos provienen del mismo estado global utilizado por la página de ingreso.
export default function Articles() {
  return <Inventory showSummary={false} />;
}
