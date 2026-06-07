import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import useIsMobile from './useIsMobile';

// Sidebar réutilisable pour toutes les pages internes (dashboard, attestation,
// profil, références).
//
// Desktop : sidebar dans le flux flex, repliable (180 px ↔ 60 px icônes).
//           La préférence est mémorisée dans le localStorage.
// Mobile  : sidebar masquée par défaut, burger en haut à droite, overlay animé.

const ITEMS = [
  { id: 'accueil',     icon: '📚', label: 'Mes modules' },
  { id: 'attestation', icon: '📄', label: 'Mon attestation' },
  { id: 'profil',      icon: '👤', label: 'Mon profil' },
  { id: 'references',  icon: '🔖', label: 'Sources & Références' },
];

const STORAGE_KEY = 'greenit-sidebar-collapsed';

// Bouton hamburger animé (3 barres → X)
function BurgerButton({ open, onClick }) {
  const bar = (transform, opacity = 1) => (
    <span style={{
      display: 'block', width: '18px', height: '2px',
      backgroundColor: '#fff', borderRadius: '2px',
      transition: 'transform 0.22s ease, opacity 0.22s ease',
      transform, opacity,
    }} />
  );
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
      style={{
        position: 'fixed', top: '12px', right: '16px', zIndex: 201,
        width: '40px', height: '40px', borderRadius: '8px',
        backgroundColor: 'var(--sidebar-bg)', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '5px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}
    >
      {bar(open ? 'translateY(7px) rotate(45deg)' : 'none')}
      {bar('none', open ? 0 : 1)}
      {bar(open ? 'translateY(-7px) rotate(-45deg)' : 'none')}
    </button>
  );
}

export default function Sidebar({ activePage, onNavigate }) {
  const isMobile = useIsMobile();

  // Desktop : repliée ou étendue
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });

  // Mobile : ouverte ou fermée
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  // Ferme la sidebar mobile si on repasse en desktop
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const closeMobile = () => setMobileOpen(false);

  // ---- Éléments de navigation ----
  const NavItems = ({ iconOnly }) => ITEMS.map((item) => {
    const isActive = activePage === item.id;
    return (
      <button
        key={item.id}
        onClick={() => { onNavigate(item.id); closeMobile(); }}
        title={iconOnly ? item.label : undefined}
        aria-label={item.label}
        style={{
          width: '100%',
          padding: iconOnly ? '11px 0' : '11px 16px',
          backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
          border: 'none',
          borderLeft: isActive ? '3px solid var(--sidebar-active)' : '3px solid transparent',
          color: isActive ? 'var(--sidebar-active)' : 'rgba(255,255,255,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: iconOnly ? 'center' : 'flex-start',
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
        {!iconOnly && <span>{item.label}</span>}
      </button>
    );
  });

  // ---- Bouton logo ----
  const LogoBtn = ({ centered }) => (
    <button
      onClick={() => { onNavigate('landing'); closeMobile(); }}
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
  // MOBILE
  // =========================================================
  if (isMobile) {
    return (
      <>
        <BurgerButton open={mobileOpen} onClick={() => setMobileOpen(o => !o)} />

        {/* Fond semi-transparent */}
        <div
          onClick={closeMobile}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 199,
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? 'auto' : 'none',
            transition: 'opacity 0.25s',
          }}
        />

        {/* Panneau sidebar en overlay */}
        <aside style={{
          position: 'fixed', top: 0, left: 0,
          height: '100vh', width: '240px',
          backgroundColor: 'var(--sidebar-bg)',
          display: 'flex', flexDirection: 'column',
          zIndex: 200,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          overflowY: 'auto',
        }}>
          <LogoBtn centered={false} />
          <nav style={{ padding: '12px 0', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <NavItems iconOnly={false} />
          </nav>
        </aside>
      </>
    );
  }

  // =========================================================
  // DESKTOP
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
        <NavItems iconOnly={collapsed} />
      </nav>
    </aside>
  );
}
