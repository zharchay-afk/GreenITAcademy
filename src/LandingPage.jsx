import React from 'react';
import Logo from './Logo';
import modulesData from '../data/modules.json';
import questionsData from '../data/questions.json';

// Reasons block (Pourquoi se former)
const IconTrending = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 9 12 13 8 21 16" /><polyline points="21 10 21 16 15 16" /></svg>
);
const IconMedal = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="15" r="5" /><polyline points="8.5 11.5 6 4 18 4 15.5 11.5" /></svg>
);
const IconUsers = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

const reasons = [
  { Icon: IconTrending, bg: '#dcfce7', title: 'Urgence climatique', text: 'Le secteur numérique pèse 3 à 4 % des émissions mondiales et croît rapidement. Sans inflexion, son empreinte pourrait doubler d\'ici 2030.' },
  { Icon: IconMedal,    bg: '#dcfce7', title: 'Compétences recherchées', text: 'Toute personne portant un projet IT, RSE ou conformité a intérêt à maîtriser les normes, labels et certifications qui encadrent le numérique.' },
  { Icon: IconUsers,    bg: '#dbeafe', title: 'Obligation légale', text: 'CSRD, EED, Taxonomie : environ 50 000 entreprises européennes doivent désormais reporter leur empreinte numérique.' },
];

// Stats dérivées des données
const totalSections = modulesData.modules.reduce((s, m) => s + m.sections.length, 0);
const stats = [
  { value: modulesData.modules.length, label: 'Modules' },
  { value: totalSections,               label: 'Leçons' },
  { value: questionsData.questions.length, label: 'Questions' },
];

// Helper : scroll fluide vers une ancre
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

// ============================================================================
// LandingPage — 3 sections en plein écran (Accueil / Pourquoi / Modules)
// ============================================================================

export default function LandingPage({ onStart, onShowLegal }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* ============================ Header sticky ============================ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={() => scrollTo('accueil')} style={brandBtnStyle}>
          <Logo size={32} />
          <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Green IT Académie</span>
        </button>

        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <button onClick={() => scrollTo('accueil')}      style={navLinkStyle}>Accueil</button>
          <button onClick={() => scrollTo('presentation')} style={navLinkStyle}>Pourquoi</button>
          <button onClick={() => scrollTo('modules')}      style={navLinkStyle}>Modules</button>
          <button onClick={onStart} style={ctaSmallStyle}>Commencer →</button>
        </nav>
      </header>

      {/* ============================ Section 1 — Hero ============================ */}
      <section id="accueil" style={{
        minHeight: 'calc(100vh - 58px)',
        background: 'linear-gradient(135deg, #064e3b 0%, #166534 60%, #14532d 100%)',
        color: '#fff', padding: '60px 32px',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '6px 14px 6px 6px', backgroundColor: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '24px', marginBottom: '32px' }}>
            <Logo size={24} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#bbf7d0', letterSpacing: '1.5px' }}>GREEN IT ACADÉMIE</span>
          </div>

          <h1 style={{ fontSize: '56px', fontWeight: 800, lineHeight: '1.1', margin: '0 0 20px 0' }}>
            Formez-vous au<br />
            <span style={{ color: '#86efac' }}>Numérique Responsable</span>
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', maxWidth: '640px', lineHeight: '1.6', margin: '0 0 36px 0' }}>
            Découvrez les enjeux environnementaux du numérique et maîtrisez les pratiques pour réduire l'empreinte écologique de vos projets IT.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '50px' }}>
            <button onClick={onStart} style={ctaPrimaryStyle}>
              Commencer la formation  →
            </button>
            <button onClick={() => scrollTo('modules')} style={ctaSecondaryStyle}>
              Voir les modules
            </button>
          </div>

          <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '38px', fontWeight: 800, color: '#bbf7d0' }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ Section 2 — Pourquoi ============================ */}
      <section id="presentation" style={{
        minHeight: 'calc(100vh - 58px)',
        backgroundColor: '#fff',
        padding: '80px 32px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#0f172a', margin: '0 0 14px 0' }}>
              Pourquoi se former au Green IT&nbsp;?
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
              Le numérique est devenu incontournable, mais son impact est massif. Se former, c'est agir.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
            {reasons.map((r, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', backgroundColor: r.bg, borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <r.Icon />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0' }}>{r.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.65', margin: 0, maxWidth: '320px', marginInline: 'auto' }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ Section 3 — Modules ============================ */}
      <section id="modules" style={{
        minHeight: 'calc(100vh - 58px)',
        backgroundColor: '#f1f5f9',
        padding: '80px 32px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#0f172a', margin: '0 0 14px 0' }}>
              Le parcours en 6 modules
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
              Une progression structurée : des concepts généraux aux cas pratiques luxembourgeois.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {modulesData.modules.map((m, i) => (
              <div key={m.id} style={{
                backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden',
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <div style={{ height: '80px', backgroundColor: m.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                  {m.image}
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '1px', marginBottom: '6px' }}>MODULE {m.id}</div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a', lineHeight: '1.35' }}>{m.title}</h3>
                  {m.subtitle && (
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>{m.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={onStart} style={{ ...ctaPrimaryStyle, fontSize: '15px' }}>
              Commencer la formation  →
            </button>
          </div>
        </div>
      </section>

      {/* ============================ Footer ============================ */}
      <footer style={{
        padding: '14px 32px', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0',
        color: '#64748b', fontSize: '11px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
      }}>
        <span>Master Data Science · UTBM · 2026</span>
        <span style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => onShowLegal('notice')}        style={footerLink}>Mentions légales</button>
          <button onClick={() => onShowLegal('privacy')}       style={footerLink}>Données personnelles</button>
          <button onClick={() => onShowLegal('cookies')}       style={footerLink}>Cookies</button>
          <button onClick={() => onShowLegal('accessibilite')} style={footerLink}>♿ Accessibilité</button>
          <button onClick={() => onShowLegal('ecoconception')} style={footerLink}>🌱 Éco-conçu</button>
        </span>
      </footer>
    </div>
  );
}

// ============================================================================
// Styles
// ============================================================================

const brandBtnStyle = {
  display: 'flex', alignItems: 'center', gap: '10px',
  background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
  fontFamily: 'inherit',
};

const navLinkStyle = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  color: '#475569', fontSize: '13px', fontWeight: 600,
  padding: '6px 4px', fontFamily: 'inherit',
};

const ctaSmallStyle = {
  padding: '8px 18px', backgroundColor: '#16a34a', color: '#fff', border: 'none',
  borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
};

const ctaPrimaryStyle = {
  padding: '14px 28px', backgroundColor: '#22c55e', color: '#fff', border: 'none',
  borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  boxShadow: '0 4px 14px rgba(34,197,94,0.3)',
};

const ctaSecondaryStyle = {
  padding: '14px 28px', backgroundColor: 'transparent', color: '#fff',
  border: '1px solid rgba(255,255,255,0.5)', borderRadius: '10px',
  fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
};

const footerLink = {
  background: 'none', border: 'none', color: '#475569', textDecoration: 'underline',
  cursor: 'pointer', padding: 0, fontSize: '11px', fontFamily: 'inherit',
};
