import React from 'react';

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

export default function ReferencesPage({ onBack }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ backgroundColor: '#1e3a5f', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#2d5a87', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📚</div>
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Sources & Références bibliographiques</span>
        </div>
        <button
          onClick={onBack}
          style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.8)', padding: '6px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}
        >
          ← Retour
        </button>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px 28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#1e3a5f', fontWeight: '700' }}>
            Bibliographie du parcours
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
            L'ensemble du contenu pédagogique de Green IT Académie s'appuie sur les sources réglementaires, normatives et institutionnelles ci-dessous. Toutes les données chiffrées et juridiques ont été vérifiées au regard des textes officiels.
          </p>
        </div>

        {sections.map((section, idx) => (
          <div key={idx} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px 24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#1e3a5f', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>{section.icon}</span>
              {section.title}
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'none' }}>
              {section.items.map((item, i) => (
                <li key={i} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: '2px solid #4ade80' }}>
                  <div style={{ fontWeight: '600', color: '#1a202c', fontSize: '13px', marginBottom: '2px' }}>{item.ref}</div>
                  <div style={{ color: '#64748b', fontSize: '12px', lineHeight: '1.5' }}>{item.detail}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div style={{ backgroundColor: '#ecfdf5', borderRadius: '8px', padding: '16px 20px', marginTop: '24px', border: '1px solid #86efac', fontSize: '12px', color: '#166534', lineHeight: '1.6' }}>
          🌱 <strong>Eco-conception :</strong> cette page de références est entièrement statique, sans image bitmap, et utilise la police système afin de minimiser l'empreinte réseau.
        </div>
      </div>
    </div>
  );
}
