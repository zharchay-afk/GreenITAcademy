import React, { useEffect, useRef, useState } from 'react';
import { useTheme, setTheme } from './theme';

// Sélecteur de thème : affiche le mode COURANT + un chevron.
// Au clic, ouvre un petit menu avec les deux options sélectionnables.

const OPTIONS = [
  { id: 'light', icon: '☀️', label: 'Clair' },
  { id: 'dark',  icon: '🌙', label: 'Sombre' },
];

export default function ThemeSelector() {
  const [theme] = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Fermeture au clic à l'extérieur
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const current = OPTIONS.find((o) => o.id === theme) || OPTIONS[0];

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen((o) => !o)}
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
        <span style={{ fontSize: '9px', opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute', bottom: 'calc(100% + 6px)', right: 0,
            backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            overflow: 'hidden', minWidth: '120px', zIndex: 100,
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
