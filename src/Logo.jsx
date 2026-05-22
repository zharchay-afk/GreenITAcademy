import React from 'react';

// Logo Green IT Académie — 3 feuilles disposées en symétrie rotationnelle (120°),
// définies une seule fois et rotées par <g transform="rotate(...)">.
// Réutilisé dans : LandingPage, Sidebar, CourseReader.

export default function Logo({ size = 180 }) {
  const leafPath = 'M 0 0 C -28 -25, -34 -65, 0 -90 C 34 -65, 28 -25, 0 0 Z';
  return (
    <svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, display: 'block' }} aria-hidden="true">
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      <g transform="translate(110, 110)">
        {[0, 120, 240].map((angle) => (
          <path key={angle} d={leafPath} transform={`rotate(${angle})`} fill="url(#leafGrad)" opacity="0.88" />
        ))}
        <circle cx="0" cy="0" r="14" fill="#fff" />
        <circle cx="0" cy="0" r="8" fill="#16a34a" />
      </g>
    </svg>
  );
}
