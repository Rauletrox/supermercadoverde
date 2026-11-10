# Semana 3 — Desarrollando sitios web con React avanzado

Continuación del inventario de Mercado Verde, conservando ingreso, edición, eliminación, navegación y Tailwind CSS.

## Requerimientos implementados

| Requerimiento | Implementación |
| --- | --- |
| Filtrar por categoría sin perder datos | `InventoryFilters`, `useInventoryFilters` y `filterProducts` derivan la lista visible sin modificar los productos globales. |
| Abrir detalle al seleccionar un artículo | El nombre y la imagen de la tabla enlazan a `/articulos/:productId`. `ArticleDetail` muestra nombre, marca, tipo, categoría, precio, stock mínimo, estado y disponibilidad. |
| Agregar al carrito descontando inventario | Acciones del reducer actualizan la reserva y el stock simultáneamente. Se valida cantidad entera positiva y disponibilidad. |
| Pantalla del carrito | `/carrito` muestra los artículos seleccionados, cantidades, precios, subtotales y total. El menú indica las unidades reservadas. |
| Aumentar y disminuir cantidades | `CartLine` ofrece controles para aumentar, disminuir y quitar. Disminuir a cero retira la línea. Quitar o vaciar devuelve el stock. |
| Framework CSS | Detalle, carrito, controles y resumen utilizan Tailwind. El CSS de componentes se limita a fotos, enlaces y estados deshabilitados compartidos. |

## Regla de inventario

`product.stock` representa unidades **disponibles**, y el carrito contiene reservas `{ productId, quantity }`. Agregar o aumentar descuenta disponibles; disminuir o retirar devuelve unidades. Sin ajustes manuales, la suma disponible + reservada se conserva por producto. El stock nunca debe quedar negativo.

La edición administrativa del stock modifica las unidades disponibles. El precio del carrito es el precio actual del producto. Se impide eliminar un producto mientras tenga unidades en el carrito para evitar referencias huérfanas.

No se añadió un proceso de pago: las cantidades siguen siendo reservas hasta que el usuario las retire. La actividad solicita gestión del carrito y del inventario.

## Estado global y persistencia

`InventoryProvider` comparte productos, carrito, acciones estables y avisos en contextos separados. `inventoryReducer` delega en `cartReducer` las actualizaciones conjuntas, evitando descontar dos veces o perder unidades.

Se conserva la clave de almacenamiento `mercado-verde-products` y se usa el formato `{ version: 2, products, cart }`. Se migran los arreglos antiguos y la versión 1 con carrito vacío. Al recargar la versión 2, se recupera el stock ya descontado y el carrito, sin descontar nuevamente.

Se validan cantidades, stock, identificadores, referencias de productos y ausencia de líneas duplicadas. Un formato futuro no se sobrescribe. Si el almacenamiento está bloqueado, el estado continúa funcionando en memoria y se muestra el aviso correspondiente.

## Demostración sugerida

1. Abrir «Listado de artículos» y seleccionar «Lácteos». Volver a «Todas las categorías» y confirmar que reaparecen los demás productos.
2. Seleccionar «Leche entera · 1 L». Con los datos de demostración su stock inicial es 12.
3. Agregar 2 unidades: el detalle debe mostrar 10 disponibles y 2 en el carrito.
4. Abrir «Carrito»: aumentar a 3 deja 9 disponibles; disminuir a 2 deja 10.
5. Recargar: las cantidades y el stock deben mantenerse.
6. Quitar la leche: el carrito queda vacío y el listado vuelve a mostrar 12 disponibles.
7. Intentar agregar un producto agotado o una cantidad superior al stock. La aplicación debe impedirlo.

## Comprobaciones

```bash
npm run check
npm run dev
```

Las pruebas de lógica verifican conservación de unidades, límites, reservas repetidas, devolución, eliminación protegida y migración. Las pruebas de interfaz recorren filtros, detalle, cambios de cantidades, recarga, agotados, enlaces inexistentes y almacenamiento bloqueado.
