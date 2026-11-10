import { ROUTES } from "../constants/inventory.js";
import React from "react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="page-intro">
      <h1>Página no encontrada</h1>
      <Link to={ROUTES.HOME} className="button">
        Volver al inventario
      </Link>
    </section>
  );
}
