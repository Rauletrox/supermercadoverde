# Mercado Verde — Gestión de inventario

Actividad sumativa de la semana 3: «Desarrollando sitios web con React avanzado». Continuación de las actividades formativas anteriores. Proyecto académico de Desarrollo Frontend II. Sitio en español construido con HTML, CSS, JavaScript y React, con Vite como herramienta de desarrollo y Tailwind CSS para la interfaz del menú, el formulario, el detalle y el carrito.

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
- `/articulos/nuevo`: formulario para ingresar nombre, marca, tipo, categoría, precio, stock y stock mínimo. Al guardar, navega al listado.
- `/articulos`: tabla de todos los artículos del estado global, con búsqueda, filtros, edición y eliminación.
- `/articulos/:productId`: detalle de un artículo y selección de unidades para el carrito.
- `/carrito`: cantidades reservadas, ajuste de unidades, subtotales y total, con inventario sincronizado.
- `/quienes-somos`: presentación, misión, visión y valores del supermercado.
- `/tiendas`: tres sucursales de ejemplo con direcciones y horarios.

React Router utiliza `HashRouter`, `Routes`, `Route` y `NavLink`. El menú inferior indica la página activa. Las rutas desconocidas muestran una página de recuperación. Las direcciones internas utilizan `#/`, `#/quienes-somos` y `#/tiendas`, lo que permite recargarlas en GitHub Pages sin configurar redirecciones.

## Organización del código

- `src/main.jsx`: montaje de React y estilos.
- `src/App.jsx`: estructura general y rutas.
- `src/pages/`: inventario, quiénes somos, tiendas y página no encontrada.
- `src/components/Navigation.jsx`: menú inferior.
- `src/components/inventory/`: resumen, tabla, formulario y confirmación de eliminación.
- `src/context/InventoryContext.jsx`: estado global con Context, `useReducer` y persistencia mediante `useEffect`.
- `src/context/inventoryReducer.js`: operaciones de agregar, editar y eliminar.
- `src/components/InventoryMenu.jsx`: nuevo menú de ingreso y listado.
- `src/utils/productForm.js`: lectura y validación del formulario compartido.
- `src/utils/productStorage.js`: carga, compatibilidad con datos previos y guardado local.
- `src/data/products.js`: productos iniciales.
- `src/constants/inventory.js`: categorías, rutas, acciones, filtros y mensajes compartidos.
- `src/utils/inventory.js`: formato de precios y reglas de stock compartidas.

El botón «Ver productos por reponer» activa el filtro «Por reponer», que incluye stock bajo y agotado, y limpia la búsqueda y la categoría. Los filtros individuales siguen disponibles. Si falla el guardado en `localStorage`, los cambios permanecen en memoria y se muestra el aviso correspondiente al guardar o eliminar, sin reemplazarlo por un mensaje de éxito.

## Estado global, almacenamiento y estilos

`InventoryProvider` envuelve el enrutador. `useProducts` consume la lista; `useInventoryActions` ofrece funciones estables para agregar, editar y eliminar; `useInventoryMessage` consume los avisos y `useCart` comparte las reservas. Los contextos están separados y sus valores se memoizan: cerrar un aviso no propaga cambios al consumidor de productos. `useReducer` actualiza la lista sin mutarla y `useEffect` sincroniza los cambios con el almacenamiento.

Los productos nuevos usan `crypto.randomUUID()` y las acciones de ingreso y edición son distintas. Un identificador duplicado se rechaza y nunca sobrescribe un artículo existente. La aplicación requiere un navegador con Web Crypto en un contexto seguro (HTTPS o localhost).

`localStorage` conserva la clave `mercado-verde-products` con formato `{ version: 2, products: [...], cart: [...] }`. Los registros de versión 1 se recuperan con un carrito vacío. Los arreglos anteriores sin versión se migran en memoria, convirtiendo IDs numéricos a texto y completando marca, tipo o icono si faltan. Se comprueban campos, longitudes, cantidades enteras, categorías, iconos y unicidad de identificadores. Datos inválidos o bloqueados producen un aviso. Los formatos de versiones futuras no se sobrescriben: las modificaciones quedan solo en memoria. El formato nuevo se escribe después de una modificación válida.

Las reglas reutilizables y las expresiones regulares están en `src/utils/productValidation.js`. El formulario compartido usa `useProductForm` y muestra el error específico junto a cada campo, con asociación accesible y foco en el primer error. La validación de aplicación funciona con `noValidate` para evitar mensajes nativos distintos entre navegadores.

Tailwind CSS se integra con `@tailwindcss/vite`. `src/styles.css` define el orden `theme`, `base`, `components`, `utilities`. `src/styles/global.css` contiene la base tipográfica y accesibilidad; `src/styles/components.css`, componentes comunes y páginas originales; Tailwind, distribución adaptable y utilidades del nuevo menú y formulario. No se importa Preflight. Se retiraron los estilos de etiquetas y grillas duplicados del modal. Guía: [capas de estilos de Tailwind](https://tailwindcss.com/docs/adding-custom-styles).

Las fotos están en `src/assets/img` y se importan desde `ProductImage.jsx`. Los artículos sin foto o con error de carga muestran un icono. El archivo vacío de leche fue retirado; las cinco imágenes válidas siguen disponibles.

## Verificación de la actividad 2

```bash
npm run check
npm run dev
```

1. En el nuevo menú, abre «Ingresar artículo» y completa todos los campos.
2. Guarda y comprueba que nombre, marca y tipo aparecen en «Listado de artículos».
3. Vuelve a «Inventario» y verifica que el resumen refleja el nuevo artículo.
4. Navega a «Quiénes somos» y regresa al listado: el artículo debe permanecer.
5. Edita y elimina un artículo; confirma que el inventario y el resumen se actualizan.
6. Recarga para verificar la persistencia local. Con almacenamiento bloqueado, se muestra el aviso y los cambios permanecen durante la sesión de la aplicación.

Las pruebas automatizadas cubren altas, edición, eliminación, validación, reposición, datos antiguos y almacenamiento bloqueado.

## Datos

Los productos se guardan en `localStorage` del navegador. Al abrir el sitio por primera vez se cargan seis productos de demostración. El stock igual o inferior al mínimo se marca como bajo; el stock cero se marca como agotado. Los precios se presentan en pesos chilenos. El valor del inventario es la suma del precio de venta por las unidades disponibles.

Los datos no se comparten entre dispositivos ni usuarios. Las tiendas y la empresa son ficticias. No se requiere backend. La tipografía usa Google Fonts y dispone de fuentes de sistema como alternativa.

Autor: Raúl Zúñiga.

## Subir el proyecto a GitHub

GitHub almacena el código y su historial. GitHub Pages permite publicar la web. Subir el repositorio no activa por sí solo la publicación.

### 1. Crear un repositorio vacío

1. Inicia sesión en GitHub y selecciona **New repository**.
2. Usa, por ejemplo, `Exp1_S2_RaulZuniga` como nombre.
3. Para seguir esta guía con GitHub Free, selecciona **Public**.
4. No agregues un README, `.gitignore` ni licencia desde GitHub: el proyecto ya contiene sus archivos locales.
5. Selecciona **Create repository** y copia su URL HTTPS.

### 2. Subir los archivos desde la terminal

Abre la terminal en la carpeta raíz del proyecto, donde está `package.json`. Necesitas Git instalado y autenticarte en GitHub al realizar el envío; puedes utilizar GitHub CLI con `gh auth login` si la tienes instalada.

Para un proyecto que todavía no tiene repositorio Git:

```bash
git init
git add .
git commit -m "Crear sitio de inventario Mercado Verde"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/Exp1_S2_RaulZuniga.git
git push -u origin main
```

Reemplaza `TU_USUARIO` y el nombre del repositorio por tus datos reales. Si Git solicita tu identidad antes del primer commit, configúrala con tu nombre y un correo asociado a tu cuenta:

```bash
git config user.name "Tu nombre"
git config user.email "tu-correo@example.com"
```

Luego repite el comando `git commit` y continúa con los pasos pendientes.

Si el proyecto ya tiene Git u otro remoto, revisa primero `git status` y `git remote -v`. Si `origin` ya existe, no vuelvas a agregarlo; si necesitas corregir su dirección, utiliza `git remote set-url origin URL_REAL`.

El `.gitignore` excluye `node_modules/` y `dist/`. Debes subir los archivos fuente, `package.json` y `package-lock.json`: GitHub Actions instalará las dependencias y generará `dist/`.

## Publicar en GitHub Pages

La configuración ya está incluida en el proyecto:

- `src/App.jsx` utiliza **HashRouter**, de React Router, para evitar errores 404 al recargar páginas internas en un alojamiento estático.
- `vite.config.js` define `base: "./"`. Los recursos se cargan con rutas relativas, por lo que no necesitas escribir el nombre del repositorio en la configuración.
- `.github/workflows/deploy.yml` instala las dependencias con `npm ci`, compila con Node.js 22 y publica `dist/` cuando envías cambios a `main`. También permite ejecutarlo manualmente desde Actions.

No tienes que crear ni copiar estos archivos nuevamente. El sitio todavía no está publicado: falta subirlo a tu repositorio y activar GitHub Pages.

Las direcciones publicadas tendrán esta forma (reemplaza el usuario y repositorio por los tuyos):

```text
https://TU_USUARIO.github.io/Exp1_S2_RaulZuniga/#/
https://TU_USUARIO.github.io/Exp1_S2_RaulZuniga/#/quienes-somos
https://TU_USUARIO.github.io/Exp1_S2_RaulZuniga/#/tiendas
```

HashRouter mantiene el cumplimiento del requisito de navegación con React Router.

### Activar Pages y enviar la configuración

1. En el repositorio de GitHub, abre **Settings → Pages**.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. En la terminal local, verifica la compilación y envía los cambios:

```bash
npm run build
git add .
git commit -m "Configurar publicación en GitHub Pages"
git push
```

4. Abre la pestaña **Actions** y espera a que el workflow termine correctamente.
5. Consulta la URL publicada en **Settings → Pages** o en el resultado del despliegue.

Si el envío ocurrió antes de activar Pages y falló, vuelve a ejecutar el workflow desde **Actions**.

### Comprobar la web publicada

- Confirma que se cargan los estilos y los productos.
- Recorre las tres páginas mediante el menú inferior.
- Recarga una página adicional y comprueba que sigue funcionando.
- Agrega un producto de prueba y recarga para verificar el guardado local.

El inventario del dominio de GitHub Pages es independiente del de `localhost`: `localStorage` pertenece a cada origen. Los visitantes tampoco comparten sus inventarios.

### Publicar actualizaciones

Después de editar los archivos fuente:

```bash
npm run build
git add .
git commit -m "Actualizar el sitio"
git push
```

GitHub Actions generará y publicará la nueva versión. No es necesario subir `dist/` manualmente.

### Problemas habituales

| Problema | Qué revisar |
| --- | --- |
| Página sin estilos o pantalla vacía | Verifica que `vite.config.js` conserve `base: "./"` y revisa el resultado de Actions. |
| Error 404 al recargar una página adicional | Verifica que la URL contiene `#/` y que publicaste la versión actual del proyecto, que utiliza `HashRouter`. |
| No se inicia la publicación | Confirma que Pages utiliza GitHub Actions y que envías cambios a la rama `main`. |
| `origin` ya existe | Revisa `git remote -v` y utiliza el remoto existente o corrige su URL. |
| No aparecen los productos guardados en localhost | Es normal: el dominio publicado utiliza un almacenamiento local diferente. |

## Funcionalidades de la semana 3

El filtro por categoría cambia la lista visible sin modificar el inventario original. Seleccionar el nombre o la foto de un artículo abre su detalle. Agregar o aumentar unidades en el carrito descuenta el stock disponible; disminuir, quitar o vaciar devuelve las unidades. Los productos agotados no pueden agregarse y las cantidades se validan también en el reducer.

Inventario y carrito se guardan juntos para mantener su consistencia al recargar. No se permite eliminar del catálogo un artículo reservado. La edición administrativa indica stock disponible y el carrito utiliza los precios actuales de los productos.

Consulta [MEJORAS_S3.md](./MEJORAS_S3.md) para las reglas, archivos y una demostración paso a paso.

## Controles de calidad

- `npm run lint`: ESLint revisa JavaScript/JSX, uso de hooks, variables, claves y prohíbe importar `react-router-dom`.
- `npm run format` / `npm run format:check`: aplica o revisa formato con Prettier.
- `npm run test:unit`: reglas, UUID, reducer, filtros y migración/validación de almacenamiento.
- `npm run test:ui`: formularios, navegación, persistencia bloqueada y estabilidad de contextos con Testing Library y Vitest/JSDOM.
- `npm run check`: ejecuta lint, formato, todas las pruebas y compilación.

Se ejecutan los controles antes del despliegue y en las propuestas de cambios mediante GitHub Actions. Se requieren Node.js 22.23 o posterior compatible y las dependencias del archivo de bloqueo (`npm ci`).

Consulta [MEJORAS_S2.md](./MEJORAS_S2.md) para la correspondencia de las diez observaciones con sus cambios.

## Documentación de referencia

- [GitHub: agregar código local a un repositorio](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).
- [Vite: publicación en GitHub Pages](https://vite.dev/guide/static-deploy#github-pages).
- [GitHub: publicación automática de un sitio](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically).
