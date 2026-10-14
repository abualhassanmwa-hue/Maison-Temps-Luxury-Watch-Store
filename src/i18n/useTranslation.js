import { useCallback } from 'react';
import { useStorefront } from '../context/useStorefront.js';
import { translate } from './translations.js';

export function useTranslation() {
  const { language } = useStorefront();
  const t = useCallback((key, values) => translate(language, key, values), [language]);
  return { language, t };
}
