import React from 'react';

// =============================================================================
// Bibliothèque de visuels SVG inline pour Green IT Académie
// Tous les schémas sont 100 % SVG, sans dépendance, sans webfont, sans image bitmap.
// Cohérent avec les principes Green IT : zéro requête réseau supplémentaire.
// =============================================================================

const Wrapper = ({ children, caption }) => (
  <figure style={{ margin: '0 0 20px 0', backgroundColor: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #e2e8f0' }}>
    {children}
    {caption && (
      <figcaption style={{ marginTop: '12px', fontSize: '11px', color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>
        {caption}
      </figcaption>
    )}
  </figure>
);

// -------------------------------------------------- Pyramide des instruments
const InstrumentHierarchy = () => (
  <Wrapper caption="Figure 1 — Pyramide des instruments du Green IT, du plus contraignant au plus volontaire">
    <svg viewBox="0 0 480 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <polygon points="240,20 320,90 160,90" fill="#1e3a5f" />
      <text x="240" y="62" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="system-ui">Réglementation</text>
      <text x="240" y="80" textAnchor="middle" fill="#cbd5e0" fontSize="10" fontFamily="system-ui">Obligatoire</text>

      <polygon points="160,90 320,90 360,150 120,150" fill="#3182ce" />
      <text x="240" y="125" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="system-ui">Normes ISO / CEN</text>
      <text x="240" y="142" textAnchor="middle" fill="#bee3f8" fontSize="10" fontFamily="system-ui">Volontaire, souvent exigée</text>

      <polygon points="120,150 360,150 400,210 80,210" fill="#48bb78" />
      <text x="240" y="185" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="system-ui">Labels environnementaux</text>
      <text x="240" y="202" textAnchor="middle" fill="#c6f6d5" fontSize="10" fontFamily="system-ui">Vérifiés par tierce partie</text>

      <polygon points="80,210 400,210 440,260 40,260" fill="#ed8936" />
      <text x="240" y="245" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="system-ui">Codes de conduite et chartes</text>
      <text x="240" y="260" textAnchor="middle" fill="#feebc8" fontSize="10" fontFamily="system-ui">Engagement libre</text>

      <text x="20" y="50" fill="#1e3a5f" fontSize="11" fontWeight="600" fontFamily="system-ui">+ contraignant</text>
      <text x="20" y="245" fill="#ed8936" fontSize="11" fontWeight="600" fontFamily="system-ui">+ volontaire</text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Directive vs Règlement
const DirectiveVsRegulation = () => (
  <Wrapper caption="Figure 2 — Mécanisme de transposition des actes juridiques européens">
    <svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Directive */}
      <rect x="20" y="20" width="220" height="180" rx="6" fill="#fff5f5" stroke="#fc8181" strokeWidth="1.5" />
      <text x="130" y="42" textAnchor="middle" fill="#991b1b" fontSize="13" fontWeight="700" fontFamily="system-ui">Directive UE</text>
      <text x="130" y="58" textAnchor="middle" fill="#991b1b" fontSize="10" fontFamily="system-ui">fixe des OBJECTIFS</text>

      <rect x="50" y="78" width="160" height="32" rx="4" fill="#fed7d7" />
      <text x="130" y="98" textAnchor="middle" fill="#742a2a" fontSize="11" fontFamily="system-ui">↓ transposition (≤ 2 ans)</text>

      <rect x="50" y="120" width="160" height="32" rx="4" fill="#fff" stroke="#fc8181" />
      <text x="130" y="140" textAnchor="middle" fill="#742a2a" fontSize="11" fontFamily="system-ui">Loi nationale</text>

      <text x="130" y="180" textAnchor="middle" fill="#991b1b" fontSize="9" fontStyle="italic" fontFamily="system-ui">Ex : DEEE, RoHS, CSRD</text>

      {/* Règlement */}
      <rect x="280" y="20" width="220" height="180" rx="6" fill="#ecfdf5" stroke="#68d391" strokeWidth="1.5" />
      <text x="390" y="42" textAnchor="middle" fill="#166534" fontSize="13" fontWeight="700" fontFamily="system-ui">Règlement UE</text>
      <text x="390" y="58" textAnchor="middle" fill="#166534" fontSize="10" fontFamily="system-ui">application DIRECTE</text>

      <rect x="310" y="78" width="160" height="32" rx="4" fill="#c6f6d5" />
      <text x="390" y="98" textAnchor="middle" fill="#22543d" fontSize="11" fontFamily="system-ui">Pas de transposition</text>

      <rect x="310" y="120" width="160" height="32" rx="4" fill="#fff" stroke="#68d391" />
      <text x="390" y="140" textAnchor="middle" fill="#22543d" fontSize="11" fontFamily="system-ui">S'impose à tous les États</text>

      <text x="390" y="180" textAnchor="middle" fill="#166534" fontSize="9" fontStyle="italic" fontFamily="system-ui">Ex : Taxonomie, Écoconception, RGPD</text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Échelle PUE
const PUEScale = () => (
  <Wrapper caption="Figure 3 — Échelle d'efficacité énergétique PUE des datacenters (Power Usage Effectiveness)">
    <svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="pueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="40%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <rect x="40" y="70" width="460" height="30" rx="15" fill="url(#pueGrad)" />

      {/* Graduations */}
      {[
        { v: 1.0, x: 40, label: 'idéal théorique' },
        { v: 1.2, x: 132, label: 'excellent' },
        { v: 1.4, x: 224, label: 'EU Code' },
        { v: 1.6, x: 316, label: 'bon' },
        { v: 1.8, x: 408, label: 'moyen' },
        { v: 2.0, x: 500, label: 'à améliorer' },
      ].map(g => (
        <g key={g.v}>
          <line x1={g.x} y1="65" x2={g.x} y2="105" stroke="#1e3a5f" strokeWidth="1" />
          <text x={g.x} y="58" textAnchor="middle" fill="#1e3a5f" fontSize="11" fontWeight="700" fontFamily="system-ui">{g.v}</text>
          <text x={g.x} y="122" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui">{g.label}</text>
        </g>
      ))}

      {/* Marqueurs */}
      <g>
        <circle cx="178" cy="85" r="6" fill="#1e3a5f" stroke="#fff" strokeWidth="2" />
        <text x="178" y="155" textAnchor="middle" fill="#1e3a5f" fontSize="10" fontWeight="700" fontFamily="system-ui">LuxConnect / EBRC</text>
        <text x="178" y="167" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui">PUE ≈ 1.3</text>
      </g>
      <g>
        <circle cx="370" cy="85" r="6" fill="#dc2626" stroke="#fff" strokeWidth="2" />
        <text x="370" y="155" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="700" fontFamily="system-ui">Moyenne mondiale</text>
        <text x="370" y="167" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui">PUE ≈ 1.55 (Uptime 2024)</text>
      </g>

      <text x="270" y="22" textAnchor="middle" fill="#1e3a5f" fontSize="12" fontWeight="700" fontFamily="system-ui">
        PUE = Énergie totale du datacenter / Énergie consommée par l'IT
      </text>
      <text x="270" y="38" textAnchor="middle" fill="#64748b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
        Plus la valeur est proche de 1.0, meilleure est l'efficacité énergétique
      </text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Cycle ACV
const ACVCycle = () => (
  <Wrapper caption="Figure 4 — Phases du cycle de vie d'un produit selon ISO 14040/44">
    <svg viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[
        { x: 70,  y: 130, label: '1. Extraction', sub: 'matières premières', color: '#4299e1' },
        { x: 180, y: 60,  label: '2. Fabrication', sub: 'composants & assemblage', color: '#3182ce' },
        { x: 290, y: 60,  label: '3. Distribution', sub: 'transport, emballage', color: '#48bb78' },
        { x: 400, y: 60,  label: '4. Utilisation', sub: 'énergie, consommables', color: '#ed8936' },
        { x: 470, y: 130, label: '5. Fin de vie', sub: 'collecte DEEE', color: '#e53e3e' },
        { x: 270, y: 200, label: 'Réemploi · Recyclage', sub: 'boucle circulaire', color: '#9f7aea' },
      ].map((node, i) => (
        <g key={i}>
          <rect x={node.x - 60} y={node.y - 18} width="120" height="36" rx="18" fill={node.color} />
          <text x={node.x} y={node.y - 2} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="system-ui">{node.label}</text>
          <text x={node.x} y={node.y + 12} textAnchor="middle" fill="#fff" fontSize="9" fontFamily="system-ui" opacity="0.9">{node.sub}</text>
        </g>
      ))}

      {/* Flèches */}
      <g stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#arr)">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>
        <line x1="130" y1="125" x2="180" y2="80" />
        <line x1="240" y1="60" x2="290" y2="60" />
        <line x1="350" y1="60" x2="400" y2="60" />
        <line x1="430" y1="80" x2="470" y2="120" />
        <line x1="430" y1="135" x2="330" y2="195" />
        <path d="M 215 200 Q 80 200 80 145" />
      </g>

      <text x="270" y="245" textAnchor="middle" fill="#64748b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
        Approche "du berceau à la tombe" — voire "du berceau au berceau" si recyclage
      </text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Frise Green Deal
const GreenDealTimeline = () => (
  <Wrapper caption="Figure 5 — Calendrier des principales réglementations européennes Green IT">
    <svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <line x1="40" y1="120" x2="500" y2="120" stroke="#1e3a5f" strokeWidth="2" />

      {[
        { x: 60,  y: 80,  yr: '2019', label: 'Green Deal', color: '#22c55e' },
        { x: 140, y: 160, yr: '2020', label: 'Taxonomie', color: '#3182ce' },
        { x: 220, y: 80,  yr: '2022', label: 'CSRD', color: '#ed8936' },
        { x: 300, y: 160, yr: '2023', label: 'EED (refonte)', color: '#9f7aea' },
        { x: 380, y: 80,  yr: '2024', label: 'Écoconception', color: '#e53e3e' },
        { x: 460, y: 160, yr: '2026', label: 'CSRD vague 2', color: '#0ea5e9' },
      ].map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1="120" x2={p.x} y2={p.y + (p.y < 120 ? 14 : -14)} stroke={p.color} strokeWidth="1.5" />
          <circle cx={p.x} cy="120" r="5" fill={p.color} />
          <rect x={p.x - 38} y={p.y - 14} width="76" height="28" rx="4" fill={p.color} />
          <text x={p.x} y={p.y - 1} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="system-ui">{p.yr}</text>
          <text x={p.x} y={p.y + 10} textAnchor="middle" fill="#fff" fontSize="9" fontFamily="system-ui">{p.label}</text>
        </g>
      ))}

      <text x="270" y="30" textAnchor="middle" fill="#1e3a5f" fontSize="13" fontWeight="700" fontFamily="system-ui">
        Du Green Deal à l'écoconception : ~5 ans pour structurer un cadre Green IT cohérent
      </text>
      <text x="270" y="215" textAnchor="middle" fill="#64748b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
        Objectif final : neutralité carbone de l'UE en 2050
      </text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Niveaux EPEAT
const EpeatLevels = () => (
  <Wrapper caption="Figure 6 — Les trois niveaux du label EPEAT">
    <svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[
        { x: 60,  level: 'Bronze', color: '#a16207', bg: '#fef3c7', criteria: 'Critères obligatoires', pct: '~23 obligatoires' },
        { x: 200, level: 'Argent', color: '#64748b', bg: '#e2e8f0', criteria: 'Obligatoires + 50 % optionnels', pct: '~23 + 50 %' },
        { x: 340, level: 'Or',     color: '#b45309', bg: '#fde68a', criteria: 'Obligatoires + 75 % optionnels', pct: '~23 + 75 %' },
      ].map((n, i) => (
        <g key={i}>
          <rect x={n.x} y="40" width="140" height="130" rx="8" fill={n.bg} stroke={n.color} strokeWidth="1.5" />
          <circle cx={n.x + 70} cy="78" r="22" fill={n.color} />
          <text x={n.x + 70} y="84" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="system-ui">{n.level[0]}</text>
          <text x={n.x + 70} y="118" textAnchor="middle" fill={n.color} fontSize="13" fontWeight="700" fontFamily="system-ui">{n.level}</text>
          <text x={n.x + 70} y="138" textAnchor="middle" fill="#1f2937" fontSize="10" fontFamily="system-ui">{n.criteria}</text>
          <text x={n.x + 70} y="156" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui">{n.pct}</text>
        </g>
      ))}

      <text x="260" y="25" textAnchor="middle" fill="#1e3a5f" fontSize="12" fontWeight="700" fontFamily="system-ui">
        Niveaux d'exigence environnementale croissants
      </text>
      <text x="500" y="115" textAnchor="middle" fill="#1e3a5f" fontSize="14" fontFamily="system-ui">→</text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Cycle PDCA
const PDCACycle = () => (
  <Wrapper caption="Figure 7 — Cycle PDCA (Plan-Do-Check-Act) — base de tous les systèmes de management ISO">
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <circle cx="200" cy="160" r="110" fill="none" stroke="#cbd5e0" strokeWidth="2" strokeDasharray="4 4" />

      {[
        { angle: -90, label: 'PLAN',  sub: 'Planifier',  detail: 'Identifier risques & objectifs', color: '#3182ce' },
        { angle: 0,   label: 'DO',    sub: 'Réaliser',   detail: 'Mettre en œuvre les actions',    color: '#22c55e' },
        { angle: 90,  label: 'CHECK', sub: 'Vérifier',   detail: 'Mesurer la performance',         color: '#ed8936' },
        { angle: 180, label: 'ACT',   sub: 'Agir',       detail: 'Améliorer en continu',           color: '#9333ea' },
      ].map((q, i) => {
        const rad = (q.angle * Math.PI) / 180;
        const x = 200 + 110 * Math.cos(rad);
        const y = 160 + 110 * Math.sin(rad);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="34" fill={q.color} />
            <text x={x} y={y - 2} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="system-ui">{q.label}</text>
            <text x={x} y={y + 14} textAnchor="middle" fill="#fff" fontSize="10" fontFamily="system-ui" opacity="0.9">{q.sub}</text>
            <text x={x} y={y + (q.angle === 90 ? 60 : -50)} textAnchor="middle" fill="#1e3a5f" fontSize="10" fontFamily="system-ui">{q.detail}</text>
          </g>
        );
      })}

      <text x="200" y="160" textAnchor="middle" fill="#1e3a5f" fontSize="12" fontWeight="700" fontFamily="system-ui">Amélioration</text>
      <text x="200" y="175" textAnchor="middle" fill="#1e3a5f" fontSize="12" fontWeight="700" fontFamily="system-ui">continue</text>

      <text x="200" y="305" textAnchor="middle" fill="#64748b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
        Modèle Deming repris par ISO 9001, 14001, 50001, 27001…
      </text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Comparaison labels
const LabelsComparison = () => (
  <Wrapper caption="Figure 8 — Comparatif des trois principaux labels environnementaux IT">
    <svg viewBox="0 0 560 230" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* En-têtes */}
      <text x="120" y="32" fill="#1e3a5f" fontSize="12" fontWeight="700" fontFamily="system-ui">Critère</text>
      <text x="240" y="32" textAnchor="middle" fill="#1e3a5f" fontSize="12" fontWeight="700" fontFamily="system-ui">EPEAT</text>
      <text x="360" y="32" textAnchor="middle" fill="#1e3a5f" fontSize="12" fontWeight="700" fontFamily="system-ui">Energy Star</text>
      <text x="480" y="32" textAnchor="middle" fill="#1e3a5f" fontSize="12" fontWeight="700" fontFamily="system-ui">Blue Angel</text>

      <line x1="20" y1="42" x2="540" y2="42" stroke="#cbd5e0" />

      {[
        { y: 70,  label: 'Origine',           v1: 'USA (GEC)',     v2: 'USA (EPA, 1992)', v3: 'Allemagne, 1978' },
        { y: 100, label: 'Périmètre',         v1: 'Multi-critères', v2: 'Énergie surtout', v3: 'Multi-critères + durabilité' },
        { y: 130, label: 'Niveau exigence',   v1: 'Bronze→Argent→Or', v2: 'Standard',     v3: 'Strict (≥ Energy Star)' },
        { y: 160, label: 'Garantie pièces',   v1: '—',             v2: '—',               v3: '≥ 5 ans' },
        { y: 190, label: 'Reconnaissance',    v1: 'Mondiale',      v2: 'Mondiale',        v3: 'UE forte' },
      ].map((row, i) => (
        <g key={i}>
          <text x="30" y={row.y} fill="#374151" fontSize="11" fontFamily="system-ui">{row.label}</text>
          <text x="240" y={row.y} textAnchor="middle" fill="#1e3a5f" fontSize="11" fontFamily="system-ui">{row.v1}</text>
          <text x="360" y={row.y} textAnchor="middle" fill="#1e3a5f" fontSize="11" fontFamily="system-ui">{row.v2}</text>
          <text x="480" y={row.y} textAnchor="middle" fill="#1e3a5f" fontSize="11" fontFamily="system-ui">{row.v3}</text>
          {i < 4 && <line x1="20" y1={row.y + 8} x2="540" y2={row.y + 8} stroke="#f1f5f9" />}
        </g>
      ))}

      <line x1="220" y1="42" x2="220" y2="200" stroke="#e2e8f0" />
      <line x1="340" y1="42" x2="340" y2="200" stroke="#e2e8f0" />
      <line x1="460" y1="42" x2="460" y2="200" stroke="#e2e8f0" />
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Trajectoire CNDCP
const CNDCPTrajectory = () => (
  <Wrapper caption="Figure 9 — Engagements du Climate Neutral Data Centre Pact (signé en 2021)">
    <svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Trois colonnes */}
      {[
        { x: 30,  yr: '2021', title: 'Signature', items: ['Google, AWS, Microsoft', 'OVHcloud, Equinix', 'Scaleway, Digital Realty'], color: '#94a3b8' },
        { x: 200, yr: '2025', title: 'Jalon intermédiaire', items: ['PUE ≤ 1.3 (nouveaux DC)', '75 % énergie décarbonée', 'Réutilisation chaleur'], color: '#ed8936' },
        { x: 370, yr: '2030', title: 'Neutralité', items: ['100 % renouvelable', 'Neutralité carbone', 'Économie circulaire serveurs', 'WUE optimisé'], color: '#22c55e' },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y="30" width="150" height="190" rx="8" fill="#fff" stroke={c.color} strokeWidth="1.5" />
          <rect x={c.x} y="30" width="150" height="34" rx="8" fill={c.color} />
          <text x={c.x + 75} y="52" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="system-ui">{c.yr}</text>
          <text x={c.x + 75} y="82" textAnchor="middle" fill="#1e3a5f" fontSize="11" fontWeight="700" fontFamily="system-ui">{c.title}</text>
          {c.items.map((it, j) => (
            <text key={j} x={c.x + 10} y={108 + j * 22} fill="#374151" fontSize="10" fontFamily="system-ui">• {it}</text>
          ))}
        </g>
      ))}

      <text x="270" y="20" textAnchor="middle" fill="#1e3a5f" fontSize="12" fontWeight="700" fontFamily="system-ui">
        Trajectoire vers la neutralité carbone des datacenters européens
      </text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Registry
const VISUALS = {
  instrumentHierarchy: InstrumentHierarchy,
  directiveVsRegulation: DirectiveVsRegulation,
  pueScale: PUEScale,
  acvCycle: ACVCycle,
  greenDealTimeline: GreenDealTimeline,
  epeatLevels: EpeatLevels,
  pdcaCycle: PDCACycle,
  labelsComparison: LabelsComparison,
  cndcpTrajectory: CNDCPTrajectory,
};

export default function Visual({ name }) {
  const Component = VISUALS[name];
  if (!Component) return null;
  return <Component />;
}

export { VISUALS };
