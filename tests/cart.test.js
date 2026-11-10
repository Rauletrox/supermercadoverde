import test from "node:test";
import assert from "node:assert/strict";
import { inventoryReducer } from "../src/context/inventoryReducer.js";
import { ACTIONS, MESSAGES, STORAGE, DEFAULT_FILTERS } from "../src/constants/inventory.js";
import { initialProducts } from "../src/data/products.js";
import { isValidCart } from "../src/utils/cart.js";
import { loadInventory, persistProducts } from "../src/utils/productStorage.js";
import { filterProducts } from "../src/utils/inventory.js";

const initial = () => ({
  products: initialProducts,
  cart: [],
  revision: 0,
  canPersist: true,
  message: "",
});
const apply = (state, type, id = "2", quantity) => inventoryReducer(state, { type, id, quantity });
const stock = (state, id = "2") => state.products.find((p) => p.id === id).stock;
test.afterEach(() => {
  delete globalThis.localStorage;
});

test("reservar, aumentar, disminuir y quitar conserva stock disponible más reservado", () => {
  const original = initial();
  let state = apply(original, ACTIONS.CART_ADD, "2", 2);
  assert.equal(stock(state), 10);
  state = apply(state, ACTIONS.CART_ADD, "2", 3);
  assert.deepEqual(state.cart, [{ productId: "2", quantity: 5 }]);
  assert.equal(stock(state), 7);
  state = apply(state, ACTIONS.CART_SET, "2", 7);
  assert.equal(stock(state), 5);
  state = apply(state, ACTIONS.CART_SET, "2", 1);
  assert.equal(stock(state), 11);
  state = apply(state, ACTIONS.CART_SET, "2", 0);
  assert.equal(stock(state), 12);
  assert.deepEqual(state.cart, []);
  assert.equal(stock(original), 12);
  assert.equal(original.cart.length, 0);
});
test("sin stock, cantidades inválidas y acciones consecutivas no producen sobreventa", () => {
  for (const quantity of [-1, 0, 1.5, NaN, Infinity, "2", Number.MAX_SAFE_INTEGER + 1]) {
    const original = initial();
    const result = apply(original, ACTIONS.CART_ADD, "2", quantity);
    assert.equal(result.products, original.products);
    assert.equal(result.cart, original.cart);
  }
  let state = apply(initial(), ACTIONS.CART_ADD, "2", 12);
  assert.equal(stock(state), 0);
  const failed = apply(state, ACTIONS.CART_ADD, "2", 1);
  assert.equal(failed.message, MESSAGES.CART_STOCK);
  assert.equal(failed.products, state.products);
  assert.equal(failed.cart, state.cart);
  assert.equal(apply(initial(), ACTIONS.CART_ADD, "6", 1).message, MESSAGES.CART_STOCK);
  state = apply(state, ACTIONS.CART_REMOVE, "2");
  assert.equal(stock(state), 12);
});
test("vaciar devuelve las reservas de todos los productos una sola vez", () => {
  let state = apply(initial(), ACTIONS.CART_ADD, "2", 2);
  state = apply(state, ACTIONS.CART_ADD, "1", 3);
  state = apply(state, ACTIONS.CART_CLEAR);
  assert.deepEqual(state.products, initialProducts);
  assert.deepEqual(state.cart, []);
  assert.equal(apply(state, ACTIONS.CART_CLEAR), state);
});
test("no permite eliminar un producto reservado ni desbordar la cantidad al editar", () => {
  const state = apply(initial(), ACTIONS.CART_ADD, "2", 2);
  const deleted = apply(state, ACTIONS.DELETE, "2");
  assert.equal(deleted.message, MESSAGES.CART_DELETE);
  assert.equal(deleted.products, state.products);
  const edited = inventoryReducer(state, {
    type: ACTIONS.UPDATE,
    product: { ...state.products[1], stock: Number.MAX_SAFE_INTEGER },
  });
  assert.equal(edited.message, MESSAGES.CART_LIMIT);
  assert.equal(edited.products, state.products);
  const removed = apply(state, ACTIONS.CART_REMOVE, "2");
  assert.equal(
    apply(removed, ACTIONS.DELETE, "2").products.some((p) => p.id === "2"),
    false,
  );
});
test("filtrar por categoría conserva el inventario y el carrito originales", () => {
  const state = apply(initial(), ACTIONS.CART_ADD, "2", 2);
  const snapshot = structuredClone(state);
  const filtered = filterProducts(state.products, { ...DEFAULT_FILTERS, category: "Lácteos" });
  assert.equal(filtered.length, 2);
  assert.deepEqual(state, snapshot);
  assert.equal(filterProducts(state.products).length, 6);
});
test("persistencia conjunta recupera reservas y stock sin descontarlo nuevamente", () => {
  const state = apply(initial(), ACTIONS.CART_ADD, "2", 3);
  let saved;
  globalThis.localStorage = {
    setItem: (_key, value) => {
      saved = value;
    },
    getItem: () => saved,
  };
  assert.equal(persistProducts(state.products, state.cart), true);
  const recovered = loadInventory();
  assert.equal(stock(recovered), 9);
  assert.deepEqual(recovered.cart, state.cart);
  assert.equal(stock(apply({ ...recovered, revision: 0 }, ACTIONS.CART_REMOVE, "2")), 12);
  saved = JSON.stringify({ version: 1, products: initialProducts });
  assert.deepEqual(loadInventory().cart, []);
  assert.deepEqual(loadInventory().products, initialProducts);
});
test("rechaza carritos huérfanos, duplicados, incompletos y cantidades incoherentes", () => {
  for (const cart of [
    null,
    {},
    [null],
    [{ productId: "no-existe", quantity: 1 }],
    [{ productId: "2", quantity: 0 }],
    [{ productId: "2", quantity: 1.5 }],
    [
      { productId: "2", quantity: 1 },
      { productId: "2", quantity: 1 },
    ],
    [{ productId: "2", quantity: Number.MAX_SAFE_INTEGER }],
  ]) {
    assert.equal(isValidCart(cart, initialProducts), false);
    globalThis.localStorage = {
      getItem: () => JSON.stringify({ version: STORAGE.VERSION, products: initialProducts, cart }),
    };
    assert.equal(loadInventory().message, MESSAGES.INVALID_STORAGE);
  }
});
