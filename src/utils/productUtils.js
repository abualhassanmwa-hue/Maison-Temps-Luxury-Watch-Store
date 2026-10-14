import { products } from '../data/products.js';

export function getStockStatus(product, t = (key) => key) {
  const stockCount = Math.max(0, Math.floor(Number(product?.stockQuantity) || 0));
  const available = product?.availability !== 'out-of-stock' && stockCount > 0;

  return {
    available,
    stockCount,
    label: !available ? t('Out of stock') : stockCount <= 3 ? t('Only {count} left', { count: stockCount }) : t('In stock')
  };
}

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id) {
  return products.find((product) => product.id === id);
}

export function filterProducts({
  search = '',
  brand = '',
  category = '',
  movement = '',
  collection = '',
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  inStockOnly = false,
  sortBy = 'featured',
  featuredOnly = false,
  newArrivalsOnly = false,
  offersOnly = false,
  bestSellersOnly = false
} = {}) {
  let filtered = [...products];

  const query = search.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((product) => {
      const haystack = [product.brand, product.name, product.movement, product.caseMaterial, product.dialColor, product.category, ...(product.collections ?? [])].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }

  if (brand) {
    filtered = filtered.filter((product) => product.brand === brand);
  }

  if (category) {
    filtered = filtered.filter((product) => product.category === category);
  }

  if (movement) {
    filtered = filtered.filter((product) => product.movement === movement);
  }

  if (collection) {
    filtered = filtered.filter((product) => (product.collections ?? []).includes(collection));
  }

  if (featuredOnly) {
    filtered = filtered.filter((product) => product.featured === true);
  }

  if (newArrivalsOnly) {
    filtered = filtered.filter((product) => product.newArrival === true);
  }

  if (offersOnly) {
    filtered = filtered.filter((product) => {
      const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
      return product.onSale === true && hasDiscount;
    });
  }

  if (bestSellersOnly) {
    filtered = filtered.filter((product) => product.bestSeller === true);
  }

  if (minPrice > 0 || maxPrice < Number.MAX_SAFE_INTEGER) {
    filtered = filtered.filter((product) => product.price >= minPrice && product.price <= maxPrice);
  }

  if (inStockOnly) {
    filtered = filtered.filter((product) => product.availability === 'in-stock' && product.stockQuantity > 0);
  }

  const sorted = [...filtered];
  switch (sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      sorted.sort((a, b) => Number(b.newArrival) - Number(a.newArrival) || b.price - a.price);
      break;
    case 'best-sellers':
      sorted.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || Number(b.featured) - Number(a.featured));
      break;
    case 'featured':
    default:
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller) || b.price - a.price);
      break;
  }

  return sorted;
}

export function buildRelatedProducts(product, limit = 3) {
  if (!product) return [];

  return products
    .filter((entry) => entry.id !== product.id && (entry.category === product.category || entry.movement === product.movement || entry.collections.some((collection) => product.collections.includes(collection))))
    .slice(0, limit);
}

export function getBrandOptions() {
  return [...new Set(products.map((product) => product.brand))].sort();
}

export function getMovementOptions() {
  return [...new Set(products.map((product) => product.movement))].sort();
}

export function getCollectionOptions() {
  const collections = new Set();
  products.forEach((product) => (product.collections ?? []).forEach((collection) => collections.add(collection)));
  return [...collections].sort();
}
