import React, { useState } from 'react';

// =============================================================================
// Bibliothèque de visuels SVG inline pour Green IT Académie.
// Tous les schémas sont 100 % SVG, sans dépendance, sans webfont, sans bitmap.
// =============================================================================

const Wrapper = ({ children, caption, animated }) => {
  const [replayKey, setReplayKey] = useState(0);
  return (
    <figure style={{ margin: '0 0 20px 0', backgroundColor: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #e2e8f0' }}>
      <div key={replayKey}>{children}</div>
      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {caption && (
          <figcaption style={{ flex: 1, fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
            {caption}
          </figcaption>
        )}
        {animated && (
          <button
            onClick={() => setReplayKey(k => k + 1)}
            title="Rejouer l'animation"
            style={{
              flexShrink: 0, padding: '4px 10px',
              backgroundColor: '#f0fdf4', color: '#166534',
              border: '1px solid #86efac', borderRadius: '5px',
              fontSize: '11px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            ↺ Rejouer
          </button>
        )}
      </div>
    </figure>
  );
};

// -------------------------------------------------- Pyramide des instruments
const InstrumentHierarchy = () => (
  <Wrapper caption="Figure — Pyramide des instruments du Green IT, du plus contraignant au plus volontaire">
    {/* Vraie pyramide à pointe : pentes continues de l'apex (310,25) à la base (40,320)-(580,320).
        Les textes sont placés dans la partie basse de chaque palier pour rester lisibles. */}
    <svg viewBox="0 0 620 340" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Tier 1 — vraie pointe (triangle) */}
      <polygon points="310,25 392,115 228,115" fill="#064e3b" />
      <text x="310" y="92" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="system-ui">Réglementation</text>
      <text x="310" y="108" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontFamily="system-ui">Obligatoire — sanctions</text>

      {/* Tier 2 — trapèze, pentes continues avec tier 1 */}
      <polygon points="228,115 392,115 461,190 159,190" fill="#3182ce" />
      <text x="310" y="150" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="system-ui">Normes ISO / CEN</text>
      <text x="310" y="168" textAnchor="middle" fill="#bee3f8" fontSize="10" fontFamily="system-ui">Volontaire, souvent exigée</text>

      {/* Tier 3 — trapèze */}
      <polygon points="159,190 461,190 521,255 99,255" fill="#48bb78" />
      <text x="310" y="222" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="system-ui">Labels environnementaux</text>
      <text x="310" y="240" textAnchor="middle" fill="#dcfce7" fontSize="10" fontFamily="system-ui">Vérifiés par tierce partie</text>

      {/* Tier 4 — base */}
      <polygon points="99,255 521,255 580,320 40,320" fill="#ed8936" />
      <text x="310" y="287" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="system-ui">Codes de conduite et chartes</text>
      <text x="310" y="305" textAnchor="middle" fill="#feebc8" fontSize="10" fontFamily="system-ui">Engagement libre</text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Directive vs Règlement
const DirectiveVsRegulation = () => (
  <Wrapper caption="Figure — Mécanisme de transposition des actes juridiques européens">
    <svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect x="20" y="20" width="240" height="200" rx="6" fill="#fff5f5" stroke="#fc8181" strokeWidth="1.5" />
      <text x="140" y="46" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="700" fontFamily="system-ui">Directive UE</text>
      <text x="140" y="64" textAnchor="middle" fill="#991b1b" fontSize="10" fontFamily="system-ui">fixe des OBJECTIFS</text>

      <rect x="50" y="84" width="180" height="34" rx="4" fill="#fed7d7" />
      <text x="140" y="105" textAnchor="middle" fill="#742a2a" fontSize="11" fontFamily="system-ui">↓ transposition (≤ 2 ans)</text>

      <rect x="50" y="128" width="180" height="34" rx="4" fill="#fff" stroke="#fc8181" />
      <text x="140" y="149" textAnchor="middle" fill="#742a2a" fontSize="11" fontFamily="system-ui">Loi nationale</text>

      <text x="140" y="195" textAnchor="middle" fill="#991b1b" fontSize="10" fontStyle="italic" fontFamily="system-ui">Ex : DEEE, RoHS, CSRD, EED</text>

      <rect x="300" y="20" width="240" height="200" rx="6" fill="#ecfdf5" stroke="#68d391" strokeWidth="1.5" />
      <text x="420" y="46" textAnchor="middle" fill="#166534" fontSize="14" fontWeight="700" fontFamily="system-ui">Règlement UE</text>
      <text x="420" y="64" textAnchor="middle" fill="#166534" fontSize="10" fontFamily="system-ui">application DIRECTE</text>

      <rect x="330" y="84" width="180" height="34" rx="4" fill="#c6f6d5" />
      <text x="420" y="105" textAnchor="middle" fill="#22543d" fontSize="11" fontFamily="system-ui">Pas de transposition</text>

      <rect x="330" y="128" width="180" height="34" rx="4" fill="#fff" stroke="#68d391" />
      <text x="420" y="149" textAnchor="middle" fill="#22543d" fontSize="11" fontFamily="system-ui">S'impose à tous les États</text>

      <text x="420" y="195" textAnchor="middle" fill="#166534" fontSize="10" fontStyle="italic" fontFamily="system-ui">Ex : Taxonomie, Écoconception, RGPD</text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Échelle PUE
const PUEScale = () => (
  <Wrapper caption="Figure — Échelle d'efficacité énergétique PUE des datacenters">
    <svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="pueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="40%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      <text x="280" y="24" textAnchor="middle" fill="#064e3b" fontSize="12" fontWeight="700" fontFamily="system-ui">
        PUE = Énergie totale du datacenter ÷ Énergie consommée par l'IT
      </text>
      <text x="280" y="42" textAnchor="middle" fill="#64748b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
        Plus la valeur est proche de 1.0, meilleure est l'efficacité énergétique
      </text>

      <rect x="50" y="80" width="460" height="30" rx="15" fill="url(#pueGrad)" />

      {[
        { v: '1.0', x: 50,  label: 'idéal théorique' },
        { v: '1.2', x: 142, label: 'excellent' },
        { v: '1.4', x: 234, label: 'EU Code' },
        { v: '1.6', x: 326, label: 'bon' },
        { v: '1.8', x: 418, label: 'moyen' },
        { v: '2.0', x: 510, label: 'à améliorer' },
      ].map(g => (
        <g key={g.v}>
          <line x1={g.x} y1="75" x2={g.x} y2="115" stroke="#064e3b" strokeWidth="1" />
          <text x={g.x} y="70" textAnchor="middle" fill="#064e3b" fontSize="11" fontWeight="700" fontFamily="system-ui">{g.v}</text>
          <text x={g.x} y="130" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui">{g.label}</text>
        </g>
      ))}

      <g>
        <circle cx="188" cy="95" r="6" fill="#064e3b" stroke="#fff" strokeWidth="2" />
        <line x1="188" y1="102" x2="188" y2="155" stroke="#064e3b" strokeDasharray="2 2" />
        <text x="188" y="170" textAnchor="middle" fill="#064e3b" fontSize="10" fontWeight="700" fontFamily="system-ui">LuxConnect / EBRC</text>
        <text x="188" y="184" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui">PUE ≈ 1.3</text>
      </g>
      <g>
        <circle cx="380" cy="95" r="6" fill="#dc2626" stroke="#fff" strokeWidth="2" />
        <line x1="380" y1="102" x2="380" y2="155" stroke="#dc2626" strokeDasharray="2 2" />
        <text x="380" y="170" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="700" fontFamily="system-ui">Moyenne mondiale</text>
        <text x="380" y="184" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui">PUE ≈ 1.55 (Uptime 2024)</text>
      </g>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Cycle ACV
const ACVCycle = () => (
  <Wrapper caption="Figure — Phases du cycle de vie d'un produit selon ISO 14040/44 (« du berceau à la tombe »)">
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* 5 phases linéaires en haut */}
      {[
        { x: 70,  label: '1. Extraction',   sub: 'matières premières', color: '#4299e1' },
        { x: 190, label: '2. Fabrication',  sub: 'composants',         color: '#3182ce' },
        { x: 310, label: '3. Distribution', sub: 'transport',          color: '#48bb78' },
        { x: 430, label: '4. Utilisation',  sub: 'énergie',            color: '#ed8936' },
        { x: 540, label: '5. Fin de vie',   sub: 'collecte DEEE',      color: '#e53e3e' },
      ].map((node, i, arr) => (
        <g key={i}>
          <rect x={node.x - 50} y="60" width="100" height="48" rx="8" fill={node.color} />
          <text x={node.x} y="80" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="system-ui">{node.label}</text>
          <text x={node.x} y="96" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="system-ui" opacity="0.9">{node.sub}</text>
          {i < arr.length - 1 && (
            <g>
              <line x1={node.x + 50} y1="84" x2={arr[i + 1].x - 50} y2="84" stroke="#94a3b8" strokeWidth="1.5" />
              <polygon points={`${arr[i + 1].x - 50},84 ${arr[i + 1].x - 56},80 ${arr[i + 1].x - 56},88`} fill="#94a3b8" />
            </g>
          )}
        </g>
      ))}

      {/* Boucle de recyclage en bas */}
      <rect x="220" y="170" width="160" height="44" rx="8" fill="#9f7aea" />
      <text x="300" y="190" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="system-ui">Réemploi · Recyclage</text>
      <text x="300" y="204" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="system-ui" opacity="0.9">boucle d'économie circulaire</text>

      {/* Flèches de bouclage */}
      <path d="M 540 110 Q 540 165 380 192" fill="none" stroke="#9f7aea" strokeWidth="1.5" strokeDasharray="3 3" />
      <polygon points="384,189 374,189 379,196" fill="#9f7aea" />

      <path d="M 220 192 Q 70 165 70 110" fill="none" stroke="#9f7aea" strokeWidth="1.5" strokeDasharray="3 3" />
      <polygon points="73,114 67,108 76,108" fill="#9f7aea" />

      <text x="300" y="36" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
        ISO 14040 / 14044 — Cycle de vie complet d'un produit
      </text>
      <text x="300" y="245" textAnchor="middle" fill="#64748b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
        Approche « du berceau à la tombe » — ou « du berceau au berceau » si recyclage généralisé
      </text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Frise Green Deal
const GreenDealTimeline = () => (
  <Wrapper caption="Figure — Calendrier des principales réglementations européennes Green IT">
    <svg viewBox="0 0 580 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <text x="290" y="30" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
        Du Green Deal à l'écoconception : un cadre Green IT bâti en cinq ans
      </text>

      <line x1="40" y1="125" x2="540" y2="125" stroke="#064e3b" strokeWidth="2" />

      {[
        { x: 70,  y: 85,  yr: '2019', label: 'Green Deal',     color: '#22c55e' },
        { x: 160, y: 165, yr: '2020', label: 'Taxonomie',      color: '#3182ce' },
        { x: 250, y: 85,  yr: '2022', label: 'CSRD',           color: '#ed8936' },
        { x: 340, y: 165, yr: '2023', label: 'EED refonte',    color: '#9f7aea' },
        { x: 430, y: 85,  yr: '2024', label: 'Écoconception',  color: '#e53e3e' },
        { x: 520, y: 165, yr: '2026', label: 'CSRD vague 2',   color: '#0ea5e9' },
      ].map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1="125" x2={p.x} y2={p.y < 125 ? p.y + 16 : p.y - 16} stroke={p.color} strokeWidth="1.5" />
          <circle cx={p.x} cy="125" r="5" fill={p.color} />
          <rect x={p.x - 42} y={p.y - 16} width="84" height="32" rx="4" fill={p.color} />
          <text x={p.x} y={p.y - 2} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="system-ui">{p.yr}</text>
          <text x={p.x} y={p.y + 11} textAnchor="middle" fill="#fff" fontSize="9" fontFamily="system-ui">{p.label}</text>
        </g>
      ))}

      <text x="290" y="220" textAnchor="middle" fill="#64748b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
        Objectif final : neutralité carbone de l'UE en 2050
      </text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Niveaux EPEAT (HTML)
const EpeatLevels = () => {
  const levels = [
    { letter: 'B', level: 'Bronze', color: '#a16207', bg: '#fef3c7', border: '#d97706', crit: 'Critères obligatoires uniquement',  pct: '≈ 23 critères requis' },
    { level: 'Argent', letter: 'A', color: '#64748b', bg: '#e2e8f0', border: '#94a3b8', crit: 'Obligatoires + 50 % des optionnels', pct: 'requis + 50 %' },
    { level: 'Or',     letter: 'O', color: '#b45309', bg: '#fde68a', border: '#d97706', crit: 'Obligatoires + 75 % des optionnels', pct: 'requis + 75 %' },
  ];
  return (
    <Wrapper caption="Figure — Les trois niveaux du label EPEAT">
      <div style={{ display: 'block' }}>
        <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#064e3b', marginBottom: '14px' }}>
          Exigence environnementale croissante
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', alignItems: 'stretch' }}>
          {levels.map((n, i) => (
            <div key={i} style={{
              backgroundColor: n.bg, border: `1.5px solid ${n.border}`, borderRadius: '10px',
              padding: '18px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: n.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '20px', fontWeight: '700',
              }}>{n.letter}</div>
              <div style={{ color: n.color, fontSize: '15px', fontWeight: 700 }}>{n.level}</div>
              <div style={{ color: '#1f2937', fontSize: '12px', lineHeight: '1.4' }}>{n.crit}</div>
              <div style={{ color: '#64748b', fontSize: '11px', fontStyle: 'italic' }}>{n.pct}</div>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

// -------------------------------------------------- Cycle PDCA (redessiné)
const PDCACycle = () => (
  <Wrapper caption="Figure — Cycle PDCA (Plan-Do-Check-Act), base de tous les systèmes de management ISO">
    <svg viewBox="0 0 520 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <text x="260" y="26" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
        Amélioration continue (modèle Deming)
      </text>

      {/* 4 quadrants en grille 2x2 */}
      {[
        { x: 100, y: 70,  letter: 'P', label: 'PLAN',  sub: 'Planifier', detail: 'Identifier les enjeux, fixer des objectifs mesurables', color: '#3182ce' },
        { x: 320, y: 70,  letter: 'D', label: 'DO',    sub: 'Réaliser',  detail: 'Mettre en œuvre les actions, former, documenter',     color: '#22c55e' },
        { x: 320, y: 190, letter: 'C', label: 'CHECK', sub: 'Vérifier',  detail: 'Mesurer, auditer, comparer aux objectifs',            color: '#ed8936' },
        { x: 100, y: 190, letter: 'A', label: 'ACT',   sub: 'Agir',      detail: 'Corriger les écarts, ajuster, relancer le cycle',     color: '#9333ea' },
      ].map((q, i) => (
        <g key={i}>
          <rect x={q.x} y={q.y} width="100" height="100" rx="10" fill={q.color} />
          <text x={q.x + 50} y={q.y + 34} textAnchor="middle" fill="#fff" fontSize="28" fontWeight="700" fontFamily="system-ui">{q.letter}</text>
          <text x={q.x + 50} y={q.y + 60} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="system-ui">{q.label}</text>
          <text x={q.x + 50} y={q.y + 78} textAnchor="middle" fill="#fff" fontSize="10" fontFamily="system-ui" opacity="0.9">{q.sub}</text>
        </g>
      ))}

      {/* Flèches circulaires */}
      <path d="M 210 105 L 310 105" stroke="#064e3b" strokeWidth="1.5" fill="none" />
      <polygon points="310,105 304,101 304,109" fill="#064e3b" />

      <path d="M 370 180 L 370 188" stroke="#064e3b" strokeWidth="1.5" fill="none" />
      <polygon points="370,190 366,184 374,184" fill="#064e3b" />

      <path d="M 310 240 L 210 240" stroke="#064e3b" strokeWidth="1.5" fill="none" />
      <polygon points="210,240 216,236 216,244" fill="#064e3b" />

      <path d="M 150 188 L 150 180" stroke="#064e3b" strokeWidth="1.5" fill="none" />
      <polygon points="150,170 146,178 154,178" fill="#064e3b" />

    </svg>
  </Wrapper>
);

// -------------------------------------------------- Comparaison labels (HTML)
const LabelsComparison = () => {
  const rows = [
    { label: 'Origine',          v1: 'USA (GEC)',             v2: 'USA (EPA, 1992)', v3: 'Allemagne, 1978' },
    { label: 'Périmètre',        v1: 'Multi-critères',        v2: 'Énergie',         v3: 'Multi-critères + durabilité' },
    { label: "Niveau d'exigence", v1: 'Bronze / Argent / Or', v2: 'Standard',        v3: 'Strict (≥ Energy Star)' },
    { label: 'Garantie pièces',  v1: '—',                     v2: '—',               v3: '≥ 5 ans' },
    { label: 'Reconnaissance',   v1: 'Mondiale',              v2: 'Mondiale',        v3: 'UE forte' },
  ];
  const td = { padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontSize: '12px', color: '#064e3b', textAlign: 'center', verticalAlign: 'middle' };
  const th = { padding: '12px', backgroundColor: '#064e3b', color: '#fff', fontSize: '13px', fontWeight: 700, textAlign: 'center' };
  return (
    <Wrapper caption="Figure — Comparatif des trois principaux labels environnementaux IT">
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: '8px', overflow: 'hidden', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: 'left', width: '24%' }}>Critère</th>
            <th style={{ ...th, width: '24%' }}>EPEAT</th>
            <th style={{ ...th, width: '24%' }}>Energy Star</th>
            <th style={{ ...th, width: '28%' }}>Blue Angel</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
              <td style={{ ...td, textAlign: 'left', fontWeight: 600, color: '#1e293b' }}>{row.label}</td>
              <td style={td}>{row.v1}</td>
              <td style={td}>{row.v2}</td>
              <td style={td}>{row.v3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
};

// -------------------------------------------------- Trajectoire CNDCP
const CNDCPTrajectory = () => (
  <Wrapper caption="Figure — Engagements du Climate Neutral Data Centre Pact (signé en 2021)">
    <svg viewBox="0 0 580 270" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <text x="290" y="28" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
        Trajectoire vers la neutralité carbone des datacenters européens
      </text>

      {[
        { x: 30,  yr: '2021', title: 'Signature', items: ['Google, AWS, Microsoft', 'OVHcloud, Equinix', 'Scaleway, Digital Realty', '100+ signataires'], color: '#94a3b8' },
        { x: 220, yr: '2025', title: 'Jalons intermédiaires', items: ['PUE ≤ 1.3 (nouveaux DC)', '75 % énergie décarbonée', 'Réutilisation chaleur', 'Audit EN 50600 annuel'], color: '#ed8936' },
        { x: 410, yr: '2030', title: 'Neutralité', items: ['100 % renouvelable', 'Neutralité carbone', 'Économie circulaire serveurs', 'WUE optimisé'], color: '#22c55e' },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y="50" width="150" height="210" rx="8" fill="#fff" stroke={c.color} strokeWidth="1.5" />
          <rect x={c.x} y="50" width="150" height="38" rx="8" fill={c.color} />
          <text x={c.x + 75} y="74" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700" fontFamily="system-ui">{c.yr}</text>
          <text x={c.x + 75} y="108" textAnchor="middle" fill="#064e3b" fontSize="11" fontWeight="700" fontFamily="system-ui">{c.title}</text>
          {c.items.map((it, j) => (
            <text key={j} x={c.x + 12} y={132 + j * 22} fill="#374151" fontSize="10" fontFamily="system-ui">• {it}</text>
          ))}
        </g>
      ))}

      {/* Flèches entre colonnes */}
      <line x1="180" y1="155" x2="215" y2="155" stroke="#94a3b8" strokeWidth="1.5" />
      <polygon points="215,155 209,151 209,159" fill="#94a3b8" />
      <line x1="370" y1="155" x2="405" y2="155" stroke="#94a3b8" strokeWidth="1.5" />
      <polygon points="405,155 399,151 399,159" fill="#94a3b8" />
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Empreinte numérique mondiale
const DigitalFootprint = () => (
  <Wrapper caption="Figure — Répartition de l'empreinte carbone du numérique (sources ADEME/ARCEP 2022)">
    <svg viewBox="0 0 580 260" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <text x="290" y="28" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
        Le numérique = 3-4 % des émissions mondiales de GES
      </text>
      <text x="290" y="45" textAnchor="middle" fill="#64748b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
        Comparable au transport aérien (2,5 %), en croissance rapide
      </text>

      {/* Camembert simplifié à 3 parts */}
      <g transform="translate(150, 145)">
        {/* Terminaux 65% */}
        <path d="M 0 0 L 0 -70 A 70 70 0 1 1 -41.1 56.6 Z" fill="#ed8936" />
        {/* Réseau 22% */}
        <path d="M 0 0 L -41.1 56.6 A 70 70 0 0 1 -67.9 -17.5 Z" fill="#3182ce" />
        {/* Datacenters 13% */}
        <path d="M 0 0 L -67.9 -17.5 A 70 70 0 0 1 0 -70 Z" fill="#9f7aea" />
      </g>

      {/* Légende */}
      <g transform="translate(320, 95)">
        {[
          { color: '#ed8936', label: 'Terminaux utilisateurs', pct: '65 %', sub: 'Fabrication (~80 %) + usage' },
          { color: '#3182ce', label: 'Réseaux de télécoms',   pct: '22 %', sub: 'Mobile, fibre, satellites' },
          { color: '#9f7aea', label: 'Datacenters',           pct: '13 %', sub: 'Croissance forte (IA, cloud)' },
        ].map((item, i) => (
          <g key={i} transform={`translate(0, ${i * 50})`}>
            <rect x="0" y="0" width="18" height="18" rx="3" fill={item.color} />
            <text x="28" y="13" fill="#064e3b" fontSize="12" fontWeight="700" fontFamily="system-ui">{item.label}</text>
            <text x="220" y="13" textAnchor="end" fill="#064e3b" fontSize="14" fontWeight="700" fontFamily="system-ui">{item.pct}</text>
            <text x="28" y="30" fill="#64748b" fontSize="10" fontFamily="system-ui">{item.sub}</text>
          </g>
        ))}
      </g>

      <text x="290" y="245" textAnchor="middle" fill="#64748b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
        Levier n°1 : prolonger la durée de vie des terminaux (impact fabrication dominant)
      </text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Double matérialité CSRD
const DoubleMaterialite = () => (
  <Wrapper caption="Figure — Le principe de double matérialité (CSRD)">
    <svg viewBox="0 0 580 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <text x="290" y="28" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
        La double matérialité impose deux regards complémentaires
      </text>

      {/* Cercle entreprise au centre */}
      <circle cx="290" cy="155" r="42" fill="#064e3b" />
      <text x="290" y="152" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="system-ui">Entreprise</text>
      <text x="290" y="168" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="system-ui" opacity="0.9">(activité IT)</text>

      {/* Flèche vers environnement */}
      <line x1="332" y1="135" x2="450" y2="100" stroke="#22c55e" strokeWidth="2" />
      <polygon points="450,100 442,98 444,108" fill="#22c55e" />
      <rect x="445" y="60" width="125" height="78" rx="8" fill="#ecfdf5" stroke="#22c55e" strokeWidth="1.5" />
      <text x="507" y="80" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="700" fontFamily="system-ui">Matérialité d'impact</text>
      <text x="507" y="98" textAnchor="middle" fill="#166534" fontSize="9" fontFamily="system-ui">L'entreprise → Environnement</text>
      <text x="507" y="115" textAnchor="middle" fill="#374151" fontSize="9" fontFamily="system-ui">Ex : empreinte carbone IT,</text>
      <text x="507" y="128" textAnchor="middle" fill="#374151" fontSize="9" fontFamily="system-ui">DEEE générés, consommation</text>

      {/* Flèche depuis environnement */}
      <line x1="248" y1="135" x2="130" y2="100" stroke="#ed8936" strokeWidth="2" />
      <polygon points="130,100 138,98 136,108" fill="#ed8936" />
      <rect x="10" y="60" width="125" height="78" rx="8" fill="#fff8e1" stroke="#ed8936" strokeWidth="1.5" />
      <text x="72" y="80" textAnchor="middle" fill="#92400e" fontSize="11" fontWeight="700" fontFamily="system-ui">Matérialité financière</text>
      <text x="72" y="98" textAnchor="middle" fill="#92400e" fontSize="9" fontFamily="system-ui">Environnement → L'entreprise</text>
      <text x="72" y="115" textAnchor="middle" fill="#374151" fontSize="9" fontFamily="system-ui">Ex : risque climatique sur DC,</text>
      <text x="72" y="128" textAnchor="middle" fill="#374151" fontSize="9" fontFamily="system-ui">prix de l'énergie, transition</text>

      {/* Encadré bas */}
      <rect x="120" y="215" width="340" height="50" rx="6" fill="#eff6ff" stroke="#bfdbfe" />
      <text x="290" y="234" textAnchor="middle" fill="#064e3b" fontSize="11" fontWeight="700" fontFamily="system-ui">
        La CSRD impose les DEUX analyses simultanément
      </text>
      <text x="290" y="252" textAnchor="middle" fill="#064e3b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
        Reporting via les standards ESRS, audité par un commissaire aux comptes
      </text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Chaîne de confiance Norme/Cert/Acc
const TrustChain = () => (
  <Wrapper caption="Figure — La chaîne de confiance : norme, certification, accréditation">
    <svg viewBox="0 0 580 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <text x="290" y="28" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
        Trois niveaux à ne pas confondre
      </text>

      {[
        { x: 30,  title: 'Norme',         actor: 'ISO / CEN / ILNAS', detail: 'Document de référence', icon: '📄', color: '#3182ce' },
        { x: 220, title: 'Certification', actor: 'Organisme certificateur',  detail: 'Audit de l\'organisation', icon: '✓',  color: '#22c55e' },
        { x: 410, title: 'Accréditation', actor: 'OLAS / COFRAC / DAkkS',    detail: 'Audit du certificateur',   icon: '⭐', color: '#9333ea' },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y="60" width="140" height="135" rx="8" fill="#fff" stroke={c.color} strokeWidth="1.5" />
          <rect x={c.x} y="60" width="140" height="38" rx="8" fill={c.color} />
          <text x={c.x + 70} y="84" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="system-ui">{c.title}</text>
          <text x={c.x + 70} y="125" textAnchor="middle" fill="#064e3b" fontSize="11" fontWeight="700" fontFamily="system-ui">{c.actor}</text>
          <text x={c.x + 70} y="155" textAnchor="middle" fill="#374151" fontSize="10" fontFamily="system-ui">{c.detail}</text>
          <text x={c.x + 70} y="180" textAnchor="middle" fontSize="20" fontFamily="system-ui">{c.icon}</text>
        </g>
      ))}

      {/* Flèches */}
      <line x1="170" y1="127" x2="218" y2="127" stroke="#94a3b8" strokeWidth="2" />
      <polygon points="218,127 210,123 210,131" fill="#94a3b8" />
      <line x1="360" y1="127" x2="408" y2="127" stroke="#94a3b8" strokeWidth="2" />
      <polygon points="408,127 400,123 400,131" fill="#94a3b8" />

      <text x="194" y="118" textAnchor="middle" fill="#64748b" fontSize="9" fontStyle="italic" fontFamily="system-ui">applique</text>
      <text x="384" y="118" textAnchor="middle" fill="#64748b" fontSize="9" fontStyle="italic" fontFamily="system-ui">valide</text>

      <text x="290" y="225" textAnchor="middle" fill="#64748b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
        Norme ISO/IEC 17021 : ce qui garantit que le certificateur est lui-même compétent
      </text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Objectifs PNEC Luxembourg
const PNECLuxembourg = () => (
  <Wrapper caption="Figure — Objectifs climat 2030 du Luxembourg (PNEC, mise à jour 2024)">
    <svg viewBox="0 0 580 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <text x="290" y="28" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
        Le Luxembourg vise plus haut que la moyenne UE
      </text>

      {[
        { x: 70,  value: '-55 %', label: 'Émissions GES', sub: 'vs 2005', barH: 165, color: '#e53e3e' },
        { x: 230, value: '37 %',  label: 'Énergies renouvelables', sub: 'mix final', barH: 110, color: '#22c55e' },
        { x: 390, value: '-42 %', label: 'Efficacité énergétique', sub: 'consommation', barH: 125, color: '#3182ce' },
      ].map((kpi, i) => (
        <g key={i}>
          {/* Barre */}
          <rect x={kpi.x} y={210 - kpi.barH} width="100" height={kpi.barH} rx="6" fill={kpi.color} />
          {/* Valeur dans la barre */}
          <text x={kpi.x + 50} y={210 - kpi.barH + 28} textAnchor="middle" fill="#fff" fontSize="22" fontWeight="700" fontFamily="system-ui">{kpi.value}</text>
          {/* Légende sous la barre */}
          <text x={kpi.x + 50} y="225" textAnchor="middle" fill="#064e3b" fontSize="11" fontWeight="700" fontFamily="system-ui">{kpi.label}</text>
          <text x={kpi.x + 50} y="237" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui">{kpi.sub}</text>
        </g>
      ))}

      {/* Ligne de référence UE */}
      <line x1="40" y1="100" x2="540" y2="100" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" />
      <text x="545" y="103" fill="#64748b" fontSize="9" fontFamily="system-ui">Objectif UE -55 %</text>
    </svg>
  </Wrapper>
);

// -------------------------------------------------- Calendrier CSRD
const CSRDTimeline = () => (
  <Wrapper caption="Figure — Calendrier d'entrée en vigueur progressive de la CSRD">
    <svg viewBox="0 0 580 260" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <text x="290" y="28" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
        La CSRD touche progressivement ~50 000 entreprises européennes
      </text>

      {[
        { y: 60,  yr: '2025', exo: 'exercice 2024', who: 'Grandes entreprises déjà NFRD', detail: '> 500 salariés + EIP', color: '#064e3b' },
        { y: 110, yr: '2026', exo: 'exercice 2025', who: 'Autres grandes entreprises', detail: '≥ 250 sal. OU > 50 M€ CA OU > 25 M€ bilan', color: '#3182ce' },
        { y: 160, yr: '2027', exo: 'exercice 2026', who: 'PME cotées', detail: '(opt-out possible jusqu\'en 2028)', color: '#48bb78' },
        { y: 210, yr: '2029', exo: 'exercice 2028', who: 'Filiales non-UE > 150 M€ CA UE', detail: 'Groupes étrangers actifs en Europe', color: '#ed8936' },
      ].map((row, i) => (
        <g key={i}>
          <rect x="30" y={row.y - 18} width="80" height="36" rx="6" fill={row.color} />
          <text x="70" y={row.y - 3} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="system-ui">{row.yr}</text>
          <text x="70" y={row.y + 12} textAnchor="middle" fill="#fff" fontSize="9" fontFamily="system-ui" opacity="0.9">{row.exo}</text>

          <rect x="125" y={row.y - 18} width="425" height="36" rx="6" fill="#f8fafc" stroke={row.color} strokeWidth="1" />
          <text x="138" y={row.y - 3} fill="#064e3b" fontSize="12" fontWeight="700" fontFamily="system-ui">{row.who}</text>
          <text x="138" y={row.y + 12} fill="#64748b" fontSize="10" fontFamily="system-ui">{row.detail}</text>
        </g>
      ))}
    </svg>
  </Wrapper>
);

// -------------------------------------------------- LuxIT Ecosystem (Module 6 — animé)
const LuxITEcosystem = () => {
  const actors = [
    { cx: 290, cy: 60,  label: 'LuxConnect', sub: 'DC gov. Tier IV',        color: '#3182ce', delay: 0.3 },
    { cx: 480, cy: 148, label: 'EBRC',        sub: 'Multi-certifié',         color: '#22c55e', delay: 0.5 },
    { cx: 420, cy: 268, label: 'ILNAS',       sub: 'Normes & accréditation', color: '#9333ea', delay: 0.7 },
    { cx: 160, cy: 268, label: 'CASES',       sub: 'Cybersécurité',          color: '#ed8936', delay: 0.9 },
    { cx: 100, cy: 148, label: 'POST Lux',    sub: 'Fibre & Cloud',          color: '#e53e3e', delay: 1.1 },
  ];
  return (
    <Wrapper caption="Figure — Écosystème numérique luxembourgeois : cinq acteurs d'une stratégie hub européen coordonnée" animated>
      <svg viewBox="0 0 580 316" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <style>{`
          @keyframes ecosFade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes ecosLine { from { stroke-dashoffset: 220; } to { stroke-dashoffset: 0; } }
        `}</style>
        <text x="290" y="18" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
          Luxembourg, hub numérique européen
        </text>
        {actors.map((a, i) => (
          <line key={`l${i}`}
            x1="290" y1="174" x2={a.cx} y2={a.cy}
            stroke={a.color} strokeWidth="1.5" strokeDasharray="220" strokeDashoffset="220" opacity="0.5"
            style={{ animation: `ecosLine 0.7s ease-out ${a.delay}s both` }}
          />
        ))}
        <g style={{ animation: 'ecosFade 0.5s ease-out 0s both' }}>
          <circle cx="290" cy="174" r="44" fill="#064e3b" />
          <text x="290" y="168" textAnchor="middle" fill="#fff" fontSize="20" fontFamily="system-ui">🇱🇺</text>
          <text x="290" y="186" textAnchor="middle" fill="#86efac" fontSize="9" fontWeight="700" fontFamily="system-ui">DIGITAL HUB</text>
        </g>
        {actors.map((a, i) => (
          <g key={`n${i}`} style={{ animation: `ecosFade 0.4s ease-out ${a.delay + 0.1}s both` }}>
            <rect x={a.cx - 50} y={a.cy - 20} width="100" height="40" rx="7" fill={a.color} />
            <text x={a.cx} y={a.cy - 4} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="system-ui">{a.label}</text>
            <text x={a.cx} y={a.cy + 11} textAnchor="middle" fill="#fff" fontSize="9" fontFamily="system-ui" opacity="0.85">{a.sub}</text>
          </g>
        ))}
        <g style={{ animation: 'ecosFade 0.5s ease-out 1.5s both' }}>
          <rect x="140" y="298" width="300" height="14" rx="4" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
          <text x="290" y="309" textAnchor="middle" fill="#166534" fontSize="9" fontWeight="600" fontFamily="system-ui">
            PUE moyen 1.3 · 100 % énergie verte · Hub cloud certifié UE
          </text>
        </g>
      </svg>
    </Wrapper>
  );
};

// -------------------------------------------------- Green IT Maturity Model (barres animées)
const GreenITMaturity = () => {
  const baseline = 230;
  const levels = [
    { label: 'Réactif',     sub: 'Conformité',   h: 44,  color: '#ef4444' },
    { label: 'Sensibilisé', sub: 'Awareness',     h: 88,  color: '#f59e0b' },
    { label: 'Structuré',   sub: 'Processus',     h: 132, color: '#eab308' },
    { label: 'Optimisé',    sub: 'Mesure',        h: 176, color: '#84cc16' },
    { label: 'Leader',      sub: 'Innovation',    h: 200, color: '#22c55e' },
  ];
  return (
    <Wrapper caption="Figure — Modèle de maturité Green IT : progression de la conformité réactive au leadership responsable" animated>
      <svg viewBox="0 0 580 278" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <style>{`
          @keyframes matGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
          @keyframes matFade { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
        <text x="290" y="18" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
          Modèle de maturité Green IT — 5 niveaux
        </text>
        <line x1="60" y1={baseline} x2="522" y2={baseline} stroke="#e2e8f0" strokeWidth="1" />
        {levels.map((lv, i) => {
          const x = 70 + i * 90;
          const d = 0.1 + i * 0.2;
          return (
            <g key={i}>
              <rect
                x={x} y={baseline - lv.h} width="80" height={lv.h} rx="4" fill={lv.color}
                style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: `matGrow 0.5s ease-out ${d}s both` }}
              />
              <text x={x + 40} y={baseline - lv.h + 20} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="system-ui"
                style={{ animation: `matFade 0.3s ease-out ${d + 0.3}s both` }}>{i + 1}</text>
              <text x={x + 40} y={baseline + 16} textAnchor="middle" fill="#064e3b" fontSize="10" fontWeight="700" fontFamily="system-ui"
                style={{ animation: `matFade 0.3s ease-out ${d}s both` }}>{lv.label}</text>
              <text x={x + 40} y={baseline + 29} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui"
                style={{ animation: `matFade 0.3s ease-out ${d}s both` }}>{lv.sub}</text>
            </g>
          );
        })}
        <g style={{ animation: 'matFade 0.5s ease-out 1.2s both' }}>
          <line x1="70" y1="250" x2="506" y2="250" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" />
          <polygon points="508,250 502,246 502,254" fill="#22c55e" />
          <text x="290" y="265" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600" fontFamily="system-ui">
            Progression vers la maturité responsable →
          </text>
        </g>
      </svg>
    </Wrapper>
  );
};

// -------------------------------------------------- ISO 50001 EnPI Trend (graphique animé)
const EnPITrend = () => {
  const baseline = 205, chartTop = 40, yMin = 70, yMax = 110;
  const chartH = baseline - chartTop;
  const toY = (v) => Math.round(baseline - ((v - yMin) / (yMax - yMin)) * chartH);
  const PX = [100, 200, 300, 400, 500];
  const data = [
    { yr: '2020', v: 100, cert: false },
    { yr: '2021', v: 97,  cert: false },
    { yr: '2022', v: 91,  cert: true  },
    { yr: '2023', v: 85,  cert: false },
    { yr: '2024', v: 79,  cert: false },
  ];
  const pts = data.map((d, i) => ({ ...d, x: PX[i], y: toY(d.v) }));
  const polyPts = pts.map(p => `${p.x},${p.y}`).join(' ');
  const DASH = 420;
  const targetY = toY(80);
  return (
    <Wrapper caption="Figure — ISO 50001 : évolution type de l'indicateur de performance énergétique (EnPI) après certification" animated>
      <svg viewBox="0 0 580 250" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <style>{`
          @keyframes enpiDraw { from { stroke-dashoffset: ${DASH}; } to { stroke-dashoffset: 0; } }
          @keyframes enpiFade { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
        <text x="290" y="18" textAnchor="middle" fill="#064e3b" fontSize="13" fontWeight="700" fontFamily="system-ui">
          ISO 50001 — Amélioration de la performance énergétique (EnPI)
        </text>
        {[110, 100, 90, 80, 70].map((v) => {
          const y = toY(v);
          return (
            <g key={v}>
              <line x1="80" y1={y} x2="540" y2={y}
                stroke={v === 80 ? '#86efac' : '#e2e8f0'}
                strokeWidth={v === 80 ? 1.5 : 0.75}
                strokeDasharray={v === 80 ? '5 4' : undefined} />
              <text x="72" y={y + 4} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="system-ui">{v}</text>
            </g>
          );
        })}
        <text x="538" y={targetY - 5} textAnchor="end" fill="#166534" fontSize="9" fontWeight="600" fontFamily="system-ui">Objectif 80 kWh</text>
        <line x1="80" y1={baseline} x2="540" y2={baseline} stroke="#374151" strokeWidth="1.5" />
        <line x1="80" y1={chartTop} x2="80"  y2={baseline} stroke="#374151" strokeWidth="1.5" />
        <text x="310" y="240" textAnchor="middle" fill="#064e3b" fontSize="10" fontStyle="italic" fontFamily="system-ui">
          kWh / unité — indicateur de performance énergétique (EnPI)
        </text>
        {data.map((d, i) => (
          <text key={i} x={PX[i]} y={baseline + 14} textAnchor="middle" fill="#374151" fontSize="10" fontFamily="system-ui">{d.yr}</text>
        ))}
        <polyline
          points={polyPts} fill="none" stroke="#22c55e" strokeWidth="2.5"
          strokeDasharray={DASH} strokeDashoffset={DASH}
          style={{ animation: `enpiDraw 2s ease-in-out 0.5s both` }}
        />
        {pts.map((p, i) => (
          <g key={i} style={{ animation: `enpiFade 0.3s ease-out ${0.5 + i * 0.38}s both` }}>
            <circle cx={p.x} cy={p.y} r={p.cert ? 7 : 5}
              fill={p.cert ? '#064e3b' : '#22c55e'} stroke="#fff" strokeWidth="2" />
            <text x={p.x} y={p.y - 11} textAnchor="middle" fill="#064e3b" fontSize="10" fontWeight="700" fontFamily="system-ui">{p.v}</text>
            {p.cert && (
              <>
                <text x={p.x} y={p.y + 21} textAnchor="middle" fill="#064e3b" fontSize="9" fontWeight="700" fontFamily="system-ui">↑ Certification</text>
                <text x={p.x} y={p.y + 33} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="system-ui">ISO 50001</text>
              </>
            )}
          </g>
        ))}
      </svg>
    </Wrapper>
  );
};

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
  digitalFootprint: DigitalFootprint,
  doubleMaterialite: DoubleMaterialite,
  trustChain: TrustChain,
  pnecLuxembourg: PNECLuxembourg,
  csrdTimeline: CSRDTimeline,
  luxITEcosystem: LuxITEcosystem,
  greenITMaturity: GreenITMaturity,
  enpiTrend: EnPITrend,
};

export default function Visual({ name }) {
  const Component = VISUALS[name];
  if (!Component) return null;
  return <Component />;
}

export { VISUALS };
