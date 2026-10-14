import { Link } from 'react-router-dom';
import { useStorefront } from '../context/useStorefront.js';
import { formatPrice } from '../utils/formatPrice.js';
import { PageHeading } from '../components/PageHeading.jsx';
import { useTranslation } from '../i18n/useTranslation.js';

export function CheckoutPage() {
  const { language, t } = useTranslation();
  const { cartItemsDetailed, subtotal } = useStorefront();

  if (!cartItemsDetailed.length) {
    return (
      <main className="section-container page-shell">
        <PageHeading
          eyebrow="CHECKOUT"
          title="Order review"
          description="Your bag is empty. Add a watch before continuing to checkout."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Bag', to: '/cart' }, { label: 'Checkout' }]}
        />
        <div className="empty-state">
          <h1 lang={language} dir="auto">{t('Your bag is empty.')}</h1>
          <Link className="button button-dark" to="/shop" lang={language} dir="auto">
            {t('Fill your bag')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section-container page-shell">
      <PageHeading
        eyebrow="CHECKOUT"
        title="Order review"
        description="Review your selected watches. This demo does not submit orders or process payments."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Bag', to: '/cart' }, { label: 'Checkout' }]}
      />

      <div className="checkout-layout">
        <section className="checkout-form checkout-unavailable" aria-labelledby="checkout-unavailable-heading">
          <h2 id="checkout-unavailable-heading" lang={language} dir="auto">{t('Order placement unavailable')}</h2>
          <p lang={language} dir="auto">{t('This demo does not save orders or process payments.')}</p>
          <Link className="button button-outline" to="/cart" lang={language} dir="auto">
            {t('Return to your bag')}
          </Link>
        </section>

        <aside className="cart-summary">
          <h2 lang={language} dir="auto">{t('Order summary')}</h2>
          <div className="checkout-line-items">
            {cartItemsDetailed.map((item) => (
              <div className="checkout-line-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span lang={language} dir="auto">{t('Quantity')}: {item.quantity}</span>
                </div>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <dl>
            <div>
              <dt lang={language} dir="auto">{t('Items')}</dt>
              <dd>{cartItemsDetailed.length}</dd>
            </div>
            <div className="summary-total">
              <dt lang={language} dir="auto">{t('Subtotal')}</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <p className="summary-note" lang={language} dir="auto">{t('Shipping is not calculated in this demo.')}</p>
        </aside>
      </div>
    </main>
  );
}
