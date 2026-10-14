import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard.jsx';
import { products } from '../data/products.js';
import { useTranslation } from '../i18n/useTranslation.js';

const categoryLinks = [
  { to: '/shop?category=men', label: "Men's watches", image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=350&q=80' },
  { to: '/shop?category=women', label: "Women's watches", image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=350&q=80' },
  { to: '/shop?movement=Automatic', label: 'Automatic', image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=350&q=80' },
  { to: '/shop?collection=dress', label: 'Dress watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=350&q=80' },
  { to: '/shop?collection=sport', label: 'Sport', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=350&q=80' },
  { to: '/shop?collection=minimalist', label: 'Minimalist', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=350&q=80' }
];

const editorialCards = [
  { slug: 'classic', title: 'Quiet confidence.', description: 'The everyday collection', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85' },
  { slug: 'Automatic', title: 'Made to move.', description: 'Mechanical artistry', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=750&q=85' },
  { slug: 'dress', title: 'Mark the moment.', description: 'The gift edit', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=750&q=85' }
];

export function HomePage() {
  const { language, t } = useTranslation();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
  const offers = products.filter((product) => product.onSale).slice(0, 4);
  const arrivals = products.filter((product) => product.newArrival).slice(0, 4);

  return (
    <main id="homeView">
      <section className="hero" id="home">
        <div className="hero-shade" />

        <div className="hero-copy">
          <p className="eyebrow" lang={language} dir="auto">{t('THE ART OF TIME')}</p>
          <h1>
            <span lang={language} dir="auto">{t('Time, defined')}</span>
            <br />
            <em lang={language} dir="auto">{t('by you.')}</em>
          </h1>
          <p className="hero-description" lang={language} dir="auto">{t('Discover considered timepieces chosen for enduring style and everyday precision.')}</p>
          <div className="hero-actions">
            <Link className="button button-gold" to="/shop">
              <span lang={language} dir="auto">{t('Explore the collection')}</span> <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link className="text-link light-link" to="/new-arrivals" lang={language} dir="auto">
              {t('Discover new arrivals')}
            </Link>
          </div>
        </div>

        <div className="hero-caption">
          <span>01 / 03</span>
          <span lang={language} dir="auto">{t('TIMELESS BY DESIGN')}</span>
        </div>
      </section>

      <section className="category-strip section-container" aria-label={t('Shop by category')}>
        {categoryLinks.map((category) => (
          <Link key={category.label} className="category-shortcut" to={category.to}>
            <span className="category-image">
              <img src={category.image} alt={t(category.label)} />
            </span>
            <span lang={language} dir="auto">{t(category.label)}</span>
          </Link>
        ))}
      </section>

      <section className="editorial section-container">
        <div className="editorial-intro">
          <p className="eyebrow" lang={language} dir="auto">{t('A STUDY IN STYLE')}</p>
          <h2>
            <span lang={language} dir="auto">{t('Every second,')}</span>
            <br />
            <em lang={language} dir="auto">{t('considered.')}</em>
          </h2>
          <p lang={language} dir="auto">{t('Pieces selected for their balance of form, function and lasting character.')}</p>
          <Link className="text-link" to="/shop" lang={language} dir="auto">
            {t('Discover our point of view')} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {editorialCards.map((card, index) => (
          <Link key={card.title} className={`editorial-card ${index === 0 ? 'editorial-card-large' : ''}`} to={`/collections/${encodeURIComponent(card.slug)}`}>
            <img src={card.image} alt={t(card.title)} />
            <span className="editorial-overlay">
              <small lang={language} dir="auto">{t(card.description)}</small>
              <strong lang={language} dir="auto">{t(card.title)}</strong>
              <span lang={language} dir="auto">{t('Explore collection ↗')}</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="product-section section-container" id="offers">
        <div className="section-heading">
          <div>
            <p className="eyebrow" lang={language} dir="auto">{t('SELECTED PIECES')}</p>
            <h2 lang={language} dir="auto">{t('Special offers')}</h2>
          </div>
          <Link className="text-link" to="/offers" lang={language} dir="auto">
            {t('View all')} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="product-grid">
          {offers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="dark-promo">
        <div className="dark-promo-image">
          <img src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1300&q=85" alt="Watch in a moody, minimal setting" />
        </div>
        <div className="dark-promo-copy">
          <p className="eyebrow" lang={language} dir="auto">{t('THE AUTOMATIC EDIT')}</p>
          <h2>
            <span lang={language} dir="auto">{t('Precision you')}</span>
            <br />
            <em lang={language} dir="auto">{t('can feel.')}</em>
          </h2>
          <p lang={language} dir="auto">{t('Mechanical character. Thoughtful proportions. A different relationship with time.')}</p>
          <Link className="button button-outline-light" to="/shop?movement=Automatic" lang={language} dir="auto">
            {t('Explore automatic watches')} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="product-section section-container" id="new-arrivals">
        <div className="section-heading">
          <div>
            <p className="eyebrow" lang={language} dir="auto">{t('NEW IN')}</p>
            <h2 lang={language} dir="auto">{t('New arrivals')}</h2>
          </div>
          <Link className="text-link" to="/new-arrivals" lang={language} dir="auto">
            {t('Browse all')} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="product-grid">
          {arrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="feature-band section-container">
        <div>
          <p className="eyebrow" lang={language} dir="auto">{t('THE HOUSE EDIT')}</p>
          <h2 lang={language} dir="auto">{t('Objects for the well-lived day.')}</h2>
        </div>
        <div className="feature-band-grid">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.slug}`} className="feature-band-item">
              <img src={product.image} alt={product.name} />
              <span>{product.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
