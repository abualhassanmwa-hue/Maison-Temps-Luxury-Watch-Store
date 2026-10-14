import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PageHeading } from '../components/PageHeading.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { resolveCatalogPage } from '../data/catalog.js';
import { getBrandOptions, getMovementOptions, filterProducts } from '../utils/productUtils.js';
import { useTranslation } from '../i18n/useTranslation.js';

function updateSearchParam(searchParams, key, value) {
  const next = new URLSearchParams(searchParams);

  if (value && value !== 'all') {
    next.set(key, value);
  } else {
    next.delete(key);
  }

  return next.toString();
}

function getActiveFilters({ params, page, t }) {
  const active = [];

  if (params.get('brand')) active.push({ key: 'brand', label: `${t('Brand: ')}${params.get('brand')}`, value: params.get('brand') });
  if (params.get('category')) active.push({ key: 'category', label: `${t('Category: ')}${t(params.get('category'))}`, value: params.get('category') });
  if (params.get('movement')) active.push({ key: 'movement', label: `${t('Movement: ')}${params.get('movement')}`, value: params.get('movement') });
  if (params.get('collection')) active.push({ key: 'collection', label: `${t('Collection: ')}${t(params.get('collection'))}`, value: params.get('collection') });
  if (params.get('search')) active.push({ key: 'search', label: `${t('Search: ')}${params.get('search')}`, value: params.get('search') });
  if (page?.kind === 'newArrivals') active.push({ key: 'catalog', label: t('New Arrivals') });
  if (page?.kind === 'featured') active.push({ key: 'catalog', label: t('Featured Watches') });
  if (page?.kind === 'bestSellers') active.push({ key: 'catalog', label: t('Best Sellers') });
  if (page?.kind === 'offers') active.push({ key: 'catalog', label: t('Offers') });

  return active;
}

export function ShopPage() {
  const { language, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const pathname = location.pathname;

  const page = useMemo(() => {
    if (pathname === '/new-arrivals') return resolveCatalogPage({ kind: 'newArrivals' });
    if (pathname === '/featured-watches') return resolveCatalogPage({ kind: 'featured' });
    if (pathname === '/best-sellers') return resolveCatalogPage({ kind: 'bestSellers' });
    if (pathname === '/offers') return resolveCatalogPage({ kind: 'offers' });
    if (pathname.startsWith('/collections/')) return resolveCatalogPage({ kind: 'collection', slug: pathname.split('/').pop() });
    if (pathname.startsWith('/categories/')) return resolveCatalogPage({ kind: 'category', slug: pathname.split('/').pop() });
    if (pathname.startsWith('/brands/')) return resolveCatalogPage({ kind: 'brand', slug: pathname.split('/').pop() });
    return resolveCatalogPage({ kind: 'shop' });
  }, [pathname]);

  const filterState = {
    search: params.get('search') ?? '',
    brand: params.get('brand') ?? '',
    category: params.get('category') ?? '',
    movement: params.get('movement') ?? '',
    collection: params.get('collection') ?? page?.kind === 'collection' ? page.slug : '',
    sortBy: params.get('sort') ?? page?.defaultSort ?? 'featured',
    featuredOnly: page?.kind === 'featured' || params.get('featured') === '1',
    newArrivalsOnly: page?.kind === 'newArrivals' || params.get('new-arrivals') === '1',
    offersOnly: page?.kind === 'offers' || params.get('offers') === '1',
    bestSellersOnly: page?.kind === 'bestSellers' || params.get('best-sellers') === '1'
  };

  const visibleProducts = filterProducts(filterState);
  const brands = getBrandOptions();
  const movements = getMovementOptions();
  const activeFilters = getActiveFilters({ params, page, t });

  const handleChange = (key, value) => {
    const query = updateSearchParam(location.search, key, value);
    navigate({ pathname: location.pathname, search: query ? `?${query}` : '' });
  };

  const handleClearAll = () => {
    navigate({ pathname: location.pathname, search: '' });
  };

  const pageTitle = page?.title ?? 'The Collection';
  const pageDescription = page?.description ?? 'Explore Maison Temps watches with considered design, technical precision, and quietly luxurious character.';
  const pageBreadcrumbs = [
    { label: 'Home', to: '/' },
    ...(pageTitle === 'The Collection'
      ? [{ label: pageTitle }]
      : [{ label: 'Watches', to: '/shop' }, { label: pageTitle }])
  ];

  return (
    <main className="section-container page-shell">
      <PageHeading
        eyebrow="MAISON TEMPS"
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={pageBreadcrumbs}
      />

      <div className="shop-controls">
        <input
          type="search"
          value={filterState.search}
          onChange={(event) => handleChange('search', event.target.value)}
          placeholder={t('Search watches, brands or movements')}
          aria-label={t('Search watches')}
          lang={language}
          dir="auto"
        />

        <select value={filterState.brand} onChange={(event) => handleChange('brand', event.target.value)} aria-label={t('Filter by brand')}>
          <option value="">{t('All brands')}</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <select value={filterState.movement} onChange={(event) => handleChange('movement', event.target.value)} aria-label={t('Filter by movement')}>
          <option value="">{t('All movements')}</option>
          {movements.map((movement) => (
            <option key={movement} value={movement}>{movement}</option>
          ))}
        </select>

        <select value={filterState.sortBy} onChange={(event) => handleChange('sort', event.target.value)} aria-label={t('Sort products')}>
          <option value="featured">{t('Featured')}</option>
          <option value="best-sellers">{t('Best sellers')}</option>
          <option value="newest">{t('Newest')}</option>
          <option value="price-asc">{t('Price: low to high')}</option>
          <option value="price-desc">{t('Price: high to low')}</option>
          <option value="name">{t('Name A–Z')}</option>
        </select>
      </div>

      <div className="shop-results-meta">
        <span lang={language} dir="auto">{t('{count} watches', { count: visibleProducts.length })}</span>
        {activeFilters.length > 0 && (
          <div className="filter-chip-row">
            {activeFilters.map((chip) => (
              <button
                key={chip.key + chip.value + chip.label}
                type="button"
                className="filter-chip"
                onClick={() => chip.value ? handleChange(chip.key, '') : null}
              >
                <span lang={language} dir="auto">{chip.label}</span>
              </button>
            ))}
            <button type="button" className="text-link" onClick={handleClearAll} lang={language} dir="auto">{t('Clear all')}</button>
          </div>
        )}
      </div>

      {visibleProducts.length ? (
        <div className="product-grid product-grid-compact">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2 lang={language} dir="auto">{t('No watches match your current filters.')}</h2>
          <Link className="button button-dark" to="/shop">
            <span lang={language} dir="auto">{t('Reset filters')}</span>
          </Link>
        </div>
      )}
    </main>
  );
}
