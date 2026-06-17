import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const Ctx = createContext({ siteName: '', logoVariant: 'leaf', logoUrl: '' });

export function SiteConfigProvider({ children }) {
  const [cfg, setCfg] = useState({ siteName: '', logoVariant: 'leaf', logoUrl: '' });

  useEffect(() => {
    if (!db) return;
    return onSnapshot(doc(db, 'config', 'pages'), snap => {
      if (!snap.exists()) return;
      const d = snap.data();
      setCfg({
        siteName:    d.siteName    || '',
        logoVariant: d.logoVariant || 'leaf',
        logoUrl:     d.logoUrl     || '',
      });
    });
  }, []);

  return <Ctx.Provider value={cfg}>{children}</Ctx.Provider>;
}

export const useSiteConfig = () => useContext(Ctx);
