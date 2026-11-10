import React, { useState } from "react";
import { Link, useParams } from "react-router";
import { useCart, useInventoryActions, useProducts } from "../context/InventoryContext";
import { MESSAGES, ROUTES } from "../constants/inventory.js";
import { PATTERNS } from "../utils/productValidation.js";
import { money, productStatus } from "../utils/inventory.js";
import ProductImage from "../components/inventory/ProductImage";

// S3: ruta de detalle accesible desde el nombre de cualquier artículo de la tabla.
export default function ArticleDetail() {
  const { productId } = useParams();
  const product = useProducts().find((p) => p.id === productId);
  if (!product)
    return (
      <section className="page-intro">
        <div>
          <h1>Artículo no encontrado</h1>
          <Link className="button" to={ROUTES.ARTICLES}>
            Volver al listado
          </Link>
        </div>
      </section>
    );
  return <DetailContent key={product.id} product={product} />;
}
function DetailContent({ product }) {
  const { addToCart } = useInventoryActions();
  const cart = useCart();
  const reserved = cart.find((line) => line.productId === product.id)?.quantity ?? 0;
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    const count = Number(quantity);
    if (!PATTERNS.INTEGER.test(quantity) || !Number.isSafeInteger(count) || count < 1) {
      setError(MESSAGES.CART_QUANTITY);
      return;
    }
    if (count > product.stock) {
      setError(MESSAGES.CART_STOCK);
      return;
    }
    addToCart(product.id, count);
    setError("");
    setQuantity("1");
  }
  return (
    <>
      <section className="page-intro">
        <div>
          <div className="eyebrow">CONOCE CADA PRODUCTO</div>
          <h1>
            Detalle del artículo<span>.</span>
          </h1>
          <p>Consulta su información y agrégalo al carrito.</p>
        </div>
        <Link className="secondary" to={ROUTES.ARTICLES}>
          Volver al listado
        </Link>
      </section>
      <section
        className="grid gap-8 rounded-xl border border-solid border-[#e1e7de] bg-white p-6 sm:p-8 lg:grid-cols-2"
        aria-labelledby="article-name"
      >
        <div className="detail-photo flex items-center justify-center rounded-xl bg-[#f7f9f6] p-8">
          <ProductImage product={product} />
        </div>
        <div>
          <div className="eyebrow">{product.category}</div>
          <h2 id="article-name" className="text-2xl font-bold">
            {product.name}
          </h2>
          <p className="text-2xl font-bold text-[#285b43]">{money(product.price)}</p>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <dt>Marca</dt>
            <dd className="m-0">{product.brand}</dd>
            <dt>Tipo de producto</dt>
            <dd className="m-0">{product.type}</dd>
            <dt>Estado</dt>
            <dd className="m-0">{productStatus(product)}</dd>
            <dt>Stock mínimo</dt>
            <dd className="m-0">{product.minimum} unidades</dd>
            <dt>Stock disponible</dt>
            <dd className="m-0 font-bold" data-testid="detail-stock">
              {product.stock} {product.stock === 1 ? "unidad" : "unidades"}
            </dd>
            <dt>En tu carrito</dt>
            <dd className="m-0">
              {reserved} {reserved === 1 ? "unidad" : "unidades"}
            </dd>
          </dl>
          <p className="text-sm leading-6 text-[#63745c]">
            Las unidades del carrito se descuentan del stock disponible. Al retirarlas, vuelven al
            inventario.
          </p>
          <form onSubmit={submit} noValidate className="mt-6 flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-2 text-sm">
              <label htmlFor="cart-quantity">Cantidad</label>
              <input
                id="cart-quantity"
                className="product-field-control w-28"
                type="number"
                min="1"
                max={product.stock}
                step="1"
                value={quantity}
                disabled={product.stock === 0}
                onChange={(event) => {
                  setQuantity(event.target.value);
                  setError("");
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "quantity-error" : undefined}
              />
            </div>
            <button className="button" type="submit" disabled={product.stock === 0}>
              {product.stock === 0 ? "Producto agotado" : "Agregar al carrito"}
            </button>
          </form>
          {error && (
            <p id="quantity-error" className="field-error" role="alert">
              {error}
            </p>
          )}
          <Link
            className="mt-5 inline-block font-semibold text-[#285b43] underline"
            to={ROUTES.CART}
          >
            Ver carrito →
          </Link>
        </div>
      </section>
    </>
  );
}
