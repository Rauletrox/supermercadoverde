import React, { useState } from "react";
import apple from "../../assets/img/manzana_roja.jpg";
import bread from "../../assets/img/pan_integral.jpeg";
import rice from "../../assets/img/arroz_grano_largo.jpg";
import tomato from "../../assets/img/tomate.jpg";
import yogurt from "../../assets/img/yogut_natural.jpg";

// La clave original permite mostrar fotos también en inventarios guardados anteriormente.
// Si una foto está vacía o no carga, se muestra el icono como respaldo.
const productImages = {
  "🍎": apple,
  "🍞": bread,
  "🍚": rice,
  "🍅": tomato,
  "🥣": yogurt,
};

export default function ProductImage({ product }) {
  const source = productImages[product.icon];
  const [failedSource, setFailedSource] = useState(null);

  return (
    <span className="product-icon">
      {source && failedSource !== source ? (
        <img
          src={source}
          alt={product.name}
          width="48"
          height="48"
          loading="lazy"
          onError={() => setFailedSource(source)}
        />
      ) : (
        <span aria-hidden="true">{product.icon || "🛒"}</span>
      )}
    </span>
  );
}
