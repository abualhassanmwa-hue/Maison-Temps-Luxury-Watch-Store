import { products } from '../data/products.js';

export async function getProducts() {
  return products;
}

export async function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getCategories() {
  return ['men', 'women'];
}
