# MAISON TEMPS — React + Vite + Tailwind CSS

This package runs the Maison Temps storefront as a React application while retaining its supplied visual styling.

## Requirements
- Node.js 20.19+ or 22.12+ (recommended for the supplied Vite 8 setup)
- npm

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Architecture
- `src/main.jsx` mounts `src/App.jsx`, which renders the React Router application.
- Shared cart, wishlist, and language state lives in `src/context/StorefrontContext.jsx`.
- Catalog records are local demo data in `src/data/products.js`; cart, wishlist, and language preferences persist in browser `localStorage`.
- `src/legacy/storefront.html` and `public/storefront.js` are retained reference artifacts and are not loaded by the active Vite entrypoint.
- There is no connected order API, database, inventory service, or payment provider. Checkout is a review-only preview.

## Existing demo features
- Product collections, filters, search suggestions, and sorting
- Product detail gallery, specifications, and related products
- Shared cart drawer and cart page with local persistence
- Wishlist with local persistence
- English/Arabic language switch
- Checkout review preview (no order or payment is submitted)
