import React from 'react';

// Footer partagé entre toutes les pages internes (dashboard, attestation, profil,
// références). Placé en dehors de la zone scrollable pour rester toujours visible.

const linkStyle = {
  background: 'none',
  border: 'none',
  color: '#64748b',
  textDecoration: 'underline',
  cursor: 'pointer',
  padding: 0,
  fontSize: '11px',
  fontFamily: 'inherit',
};

export default function Footer({ onShowLegal }) {
  return (
    <footer style={{
      flexShrink: 0,
      padding: '10px 24px',
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
      color: '#64748b',
      fontSize: '11px',
    }}>
      <span>Master Data Science · UTBM · 2026</span>
      {onShowLegal && (
        <span style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => onShowLegal('notice')} style={linkStyle}>Mentions légales</button>
          <button onClick={() => onShowLegal('privacy')} style={linkStyle}>Données personnelles</button>
          <button onClick={() => onShowLegal('cookies')} style={linkStyle}>Cookies</button>
          <button onClick={() => onShowLegal('accessibilite')} style={linkStyle}>♿ Accessibilité</button>
          <button onClick={() => onShowLegal('ecoconception')} style={linkStyle}>🌱 Éco-conçu</button>
        </span>
      )}
    </footer>
  );
}
