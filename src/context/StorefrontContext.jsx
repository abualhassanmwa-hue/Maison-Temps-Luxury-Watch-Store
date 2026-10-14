import { useEffect, useMemo, useRef, useState } from 'react';
import { StorefrontContext } from './storefront-context.js';
import { products } from '../data/products.js';

const STORAGE_KEYS = {
  cart: 'mt_cart_v1',
  wishlist: 'mt_wishlist_v1',
  language: 'mt_language_v1'
};

function normalizeLanguage(value) {
  return value === 'ar' ? 'ar' : 'en';
}

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeCartValue(value) {
  if (!Array.isArray(value)) return [];

  const quantities = new Map();
  value.forEach((item) => {
    if (!item || typeof item !== 'object') return;
    const product = products.find((entry) => entry.id === item.id);
    const quantity = Math.floor(Number(item.quantity));
    if (!product || !Number.isFinite(quantity) || quantity < 1 || !product.stockQuantity || product.availability === 'out-of-stock') return;
    quantities.set(product.id, (quantities.get(product.id) ?? 0) + quantity);
  });

  return [...quantities].flatMap(([id, quantity]) => {
    const product = products.find((entry) => entry.id === id);
    return product ? [{ id, quantity: Math.min(quantity, product.stockQuantity) }] : [];
  });
}

function safeWishlistValue(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((id) => typeof id === 'string' && products.some((product) => product.id === id));
}

export function StorefrontProvider({ children }) {
  const [language, setLanguageState] = useState(() => normalizeLanguage(readStorage(STORAGE_KEYS.language, 'en')));
  const [cartItems, setCartItems] = useState(() => safeCartValue(readStorage(STORAGE_KEYS.cart, [])));
  const cartItemsRef = useRef(cartItems);
  const [wishlist, setWishlist] = useState(() => safeWishlistValue(readStorage(STORAGE_KEYS.wishlist, [])));

  const setLanguage = (value) => setLanguageState(normalizeLanguage(value));

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
    window.localStorage.setItem(STORAGE_KEYS.language, JSON.stringify(language));
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity = 1) => {
    const catalogProduct = products.find((entry) => entry.id === product?.id);
    const safeQuantity = Math.floor(Number(quantity));
    if (!catalogProduct || !Number.isFinite(safeQuantity) || safeQuantity < 1 || !catalogProduct.stockQuantity || catalogProduct.availability === 'out-of-stock') return 0;

    const currentItems = cartItemsRef.current;
    const existingQuantity = currentItems.find((item) => item.id === catalogProduct.id)?.quantity ?? 0;
    const availableQuantity = Math.max(0, catalogProduct.stockQuantity - existingQuantity);
    if (safeQuantity > availableQuantity) return 0;

    const existing = currentItems.find((item) => item.id === catalogProduct.id);
    const nextItems = existing
      ? currentItems.map((item) => (item.id === catalogProduct.id ? { ...item, quantity: item.quantity + safeQuantity } : item))
      : [...currentItems, { id: catalogProduct.id, quantity: safeQuantity }];
    cartItemsRef.current = nextItems;
    setCartItems(nextItems);
    return safeQuantity;
  };

  const updateCartQuantity = (productId, delta) => {
    const currentItems = cartItemsRef.current;
    const nextItems = currentItems
      .map((item) => {
        if (item.id !== productId) return item;
        const product = products.find((entry) => entry.id === productId);
        const currentQty = item.quantity + Math.trunc(Number(delta) || 0);
        const max = product?.stockQuantity ?? item.quantity;
        return { ...item, quantity: Math.max(1, Math.min(currentQty, max)) };
      })
      .filter((item) => item.quantity > 0);
    cartItemsRef.current = nextItems;
    setCartItems(nextItems);
  };

  const removeFromCart = (productId) => {
    const nextItems = cartItemsRef.current.filter((item) => item.id !== productId);
    cartItemsRef.current = nextItems;
    setCartItems(nextItems);
  };

  const toggleWishlist = (productId) => {
    setWishlist((current) => (current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]));
  };

  const cartItemsDetailed = useMemo(
    () =>
      cartItems.map((item) => {
        const product = products.find((entry) => entry.id === item.id);
        return product ? { ...product, quantity: item.quantity } : null;
      }).filter(Boolean),
    [cartItems]
  );

  const subtotal = cartItemsDetailed.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    language,
    setLanguage,
    cartItems,
    cartItemsDetailed,
    wishlist,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    subtotal,
    cartCount: cartItems.reduce((count, item) => count + item.quantity, 0),
    wishlistCount: wishlist.length
  };

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
}
