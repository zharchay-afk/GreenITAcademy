import React, { useEffect, useRef, useState } from 'react';
import { useTheme, setTheme } from './theme';

// Sélecteur de thème : affiche le mode COURANT + un chevron.
// Au clic, ouvre un petit menu avec les deux options sélectionnables.
// Le menu est rendu en position:fixed pour ne jamais être clippé par un parent
// overflow:hidden (ex. footer sticky dans un conteneur flex).

const OPTIONS = [
  { id: 'light', icon: '☀️', label: 'Clair' },
  { id: 'dark',  icon: '🌙', label: 'Sombre' },
];

export default function ThemeSelector() {
  const [theme] = useTheme();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const dropRef = useRef(null);
  const [pos, setPos] = useState(null);

  // Calcule la position fixe du dropdown au-dessus du bouton
  function calcPos() {
    if (!btnRef.current) return null;
    const rect = btnRef.current.getBoundingClientRect();
    return {
      // bottom = distance depuis le bas du viewport jusqu'au bas du dropdown
      // On place le bas du dropdown légèrement au-dessus du haut du bouton
      bottom: window.innerHeight - rect.top + 4,
      right: window.innerWidth - rect.right,
    };
  }

  const toggle = () => {
    setOpen((o) => {
      if (!o) setPos(calcPos());
      return !o;
    });
  };

  // Fermeture au clic à l'extérieur
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      if (dropRef.current && dropRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // Fermeture au redimensionnement (la position fixe serait décalée)
  useEffect(() => {
    if (!open) return;
    const onResize = () => setOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  const current = OPTIONS.find((o) => o.id === theme) || OPTIONS[0];

  return (
    <div style={{ display: 'inline-block' }}>
      <button
        ref={btnRef}
        onClick={toggle}
        title="Changer de thème"
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          background: 'var(--bg-soft)', border: '1px solid var(--border)',
          cursor: 'pointer', padding: '4px 10px', borderRadius: '12px',
          fontSize: '12px', fontFamily: 'inherit', color: 'var(--text-primary)',
          display: 'inline-flex', alignItems: 'center', gap: '6px',
        }}
      >
        <span>{current.icon} {current.label}</span>
        <span style={{
          fontSize: '9px', opacity: 0.7,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s',
          display: 'inline-block',
        }}>▾</span>
      </button>

      {open && pos && (
        <div
          ref={dropRef}
          role="listbox"
          style={{
            position: 'fixed',
            bottom: pos.bottom,
            right: pos.right,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            overflow: 'hidden',
            minWidth: '120px',
            zIndex: 9999,
          }}
        >
          {OPTIONS.map((o) => {
            const active = o.id === theme;
            return (
              <button
                key={o.id}
                role="option"
                aria-selected={active}
                onClick={() => { setTheme(o.id); setOpen(false); }}
                style={{
                  width: '100%', textAlign: 'left', border: 'none',
                  backgroundColor: active ? 'var(--accent-soft)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-primary)',
                  padding: '9px 12px', cursor: 'pointer', fontSize: '12px',
                  fontFamily: 'inherit', fontWeight: active ? 700 : 500,
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <span>{o.icon}</span>
                <span>{o.label}</span>
                {active && <span style={{ marginLeft: 'auto' }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
