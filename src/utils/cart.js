// S3: una línea por producto; stock disponible más unidades reservadas debe ser seguro.
export function isValidCart(cart, products) {
  if (!Array.isArray(cart)) return false;
  const seen = new Set();
  return cart.every((line) => {
    if (
      !line ||
      typeof line !== "object" ||
      typeof line.productId !== "string" ||
      !Number.isSafeInteger(line.quantity) ||
      line.quantity <= 0 ||
      seen.has(line.productId)
    )
      return false;
    seen.add(line.productId);
    const product = products.find((p) => p.id === line.productId);
    return Boolean(product && Number.isSafeInteger(product.stock + line.quantity));
  });
}
export function cartLines(cart, products) {
  return cart.map((line) => ({ ...line, product: products.find((p) => p.id === line.productId) }));
}
export const cartUnits = (cart) => cart.reduce((sum, line) => sum + line.quantity, 0);
