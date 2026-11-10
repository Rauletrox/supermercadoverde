import React from "react";
import Stat from "./Stat";
import { money, needsRestock } from "../../utils/inventory.js";

export default function InventorySummary({ products }) {
  return (
    <section className="stats" aria-label="Resumen del inventario">
      <Stat
        label="Productos registrados"
        value={products.length}
        icon="▦"
        detail="Variedad en tu catálogo"
      />
      <Stat
        label="Unidades disponibles"
        value={products.reduce((n, p) => n + p.stock, 0)}
        icon="▤"
        detail="Stock total del supermercado"
      />
      <Stat
        label="Productos por reponer"
        value={products.filter(needsRestock).length}
        icon="↗"
        detail="Stock bajo o agotado"
        warning
      />
      <Stat
        label="Valor del inventario"
        value={money(products.reduce((n, p) => n + p.price * p.stock, 0))}
        icon="$"
        detail="Calculado a precio de venta"
      />
    </section>
  );
}
