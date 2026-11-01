# Mercado Verde — Gestión de inventario

Actividad formativa 2: «Implementando gestión de estado en componentes frontend con React». Proyecto académico de Desarrollo Frontend II. Sitio en español construido con HTML, CSS, JavaScript y React, con Vite como herramienta de desarrollo y Tailwind CSS para la interfaz del menú de artículos y el formulario.

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
- `src/data/products.js`: productos iniciales y categorías.
- `src/utils/inventory.js`: formato de precios y reglas de stock compartidas.

El botón «Ver productos por reponer» activa el filtro «Por reponer», que incluye stock bajo y agotado, y limpia la búsqueda y la categoría. Los filtros individuales siguen disponibles. Si falla el guardado en `localStorage`, los cambios permanecen en memoria y se muestra el aviso correspondiente al guardar o eliminar, sin reemplazarlo por un mensaje de éxito.

## Estado global y framework CSS

`InventoryProvider` envuelve el enrutador. Las páginas consumen `products`, `saveProduct` y `deleteProduct` mediante `useInventory`. El estado se mantiene al cambiar entre páginas, incluso cuando el navegador bloquea `localStorage`; al recargar se recuperan solo los cambios que pudieron persistirse. `useReducer` actualiza el inventario sin mutarlo y `useEffect` sincroniza los cambios con el almacenamiento local. Los mensajes se muestran fuera de las rutas para conservarlos después de navegar.

Los artículos anteriores que no tienen marca o tipo reciben «Sin marca» y su categoría como tipo. Los productos de demostración incluyen marcas ficticias. El filtro «Por reponer» incluye tanto stock bajo como agotado.

Tailwind CSS está instalado mediante `tailwindcss` y `@tailwindcss/vite`, con el plugin configurado en `vite.config.js`. El menú, los campos del formulario y la página de ingreso usan utilidades de distribución, espaciado, colores, bordes y adaptación a pantallas. Se importan las capas de tema y utilidades sin Preflight para conservar el diseño CSS de la actividad 1, siguiendo la [documentación oficial](https://tailwindcss.com/docs/preflight#disabling-preflight).

## Verificación de la actividad 2

```bash
npm test
npm run build
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
2. Usa, por ejemplo, `Exp1_S1_RaulZuniga` como nombre.
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
git remote add origin https://github.com/TU_USUARIO/Exp1_S1_RaulZuniga.git
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
https://TU_USUARIO.github.io/Exp1_S1_RaulZuniga/#/
https://TU_USUARIO.github.io/Exp1_S1_RaulZuniga/#/quienes-somos
https://TU_USUARIO.github.io/Exp1_S1_RaulZuniga/#/tiendas
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

## Documentación de referencia

- [GitHub: agregar código local a un repositorio](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).
- [Vite: publicación en GitHub Pages](https://vite.dev/guide/static-deploy#github-pages).
- [GitHub: publicación automática de un sitio](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically).
