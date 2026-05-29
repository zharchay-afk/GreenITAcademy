import React from 'react';
import { useTheme, toggleTheme } from './theme';

// Footer partagé entre toutes les pages internes (dashboard, attestation, profil,
// références). Placé en dehors de la zone scrollable pour rester toujours visible.

const linkStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  textDecoration: 'underline',
  cursor: 'pointer',
  padding: 0,
  fontSize: '11px',
  fontFamily: 'inherit',
};

export default function Footer({ onShowLegal, onShowLanding }) {
  const [theme] = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer
      data-themed="surface"
      data-themed-border
      style={{
        flexShrink: 0,
        padding: '10px 24px',
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--bg-surface)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        color: 'var(--text-secondary)',
        fontSize: '11px',
      }}
    >
      <span>Master Data Science · UTBM · 2026</span>
      <span style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {onShowLanding && (
          <button onClick={onShowLanding} style={linkStyle}>↩ Page de présentation</button>
        )}
        {onShowLegal && (
          <>
            <button onClick={() => onShowLegal('notice')}        style={linkStyle}>Mentions légales</button>
            <button onClick={() => onShowLegal('privacy')}       style={linkStyle}>Données personnelles</button>
            <button onClick={() => onShowLegal('cookies')}       style={linkStyle}>Cookies</button>
            <button onClick={() => onShowLegal('accessibilite')} style={linkStyle}>♿ Accessibilité</button>
            <button onClick={() => onShowLegal('ecoconception')} style={linkStyle}>🌱 Éco-conçu</button>
          </>
        )}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          style={{
            background: 'var(--bg-soft)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontFamily: 'inherit',
            color: 'var(--text-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isDark ? '☀️' : '🌙'} {isDark ? 'Clair' : 'Sombre'}
        </button>
      </span>
    </footer>
  );
}
