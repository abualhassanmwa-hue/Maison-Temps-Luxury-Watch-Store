import { useContext } from 'react';
import { StorefrontContext } from './storefront-context.js';

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error('useStorefront must be used within StorefrontProvider');
  }
  return context;
}
