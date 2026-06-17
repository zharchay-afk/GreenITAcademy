import React from 'react';
import { useSiteConfig } from './SiteConfigContext';

// ── Variantes de logo ──────────────────────────────────────────────────────

function LeafLogo({ size }) {
  const p = 'M 0 0 C -28 -25, -34 -65, 0 -90 C 34 -65, 28 -25, 0 0 Z';
  return (
    <svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, display: 'block' }} aria-hidden="true">
      <g transform="translate(110, 110)">
        {[0, 120, 240].map(a => <path key={a} d={p} transform={`rotate(${a})`} fill="#22c55e" opacity="0.9" />)}
        <circle cx="0" cy="0" r="14" fill="#fff" />
        <circle cx="0" cy="0" r="8" fill="#16a34a" />
      </g>
    </svg>
  );
}

function GlobeLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, display: 'block' }} aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="#3b82f6" />
      <ellipse cx="50" cy="50" rx="44" ry="17" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
      <ellipse cx="50" cy="50" rx="22" ry="44" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
      <line x1="50" y1="6" x2="50" y2="94" stroke="#93c5fd" strokeWidth="1.5" />
      <ellipse cx="36" cy="36" rx="11" ry="7" fill="#22c55e" opacity="0.9" transform="rotate(-20 36 36)" />
      <ellipse cx="63" cy="52" rx="7" ry="10" fill="#22c55e" opacity="0.9" transform="rotate(10 63 52)" />
      <ellipse cx="40" cy="63" rx="5" ry="4" fill="#22c55e" opacity="0.9" />
    </svg>
  );
}

function TreeLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, display: 'block' }} aria-hidden="true">
      <polygon points="50,6 76,44 24,44" fill="#16a34a" />
      <polygon points="50,28 80,66 20,66" fill="#22c55e" />
      <rect x="43" y="66" width="14" height="22" rx="3" fill="#78350f" />
    </svg>
  );
}

function ChipLogo({ size }) {
  const pins = [34, 46, 58];
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, display: 'block' }} aria-hidden="true">
      <rect x="22" y="22" width="56" height="56" rx="6" fill="#1e3a5f" />
      <rect x="32" y="32" width="36" height="36" rx="4" fill="#3b82f6" />
      {pins.map(p => <rect key={`l${p}`} x="6"  y={p} width="14" height="5" rx="2" fill="#64748b" />)}
      {pins.map(p => <rect key={`r${p}`} x="80" y={p} width="14" height="5" rx="2" fill="#64748b" />)}
      {pins.map(p => <rect key={`t${p}`} x={p}  y="6" width="5" height="14" rx="2" fill="#64748b" />)}
      {pins.map(p => <rect key={`b${p}`} x={p}  y="80" width="5" height="14" rx="2" fill="#64748b" />)}
      <line x1="36" y1="50" x2="64" y2="50" stroke="#93c5fd" strokeWidth="2.5" />
      <line x1="50" y1="36" x2="50" y2="64" stroke="#93c5fd" strokeWidth="2.5" />
    </svg>
  );
}

function SunLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, display: 'block' }} aria-hidden="true">
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
        const r = a * Math.PI / 180;
        return (
          <line key={a}
            x1={50 + 26 * Math.cos(r)} y1={50 + 26 * Math.sin(r)}
            x2={50 + 42 * Math.cos(r)} y2={50 + 42 * Math.sin(r)}
            stroke="#f59e0b" strokeWidth="5" strokeLinecap="round"
          />
        );
      })}
      <circle cx="50" cy="50" r="22" fill="#fbbf24" />
    </svg>
  );
}

function DropLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, display: 'block' }} aria-hidden="true">
      <path d="M 50 8 C 24 38, 14 62, 14 70 A 36 36 0 0 0 86 70 C 86 62, 76 38, 50 8 Z" fill="#3b82f6" />
      <ellipse cx="40" cy="60" rx="6" ry="12" fill="rgba(255,255,255,0.25)" transform="rotate(-25 40 60)" />
      <path d="M 50 52 C 40 46, 36 58, 50 66 C 64 58, 60 46, 50 52 Z" fill="#22c55e" opacity="0.85" />
    </svg>
  );
}

function BoltLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, display: 'block' }} aria-hidden="true">
      <polygon points="58,8 28,54 50,54 42,92 72,46 50,46" fill="#f59e0b" />
    </svg>
  );
}

// ── Catalogue exporté (utilisé par LogoPicker) ─────────────────────────────

export const LOGO_VARIANTS = [
  { id: 'leaf',  label: 'Feuille',  Component: LeafLogo  },
  { id: 'globe', label: 'Globe',    Component: GlobeLogo },
  { id: 'tree',  label: 'Arbre',    Component: TreeLogo  },
  { id: 'chip',  label: 'Puce IT',  Component: ChipLogo  },
  { id: 'sun',   label: 'Solaire',  Component: SunLogo   },
  { id: 'drop',  label: 'Goutte',   Component: DropLogo  },
  { id: 'bolt',  label: 'Énergie',  Component: BoltLogo  },
];

// ── Composant Logo ─────────────────────────────────────────────────────────
// Si variant/url ne sont pas fournis en prop, lit le logo configuré via le
// SiteConfigContext (mis à jour en temps réel depuis Firestore config/pages).
// Passer variant/url explicitement force une variante précise (ex: dans le picker).

export default function Logo({ size = 32, variant, url }) {
  const cfg = useSiteConfig();
  const v = variant !== undefined ? variant : (cfg.logoVariant || 'leaf');
  const u = url     !== undefined ? url     : (cfg.logoUrl     || '');

  if (u) {
    return (
      <img
        src={u}
        alt="logo"
        style={{ width: size, height: size, borderRadius: '6px', objectFit: 'contain', display: 'block' }}
      />
    );
  }
  const found = LOGO_VARIANTS.find(x => x.id === v);
  const Comp  = found ? found.Component : LeafLogo;
  return <Comp size={size} />;
}
