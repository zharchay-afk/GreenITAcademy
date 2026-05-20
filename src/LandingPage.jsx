import React from 'react';

const modules = [
  'Cadres conceptuels et typologie des instruments',
  'Cadre réglementaire européen et luxembourgeois',
  'Normes et certifications ISO',
  'Labels environnementaux IT',
  'Codes de conduite et chartes',
  'Cas pratiques au Luxembourg',
];

// Illustration SVG — feuilles stylisées
const HeroLogo = () => (
  <svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '180px', height: '180px' }} aria-hidden="true">
    <defs>
      <linearGradient id="leaf1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
      <linearGradient id="leaf2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
      <linearGradient id="leaf3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bbf7d0" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
    </defs>
    <path d="M 110 110 C 60 60, 60 30, 110 20 C 130 70, 130 100, 110 110 Z" fill="url(#leaf3)" opacity="0.85" />
    <path d="M 110 110 C 160 60, 200 60, 200 110 C 150 130, 130 130, 110 110 Z" fill="url(#leaf2)" opacity="0.9" />
    <path d="M 110 110 C 60 130, 30 170, 80 200 C 110 160, 120 130, 110 110 Z" fill="url(#leaf1)" opacity="0.85" />
    <circle cx="110" cy="110" r="14" fill="#fff" />
    <circle cx="110" cy="110" r="9" fill="#16a34a" />
  </svg>
);

export default function LandingPage({ onStart, onShowLegal }) {
  return (
    <div style={{
      height: '100vh', overflow: 'hidden', backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header compact */}
      <header style={{ flexShrink: 0, backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#dcfce7', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌿</div>
          <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>Green IT Académie</span>
        </div>
        <button onClick={onStart} style={btnPrimary}>Commencer la formation →</button>
      </header>

      {/* Hero — page de bienvenue */}
      <section style={{
        flex: 1, minHeight: 0,
        background: 'linear-gradient(135deg, #064e3b 0%, #166534 60%, #14532d 100%)',
        color: '#fff', padding: '32px 32px',
        display: 'flex', alignItems: 'center', overflow: 'auto',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '40px', alignItems: 'center' }}>
          {/* Colonne texte */}
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: '800', lineHeight: '1.15', margin: '0 0 16px 0' }}>
              Bienvenue sur <span style={{ color: '#86efac' }}>Green&nbsp;IT Académie</span>
            </h1>

            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.88)', lineHeight: '1.6', maxWidth: '640px' }}>
              <p style={{ margin: '0 0 10px 0' }}>
                <strong>Green IT Académie</strong> est un parcours d'auto-formation gratuit et accessible à tous, pour s'initier ou approfondir ses connaissances sur les <strong>normes, labels et certifications</strong> qui encadrent le numérique responsable.
              </p>
              <p style={{ margin: '0 0 10px 0' }}>
                Le parcours s'adresse en priorité aux <strong>professionnels IT, DSI, RSSI, DPO, responsables RSE</strong> et aux étudiants en informatique, droit du numérique ou développement durable. Les cas pratiques sont largement inspirés de la réglementation européenne et de l'écosystème luxembourgeois.
              </p>
              <p style={{ margin: '0 0 10px 0' }}>
                Élaboré par deux étudiants en <strong>Master Data Science de l'UTBM</strong>, il propose un parcours structuré au travers de <strong>6 modules</strong> :
              </p>
              <ul style={{ margin: '0 0 14px 0', paddingLeft: '22px', color: 'rgba(255,255,255,0.85)' }}>
                {modules.map((m, i) => <li key={i} style={{ marginBottom: '3px' }}>{m}</li>)}
              </ul>
              <p style={{ margin: 0 }}>
                À l'issue de chaque module, un <strong>quiz adaptatif</strong> évalue vos connaissances et délivre une <strong>attestation de suivi</strong> dès 70&nbsp;% de réussite sur les 6 modules.
              </p>
            </div>

            {/* CTA unique */}
            <div style={{ marginTop: '22px' }}>
              <button onClick={onStart} style={{
                backgroundColor: '#22c55e', color: '#fff', border: '1px solid #22c55e',
                borderRadius: '10px', padding: '14px 28px', cursor: 'pointer',
                fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(34,197,94,0.25)',
                fontSize: '15px', fontWeight: '700',
              }}>
                Commencer la formation →
              </button>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>
                Accès immédiat, sans inscription. Progression enregistrée localement dans votre navigateur.
              </div>
            </div>
          </div>

          {/* Colonne illustration */}
          <div style={{ textAlign: 'center' }}>
            <HeroLogo />
            <div style={{ marginTop: '12px', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', color: '#bbf7d0' }}>GREEN IT</div>
            <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px', color: '#fff' }}>ACADÉMIE</div>
          </div>
        </div>
      </section>

      {/* Footer symétrique au header */}
      <footer style={{ flexShrink: 0, padding: '10px 32px', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <span>Master Data Science · UTBM · 2026</span>
        <span style={{ display: 'flex', gap: '14px' }}>
          <button onClick={() => onShowLegal('notice')} style={footerLink}>Mentions légales</button>
          <button onClick={() => onShowLegal('privacy')} style={footerLink}>Données</button>
          <button onClick={() => onShowLegal('cookies')} style={footerLink}>Cookies</button>
        </span>
      </footer>
    </div>
  );
}

const btnPrimary = {
  padding: '8px 16px', backgroundColor: '#16a34a', color: '#fff', border: '1px solid #16a34a',
  borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
};
const footerLink = {
  background: 'none', border: 'none', color: '#475569', textDecoration: 'underline',
  cursor: 'pointer', padding: 0, fontSize: '11px', fontFamily: 'inherit',
};
