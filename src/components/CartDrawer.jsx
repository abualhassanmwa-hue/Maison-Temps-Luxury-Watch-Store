import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useStorefront } from '../context/useStorefront.js';
import { formatPrice } from '../utils/formatPrice.js';
import { getStockStatus } from '../utils/productUtils.js';
import { useTranslation } from '../i18n/useTranslation.js';

export function CartDrawer({ open, onClose }) {
  const { language, t } = useTranslation();
  const { cartItemsDetailed, cartCount, subtotal, updateCartQuantity, removeFromCart } = useStorefront();
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    returnFocusRef.current = document.activeElement;
    document.body.classList.add('cart-drawer-open');
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = drawerRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('cart-drawer-open');
      document.removeEventListener('keydown', handleKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [onClose, open]);

  return (
    <div className={`cart-drawer-layer${open ? ' is-open' : ''}`} aria-hidden={!open} inert={!open}>
      {open && (
        <button
          type="button"
          className="cart-drawer-backdrop"
          aria-label={t('Close shopping bag')}
          onClick={onClose}
        />
      )}
      <aside
        ref={drawerRef}
        id="cart-drawer"
        className={`cart-drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="cart-drawer-header">
          <div>
            <p className="eyebrow" lang={language} dir="auto">{t('Your selection')}</p>
            <h2 id="cart-drawer-title" lang={language} dir="auto">{t('Your bag')} <span>({cartCount})</span></h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="icon-button"
            aria-label={t('Close shopping bag')}
            onClick={onClose}
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        {cartItemsDetailed.length ? (
          <>
            <div className="cart-drawer-items">
              {cartItemsDetailed.map((product) => (
                <article className="cart-drawer-item" key={product.id}>
                  <Link to={`/products/${product.slug}`} onClick={onClose} aria-label={t('View {name}', { name: product.name })}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="cart-drawer-item-copy">
                    <span className="cart-drawer-brand">{product.brand}</span>
                    <Link className="cart-drawer-product-name" to={`/products/${product.slug}`} onClick={onClose}>{product.name}</Link>
                    <span className="cart-drawer-sku">SKU: {product.id}</span>
                    <span
                      className={`stock-status cart-stock-status ${getStockStatus(product, t).available ? '' : 'is-unavailable'}`}
                      lang={language}
                      dir="auto"
                    >
                      {getStockStatus(product, t).label}
                    </span>
                    <div className="cart-drawer-item-controls">
                      <div className="quantity-control" aria-label={t('Quantity for {name}', { name: product.name })}>
                        <button
                          type="button"
                          aria-label={t('Decrease quantity for {name}', { name: product.name })}
                          onClick={() => updateCartQuantity(product.id, -1)}
                          disabled={product.quantity <= 1}
                        >
                          <Minus size={13} aria-hidden="true" />
                        </button>
                        <span aria-live="polite">{product.quantity}</span>
                        <button
                          type="button"
                          aria-label={t('Increase quantity for {name}', { name: product.name })}
                          onClick={() => updateCartQuantity(product.id, 1)}
                          disabled={product.quantity >= getStockStatus(product, t).stockCount}
                        >
                          <Plus size={13} aria-hidden="true" />
                        </button>
                      </div>
                      <strong>{formatPrice(product.price * product.quantity)}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-drawer-remove"
                    aria-label={t('Remove {name}', { name: product.name })}
                    onClick={() => removeFromCart(product.id)}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-drawer-subtotal">
                <span lang={language} dir="auto">{t('Subtotal')}</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p className="summary-note" lang={language} dir="auto">{t('Shipping is not calculated in this demo.')}</p>
              <div className="cart-drawer-actions">
                <Link className="button button-dark" to="/cart" onClick={onClose} lang={language} dir="auto">
                  {t('View bag')}
                </Link>
                <Link className="button button-outline" to="/checkout" onClick={onClose} lang={language} dir="auto">
                  {t('Proceed to checkout')}
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="cart-drawer-empty">
            <p lang={language} dir="auto">{t('Your bag is empty.')}</p>
            <Link className="button button-dark" to="/shop" onClick={onClose} lang={language} dir="auto">
              {t('Continue shopping')}
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
