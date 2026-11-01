import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page-intro">
      <h1>Página no encontrada</h1>
      <Link to="/" className="button">Volver al inventario</Link>
    </section>
  );
}
