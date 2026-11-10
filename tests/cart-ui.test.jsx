import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import { initialProducts } from "../src/data/products.js";
import { MESSAGES, STORAGE } from "../src/constants/inventory.js";

beforeEach(() => {
  localStorage.clear();
  window.location.hash = "#/articulos";
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
async function detail(user) {
  await user.click(screen.getByRole("link", { name: /Leche entera · 1 L/ }));
}
async function reserve(user, quantity) {
  await user.clear(screen.getByLabelText("Cantidad"));
  await user.type(screen.getByLabelText("Cantidad"), String(quantity));
  await user.click(screen.getByRole("button", { name: "Agregar al carrito" }));
}
async function openCart(user) {
  await user.click(screen.getByRole("link", { name: /🛒 Carrito/ }));
}

describe("S3: categoría, detalle y carrito", () => {
  it("filtra dinámicamente por categoría y recupera el listado completo", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filtrar por categoría" }),
      "Lácteos",
    );
    expect(screen.queryByText("Manzana roja")).toBeNull();
    expect(screen.getByText("Yogur natural")).toBeTruthy();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filtrar por categoría" }),
      "Todas las categorías",
    );
    expect(screen.getByText("Manzana roja")).toBeTruthy();
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(7);
    expect(localStorage.getItem(STORAGE.KEY)).toBeNull();
  });
  it("muestra detalle, reserva, aumenta, disminuye y restaura al quitar", async () => {
    const user = userEvent.setup();
    render(<App />);
    await detail(user);
    expect(screen.getByRole("heading", { name: "Leche entera · 1 L" })).toBeTruthy();
    expect(screen.getByTestId("detail-stock").textContent).toBe("12 unidades");
    await reserve(user, 2);
    expect(screen.getByTestId("detail-stock").textContent).toBe("10 unidades");
    await openCart(user);
    let line = screen.getByRole("article", { name: "Leche entera · 1 L" });
    expect(within(line).getByText("Stock disponible: 10")).toBeTruthy();
    await user.click(within(line).getByRole("button", { name: /Aumentar/ }));
    expect(within(line).getByText("Stock disponible: 9")).toBeTruthy();
    // Recargar la aplicación recupera el carrito junto a su stock disponible.
    cleanup();
    render(<App />);
    line = screen.getByRole("article", { name: "Leche entera · 1 L" });
    expect(within(line).getByLabelText("3 unidades")).toBeTruthy();
    expect(within(line).getByText("Stock disponible: 9")).toBeTruthy();
    await user.click(within(line).getByRole("button", { name: /Disminuir/ }));
    expect(within(line).getByText("Stock disponible: 10")).toBeTruthy();
    await user.click(within(line).getByRole("button", { name: /Quitar/ }));
    expect(screen.getByRole("heading", { name: "Tu carrito está vacío" })).toBeTruthy();
    const saved = JSON.parse(localStorage.getItem(STORAGE.KEY));
    expect(saved.products.find((p) => p.id === "2").stock).toBe(12);
    expect(saved.cart).toEqual([]);
  });
  it("impide agregar agotados y aumentar después de reservar la última unidad", async () => {
    localStorage.setItem(
      STORAGE.KEY,
      JSON.stringify({
        version: STORAGE.VERSION,
        products: initialProducts.map((p) => (p.id === "2" ? { ...p, stock: 1 } : p)),
        cart: [],
      }),
    );
    const user = userEvent.setup();
    render(<App />);
    await detail(user);
    await reserve(user, 1);
    expect(screen.getByRole("button", { name: "Producto agotado" }).disabled).toBe(true);
    await openCart(user);
    expect(screen.getByRole("button", { name: /Aumentar/ }).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Vaciar carrito" }));
    await user.click(screen.getByRole("link", { name: "Explorar artículos" }));
    await detail(user);
    expect(screen.getByTestId("detail-stock").textContent).toBe("1 unidad");
  });
  it("carrito e inventario continúan sincronizados con almacenamiento bloqueado", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Bloqueado");
    });
    const user = userEvent.setup();
    render(<App />);
    await detail(user);
    await reserve(user, 2);
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain(MESSAGES.STORAGE));
    await openCart(user);
    expect(screen.getByText("Stock disponible: 10")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /Disminuir/ }));
    expect(screen.getByText("Stock disponible: 11")).toBeTruthy();
  });
  it("maneja enlaces a artículos que ya no existen", () => {
    window.location.hash = "#/articulos/no-existe";
    render(<App />);
    expect(screen.getByRole("heading", { name: "Artículo no encontrado" })).toBeTruthy();
  });
});
