import React from 'react';
import Logo from './Logo';

const modules = [
  'Cadres conceptuels et typologie des instruments',
  'Cadre réglementaire européen et luxembourgeois',
  'Normes et certifications ISO',
  'Labels environnementaux IT',
  'Codes de conduite et chartes',
  'Cas pratiques au Luxembourg',
];

export default function LandingPage({ onStart, onShowLegal }) {
  return (
    <div style={{
      height: '100vh', overflow: 'hidden', backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
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

            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.88)', lineHeight: '1.6', maxWidth: '640px', textAlign: 'justify', hyphens: 'auto' }}>
              <p style={{ margin: '0 0 10px 0' }}>
                <strong>Green IT Académie</strong> est un parcours d'auto-formation gratuit et accessible à tous, pour s'initier ou approfondir ses connaissances sur les <strong>normes, labels et certifications</strong> qui encadrent le numérique responsable.
              </p>
              <p style={{ margin: '0 0 10px 0' }}>
                Le parcours s'adresse à <strong>toute personne intéressée par l'impact environnemental du numérique</strong> : professionnels, étudiants, citoyens, quel que soit votre niveau de départ. Les cas pratiques sont largement inspirés de la réglementation européenne et de l'écosystème luxembourgeois.
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
            <Logo size={180} />
            <div style={{ marginTop: '12px', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', color: '#bbf7d0' }}>GREEN IT</div>
            <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px', color: '#fff' }}>ACADÉMIE</div>
          </div>
        </div>
      </section>

      {/* Footer symétrique au header */}
      <footer style={{ flexShrink: 0, padding: '10px 32px', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <span>Master Data Science · UTBM · 2026</span>
        <span style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button onClick={() => onShowLegal('notice')} style={footerLink}>Mentions légales</button>
          <button onClick={() => onShowLegal('privacy')} style={footerLink}>Données</button>
          <button onClick={() => onShowLegal('cookies')} style={footerLink}>Cookies</button>
          <button onClick={() => onShowLegal('accessibilite')} style={footerLink}>♿ Accessibilité</button>
          <button onClick={() => onShowLegal('ecoconception')} style={footerLink}>🌱 Éco-conçu</button>
        </span>
      </footer>
    </div>
  );
}

const footerLink = {
  background: 'none', border: 'none', color: '#475569', textDecoration: 'underline',
  cursor: 'pointer', padding: 0, fontSize: '11px', fontFamily: 'inherit',
};
