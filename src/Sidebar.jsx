import React from 'react';
import Logo from './Logo';

// Sidebar réutilisable pour toutes les pages internes (dashboard, attestation,
// profil, références, scorm). Le menu liste uniquement les espaces de travail :
// la « page d'accueil » publique reste accessible en cliquant sur le logo.

const ITEMS = [
  { id: 'accueil',     icon: '📚', label: 'Mes modules' },
  { id: 'attestation', icon: '📄', label: 'Mon attestation' },
  { id: 'profil',      icon: '👤', label: 'Mon profil' },
  { id: 'references',  icon: '🔖', label: 'Sources & Références' },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside style={{
      width: '180px',
      backgroundColor: '#064e3b',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo cliquable — convention : retour à la page de présentation */}
      <button
        onClick={() => onNavigate('landing')}
        title="Retour à la page de présentation"
        style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size={36} />
          <div>
            <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Green IT</div>
            <div style={{ color: '#86efac', fontSize: '10px', fontStyle: 'italic' }}>académie</div>
          </div>
        </div>
      </button>

      {/* Navigation principale */}
      <nav style={{ padding: '12px 0', flex: 1, overflowY: 'auto' }}>
        {ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: '100%',
                padding: '11px 16px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: 'none',
                borderLeft: isActive ? '3px solid #4ade80' : '3px solid transparent',
                color: isActive ? '#4ade80' : 'rgba(255,255,255,0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '400',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Petit lien discret pour ceux qui n'auraient pas l'habitude du logo cliquable */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => onNavigate('landing')}
          style={{
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
            padding: 0, cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit',
            textDecoration: 'underline',
          }}
        >
          ↩ Page de présentation
        </button>
      </div>
    </aside>
  );
}
