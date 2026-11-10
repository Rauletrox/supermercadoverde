import React from "react";
import { Link } from "react-router";
import { useCart, useInventoryActions, useProducts } from "../context/InventoryContext";
import { ROUTES } from "../constants/inventory.js";
import { cartLines, cartUnits } from "../utils/cart.js";
import { money } from "../utils/inventory.js";
import CartLine from "../components/inventory/CartLine";

// S3: modificar el carrito actualiza simultáneamente las cantidades disponibles.
export default function Cart() {
  const products = useProducts();
  const cart = useCart();
  const { clearCart } = useInventoryActions();
  const lines = cartLines(cart, products);
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  return (
    <>
      <section className="page-intro">
        <div>
          <div className="eyebrow">TUS PRODUCTOS SELECCIONADOS</div>
          <h1>
            Carrito de compras<span>.</span>
          </h1>
          <p>Ajusta las cantidades y el inventario se actualizará automáticamente.</p>
        </div>
        <Link className="button" to={ROUTES.ARTICLES}>
          Seguir agregando
        </Link>
      </section>
      {lines.length === 0 ? (
        <section className="rounded-xl border border-solid border-[#e1e7de] bg-white p-10 text-center">
          <h2>Tu carrito está vacío</h2>
          <p>Selecciona un artículo del listado para ver su detalle y agregarlo.</p>
          <Link className="button" to={ROUTES.ARTICLES}>
            Explorar artículos
          </Link>
        </section>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="grid gap-4" aria-label="Artículos del carrito">
            {lines.map((line) => (
              <CartLine key={line.productId} product={line.product} quantity={line.quantity} />
            ))}
          </section>
          <aside
            className="rounded-xl border border-solid border-[#dfe7d5] bg-[#eaf0e1] p-6"
            aria-label="Resumen del carrito"
          >
            <h2 className="mt-0 text-xl font-bold">Resumen</h2>
            <p>
              {cartUnits(cart)} unidades en {cart.length} artículos
            </p>
            <div className="my-6 flex justify-between gap-4 text-xl font-bold">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
            <p className="text-sm leading-6">
              Las cantidades ya están descontadas del inventario. Disminuir o quitar un artículo
              devuelve las unidades disponibles.
            </p>
            <button className="secondary w-full" onClick={clearCart}>
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
