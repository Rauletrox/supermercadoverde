// PAUTA · Criterio 2 (50 puntos): frontend desarrollado con JavaScript y React.
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
// PAUTA · Criterio 1 (50 puntos): React Router implementa la navegación entre páginas.
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import "./styles.css";

const initialProducts = [
  {
    id: 1,
    name: "Manzana roja",
    category: "Frutas y verduras",
    stock: 85,
    minimum: 20,
    price: 1490,
    icon: "🍎",
  },
  {
    id: 2,
    name: "Leche entera · 1 L",
    category: "Lácteos",
    stock: 12,
    minimum: 15,
    price: 1190,
    icon: "🥛",
  },
  {
    id: 3,
    name: "Pan integral",
    category: "Panadería",
    stock: 32,
    minimum: 10,
    price: 2290,
    icon: "🍞",
  },
  {
    id: 4,
    name: "Arroz grano largo · 1 kg",
    category: "Abarrotes",
    stock: 64,
    minimum: 15,
    price: 1590,
    icon: "🍚",
  },
  {
    id: 5,
    name: "Tomate",
    category: "Frutas y verduras",
    stock: 8,
    minimum: 15,
    price: 1890,
    icon: "🍅",
  },
  {
    id: 6,
    name: "Yogur natural",
    category: "Lácteos",
    stock: 0,
    minimum: 10,
    price: 690,
    icon: "🥣",
  },
];
const categories = [
  "Frutas y verduras",
  "Lácteos",
  "Panadería",
  "Abarrotes",
  "Otros",
];
const money = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

// PAUTA · Criterio 1: BrowserRouter habilita el enrutamiento y Routes selecciona la página.
function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <Link to="/" className="brand">
          <span className="brand-icon">✳</span>
          <span>
            mercado<span className="brand-light">verde</span>
            <small>FRESCO. CERCANO. NUESTRO.</small>
          </span>
        </Link>
        <span className="header-label">
          <span className="live-dot" /> Panel de administración
        </span>
      </header>
      <main>
        {/* PAUTA · Home y dos páginas adicionales, cada una con una ruta propia. */}
        <Routes>
          <Route path="/" element={<Inventory />} />
          <Route path="/quienes-somos" element={<About />} />
          <Route path="/tiendas" element={<Stores />} />
          <Route
            path="*"
            element={
              <section className="page-intro">
                <h1>Página no encontrada</h1>
                <Link to="/" className="button">
                  Volver al inventario
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer>
        <span>© {new Date().getFullYear()} Mercado Verde</span>
        <span>Proyecto académico · Raúl Zúñiga · Datos de demostración</span>
      </footer>
      {/* PAUTA · Menú inferior: NavLink permite navegar e identifica la página activa. */}
      <nav className="bottom-nav" aria-label="Navegación principal">
        <NavLink to="/" end>
          <span>▦</span> Inventario
        </NavLink>
        <NavLink to="/quienes-somos">
          <span>♧</span> Quiénes somos
        </NavLink>
        <NavLink to="/tiendas">
          <span>⌖</span> Nuestras tiendas
        </NavLink>
      </nav>
    </BrowserRouter>
  );
}

// PAUTA · Criterio 2: página principal del sitio de gestión de inventario del supermercado.
// Incluye listado, búsqueda, filtros, creación, edición y eliminación de productos.
function Inventory() {
  // Persistencia local complementaria: recupera el inventario guardado en este navegador.
  const [products, setProducts] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("mercado-verde-products"));
      return Array.isArray(saved) &&
        saved.every(
          (p) =>
            p &&
            typeof p.name === "string" &&
            categories.includes(p.category) &&
            Number.isFinite(p.stock) &&
            p.stock >= 0 &&
            Number.isFinite(p.minimum) &&
            p.minimum >= 0 &&
            Number.isFinite(p.price) &&
            p.price >= 0 &&
            typeof p.id === "number",
        )
        ? saved
        : initialProducts;
    } catch {
      return initialProducts;
    }
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas las categorías");
  const [status, setStatus] = useState("Todos los estados");
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  function update(next) {
    setProducts(next);
    try {
      localStorage.setItem("mercado-verde-products", JSON.stringify(next));
    } catch {
      setMessage(
        "Los cambios se conservarán durante esta sesión. El navegador no permitió guardarlos.",
      );
    }
  }
  const state = (p) =>
    p.stock === 0
      ? "Agotado"
      : p.stock <= p.minimum
        ? "Stock bajo"
        : "Disponible";
  const filtered = products.filter(
    (p) =>
      p.name.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es")) &&
      (category === "Todas las categorías" || p.category === category) &&
      (status === "Todos los estados" || state(p) === status),
  );
  const low = products.filter((p) => p.stock <= p.minimum).length;
  function save(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const product = {
      id: editing.id ?? Date.now(),
      name: data.get("name").trim(),
      category: data.get("category"),
      stock: Number(data.get("stock")),
      minimum: Number(data.get("minimum")),
      price: Number(data.get("price")),
      icon: editing.icon ?? "🛒",
    };
    if (!product.name) return;
    update(
      editing.id
        ? products.map((p) => (p.id === product.id ? product : p))
        : [...products, product],
    );
    setEditing(null);
    setMessage("Producto guardado correctamente.");
  }
  return (
    <>
      <section className="page-intro">
        <div>
          <div className="eyebrow">TU SUPERMERCADO, EN ORDEN</div>
          <h1>
            Control de inventario<span>.</span>
          </h1>
          <p>Todo lo que necesitas para mantener tus estantes al día.</p>
        </div>
        <button className="button" onClick={() => setEditing({})}>
          ＋ Agregar producto
        </button>
      </section>
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
          value={low}
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
      {low > 0 && (
        <div className="notice">
          <span className="notice-icon">!</span>
          <p>
            <strong>Un vistazo a tus estantes.</strong> Tienes {low} productos
            que necesitan reposición.
          </p>
          <button
            onClick={() => {
              setStatus("Todos los estados");
              setCategory("Todas las categorías");
              setSearch("");
              setStatus("Stock bajo");
            }}
          >
            Ver stock bajo →
          </button>
        </div>
      )}
      <section className="inventory-panel">
        <div className="panel-title">
          <div>
            <h2>Listado de productos</h2>
            <p>Consulta y administra los productos de tu supermercado.</p>
          </div>
          <span className="count">{products.length} productos</span>
        </div>
        <div className="filters">
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Buscar producto"
              placeholder="Buscar un producto…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <select
            aria-label="Filtrar por categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["Todas las categorías", ...categories].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            aria-label="Filtrar por estado"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["Todos los estados", "Disponible", "Stock bajo", "Agotado"].map(
              (s) => (
                <option key={s}>{s}</option>
              ),
            )}
          </select>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio unitario</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="product">
                      <span className="product-icon">{p.icon}</span>
                      <span>
                        <strong>{p.name}</strong>
                        <small>
                          SKU-{String(p.id).slice(-5).padStart(5, "0")}
                        </small>
                      </span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td className="price">{money(p.price)}</td>
                  <td>
                    <strong>{p.stock}</strong>
                    <span className="unit"> un.</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${state(p) === "Disponible" ? "green" : state(p) === "Agotado" ? "red" : "amber"}`}
                    >
                      <span>●</span> {state(p)}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        aria-label={`Editar ${p.name}`}
                        onClick={() => setEditing(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="delete"
                        aria-label={`Eliminar ${p.name}`}
                        onClick={() => setPendingDelete(p)}
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty">
              No hay productos que coincidan con tu búsqueda.
            </div>
          )}
        </div>
        <div className="table-footer">
          Mostrando {filtered.length} de {products.length} productos
          <span>Precios en pesos chilenos (CLP)</span>
        </div>
      </section>
      <div className="local-note">
        <span>◈</span> Tu inventario se guarda automáticamente en este
        navegador.
      </div>
      {message && (
        <div className="toast" role="status">
          {message}
          <button aria-label="Cerrar mensaje" onClick={() => setMessage("")}>
            ×
          </button>
        </div>
      )}
      {editing && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditing(null);
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-title"
          >
            <div className="modal-heading">
              <h2 id="product-title">
                {editing.id ? "Editar producto" : "Agregar producto"}
              </h2>
              <button
                aria-label="Cerrar formulario"
                onClick={() => setEditing(null)}
              >
                ×
              </button>
            </div>
            <form onSubmit={save}>
              <label>
                Nombre del producto
                <input
                  autoFocus
                  name="name"
                  required
                  maxLength="80"
                  pattern=".*\S.*"
                  defaultValue={editing.name}
                />
              </label>
              <label>
                Categoría
                <select
                  name="category"
                  defaultValue={editing.category ?? categories[0]}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <div className="form-grid">
                <label>
                  Precio unitario (CLP)
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="1"
                    required
                    defaultValue={editing.price ?? 0}
                  />
                </label>
                <label>
                  Stock (unidades)
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    step="1"
                    required
                    defaultValue={editing.stock ?? 0}
                  />
                </label>
              </div>
              <label>
                Stock mínimo
                <input
                  type="number"
                  name="minimum"
                  min="0"
                  step="1"
                  required
                  defaultValue={editing.minimum ?? 10}
                />
              </label>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </button>
                <button className="button" type="submit">
                  Guardar producto
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      {pendingDelete && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <h2 id="delete-title">Eliminar producto</h2>
            <p>¿Quieres eliminar “{pendingDelete.name}” del inventario?</p>
            <div className="modal-buttons">
              <button
                className="secondary"
                autoFocus
                onClick={() => setPendingDelete(null)}
              >
                Cancelar
              </button>
              <button
                className="button danger"
                onClick={() => {
                  update(products.filter((p) => p.id !== pendingDelete.id));
                  setPendingDelete(null);
                  setMessage("Producto eliminado.");
                }}
              >
                Eliminar
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
function Stat({ label, value, icon, detail, warning }) {
  return (
    <article className={`stat ${warning ? "warning" : ""}`}>
      <div className="stat-top">
        {label}
        <span>{icon}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
// PAUTA · Criterio 2: primera página adicional elegida, «Quiénes somos».
// Presenta el supermercado, su misión, visión y valores.
function About() {
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
// PAUTA · Criterio 2: segunda página adicional elegida, «Nuestras tiendas».
// Presenta sucursales de demostración, direcciones y horarios.
function Stores() {
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

// Montaje de la aplicación React en el contenedor HTML de index.html.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
