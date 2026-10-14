import { Link } from 'react-router-dom';
import { PageHeading } from '../components/PageHeading.jsx';
import { useTranslation } from '../i18n/useTranslation.js';

export function NotFoundPage() {
  const { language, t } = useTranslation();

  return (
    <main className="section-container page-shell">
      <PageHeading
        eyebrow="404"
        title="Page not found."
        description="The route you requested is no longer available."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Page not found' }]}
      />
      <div className="empty-state">
        <Link className="button button-dark" to="/" lang={language} dir="auto">
          {t('Return home')}
        </Link>
      </div>
    </main>
  );
}
