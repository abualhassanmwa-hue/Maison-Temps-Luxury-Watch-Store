export const editorialCollections = [
  {
    slug: 'classic',
    title: 'Classic Watches',
    description: 'Refined staples with balanced proportions, quiet confidence, and enduring appeal.'
  },
  {
    slug: 'sport',
    title: 'Sport Watches',
    description: 'Purposeful designs for active days, strong silhouettes, and easy readability.'
  },
  {
    slug: 'dress',
    title: 'Dress Watches',
    description: 'Elegant pieces for evenings, celebrations, and the moments that deserve presence.'
  },
  {
    slug: 'minimalist',
    title: 'Minimalist Watches',
    description: 'Understated essentials shaped by clarity, proportion, and everyday ease.'
  },
  {
    slug: 'diver',
    title: 'Diver Watches',
    description: 'Built for depth, precision, and a confident, technical profile.'
  },
  {
    slug: 'automatic',
    title: 'Automatic Watches',
    description: 'Mechanical character and tactile movement that reward a slower, more considered rhythm.'
  }
];

export function slugify(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCollectionBySlug(slug) {
  return editorialCollections.find((entry) => entry.slug === slugify(slug));
}

export function getCategoryBySlug(slug) {
  const normalized = slugify(slug);
  return (
    ['men', 'women'].find((entry) => slugify(entry) === normalized) || null
  );
}

export function getBrandBySlug(slug, brandOptions = []) {
  const normalized = slugify(slug);
  return brandOptions.find((brand) => slugify(brand) === normalized) ?? null;
}

export function resolveCatalogPage({ kind = 'shop', slug = '' } = {}) {
  if (kind === 'shop') {
    return {
      kind: 'shop',
      title: 'The Collection',
      description: 'Explore Maison Temps watches with considered design, technical precision, and quietly luxurious character.',
      defaultSort: 'featured'
    };
  }

  if (kind === 'newArrivals') {
    return {
      kind: 'newArrivals',
      title: 'New Arrivals',
      description: 'Newly introduced pieces chosen for their distinct character, fresh perspective, and considered craftsmanship.',
      defaultSort: 'newest'
    };
  }

  if (kind === 'featured') {
    return {
      kind: 'featured',
      title: 'Featured Watches',
      description: 'A carefully curated selection of Maison Temps signatures and the most compelling pieces from our collection.',
      defaultSort: 'featured'
    };
  }

  if (kind === 'bestSellers') {
    return {
      kind: 'bestSellers',
      title: 'Best Sellers',
      description: 'Watches marked as best sellers in the Maison Temps collection.',
      defaultSort: 'best-sellers'
    };
  }

  if (kind === 'offers') {
    return {
      kind: 'offers',
      title: 'Offers',
      description: 'Verified sale pieces with current pricing and clear savings available while stock lasts.',
      defaultSort: 'price-asc'
    };
  }

  if (kind === 'collection') {
    const match = getCollectionBySlug(slug);
    if (!match) return null;

    return {
      kind: 'collection',
      slug: match.slug,
      title: match.title,
      description: match.description,
      defaultSort: 'featured'
    };
  }

  if (kind === 'category') {
    const categoryValue = getCategoryBySlug(slug);
    if (!categoryValue) return null;

    return {
      kind: 'category',
      slug: categoryValue,
      title: categoryValue === 'men' ? "Men's Watches" : "Women's Watches",
      description: categoryValue === 'men'
        ? 'A refined selection of understated, versatile watches designed for everyday wear.'
        : 'Elegant, considered timepieces balancing feminine form with precise mechanical character.',
      defaultSort: 'featured'
    };
  }

  if (kind === 'brand') {
    return {
      kind: 'brand',
      slug: slug,
      title: slug ? slug.replace(/-/g, ' ') : 'Brand Collection',
      description: 'Curated pieces from this Maison Temps brand, selected for design character and everyday versatility.',
      defaultSort: 'featured'
    };
  }

  return null;
}
