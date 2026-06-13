import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import useIsMobile from './useIsMobile';

// Sidebar réutilisable pour toutes les pages internes (dashboard, attestation,
// profil, références).
//
// Desktop : sidebar dans le flux flex, repliable (180 px ↔ 60 px icônes).
//           La préférence est mémorisée dans le localStorage.
// Mobile  : barre de navigation fixée en bas de l'écran (bottom nav bar).
//           4 onglets toujours visibles, navigation en 1 tap.

const ITEMS = [
  { id: 'accueil',     icon: '📚', label: 'Modules' },
  { id: 'attestation', icon: '📄', label: 'Attestation' },
  { id: 'profil',      icon: '👤', label: 'Profil' },
  { id: 'references',  icon: '🔖', label: 'Sources' },
];

const STORAGE_KEY = 'greenit-sidebar-collapsed';

export default function Sidebar({ activePage, onNavigate }) {
  const isMobile = useIsMobile();

  // Desktop : repliée ou étendue
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  // ---- Logo cliquable (retour landing) ----
  const LogoBtn = ({ centered }) => (
    <button
      onClick={() => onNavigate('landing')}
      title="Retour à la page de présentation"
      style={{
        padding: centered ? '20px 0' : '20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'transparent', border: 'none', cursor: 'pointer',
        textAlign: 'left', fontFamily: 'inherit',
        display: 'flex', justifyContent: centered ? 'center' : 'flex-start',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Logo size={36} />
        {!centered && (
          <div>
            <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Green IT</div>
            <div style={{ color: 'var(--sidebar-active)', fontSize: '10px', fontStyle: 'italic' }}>académie</div>
          </div>
        )}
      </div>
    </button>
  );

  // =========================================================
  // MOBILE — barre de navigation fixée en bas
  // =========================================================
  if (isMobile) {
    return (
      <nav
        aria-label="Navigation principale"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '48px',
          backgroundColor: 'var(--sidebar-bg)',
          display: 'flex',
          alignItems: 'stretch',
          zIndex: 100,
          boxShadow: '0 -1px 6px rgba(0,0,0,0.2)',
        }}
      >
        {ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                background: 'transparent',
                border: 'none',
                borderTop: isActive ? '2px solid var(--sidebar-active)' : '2px solid transparent',
                cursor: 'pointer',
                color: isActive ? 'var(--sidebar-active)' : 'rgba(255,255,255,0.55)',
                fontFamily: 'inherit',
                transition: 'color 0.15s',
                padding: 0,
              }}
            >
              <span style={{ fontSize: '20px', lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: isActive ? '700' : '400', letterSpacing: '0.1px' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  // =========================================================
  // DESKTOP — sidebar dans le flux flex
  // =========================================================
  const width = collapsed ? '60px' : '180px';
  return (
    <aside style={{
      width,
      backgroundColor: 'var(--sidebar-bg)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      transition: 'width 0.2s ease',
      position: 'relative',
      paddingTop: 'env(safe-area-inset-top)',
    }}>
      {/* Bouton de bascule (chevron) */}
      <button
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Déplier le menu' : 'Replier le menu'}
        aria-label={collapsed ? 'Déplier le menu' : 'Replier le menu'}
        style={{
          position: 'absolute', top: '24px', right: '-12px',
          width: '24px', height: '24px', borderRadius: '50%',
          backgroundColor: 'var(--bg-surface)', color: 'var(--accent)',
          border: '1px solid var(--border)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: '700', zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)', fontFamily: 'inherit',
        }}
      >
        {collapsed ? '›' : '‹'}
      </button>

      <LogoBtn centered={collapsed} />

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
                borderLeft: isActive ? '3px solid var(--sidebar-active)' : '3px solid transparent',
                color: isActive ? 'var(--sidebar-active)' : 'rgba(255,255,255,0.85)',
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
    </aside>
  );
}
