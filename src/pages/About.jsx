import React from "react";
// Actividad 1: página informativa «Quiénes somos», conservada en la actividad 2.
// Presenta el supermercado, su misión, visión y valores.
export default function About() {
  return (
    <>
      <section className="page-intro">
        <div>
          <div className="eyebrow">CONOCE MERCADO VERDE</div>
          <h1>
            Cerca de ti, cada día<span>.</span>
          </h1>
          <p>Buenos productos y una atención que te hace sentir en casa.</p>
        </div>
      </section>
      <section className="about-hero">
        <div className="about-art" aria-hidden="true">
          🥬<span>🍋</span>🥑
        </div>
        <div>
          <div className="eyebrow">QUIÉNES SOMOS</div>
          <h2>Un mercado con espíritu de barrio.</h2>
          <p>
            Mercado Verde es un supermercado de demostración creado con una idea
            sencilla: hacer que las compras diarias sean una experiencia
            cercana, ordenada y accesible.
          </p>
          <p>
            En nuestra propuesta, combinamos frutas y verduras, abarrotes,
            lácteos y panadería en un solo lugar. Este aplicativo nos ayuda a
            conocer la disponibilidad de cada producto y anticipar su
            reposición.
          </p>
          <span className="demo-label">
            Empresa ficticia · Proyecto académico
          </span>
        </div>
      </section>
      <section className="value-grid">
        <article>
          <span>☀</span>
          <h2>Nuestra misión</h2>
          <p>
            Acercar productos de uso cotidiano a las familias, con atención
            amable y un inventario organizado que facilite sus compras.
          </p>
        </article>
        <article>
          <span>♧</span>
          <h2>Nuestra visión</h2>
          <p>
            Ser un supermercado reconocido por su cercanía con la comunidad y el
            cuidado de cada detalle en su servicio.
          </p>
        </article>
        <article>
          <span>♡</span>
          <h2>Nuestros valores</h2>
          <p>
            Creemos en la transparencia, el respeto, el trabajo en equipo y el
            consumo responsable.
          </p>
        </article>
      </section>
    </>
  );
}
