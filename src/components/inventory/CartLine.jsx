import React from "react";
import { Link } from "react-router";
import { articlePath } from "../../constants/inventory.js";
import { useInventoryActions } from "../../context/InventoryContext";
import { money } from "../../utils/inventory.js";
import ProductImage from "./ProductImage";

export default function CartLine({ product, quantity }) {
  const { setCartQuantity, removeFromCart } = useInventoryActions();
  return (
    <article
      aria-label={product.name}
      className="flex flex-wrap items-center gap-5 rounded-xl border border-solid border-[#e1e7de] bg-white p-5"
    >
      <ProductImage product={product} />
      <div className="min-w-40 flex-1">
        <Link className="font-bold underline" to={articlePath(product.id)}>
          {product.name}
        </Link>
        <p className="mb-0 text-sm text-[#63745c]">
          {product.brand} · {money(product.price)} por unidad
        </p>
        <p className="mb-0 text-sm">Stock disponible: {product.stock}</p>
      </div>
      <div
        className="flex items-center gap-3"
        role="group"
        aria-label={`Cantidad de ${product.name}`}
      >
        <button
          className="secondary"
          aria-label={`Disminuir ${product.name}`}
          onClick={() => setCartQuantity(product.id, quantity - 1)}
        >
          −
        </button>
        <span className="min-w-6 text-center font-bold" aria-label={`${quantity} unidades`}>
          {quantity}
        </span>
        <button
          className="secondary"
          aria-label={`Aumentar ${product.name}`}
          disabled={product.stock === 0}
          onClick={() => setCartQuantity(product.id, quantity + 1)}
        >
          ＋
        </button>
      </div>
      <strong>{money(product.price * quantity)}</strong>
      <button
        className="secondary"
        aria-label={`Quitar ${product.name} del carrito`}
        onClick={() => removeFromCart(product.id)}
      >
        Quitar
      </button>
    </article>
  );
}
