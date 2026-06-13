import React, { useState } from 'react';
import ThemeSelector from './ThemeSelector';

// Footer partagé entre toutes les pages internes (dashboard, attestation, profil,
// références, légal). Toujours sur 1 ligne — les liens légaux sont accessibles
// via un bouton "▲ Liens" qui ouvre un panneau rétractable au-dessus.

const linkStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  textDecoration: 'underline',
  cursor: 'pointer',
  padding: 0,
  fontSize: '11px',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
};

export default function Footer({ onShowLegal, onShowLanding }) {
  const [open, setOpen] = useState(false);

  return (
    <footer
      data-themed="surface"
      style={{
        flexShrink: 0,
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-secondary)',
        fontSize: '11px',
      }}
    >
      {/* Panneau de liens — déplié au-dessus de la barre principale */}
      {open && (
        <div
          style={{
            padding: '10px 24px 8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {onShowLanding && (
            <button onClick={() => { onShowLanding(); setOpen(false); }} style={linkStyle}>
              ↩ Page de présentation
            </button>
          )}
          {onShowLegal && (
            <>
              <button onClick={() => { onShowLegal('notice');        setOpen(false); }} style={linkStyle}>Mentions légales</button>
              <button onClick={() => { onShowLegal('privacy');       setOpen(false); }} style={linkStyle}>Données personnelles</button>
              <button onClick={() => { onShowLegal('cookies');       setOpen(false); }} style={linkStyle}>Cookies</button>
              <button onClick={() => { onShowLegal('accessibilite'); setOpen(false); }} style={linkStyle}>♿ Accessibilité</button>
              <button onClick={() => { onShowLegal('ecoconception'); setOpen(false); }} style={linkStyle}>🌱 Éco-conçu</button>
              <button onClick={() => { onShowLegal('sitemap');       setOpen(false); }} style={linkStyle}>🗺️ Plan du site</button>
            </>
          )}
        </div>
      )}

      {/* Barre compacte toujours visible */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '8px',
          paddingRight: '24px',
          paddingBottom: '8px',
          paddingLeft: '24px',
          gap: '12px',
        }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          title={open ? 'Masquer les informations' : 'Afficher les informations'}
          aria-expanded={open}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            fontFamily: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: 0,
          }}
        >
          <span
            style={{
              fontSize: '9px',
              display: 'inline-block',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          >▲</span>
          Informations
        </button>

        <ThemeSelector />
      </div>
    </footer>
  );
}
