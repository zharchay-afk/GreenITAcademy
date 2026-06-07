import { useState, useEffect } from 'react';

/**
 * Retourne true si la largeur de fenêtre est inférieure au breakpoint (768 px par défaut).
 * Se met à jour automatiquement lors du redimensionnement.
 */
export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);

  return isMobile;
}
