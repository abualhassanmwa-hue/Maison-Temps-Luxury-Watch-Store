import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Globe2, Heart, Search, ShoppingBag } from 'lucide-react';
import { CartDrawer } from './CartDrawer.jsx';
import { filterProducts } from '../utils/productUtils.js';
import { useStorefront } from '../context/useStorefront.js';
import { useTranslation } from '../i18n/useTranslation.js';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Watches' },
  { to: '/new-arrivals', label: 'New Arrivals' },
  { to: '/featured-watches', label: 'Featured Watches' },
  { to: '/offers', label: 'Offers' }
];

const homeBackgroundImage = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=2200&q=85';

export function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { setLanguage, cartCount, wishlistCount } = useStorefront();
  const { language, t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const closeCartDrawer = useCallback(() => setCartDrawerOpen(false), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return filterProducts({ search: query.trim() }).slice(0, 3);
  }, [query]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    setSearchOpen(false);
    if (!trimmed) return;
    navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    document.body.classList.add('mobile-nav-open');
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    const handlePointerDown = (event) => {
      if (event.target.closest('.main-nav, .mobile-menu-toggle')) return;
      setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.body.classList.remove('mobile-nav-open');
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {isHomePage && (
        <div
          className="home-background-layer"
          aria-hidden="true"
          style={{ backgroundImage: `url("${homeBackgroundImage}")` }}
        />
      )}
      <div className={isHomePage ? 'home-page-layer' : undefined}>
        <div className="announcement" aria-label={t('Store announcement')}>
          <span lang={language} dir="auto">{t('COMPLIMENTARY DELIVERY ON ELIGIBLE ORDERS')}</span>
          <span className="announcement-dot">◆</span>
          <span lang={language} dir="auto">{t('TIMELESS DESIGN. CONSIDERED DETAILS.')}</span>
        </div>

        <header className="site-header">
          <button
            className="icon-button mobile-menu-toggle"
            type="button"
            aria-label={t(mobileMenuOpen ? 'Close navigation' : 'Open navigation')}
            aria-controls="main-navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <Link to="/" className="brand" aria-label="Maison Temps home">
            <span className="brand-mark">
              M<span>T</span>
            </span>
            <span className="brand-name">
              MAISON <b>TEMPS</b>
              <small>THE ART OF TIME</small>
            </span>
          </Link>

          <nav id="main-navigation" className={`main-nav${mobileMenuOpen ? ' is-open' : ''}`} aria-label={t('Main navigation')}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive || (item.to === '/shop' && location.pathname === '/shop') ? 'nav-link active' : 'nav-link')}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span lang={language} dir="auto">{t(item.label)}</span>
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <label className="language-control" aria-label={t('Language selector')}>
              <span className="sr-only">{t('Language')}</span>
              <Globe2 size={14} aria-hidden="true" />
              <select value={language} onChange={handleLanguageChange} aria-label={t('Language')}>
                <option value="en">EN</option>
                <option value="ar">العربية</option>
              </select>
            </label>

            <button className="icon-button" type="button" aria-label={t('Search the collection')} onClick={() => setSearchOpen((open) => !open)}>
              <Search size={20} strokeWidth={1.8} aria-hidden="true" />
            </button>

            <Link to="/wishlist" className="icon-button" aria-label={t('Wishlist')}>
              <Heart size={20} strokeWidth={1.8} aria-hidden="true" />
              {wishlistCount > 0 && <span className="count-badge">{wishlistCount}</span>}
            </Link>

            <button
              type="button"
              className="icon-button bag-button"
              aria-label={t('View cart')}
              aria-haspopup="dialog"
              aria-controls="cart-drawer"
              aria-expanded={cartDrawerOpen}
              onClick={() => {
                setMobileMenuOpen(false);
                setCartDrawerOpen(true);
              }}
            >
              <ShoppingBag size={20} strokeWidth={1.8} aria-hidden="true" />
              {cartCount > 0 && <span className="count-badge">{cartCount}</span>}
            </button>
          </div>
        </header>

        {mobileMenuOpen && (
          <button
            className="mobile-menu-backdrop"
            type="button"
            aria-label={t('Close navigation')}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <CartDrawer open={cartDrawerOpen} onClose={closeCartDrawer} />

        <section className={`search-panel ${searchOpen ? 'is-open' : ''}`} hidden={!searchOpen} aria-live="polite">
          <form className="search-form" onSubmit={handleSubmit}>
            <label htmlFor="store-search" className="sr-only">
              {t('Search the collection')}
            </label>
            <input
              id="store-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('Search watches, brands, movement…')}
              autoComplete="off"
            />
            <button className="button button-dark" type="submit">
              {t('Search')}
            </button>
            <button className="icon-button" type="button" aria-label={t('Close search')} onClick={() => setSearchOpen(false)}>
              ×
            </button>
          </form>

          {query.trim() && (
            <div className="search-results">
              {results.length ? (
                results.map((product) => (
                  <Link key={product.id} to={`/products/${product.slug}`} className="search-result" onClick={() => setSearchOpen(false)}>
                    <img src={product.image} alt={product.name} />
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.brand}</small>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="search-result empty-search-result" lang={language} dir="auto">{t('No matching watches found.')}</div>
              )}
            </div>
          )}
        </section>

        <div>{children}</div>

        <footer className="site-footer section-container">
          <div>
            <span className="brand-mark brand-mark-small">M<span>T</span></span>
            <p lang={language} dir="auto">{t('Designed for quiet luxury and everyday precision.')}</p>
          </div>
          <div>
            <strong lang={language} dir="auto">{t('Explore')}</strong>
            <ul>
              <li><Link to="/shop" lang={language} dir="auto">{t('Shop collection')}</Link></li>
              <li><Link to="/cart" lang={language} dir="auto">{t('Bag')}</Link></li>
              <li><Link to="/wishlist" lang={language} dir="auto">{t('Wishlist')}</Link></li>
            </ul>
          </div>
        </footer>
      </div>
    </>
  );
}
