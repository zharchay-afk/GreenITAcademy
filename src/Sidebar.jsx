import React, { useEffect, useState } from 'react';
import Logo from './Logo';

// Sidebar réutilisable pour toutes les pages internes (dashboard, attestation,
// profil, références). Le menu liste uniquement les espaces de travail :
// la « page d'accueil » publique reste accessible en cliquant sur le logo.
//
// La sidebar est repliable : la préférence (étendue / repliée) est mémorisée
// dans le localStorage du navigateur.

const ITEMS = [
  { id: 'accueil',     icon: '📚', label: 'Mes modules' },
  { id: 'attestation', icon: '📄', label: 'Mon attestation' },
  { id: 'profil',      icon: '👤', label: 'Mon profil' },
  { id: 'references',  icon: '🔖', label: 'Sources & Références' },
];

const STORAGE_KEY = 'greenit-sidebar-collapsed';

export default function Sidebar({ activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  const width = collapsed ? '60px' : '180px';

  return (
    <aside style={{
      width,
      backgroundColor: '#064e3b',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      transition: 'width 0.2s ease',
      position: 'relative',
    }}>
      {/* Bouton de bascule (chevron) */}
      <button
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Déplier le menu' : 'Replier le menu'}
        aria-label={collapsed ? 'Déplier le menu' : 'Replier le menu'}
        style={{
          position: 'absolute',
          top: '24px',
          right: '-12px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          color: '#064e3b',
          border: '1px solid #d1d5db',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '700',
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          fontFamily: 'inherit',
        }}
      >
        {collapsed ? '›' : '‹'}
      </button>

      {/* Logo cliquable */}
      <button
        onClick={() => onNavigate('landing')}
        title="Retour à la page de présentation"
        style={{
          padding: collapsed ? '20px 0' : '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size={36} />
          {!collapsed && (
            <div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Green IT</div>
              <div style={{ color: '#86efac', fontSize: '10px', fontStyle: 'italic' }}>académie</div>
            </div>
          )}
        </div>
      </button>

      {/* Navigation principale */}
      <nav style={{ padding: '12px 0', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              style={{
                width: '100%',
                padding: collapsed ? '11px 0' : '11px 16px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: 'none',
                borderLeft: isActive ? '3px solid #4ade80' : '3px solid transparent',
                color: isActive ? '#4ade80' : 'rgba(255,255,255,0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '400',
                textAlign: 'left',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: '17px', flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Lien discret vers la page de présentation */}
      <div style={{ padding: collapsed ? '12px 0' : '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        {collapsed ? (
          <button
            onClick={() => onNavigate('landing')}
            title="Page de présentation"
            aria-label="Page de présentation"
            style={{
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              padding: '4px', fontSize: '15px', fontFamily: 'inherit',
            }}
          >
            ↩
          </button>
        ) : (
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
        )}
      </div>
    </aside>
  );
}
