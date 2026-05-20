import React from 'react';
import Sidebar from './Sidebar';

const sections = [
  {
    title: 'Cadre réglementaire européen',
    icon: '⚖️',
    items: [
      { ref: 'Pacte Vert pour l\'Europe (Green Deal)', detail: 'Communication de la Commission européenne, COM(2019) 640 final, décembre 2019.' },
      { ref: 'Directive CSRD', detail: 'Directive (UE) 2022/2464 du 14 décembre 2022 — Reporting de durabilité des entreprises.' },
      { ref: 'Règlement Taxonomie', detail: 'Règlement (UE) 2020/852 du 18 juin 2020 — Classification des activités économiques durables.' },
      { ref: 'Directive EED', detail: 'Directive (UE) 2023/1791 du 13 septembre 2023 — Efficacité énergétique (refonte).' },
      { ref: 'Directive DEEE', detail: 'Directive 2012/19/UE — Déchets d\'équipements électriques et électroniques.' },
      { ref: 'Directive RoHS', detail: 'Directive 2011/65/UE — Limitation des substances dangereuses dans les EEE.' },
      { ref: 'Règlement Écoconception', detail: 'Règlement (UE) 2024/1781 du 13 juin 2024 — Cadre d\'écoconception pour des produits durables.' },
      { ref: 'SFDR', detail: 'Règlement (UE) 2019/2088 — Publications en matière de durabilité dans le secteur financier.' },
      { ref: 'DORA', detail: 'Règlement (UE) 2022/2554 — Résilience opérationnelle numérique du secteur financier.' },
    ],
  },
  {
    title: 'Normes ISO et européennes',
    icon: '📋',
    items: [
      { ref: 'ISO 14001:2015', detail: 'Systèmes de management environnemental — Exigences et lignes directrices.' },
      { ref: 'ISO 14040:2006 / ISO 14044:2006', detail: 'Analyse du cycle de vie (ACV) — Principes, cadre et exigences.' },
      { ref: 'ISO 50001:2018', detail: 'Systèmes de management de l\'énergie.' },
      { ref: 'EN 50600', detail: 'Installations et infrastructures de datacenters (norme européenne CENELEC).' },
    ],
  },
  {
    title: 'Labels environnementaux IT',
    icon: '🏷️',
    items: [
      { ref: 'EPEAT', detail: 'Electronic Product Environmental Assessment Tool — Green Electronics Council.' },
      { ref: 'Energy Star', detail: 'EPA (États-Unis) et Commission européenne.' },
      { ref: 'Blue Angel', detail: 'Umweltbundesamt (Allemagne) — Premier label écologique au monde (1978).' },
    ],
  },
  {
    title: 'Codes de conduite',
    icon: '📜',
    items: [
      { ref: 'EU Code of Conduct on Data Centre Energy Efficiency', detail: 'Joint Research Centre, Commission européenne.' },
      { ref: 'CNDCP', detail: 'Code of Conduct on Data Centre Power — ETSI (European Telecommunications Standards Institute).' },
    ],
  },
  {
    title: 'Acteurs luxembourgeois',
    icon: '🇱🇺',
    items: [
      { ref: 'ILNAS', detail: 'Institut Luxembourgeois de la Normalisation, de l\'Accréditation, de la Sécurité et qualité.' },
      { ref: 'INDR', detail: 'Institut National pour le Développement durable et la Responsabilité sociale des entreprises.' },
      { ref: 'Luxinnovation', detail: 'Agence nationale d\'innovation du Luxembourg.' },
      { ref: 'LuxConnect', detail: 'Opérateur de datacenters durables Tier IV au Luxembourg.' },
      { ref: 'EBRC', detail: 'European Business Reliance Centre — Datacenters et services managés.' },
    ],
  },
  {
    title: 'Sources sur le Green IT',
    icon: '🌱',
    items: [
      { ref: 'ADEME / ARCEP', detail: 'Évaluation de l\'impact environnemental du numérique en France, rapport 2022.' },
      { ref: 'The Shift Project', detail: 'Lean ICT : Pour une sobriété numérique, rapport 2018.' },
      { ref: 'GreenIT.fr', detail: 'Référentiel d\'éco-conception web (115 bonnes pratiques).' },
    ],
  },
  {
    title: 'Sources techniques',
    icon: '⚙️',
    items: [
      { ref: 'Standard SCORM 1.2', detail: 'Advanced Distributed Learning (ADL).' },
      { ref: 'React Native', detail: 'Documentation officielle Meta — https://reactnative.dev' },
      { ref: 'Expo', detail: 'Documentation officielle — https://docs.expo.dev' },
      { ref: 'Vite', detail: 'Next Generation Frontend Tooling — https://vitejs.dev' },
    ],
  },
];

export default function ReferencesPage({ onNavigate }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Sidebar activePage="references" onNavigate={onNavigate} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ backgroundColor: '#fff', padding: '16px 32px', borderBottom: '1px solid #e2e8f0' }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#064e3b' }}>Sources &amp; Références bibliographiques</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
            Sources réglementaires, normatives et institutionnelles utilisées dans le parcours
          </p>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
                L'ensemble du contenu pédagogique de Green IT Académie s'appuie sur les sources ci-dessous. Toutes les données chiffrées et juridiques ont été vérifiées au regard des textes officiels.
              </p>
            </div>

            {sections.map((section, idx) => (
              <div key={idx} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px 24px', marginBottom: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <h2 style={{ margin: '0 0 14px 0', fontSize: '15px', color: '#064e3b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{section.icon}</span>
                  {section.title}
                </h2>
                <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                  {section.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: '2px solid #4ade80' }}>
                      <div style={{ fontWeight: '600', color: '#1a202c', fontSize: '13px', marginBottom: '2px' }}>{item.ref}</div>
                      <div style={{ color: '#64748b', fontSize: '12px', lineHeight: '1.5' }}>{item.detail}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div style={{ backgroundColor: '#ecfdf5', borderRadius: '8px', padding: '14px 18px', marginTop: '20px', border: '1px solid #86efac', fontSize: '12px', color: '#166534', lineHeight: '1.6' }}>
              🌱 <strong>Eco-conception :</strong> cette page est entièrement statique, sans image bitmap, et utilise la police système afin de minimiser l'empreinte réseau.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
