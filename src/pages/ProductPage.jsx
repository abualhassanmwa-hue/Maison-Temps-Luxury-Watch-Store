import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { ProductCard } from '../components/ProductCard.jsx';
import { useStorefront } from '../context/useStorefront.js';
import { buildRelatedProducts, getProductBySlug, getStockStatus } from '../utils/productUtils.js';
import { formatPrice, getDiscountPercent } from '../utils/formatPrice.js';
import { useTranslation } from '../i18n/useTranslation.js';

export function ProductPage() {
  const { language, t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductBySlug(slug);
  const { addToCart, toggleWishlist, wishlist, cartItemsDetailed } = useStorefront();
  const buyingRef = useRef(false);
  const [productView, setProductView] = useState(null);
  const [isBuying, setIsBuying] = useState(false);
  const hasCurrentProductView = productView?.productId === product?.id;
  const selectedImage = hasCurrentProductView ? productView.image : product?.image ?? '';
  const quantity = hasCurrentProductView ? productView.quantity : 1;
  const addedToCart = hasCurrentProductView && productView.addedToCart;
  const galleryImages = product
    ? [...new Set([product.image, ...(product.images ?? [])].filter(Boolean))]
    : [];
  const stock = getStockStatus(product, t);
  const inCartQuantity = cartItemsDetailed.find((item) => item.id === product?.id)?.quantity ?? 0;
  const remainingStock = Math.max(0, stock.stockCount - inCartQuantity);
  const purchaseMessage = hasCurrentProductView ? productView.purchaseMessage : '';

  useEffect(() => {
    if (!product) return undefined;

    const previousTitle = document.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag?.content;

    document.title = `${product.brand} ${product.name} | Maison Temps`;
    if (descriptionTag) descriptionTag.content = product.description;

    return () => {
      document.title = previousTitle;
      if (descriptionTag && previousDescription !== undefined) descriptionTag.content = previousDescription;
    };
  }, [product]);

  const updateProductView = (updates) => {
    setProductView((current) => {
      const isCurrent = current?.productId === product?.id;
      return {
        productId: product?.id,
        image: isCurrent ? current.image : product?.image ?? '',
        quantity: isCurrent ? current.quantity : 1,
        addedToCart: isCurrent ? current.addedToCart : false,
        purchaseMessage: isCurrent ? current.purchaseMessage : '',
        ...updates
      };
    });
  };

  if (!product) {
    return (
      <main className="section-container page-shell">
        <div className="empty-state">
          <h1 lang={language} dir="auto">{t('Watch not found')}</h1>
          <Link className="button button-dark" to="/shop" lang={language} dir="auto">
            {t('Return to the collection')}
          </Link>
        </div>
      </main>
    );
  }

  const isInWishlist = wishlist.includes(product.id);
  const relatedProducts = buildRelatedProducts(product, 3);
  const handleAddToCart = () => {
    const addedQuantity = addToCart(product, quantity);
    updateProductView({
      addedToCart: addedQuantity === quantity,
      purchaseMessage: addedQuantity === quantity ? '' : t('Unable to add the selected quantity because it exceeds available stock.')
    });
  };
  const handleBuyNow = () => {
    if (buyingRef.current) return;

    buyingRef.current = true;
    setIsBuying(true);
    const addedQuantity = addToCart(product, quantity);
    if (addedQuantity !== quantity) {
      buyingRef.current = false;
      setIsBuying(false);
      updateProductView({
        addedToCart: false,
        purchaseMessage: t('Unable to add the selected quantity because it exceeds available stock.')
      });
      return;
    }

    navigate('/checkout');
  };

  return (
    <main className="section-container page-shell">
      <nav className="page-breadcrumb" aria-label={t('Breadcrumb')}>
        <span><Link to="/" lang={language} dir="auto">{t('Home')}</Link></span>
        <span><span className="breadcrumb-separator" aria-hidden="true">/</span><Link to="/shop" lang={language} dir="auto">{t('Watches')}</Link></span>
        <span><span className="breadcrumb-separator" aria-hidden="true">/</span><span aria-current="page">{product.name}</span></span>
      </nav>
      <div className="product-detail-layout">
        <div className="product-gallery">
          <img src={selectedImage || product.image} alt={product.name} className="product-main-image" />
          <div className="product-thumb-row">
            {galleryImages.map((image, index) => (
              <button
                key={`${product.id}-${index}`}
                type="button"
                className={`product-thumb${selectedImage === image ? ' is-selected' : ''}`}
                aria-label={t('View {name} image {index}', { name: product.name, index: index + 1 })}
                aria-pressed={selectedImage === image}
                onClick={() => updateProductView({ image })}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail-copy">
          <p className="eyebrow">{product.brand}</p>
          <h1>{product.name}</h1>
          <p className="product-sku">SKU: {product.id}</p>
          <div className="price-row product-price-row">
            <strong>{formatPrice(product.price)}</strong>
            {product.originalPrice > product.price && (
              <>
                <span className="price-original">{formatPrice(product.originalPrice)}</span>
                <span className="price-save">-{getDiscountPercent(product)}%</span>
              </>
            )}
          </div>

          <p className={`stock-status product-stock-status ${stock.available ? '' : 'is-unavailable'}`} aria-live="polite" lang={language} dir="auto">
            {stock.label}
          </p>
          <p className="product-description">{product.description}</p>

          <div className="detail-quantity">
            <span lang={language} dir="auto">{t('Quantity')}</span>
            <div className="quantity-control" aria-label={t('Quantity for {name}', { name: product.name })}>
              <button
                type="button"
                onClick={() => updateProductView({ quantity: Math.max(1, quantity - 1), addedToCart: false, purchaseMessage: '' })}
                disabled={quantity <= 1}
                aria-label={t('Decrease quantity')}
              >
                −
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                type="button"
                onClick={() => updateProductView({ quantity: Math.min(remainingStock, quantity + 1), addedToCart: false, purchaseMessage: '' })}
                disabled={!stock.available || quantity >= remainingStock}
                aria-label={t('Increase quantity')}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button
              type="button"
              className="button button-dark"
              onClick={handleAddToCart}
              disabled={!stock.available || quantity > remainingStock || remainingStock === 0}
            >
              <ShoppingBag size={14} strokeWidth={1.8} aria-hidden="true" />
              <span lang={language} dir="auto">{!stock.available ? t('Out of stock') : remainingStock === 0 ? t('All available units in your bag') : t('Add to cart')}</span>
            </button>
            <button
              type="button"
              className="button button-outline"
              onClick={handleBuyNow}
              disabled={!stock.available || quantity > remainingStock || remainingStock === 0 || isBuying}
            >
              <ShoppingBag size={14} strokeWidth={1.8} aria-hidden="true" />
              <span lang={language} dir="auto">{isBuying ? t('Processing') : t('Buy now')}</span>
            </button>
            <button type="button" className={`button button-outline ${isInWishlist ? 'is-active' : ''}`} onClick={() => toggleWishlist(product.id)}>
              <Heart size={14} strokeWidth={1.8} fill={isInWishlist ? 'currentColor' : 'none'} aria-hidden="true" />
              <span lang={language} dir="auto">{isInWishlist ? t('Saved') : t('Save')}</span>
            </button>
          </div>
          {purchaseMessage && <p className="product-purchase-message" role="status" lang={language} dir="auto">{purchaseMessage}</p>}
          {addedToCart && stock.available && <p className="success-message" role="status" lang={language} dir="auto">{t('{count} added to your bag.', { count: quantity })}</p>}

          <div className="product-detail-meta">
            <div>
              <span lang={language} dir="auto">{t('Movement')}</span>
              <strong>{product.movement}</strong>
            </div>
            <div>
              <span lang={language} dir="auto">{t('Case material')}</span>
              <strong>{product.caseMaterial}</strong>
            </div>
            <div>
              <span lang={language} dir="auto">{t('Water resistance')}</span>
              <strong>{product.waterResistance}</strong>
            </div>
            <div>
              <span lang={language} dir="auto">{t('Case size')}</span>
              <strong>{product.caseDiameter} mm</strong>
            </div>
            <div>
              <span lang={language} dir="auto">{t('Dial')}</span>
              <strong>{product.dialColor}</strong>
            </div>
            <div>
              <span lang={language} dir="auto">{t('Strap')}</span>
              <strong>{product.strapMaterial}</strong>
            </div>
            <div>
              <span lang={language} dir="auto">{t('Glass')}</span>
              <strong>{product.glass}</strong>
            </div>
            {product.powerReserve && (
              <div>
                <span lang={language} dir="auto">{t('Power reserve')}</span>
                <strong>{product.powerReserve}</strong>
              </div>
            )}
          </div>

        </div>
      </div>

      <section className="product-reviews" aria-labelledby="product-reviews-heading">
        <h2 id="product-reviews-heading" lang={language} dir="auto">{t('Customer reviews')}</h2>
        <p lang={language} dir="auto">{t('Reviews are not available yet.')}</p>
      </section>

      {relatedProducts.length > 0 && (
        <section className="product-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow" lang={language} dir="auto">{t('YOU MAY ALSO LIKE')}</p>
              <h2 lang={language} dir="auto">{t('Related pieces')}</h2>
            </div>
          </div>
          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
