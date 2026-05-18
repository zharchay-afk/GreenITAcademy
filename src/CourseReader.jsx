import React, { useState } from 'react';
import modulesData from '../data/modules.json';
import Visual from './Visuals';

export default function CourseReader({ moduleId, onBack, onStartQuiz }) {
  const module = modulesData.modules.find(m => m.id === moduleId);
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!module) return <div>Module non trouvé</div>;

  const section = module.sections[currentIdx];
  const total = module.sections.length;
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === total - 1;
  const progressPct = Math.round(((currentIdx + 1) / total) * 100);

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f1f5f9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', backgroundColor: '#1e3a5f', height: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#2d5a87', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🌿</div>
            <div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Green IT</div>
              <div style={{ color: '#7cb3d9', fontSize: '10px', fontStyle: 'italic' }}>académie</div>
            </div>
          </div>
        </div>

        {/* Module info */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ backgroundColor: module.bgColor, borderRadius: '8px', padding: '10px', textAlign: 'center', fontSize: '28px', marginBottom: '10px' }}>
            {module.image}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.4px', marginBottom: '4px' }}>{module.unite}</div>
          <div style={{ color: '#fff', fontSize: '12px', fontWeight: '600', lineHeight: '1.4' }}>{module.title}</div>
        </div>

        {/* Section list */}
        <nav style={{ padding: '8px 0', flex: 1, overflowY: 'auto' }}>
          {module.sections.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIdx(idx)}
              style={{
                width: '100%', padding: '10px 16px',
                backgroundColor: idx === currentIdx ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: 'none',
                borderLeft: idx === currentIdx ? '3px solid #4ade80' : '3px solid transparent',
                color: idx === currentIdx ? '#4ade80' : idx < currentIdx ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                textAlign: 'left', cursor: 'pointer', fontSize: '12px',
                display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.4',
              }}
            >
              <span style={{ flexShrink: 0 }}>
                {idx < currentIdx ? '✓' : idx === currentIdx ? '▶' : '○'}
              </span>
              <span>{s.title}</span>
            </button>
          ))}
        </nav>

        {/* Retour */}
        <div style={{ padding: '16px' }}>
          <button
            onClick={onBack}
            style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}
          >
            ← Retour à l'accueil
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ backgroundColor: '#fff', padding: '16px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              {module.unite} · Section {currentIdx + 1} sur {total} · ⏱ Durée estimée : {module.estimatedTime}
            </div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e3a5f' }}>{section.title}</h1>
            {module.subtitle && (
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px', fontStyle: 'italic' }}>{module.subtitle}</div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Progression</span>
            <div style={{ width: '120px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: '#22c55e', borderRadius: '3px', transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: '12px', color: '#64748b', minWidth: '36px' }}>{progressPct}%</span>
          </div>
        </header>

        {/* Texte du cours */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>

            {/* Intro (chapeau) */}
            {section.intro && (
              <div style={{ marginBottom: '20px', padding: '16px 20px', borderLeft: '3px solid #4ade80', backgroundColor: '#f0fdf4', borderRadius: '0 6px 6px 0' }}>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.65', color: '#166534', fontStyle: 'italic' }}>
                  {section.intro}
                </p>
              </div>
            )}

            {/* Contenu principal */}
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '28px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.85', color: '#374151', whiteSpace: 'pre-line' }}>
                {section.content}
              </p>
            </div>

            {/* Visuel(s) SVG */}
            {section.visual && (Array.isArray(section.visual)
              ? section.visual.map((v, i) => <Visual key={i} name={v} />)
              : <Visual name={section.visual} />
            )}

            {/* Sous-sections détaillées */}
            {Array.isArray(section.details) && section.details.length > 0 && (
              <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px 28px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                {section.details.map((d, i) => (
                  <div key={i} style={{ marginBottom: i < section.details.length - 1 ? '18px' : 0, paddingBottom: i < section.details.length - 1 ? '18px' : 0, borderBottom: i < section.details.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700', color: '#1e3a5f' }}>{d.subtitle}</h4>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.7', color: '#374151', whiteSpace: 'pre-line' }}>{d.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Exemples concrets */}
            {Array.isArray(section.examples) && section.examples.length > 0 && (
              <div style={{ backgroundColor: '#fff8e1', borderRadius: '8px', padding: '20px 24px', marginBottom: '20px', border: '1px solid #fde68a' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.3px' }}>
                  🔎 EXEMPLES CONCRETS
                </h3>
                {section.examples.map((ex, i) => (
                  <div key={i} style={{ marginBottom: i < section.examples.length - 1 ? '12px' : 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#78350f', marginBottom: '2px' }}>{ex.title}</div>
                    <div style={{ fontSize: '13px', color: '#78350f', lineHeight: '1.55' }}>{ex.text}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Points clés */}
            <div style={{ backgroundColor: '#ecfdf5', borderRadius: '8px', padding: '20px', border: '1px solid #86efac', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '700', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💡 Points clés à retenir
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {section.keyPoints.map((point, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: i < section.keyPoints.length - 1 ? '10px' : 0, fontSize: '14px', color: '#166534', lineHeight: '1.5' }}>
                    <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pour aller plus loin */}
            {Array.isArray(section.goFurther) && section.goFurther.length > 0 && (
              <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '18px 22px', border: '1px solid #bfdbfe' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '700', color: '#1e40af', letterSpacing: '0.4px' }}>
                  📖 POUR ALLER PLUS LOIN
                </h3>
                <ul style={{ margin: 0, paddingLeft: '18px', listStyle: 'disc' }}>
                  {section.goFurther.map((g, i) => (
                    <li key={i} style={{ fontSize: '12px', color: '#1e3a5f', lineHeight: '1.6', marginBottom: i < section.goFurther.length - 1 ? '4px' : 0 }}>{g}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Navigation bas de page */}
        <footer style={{ padding: '16px 32px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentIdx(i => i - 1)}
            disabled={isFirst}
            style={{ padding: '10px 20px', backgroundColor: isFirst ? '#f8fafc' : '#fff', color: isFirst ? '#a0aec0' : '#1e3a5f', border: `1px solid ${isFirst ? '#e2e8f0' : '#1e3a5f'}`, borderRadius: '6px', cursor: isFirst ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px' }}
          >
            ← Précédent
          </button>

          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{currentIdx + 1} / {total}</span>

          {isLast ? (
            <button
              onClick={onStartQuiz}
              style={{ padding: '10px 24px', backgroundColor: '#e65100', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
            >
              S'évaluer sur ce module →
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(i => i + 1)}
              style={{ padding: '10px 20px', backgroundColor: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
            >
              Suivant →
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}
