import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation.js';

export function PageHeading({ eyebrow, title, description, breadcrumbs = [] }) {
  const { language, t } = useTranslation();

  return (
    <header className="page-heading">
      {breadcrumbs.length > 0 && (
        <nav className="page-breadcrumb" aria-label={t('Breadcrumb')}>
          {breadcrumbs.map((breadcrumb, index) => (
            <span key={`${breadcrumb.label}-${index}`}>
              {index > 0 && <span className="breadcrumb-separator" aria-hidden="true">/</span>}
              {breadcrumb.to && index < breadcrumbs.length - 1
                ? <Link to={breadcrumb.to} lang={language} dir="auto">{t(breadcrumb.label)}</Link>
                : <span lang={language} dir="auto" aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}>{t(breadcrumb.label)}</span>}
            </span>
          ))}
        </nav>
      )}
      {eyebrow && <p className="eyebrow" lang={language} dir="auto">{t(eyebrow)}</p>}
      <h1 lang={language} dir="auto">{t(title)}</h1>
      {description && <p className="page-heading-description" lang={language} dir="auto">{t(description)}</p>}
    </header>
  );
}
