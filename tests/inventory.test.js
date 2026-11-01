import test from "node:test";
import assert from "node:assert/strict";
import { inventoryReducer } from "../src/context/inventoryReducer.js";
import { initialProducts } from "../src/data/products.js";
import { loadProducts, persistProducts, STORAGE_WARNING } from "../src/utils/productStorage.js";
import { productFromForm } from "../src/utils/productForm.js";
import { needsRestock, matchesStatus } from "../src/utils/inventory.js";

const form = (overrides = {}) => new Map(Object.entries({
  name: " Arroz integral ", brand: " Marca demo ", type: " Arroz ",
  category: "Abarrotes", stock: "7", minimum: "10", price: "1500", ...overrides,
}));

test("agregar, editar y eliminar conserva un único inventario e información completa", () => {
  const original = { products: initialProducts, revision: 0, message: "" };
  const product = productFromForm(form());
  const added = inventoryReducer(original, { type: "save", product });
  assert.equal(added.products.length, 7);
  assert.equal(added.products.at(-1).brand, "Marca demo");
  assert.equal(added.products.at(-1).type, "Arroz");
  const edited = inventoryReducer(added, { type: "save", product: { ...product, stock: 22 } });
  assert.equal(edited.products.length, 7);
  assert.equal(edited.products.at(-1).stock, 22);
  const removed = inventoryReducer(edited, { type: "delete", id: product.id });
  assert.deepEqual(removed.products, initialProducts);
  assert.equal(original.products.length, 6);
});

test("validar campos obligatorios y números enteros no negativos", () => {
  for (const values of [{ name: " " }, { brand: " " }, { type: "" }, { stock: "-1" },
    { price: "NaN" }, { stock: "1.5" }, { minimum: "" }, { category: "Inválida" }]) {
    assert.throws(() => productFromForm(form(values)));
  }
  const previous = { id: 14, icon: "🍚" };
  assert.equal(productFromForm(form(), previous).id, 14);
  assert.equal(productFromForm(form(), previous).icon, "🍚");
});

test("reposiciones incluyen agotados y productos en el mínimo", () => {
  assert.deepEqual(initialProducts.filter((p) => matchesStatus(p, "Por reponer")), initialProducts.filter(needsRestock));
  assert.equal(initialProducts.filter(needsRestock).length, 3);
  assert.equal(matchesStatus({ stock: 0, minimum: 0 }, "Por reponer"), true);
  assert.equal(matchesStatus({ stock: 4, minimum: 4 }, "Stock bajo"), true);
});

test("recuperar almacenamiento anterior, vacío o inválido", () => {
  const legacy = initialProducts.map(({ brand, type, ...product }) => product);
  globalThis.localStorage = { getItem: () => JSON.stringify(legacy) };
  assert.equal(loadProducts()[0].brand, "Sin marca");
  assert.equal(loadProducts()[0].type, legacy[0].category);
  globalThis.localStorage = { getItem: () => "[]" };
  assert.deepEqual(loadProducts(), []);
  globalThis.localStorage = { getItem: () => "no es JSON" };
  assert.deepEqual(loadProducts(), initialProducts);
});

test("persistencia permitida y bloqueada, con cambios y aviso conservados", () => {
  let stored;
  globalThis.localStorage = { setItem: (key, value) => { stored = value; } };
  assert.equal(persistProducts(initialProducts), true);
  assert.deepEqual(JSON.parse(stored), initialProducts);
  globalThis.localStorage = {
    getItem() { throw new Error("Bloqueado"); },
    setItem() { throw new Error("Bloqueado"); },
  };
  assert.deepEqual(loadProducts(), initialProducts);
  assert.equal(persistProducts(initialProducts), false);
  const edited = inventoryReducer({ products: initialProducts, revision: 0, message: "" }, {
    type: "save", product: { ...initialProducts[0], stock: 6 },
  });
  const warned = inventoryReducer(edited, { type: "message", message: STORAGE_WARNING });
  assert.equal(warned.products[0].stock, 6);
  assert.equal(warned.message, STORAGE_WARNING);
  const dismissed = inventoryReducer(warned, { type: "message", message: "" });
  assert.equal(dismissed.revision, warned.revision);
  delete globalThis.localStorage;
});
