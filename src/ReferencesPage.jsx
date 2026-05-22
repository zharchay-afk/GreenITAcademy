import React from 'react';
import Sidebar from './Sidebar';

const sections = [
  {
    title: 'Cadre réglementaire européen',
    icon: '⚖️',
    items: [
      { ref: 'Pacte Vert pour l\'Europe (Green Deal)', detail: 'Communication de la Commission européenne, COM(2019) 640 final, décembre 2019.',
        url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=COM%3A2019%3A640%3AFIN' },
      { ref: 'Directive CSRD', detail: 'Directive (UE) 2022/2464 du 14 décembre 2022 — Reporting de durabilité des entreprises.',
        url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32022L2464' },
      { ref: 'Règlement Taxonomie', detail: 'Règlement (UE) 2020/852 du 18 juin 2020 — Classification des activités économiques durables.',
        url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32020R0852' },
      { ref: 'Directive EED', detail: 'Directive (UE) 2023/1791 du 13 septembre 2023 — Efficacité énergétique (refonte).',
        url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023L1791' },
      { ref: 'Directive DEEE', detail: 'Directive 2012/19/UE — Déchets d\'équipements électriques et électroniques.',
        url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32012L0019' },
      { ref: 'Directive RoHS', detail: 'Directive 2011/65/UE — Limitation des substances dangereuses dans les EEE.',
        url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011L0065' },
      { ref: 'Règlement Écoconception', detail: 'Règlement (UE) 2024/1781 du 13 juin 2024 — Cadre d\'écoconception pour des produits durables.',
        url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R1781' },
      { ref: 'SFDR', detail: 'Règlement (UE) 2019/2088 — Publications en matière de durabilité dans le secteur financier.',
        url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32019R2088' },
      { ref: 'DORA', detail: 'Règlement (UE) 2022/2554 — Résilience opérationnelle numérique du secteur financier.',
        url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32022R2554' },
    ],
  },
  {
    title: 'Normes ISO et européennes',
    icon: '📋',
    items: [
      { ref: 'ISO 14001:2015', detail: 'Systèmes de management environnemental — Exigences et lignes directrices.',
        url: 'https://www.iso.org/standard/60857.html' },
      { ref: 'ISO 14040:2006 / ISO 14044:2006', detail: 'Analyse du cycle de vie (ACV) — Principes, cadre et exigences.',
        url: 'https://www.iso.org/standard/37456.html' },
      { ref: 'ISO 50001:2018', detail: 'Systèmes de management de l\'énergie.',
        url: 'https://www.iso.org/standard/69426.html' },
      { ref: 'ISO/IEC 17021-1', detail: 'Exigences pour les organismes auditant et certifiant des systèmes de management.',
        url: 'https://www.iso.org/standard/61651.html' },
      { ref: 'ISO 14024:2018', detail: 'Étiquetage environnemental — Principes de Type I (labels multi-critères tierce partie).',
        url: 'https://www.iso.org/standard/72458.html' },
    ],
  },
  {
    title: 'Labels environnementaux IT',
    icon: '🏷️',
    items: [
      { ref: 'EPEAT', detail: 'Electronic Product Environmental Assessment Tool — Global Electronics Council.',
        url: 'https://www.epeat.net/' },
      { ref: 'Energy Star', detail: 'EPA (États-Unis) et Commission européenne — programme d\'efficacité énergétique.',
        url: 'https://www.energystar.gov/' },
      { ref: 'Blue Angel', detail: 'Umweltbundesamt (Allemagne) — Premier label écologique au monde (1978).',
        url: 'https://www.blauer-engel.de/en' },
      { ref: 'TCO Certified', detail: 'Label suédois historique pour écrans et postes de travail (critères sociaux inclus).',
        url: 'https://tcocertified.com/' },
      { ref: 'IEEE 1680.1-2018', detail: 'Standard support d\'EPEAT pour ordinateurs et écrans.',
        url: 'https://standards.ieee.org/ieee/1680.1/6094/' },
      { ref: 'Ecolabel Index', detail: 'Panorama mondial des écolabels actifs.',
        url: 'https://www.ecolabelindex.com/' },
    ],
  },
  {
    title: 'Codes de conduite',
    icon: '📜',
    items: [
      { ref: 'EU Code of Conduct on Data Centre Energy Efficiency', detail: 'Joint Research Centre, Commission européenne.',
        url: 'https://joint-research-centre.ec.europa.eu/scientific-activities-z/energy-efficiency/energy-efficiency-products/code-conduct-ict_en' },
      { ref: 'Climate Neutral Data Centre Pact (CNDCP)', detail: 'Engagement collectif des opérateurs européens vers la neutralité carbone des datacenters en 2030.',
        url: 'https://www.climateneutraldatacentre.net/' },
      { ref: 'Charte Numérique Responsable (INR)', detail: '10 engagements concrets de numérique responsable.',
        url: 'https://institutnr.org/' },
      { ref: 'Responsible Business Alliance (RBA)', detail: 'Code de conduite pour la supply chain électronique (Apple, Dell, HP, Intel…).',
        url: 'https://www.responsiblebusiness.org/' },
    ],
  },
  {
    title: 'Acteurs luxembourgeois',
    icon: '🇱🇺',
    items: [
      { ref: 'ILNAS', detail: 'Institut Luxembourgeois de la Normalisation, de l\'Accréditation, de la Sécurité et qualité.',
        url: 'https://portail-qualite.public.lu/' },
      { ref: 'INDR', detail: 'Institut National pour le Développement durable et la Responsabilité sociale des entreprises.',
        url: 'https://www.indr.lu/' },
      { ref: 'Luxinnovation', detail: 'Agence nationale d\'innovation du Luxembourg.',
        url: 'https://www.luxinnovation.lu/' },
      { ref: 'CSSF', detail: 'Commission de Surveillance du Secteur Financier — circulaires ESG luxembourgeoises.',
        url: 'https://www.cssf.lu/en/sustainable-finance/' },
      { ref: 'LuxConnect', detail: 'Opérateur de datacenters durables Tier IV au Luxembourg.',
        url: 'https://luxconnect.lu/' },
      { ref: 'EBRC', detail: 'European Business Reliance Centre — Datacenters et services managés (groupe POST).',
        url: 'https://www.ebrc.com/' },
      { ref: 'Klima-Pakt fir Betriber', detail: 'Pacte climat luxembourgeois pour les entreprises.',
        url: 'https://www.klima-pakt.lu/' },
    ],
  },
  {
    title: 'Sources sur le Green IT',
    icon: '🌱',
    items: [
      { ref: 'ARCEP — Empreinte environnementale du numérique', detail: 'Travaux conjoints ADEME / ARCEP sur l\'impact environnemental du numérique en France.',
        url: 'https://www.arcep.fr/la-regulation/grands-dossiers-thematiques-transverses/lempreinte-environnementale-du-numerique.html' },
      { ref: 'The Shift Project', detail: 'Lean ICT : pour une sobriété numérique (2018) — référence fondatrice.',
        url: 'https://theshiftproject.org/article/pour-une-sobriete-numerique-rapport-shift/' },
      { ref: 'Global E-waste Monitor', detail: 'UNITAR / ITU — état mondial annuel des DEEE.',
        url: 'https://ewastemonitor.info/' },
      { ref: 'Boavizta', detail: 'Communauté et outils ACV numériques open source.',
        url: 'https://boavizta.org/' },
      { ref: 'Negaoctet', detail: 'Base de données ADEME des impacts environnementaux du numérique.',
        url: 'https://negaoctet.org/' },
      { ref: 'Green Software Foundation', detail: 'Foundation pour la sobriété logicielle.',
        url: 'https://greensoftware.foundation/' },
    ],
  },
  {
    title: 'Sources techniques (stack)',
    icon: '⚙️',
    items: [
      { ref: 'React', detail: 'Bibliothèque d\'interface utilisateur — Meta.',
        url: 'https://react.dev/' },
      { ref: 'Vite', detail: 'Outil de build et serveur de développement front-end.',
        url: 'https://vitejs.dev/' },
      { ref: 'Standard SCORM 1.2', detail: 'Advanced Distributed Learning (ADL) — interopérabilité LMS.',
        url: 'https://adlnet.gov/projects/scorm/' },
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
                L'ensemble du contenu pédagogique de Green IT Académie s'appuie sur les sources ci-dessous. Toutes les données chiffrées et juridiques ont été vérifiées au regard des textes officiels. Les références cliquables ouvrent le texte officiel ou le site de référence.
              </p>
            </div>

            {sections.map((section, idx) => (
              <div key={idx} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px 24px', marginBottom: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <h2 style={{ margin: '0 0 14px 0', fontSize: '15px', color: '#064e3b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{section.icon}</span>
                  {section.title}
                </h2>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                  {section.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: '2px solid #4ade80' }}>
                      <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '2px' }}>
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                            {item.ref}
                          </a>
                        ) : (
                          <span style={{ color: '#1a202c' }}>{item.ref}</span>
                        )}
                      </div>
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
