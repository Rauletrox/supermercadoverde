import React from "react";
// Actividad 1: página informativa «Nuestras tiendas», conservada en la actividad 2.
// Presenta sucursales de demostración, direcciones y horarios.
export default function Stores() {
  const stores = [
    {
      name: "Santiago Centro",
      address: "Av. Alameda 1250, Santiago",
      hours: "Lunes a sábado · 08:30 a 21:00",
      sunday: "Domingo · 09:00 a 19:00",
      tag: "Tienda principal",
    },
    {
      name: "Providencia",
      address: "Av. Providencia 2150, Providencia",
      hours: "Lunes a sábado · 09:00 a 21:00",
      sunday: "Domingo · 09:30 a 19:00",
      tag: "Cerca de tu barrio",
    },
    {
      name: "Ñuñoa",
      address: "Av. Irarrázaval 3200, Ñuñoa",
      hours: "Lunes a sábado · 08:30 a 20:30",
      sunday: "Domingo · 09:00 a 18:00",
      tag: "Tu mercado de siempre",
    },
  ];
  return (
    <>
      <section className="page-intro">
        <div>
          <div className="eyebrow">ENCUÉNTRANOS EN TU BARRIO</div>
          <h1>
            Nuestras tiendas<span>.</span>
          </h1>
          <p>Tres espacios pensados para acompañar tus compras de cada día.</p>
        </div>
      </section>
      <div className="store-banner">
        <span>⌖</span>
        <div>
          <h2>Siempre hay un Mercado Verde cerca</h2>
          <p>
            Consulta las direcciones y horarios de nuestras sucursales de
            ejemplo.
          </p>
        </div>
      </div>
      <section className="store-grid">
        {stores.map((s, i) => (
          <article className="store-card" key={s.name}>
            <div className={`store-art store-${i}`} aria-hidden="true">
              <span>✳</span>
              <strong>mercadoverde</strong>
              <div className="awning" />
              <div className="store-windows">▥ ▥ ▥</div>
            </div>
            <div className="store-content">
              <div className="eyebrow">{s.tag}</div>
              <h2>{s.name}</h2>
              <p className="address">⌖ {s.address}</p>
              <hr />
              <h3>Horario de atención</h3>
              <p>
                {s.hours}
                <br />
                {s.sunday}
              </p>
            </div>
          </article>
        ))}
      </section>
      <p className="local-note">
        Las sucursales, direcciones y horarios son ficticios y se presentan con
        fines académicos.
      </p>
    </>
  );
}

