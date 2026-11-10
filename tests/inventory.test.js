import test from "node:test";
import assert from "node:assert/strict";
import { inventoryReducer } from "../src/context/inventoryReducer.js";
import { initialProducts } from "../src/data/products.js";
import { loadInventory, persistProducts } from "../src/utils/productStorage.js";
import { productFromForm } from "../src/utils/productForm.js";
import { isValidInventory } from "../src/utils/productValidation.js";
import { filterProducts, needsRestock } from "../src/utils/inventory.js";
import { ACTIONS, DEFAULT_FILTERS, MESSAGES, STATUS, STORAGE } from "../src/constants/inventory.js";

const form = (overrides = {}) =>
  new Map(
    Object.entries({
      name: " Arroz integral ",
      brand: " Marca demo ",
      type: " Arroz ",
      category: "Abarrotes",
      stock: "7",
      minimum: "10",
      price: "1500",
      ...overrides,
    }),
  );
const initial = () => ({ products: initialProducts, revision: 0, message: "", canPersist: true });
function stored(value) {
  globalThis.localStorage = { getItem: () => JSON.stringify(value) };
}
test.afterEach(() => {
  delete globalThis.localStorage;
});

test("agregar, editar y eliminar sin mutar la lista anterior", () => {
  const original = initial();
  const product = productFromForm(form());
  const added = inventoryReducer(original, { type: ACTIONS.ADD, product });
  assert.equal(added.products.length, 7);
  assert.equal(added.products.at(-1).brand, "Marca demo");
  const edited = inventoryReducer(added, {
    type: ACTIONS.UPDATE,
    product: { ...product, stock: 22 },
  });
  assert.equal(edited.products.length, 7);
  assert.equal(edited.products.at(-1).stock, 22);
  assert.deepEqual(
    inventoryReducer(edited, { type: ACTIONS.DELETE, id: product.id }).products,
    initialProducts,
  );
  assert.equal(original.products.length, 6);
});
test("una colisión de ID no sobrescribe un producto; editar no crea uno nuevo", () => {
  const state = initial();
  const duplicate = inventoryReducer(state, {
    type: ACTIONS.ADD,
    product: { ...initialProducts[0], name: "Otro" },
  });
  assert.equal(duplicate.products, state.products);
  assert.equal(duplicate.message, MESSAGES.DUPLICATE);
  assert.equal(duplicate.revision, 0);
  assert.equal(
    inventoryReducer(state, { type: ACTIONS.UPDATE, product: productFromForm(form()) }).products,
    state.products,
  );
});
test("UUID distintos aunque se registren productos en el mismo milisegundo", () => {
  const now = Date.now;
  Date.now = () => 1;
  try {
    const ids = Array.from({ length: 1000 }, () => productFromForm(form()).id);
    assert.equal(new Set(ids).size, ids.length);
    assert.match(ids[0], /^[0-9a-f]{8}-[0-9a-f-]{27}$/);
  } finally {
    Date.now = now;
  }
  assert.equal(productFromForm(form(), initialProducts[0]).id, initialProducts[0].id);
});
test("mensajes específicos por campo, límites y entradas numéricas inválidas", () => {
  for (const [field, value] of Object.entries({
    name: " ",
    brand: " ",
    type: "",
    stock: "-1",
    price: "1e3",
    minimum: "",
  })) {
    assert.throws(
      () => productFromForm(form({ [field]: value })),
      (error) => Boolean(error.errors[field]),
    );
  }
  for (const value of ["1.5", "NaN", "Infinity", "9007199254740992", null]) {
    assert.throws(() => productFromForm(form({ stock: value })));
  }
  assert.throws(
    () => productFromForm(form({ brand: "a".repeat(61), category: "No existe" })),
    (error) => Boolean(error.errors.brand && error.errors.category),
  );
  assert.equal(productFromForm(form({ stock: "0" })).stock, 0);
});
test("filtros combinados y reposición incluyendo agotados", () => {
  assert.deepEqual(
    filterProducts(initialProducts, { ...DEFAULT_FILTERS, status: STATUS.RESTOCK }),
    initialProducts.filter(needsRestock),
  );
  assert.equal(
    filterProducts(initialProducts, {
      ...DEFAULT_FILTERS,
      search: "  VALLE  ",
      category: "Lácteos",
    }).length,
    2,
  );
  assert.equal(
    filterProducts(initialProducts, { ...DEFAULT_FILTERS, status: STATUS.LOW }).length,
    2,
  );
});
test("migración del arreglo anterior y lectura del formato versionado", () => {
  const legacy = initialProducts.map(({ brand: _brand, type: _type, ...p }) => ({
    ...p,
    id: Number(p.id),
  }));
  stored(legacy);
  assert.equal(loadInventory().products[0].id, "1");
  assert.equal(loadInventory().products[0].brand, "Sin marca");
  assert.equal(loadInventory().products[0].type, legacy[0].category);
  stored({ version: STORAGE.VERSION, products: initialProducts, cart: [] });
  assert.deepEqual(loadInventory().products, initialProducts);
  stored({ version: STORAGE.VERSION, products: [], cart: [] });
  assert.deepEqual(loadInventory().products, []);
});
test("rechaza inventarios incompletos, IDs duplicados y tipos incorrectos", () => {
  for (const products of [
    [null],
    [{ ...initialProducts[0], stock: 1.5 }],
    [{ ...initialProducts[0], stock: "2" }],
    [{ ...initialProducts[0], brand: "" }],
    [{ ...initialProducts[0], icon: {} }],
    [initialProducts[0], initialProducts[0]],
    [{ ...initialProducts[0], id: "" }],
  ]) {
    assert.equal(isValidInventory(products), false);
    stored({ version: STORAGE.VERSION, products });
    assert.equal(loadInventory().message, MESSAGES.INVALID_STORAGE);
  }
});
test("versiones futuras se preservan sin habilitar escrituras", () => {
  stored({ version: STORAGE.VERSION + 1, products: initialProducts });
  assert.equal(loadInventory().canPersist, false);
  assert.equal(loadInventory().message, MESSAGES.FUTURE_STORAGE);
});
test("guarda sobre versionado y rechaza datos inválidos antes de escribir", () => {
  let value;
  globalThis.localStorage = {
    setItem: (key, next) => {
      assert.equal(key, STORAGE.KEY);
      value = next;
    },
  };
  assert.equal(persistProducts(initialProducts), true);
  assert.deepEqual(JSON.parse(value), {
    version: STORAGE.VERSION,
    products: initialProducts,
    cart: [],
  });
  value = undefined;
  assert.equal(persistProducts([{}]), false);
  assert.equal(value, undefined);
});
test("maneja JSON corrupto y acceso bloqueado sin perder los cambios en memoria", () => {
  globalThis.localStorage = { getItem: () => "{ roto" };
  assert.equal(loadInventory().message, MESSAGES.INVALID_STORAGE);
  globalThis.localStorage = {
    getItem() {
      throw new Error("Bloqueado");
    },
    setItem() {
      throw new Error("Bloqueado");
    },
  };
  assert.equal(loadInventory().message, MESSAGES.STORAGE);
  assert.equal(persistProducts(initialProducts), false);
  const edited = inventoryReducer(initial(), {
    type: ACTIONS.UPDATE,
    product: { ...initialProducts[0], stock: 6 },
  });
  const warned = inventoryReducer(edited, { type: ACTIONS.MESSAGE, message: MESSAGES.STORAGE });
  assert.equal(warned.products[0].stock, 6);
  assert.equal(warned.message, MESSAGES.STORAGE);
});
