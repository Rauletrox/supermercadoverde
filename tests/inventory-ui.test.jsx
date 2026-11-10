import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import {
  InventoryProvider,
  useInventoryActions,
  useInventoryMessage,
  useProducts,
} from "../src/context/InventoryContext";
import { initialProducts } from "../src/data/products.js";
import { MESSAGES, STORAGE } from "../src/constants/inventory.js";

beforeEach(() => {
  localStorage.clear();
  window.location.hash = "#/";
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
async function openNew(user) {
  await user.click(
    within(screen.getByRole("navigation", { name: "Gestión de artículos" })).getByRole("link", {
      name: /Ingresar artículo/,
    }),
  );
}
async function fillProduct(user, name = "Galletas de avena") {
  await user.type(screen.getByLabelText("Nombre del producto"), name);
  await user.type(screen.getByLabelText("Marca"), "Marca prueba");
  await user.type(screen.getByLabelText("Tipo de producto"), "Galletas");
}

describe("navegación, formularios compartidos y contexto", () => {
  it("muestra errores por campo, agrega, conserva al navegar, edita y elimina", async () => {
    const user = userEvent.setup();
    render(<App />);
    await openNew(user);
    await user.click(screen.getByRole("button", { name: "Agregar al inventario" }));
    expect(screen.getByText("Ingresa el nombre del producto.")).toBeTruthy();
    expect(screen.getByText("Ingresa la marca del producto.")).toBeTruthy();
    expect(screen.getByText("Ingresa el tipo de producto.")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText("Nombre del producto"));
    await fillProduct(user);
    await user.click(screen.getByRole("button", { name: "Agregar al inventario" }));
    expect(
      await screen.findByRole("heading", { level: 1, name: /Listado de artículos/ }),
    ).toBeTruthy();
    expect(screen.getByText("Galletas de avena")).toBeTruthy();
    const stored = JSON.parse(localStorage.getItem(STORAGE.KEY));
    expect(stored.version).toBe(STORAGE.VERSION);
    expect(stored.products).toHaveLength(7);
    await user.click(screen.getByRole("link", { name: /Quiénes somos/ }));
    await user.click(screen.getByRole("link", { name: /Listado de artículos/ }));
    await user.click(screen.getByRole("button", { name: "Editar Galletas de avena" }));
    const dialog = screen.getByRole("dialog");
    await user.clear(within(dialog).getByLabelText("Marca"));
    await user.click(within(dialog).getByRole("button", { name: "Guardar producto" }));
    expect(within(dialog).getByText("Ingresa la marca del producto.")).toBeTruthy();
    await user.type(within(dialog).getByLabelText("Marca"), "Marca editada");
    await user.click(within(dialog).getByRole("button", { name: "Guardar producto" }));
    expect(screen.getByText("Marca editada")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Eliminar Galletas de avena" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Eliminar" }));
    expect(screen.queryByText("Galletas de avena")).toBeNull();
  });

  it("repone agotados y stock bajo, limpiando búsqueda y categoría", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByRole("textbox", { name: "Buscar producto" }), "Pan");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filtrar por categoría" }),
      "Panadería",
    );
    await user.click(screen.getByRole("button", { name: /Ver productos por reponer/ }));
    expect(screen.getByRole("textbox", { name: "Buscar producto" }).value).toBe("");
    expect(screen.getByText("Yogur natural")).toBeTruthy();
    expect(screen.getByText("Tomate")).toBeTruthy();
    expect(screen.getByText("Leche entera · 1 L")).toBeTruthy();
    expect(screen.queryByText("Pan integral")).toBeNull();
  });

  it("un fallo al guardar mantiene el aviso y los productos tras cambiar de ruta", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Bloqueado");
    });
    render(<App />);
    await openNew(user);
    await fillProduct(user);
    await user.click(screen.getByRole("button", { name: "Agregar al inventario" }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain(MESSAGES.STORAGE));
    await user.click(screen.getByRole("link", { name: /Quiénes somos/ }));
    await user.click(screen.getByRole("link", { name: /Listado de artículos/ }));
    expect(screen.getByText("Galletas de avena")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain(MESSAGES.STORAGE);
  });

  it("no sobrescribe almacenamiento de una versión futura", async () => {
    const saved = JSON.stringify({ version: STORAGE.VERSION + 1, products: initialProducts });
    localStorage.setItem(STORAGE.KEY, saved);
    const write = vi.spyOn(Storage.prototype, "setItem");
    const user = userEvent.setup();
    render(<App />);
    await openNew(user);
    await fillProduct(user);
    await user.click(screen.getByRole("button", { name: "Agregar al inventario" }));
    expect(screen.getByText("Galletas de avena")).toBeTruthy();
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(MESSAGES.FUTURE_STORAGE),
    );
    expect(write).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORAGE.KEY)).toBe(saved);
  });

  it("las acciones son estables y cerrar mensajes no vuelve a renderizar productos", async () => {
    let productRenders = 0;
    let actionRenders = 0;
    const references = [];
    function ProductsProbe() {
      const products = useProducts();
      productRenders++;
      return <span>{products.length} registrados</span>;
    }
    function ActionsProbe() {
      const actions = useInventoryActions();
      actionRenders++;
      references.push(actions);
      return (
        <button onClick={() => actions.updateProduct({ ...initialProducts[0], stock: 6 })}>
          Actualizar
        </button>
      );
    }
    function NotificationProbe() {
      const { message, dismissMessage } = useInventoryMessage();
      return <button onClick={dismissMessage}>Cerrar {message}</button>;
    }
    render(
      <InventoryProvider>
        <ProductsProbe />
        <ActionsProbe />
        <NotificationProbe />
      </InventoryProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));
    await waitFor(() => expect(screen.getByText(`Cerrar ${MESSAGES.UPDATED}`)).toBeTruthy());
    const afterUpdate = productRenders;
    fireEvent.click(screen.getByRole("button", { name: /^Cerrar/ }));
    expect(productRenders).toBe(afterUpdate);
    expect(actionRenders).toBe(1);
    expect(new Set(references).size).toBe(1);
  });
});
