// Petit utilitaire de thème — pas de Context React, juste une lecture/écriture
// sur l'attribut data-theme du <html>. L'application initiale du thème est
// faite dans index.html avant le rendu React pour éviter le flash.

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'greenit-theme';

export function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  // Notifie les composants qui utilisent useTheme
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

// Hook React pour réagir au changement de thème
export function useTheme() {
  const [theme, setLocalTheme] = useState(() => getTheme());
  useEffect(() => {
    const handler = (e) => setLocalTheme(e.detail);
    window.addEventListener('themechange', handler);
    return () => window.removeEventListener('themechange', handler);
  }, []);
  return [theme, setTheme];
}
