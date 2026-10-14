export function formatPrice(value) {
  const safeValue = Number(value ?? 0);
  return `${safeValue.toLocaleString('en-US')} IQD`;
}

export function getDiscountPercent(product) {
  if (!product?.originalPrice || product.originalPrice <= product.price) {
    return 0;
  }

  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}
