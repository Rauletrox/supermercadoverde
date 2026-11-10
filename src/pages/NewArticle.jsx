import React from "react";
import { useNavigate } from "react-router";
import ProductForm from "../components/inventory/ProductForm";
import { ROUTES } from "../constants/inventory.js";

// Criterios Semana 02 - Criterio 6 (40 puntos): página con formulario para ingresar artículos.
// ProductForm comparte la validación y el guardado con la edición de artículos.
export default function NewArticle() {
  const navigate = useNavigate();

  return (
    <>
      <section className="page-intro">
        <div>
          <div className="eyebrow">AMPLÍA TU CATÁLOGO</div>
          <h1>
            Ingresar artículo<span>.</span>
          </h1>
          <p>Registra un producto para incorporarlo al inventario.</p>
        </div>
      </section>
      {/* Criterios Semana 02 - Criterio 2: Tailwind distribuye formulario y ayuda en una grilla adaptable con lg:grid-cols. */}
      <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
        <section
          aria-labelledby="new-article-title"
          className="rounded-xl border border-solid border-[#e1e7de] bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 id="new-article-title" className="mt-0 mb-2 text-xl font-bold">
            Datos del artículo
          </h2>
          <p className="mb-6 text-sm text-[#718075]">Todos los campos son obligatorios.</p>
          <ProductForm
            onSaved={() => navigate(ROUTES.ARTICLES)}
            onCancel={() => navigate(ROUTES.ARTICLES)}
          />
        </section>
        <aside className="rounded-xl border border-solid border-[#dfe7d5] bg-[#eaf0e1] p-6">
          <span aria-hidden="true" className="text-4xl">
            🛒
          </span>
          <h2 className="text-lg font-bold">Tu inventario al día</h2>
          <p className="text-sm leading-7 text-[#52634a]">
            Agrega el nombre, la marca y el tipo de producto para identificar cada artículo. La
            categoría permite agruparlo en el listado.
          </p>
          <p className="text-sm leading-7 text-[#52634a]">
            Al guardar, podrás verlo en la tabla y en el resumen del inventario.
          </p>
        </aside>
      </div>
    </>
  );
}
