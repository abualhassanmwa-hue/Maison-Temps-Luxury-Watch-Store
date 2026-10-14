import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useStorefront } from '../context/useStorefront.js';
import { formatPrice } from '../utils/formatPrice.js';
import { getStockStatus } from '../utils/productUtils.js';
import { PageHeading } from '../components/PageHeading.jsx';
import { useTranslation } from '../i18n/useTranslation.js';

export function CartPage() {
  const { language, t } = useTranslation();
  const { cartItemsDetailed, subtotal, updateCartQuantity, removeFromCart } = useStorefront();

  if (!cartItemsDetailed.length) {
    return (
      <main className="section-container page-shell">
        <PageHeading
          eyebrow="BAG"
          title="Your selection"
          description="Review the watches you have added to your bag."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Bag' }]}
        />
        <div className="empty-state">
          <h1 lang={language} dir="auto">{t('Your bag is empty.')}</h1>
          <p lang={language} dir="auto">{t('Explore the collection to find your next signature piece.')}</p>
          <Link className="button button-dark" to="/shop" lang={language} dir="auto">
            {t('Continue shopping')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section-container page-shell">
      <PageHeading
        eyebrow="BAG"
        title="Your selection"
        description="Review the watches you have added to your bag."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Bag' }]}
      />

      <div className="cart-layout">
        <div className="cart-items">
          {cartItemsDetailed.map((product) => (
            <div key={product.id} className="cart-item">
              <Link to={`/products/${product.slug}`} className="cart-item-image-link" aria-label={t('View {name}', { name: product.name })}>
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="cart-item-copy">
                <div className="cart-item-header">
                  <div>
                    <p>{product.brand}</p>
                    <h3><Link to={`/products/${product.slug}`}>{product.name}</Link></h3>
                    <p className="cart-item-sku">SKU: {product.id}</p>
                  </div>
                  <button type="button" className="icon-button cart-remove" aria-label={t('Remove {name}', { name: product.name })} onClick={() => removeFromCart(product.id)}>
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
                <div className="cart-item-details">
                  <span>{product.movement} {t('movement')}</span>
                  <span>{product.caseDiameter} {t('mm case')}</span>
                  <span>{product.dialColor} {t('dial')}</span>
                </div>
                <p className={`stock-status cart-stock-status ${getStockStatus(product, t).available ? '' : 'is-unavailable'}`} lang={language} dir="auto">
                  {getStockStatus(product, t).label}
                </p>
                <div className="cart-item-actions">
                  <div className="quantity-control" aria-label={t('Quantity for {name}', { name: product.name })}>
                    <button type="button" onClick={() => updateCartQuantity(product.id, -1)} disabled={product.quantity <= 1} aria-label={t('Decrease quantity for {name}', { name: product.name })}>
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <span>{product.quantity}</span>
                    <button type="button" onClick={() => updateCartQuantity(product.id, 1)} disabled={product.quantity >= getStockStatus(product, t).stockCount} aria-label={t('Increase quantity for {name}', { name: product.name })}>
                      <Plus size={14} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="cart-item-prices">
                    <span>{formatPrice(product.price)} {t('each')}</span>
                    <strong>{formatPrice(product.price * product.quantity)}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2 lang={language} dir="auto">{t('Order summary')}</h2>
          <dl>
            <div>
              <dt lang={language} dir="auto">{t('Subtotal')}</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <p className="summary-note" lang={language} dir="auto">{t('Shipping is not calculated in this demo.')}</p>
          <Link className="button button-dark" to="/checkout" lang={language} dir="auto">
            {t('Proceed to checkout')}
          </Link>
        </aside>
      </div>
    </main>
  );
}
