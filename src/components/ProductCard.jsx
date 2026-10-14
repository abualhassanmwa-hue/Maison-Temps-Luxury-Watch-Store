import { Link, useNavigate } from 'react-router-dom';
import { useId, useRef, useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice, getDiscountPercent } from '../utils/formatPrice.js';
import { getStockStatus } from '../utils/productUtils.js';
import { useStorefront } from '../context/useStorefront.js';
import { useTranslation } from '../i18n/useTranslation.js';

export function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist, cartItemsDetailed } = useStorefront();
  const { language, t } = useTranslation();
  const navigate = useNavigate();
  const buyingRef = useRef(false);
  const descriptionId = useId();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [buyMessage, setBuyMessage] = useState('');
  const inWishlist = wishlist.includes(product.id);
  const stock = getStockStatus(product, t);
  const inCartQuantity = cartItemsDetailed.find((item) => item.id === product.id)?.quantity ?? 0;
  const canAddToCart = stock.available && inCartQuantity < stock.stockCount;

  const handleBuyNow = () => {
    if (buyingRef.current) return;

    buyingRef.current = true;
    setIsBuying(true);
    setBuyMessage('');

    const addedQuantity = addToCart(product, 1);
    if (!addedQuantity) {
      buyingRef.current = false;
      setIsBuying(false);
      setBuyMessage(t('Unable to add this item because the available stock is already in your bag.'));
      return;
    }

    navigate('/checkout');
  };

  return (
    <article className="product-card">
      <div className="product-card-media">
        <Link to={`/products/${product.slug}`} aria-label={t('View {name}', { name: product.name })}>
          <img src={product.image} alt={product.name} />
        </Link>
        {product.onSale && <span className="product-pill" lang={language} dir="auto">{t('Sale')}</span>}
        <button
          type="button"
          className={`product-wishlist ${inWishlist ? 'active' : ''}`}
          aria-label={inWishlist ? t('Remove from wishlist') : t('Add to wishlist')}
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart size={16} strokeWidth={1.8} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-meta-row">
          <span>{product.brand}</span>
          {product.newArrival && <span className="product-detail-tag" lang={language} dir="auto">{t('New')}</span>}
        </div>
        <Link to={`/products/${product.slug}`} className="product-name-link">
          {product.name}
        </Link>
        <p id={descriptionId} className={`product-card-description${descriptionExpanded ? ' is-expanded' : ''}`}>
          {product.description}
        </p>
        <button
          type="button"
          className="product-description-toggle"
          aria-controls={descriptionId}
          aria-expanded={descriptionExpanded}
          onClick={() => setDescriptionExpanded((expanded) => !expanded)}
          lang={language}
          dir="auto"
        >
          {t(descriptionExpanded ? 'Show less' : 'More')}
        </button>
        <div className="product-card-specs" aria-label={t('{name} specifications', { name: product.name })}>
          <span>SKU: {product.id}</span>
        </div>

        <div className="price-row">
          <strong>{formatPrice(product.price)}</strong>
          {product.originalPrice > product.price && (
            <>
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
              <span className="price-save">-{getDiscountPercent(product)}%</span>
            </>
          )}
        </div>

        <p className={`stock-status ${stock.available ? '' : 'is-unavailable'}`} aria-live="polite" lang={language} dir="auto">
          {stock.label}
        </p>

        <div className="product-card-actions">
          <button type="button" className="button button-dark" onClick={() => addToCart(product)} disabled={!canAddToCart}>
            <ShoppingBag size={14} strokeWidth={1.8} aria-hidden="true" />
            <span lang={language} dir="auto">{!stock.available ? t('Out of stock') : canAddToCart ? t('Add to cart') : t('In your bag')}</span>
          </button>
          <button type="button" className="button button-outline" onClick={handleBuyNow} disabled={!stock.available || isBuying}>
            <ShoppingBag size={14} strokeWidth={1.8} aria-hidden="true" />
            <span lang={language} dir="auto">{isBuying ? t('Processing') : t('Buy now')}</span>
          </button>
        </div>
        {buyMessage && <p className="product-card-message" role="status" lang={language} dir="auto">{buyMessage}</p>}
      </div>
    </article>
  );
}
