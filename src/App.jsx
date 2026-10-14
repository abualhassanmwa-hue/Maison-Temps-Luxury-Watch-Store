import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { StorefrontProvider } from './context/StorefrontContext.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ShopPage } from './pages/ShopPage.jsx';
import { ProductPage } from './pages/ProductPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { WishlistPage } from './pages/WishlistPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <StorefrontProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/new-arrivals" element={<ShopPage />} />
            <Route path="/featured-watches" element={<ShopPage />} />
            <Route path="/best-sellers" element={<ShopPage />} />
            <Route path="/offers" element={<ShopPage />} />
            <Route path="/collections/:slug" element={<ShopPage />} />
            <Route path="/categories/:slug" element={<ShopPage />} />
            <Route path="/brands/:slug" element={<ShopPage />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </StorefrontProvider>
    </BrowserRouter>
  );
}
