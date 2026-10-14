import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard.jsx';
import { useStorefront } from '../context/useStorefront.js';
import { getProductById } from '../utils/productUtils.js';
import { PageHeading } from '../components/PageHeading.jsx';
import { useTranslation } from '../i18n/useTranslation.js';

export function WishlistPage() {
  const { language, t } = useTranslation();
  const { wishlist } = useStorefront();
  const products = wishlist.map((id) => getProductById(id)).filter(Boolean);

  if (!products.length) {
    return (
      <main className="section-container page-shell">
        <PageHeading
          eyebrow="SAVED PIECES"
          title="Wishlist"
          description="Keep the watches you love close at hand."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]}
        />
        <div className="empty-state">
          <h1 lang={language} dir="auto">{t('Your wishlist is empty.')}</h1>
          <p lang={language} dir="auto">{t('Save a few pieces you love and keep them close.')}</p>
          <Link className="button button-dark" to="/shop" lang={language} dir="auto">
            {t('Explore watches')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section-container page-shell">
      <PageHeading
        eyebrow="SAVED PIECES"
        title="Wishlist"
        description="Keep the watches you love close at hand."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]}
      />
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
