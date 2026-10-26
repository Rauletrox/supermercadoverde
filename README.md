# Mercado Verde — Gestión de inventario

Proyecto académico de Desarrollo Frontend II. Sitio en español construido con HTML, CSS, JavaScript y React, con Vite como herramienta de desarrollo.

## Ejecutar

Se requiere Node.js compatible con la versión instalada de Vite.

```bash
npm install
npm run dev
```

Abre la URL indicada por Vite en la terminal.

```bash
npm run build
npm run preview
```

El primer comando genera la versión de producción en `dist/`; el segundo permite revisarla localmente.

## Páginas y navegación

- `/`: página principal con inventario, resumen, búsqueda, filtros por categoría y estado, creación, edición y eliminación de productos.
- `/quienes-somos`: presentación, misión, visión y valores del supermercado.
- `/tiendas`: tres sucursales de ejemplo con direcciones y horarios.

React Router utiliza `BrowserRouter`, `Routes`, `Route` y `NavLink`. El menú inferior indica la página activa. Las rutas desconocidas muestran una página de recuperación. Para publicar en un servidor estático, configura la redirección de rutas a `index.html`.

## Datos

Los productos se guardan en `localStorage` del navegador. Al abrir el sitio por primera vez se cargan seis productos de demostración. El stock igual o inferior al mínimo se marca como bajo; el stock cero se marca como agotado. Los precios se presentan en pesos chilenos. El valor del inventario es la suma del precio de venta por las unidades disponibles.

Los datos no se comparten entre dispositivos ni usuarios. Las tiendas y la empresa son ficticias. No se requiere backend. La tipografía usa Google Fonts y dispone de fuentes de sistema como alternativa.

Autor: Raúl Zúñiga.
