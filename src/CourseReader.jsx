import React, { useState, useEffect, useRef } from 'react';
import modulesData from '../data/modules.json';
import Visual from './Visuals';
import Logo from './Logo';
import useIsMobile from './useIsMobile';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function CourseReader({ moduleId, onBack, onStartQuiz, onSelectModule }) {
  const jsonModule = modulesData.modules.find(m => m.id === moduleId);
  const [firestoreOverride, setFirestoreOverride] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef(null);
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse
  const [sidebarOpen, setSidebarOpen] = useState(false);           // mobile overlay

  // Charge les overrides Firestore pour ce module
  useEffect(() => {
    if (!db || !moduleId) return;
    getDoc(doc(db, 'content_modules', String(moduleId))).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setFirestoreOverride(data._deleted ? null : data);
      } else {
        setFirestoreOverride(null);
      }
    }).catch(() => setFirestoreOverride(null));
  }, [moduleId]);

  // Réinitialise sur la première section quand on change de module + remonte
  useEffect(() => {
    setCurrentIdx(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [moduleId]);

  // Remonte en haut à chaque changement de section
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [currentIdx]);

  // Ferme le menu mobile quand on repasse en desktop
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  // Fusionne JSON + overrides Firestore
  const module = jsonModule
    ? {
        ...jsonModule,
        ...(firestoreOverride ? {
          title:    firestoreOverride.title    || jsonModule.title,
          subtitle: firestoreOverride.subtitle || jsonModule.subtitle,
          image:    firestoreOverride.image    || jsonModule.image,
          imageUrl: firestoreOverride.imageUrl || null,
          intro:    firestoreOverride.intro    || jsonModule.intro,
          sections: firestoreOverride.sections
            ? jsonModule.sections.map(base => {
                const ov = firestoreOverride.sections.find(s => s.id === base.id);
                return ov ? { ...base, ...ov } : base;
              })
            : jsonModule.sections,
        } : {}),
      }
    : null;

  if (!module) return <div>Module non trouvé</div>;

  // Garde contre le render intermédiaire quand moduleId change avant que l'effet reset
  const safeIdx = Math.min(currentIdx, module.sections.length - 1);
  const section = module.sections[safeIdx];
  const total = module.sections.length;
  const isFirst = safeIdx === 0;
  const isLast = safeIdx === total - 1;
  const progressPct = Math.round(((safeIdx + 1) / total) * 100);

  // Navigation module précédent / suivant
  const allIds = modulesData.modules.map(m => m.id);
  const mIdx = allIds.indexOf(moduleId);
  const prevModuleId = mIdx > 0 ? allIds[mIdx - 1] : null;
  const nextModuleId = mIdx < allIds.length - 1 ? allIds[mIdx + 1] : null;

  const handleSectionClick = (idx) => {
    setCurrentIdx(idx);
    if (isMobile) setSidebarOpen(false);
  };

  // ----------------------------------------------------------------
  // Contenu de la sidebar (partagé entre desktop et mobile overlay)
  // ----------------------------------------------------------------
  const SidebarContent = ({ compact = false }) => (
    <>
      {/* Logo */}
      <div style={{
        padding: compact ? '20px 0' : '20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: compact ? 'center' : 'flex-start',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size={36} />
          {!compact && (
            <div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Green IT</div>
              <div style={{ color: 'var(--sidebar-active)', fontSize: '10px', fontStyle: 'italic' }}>académie</div>
            </div>
          )}
        </div>
      </div>

      {/* Module info */}
      <div style={{
        padding: compact ? '12px 0' : '16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', flexDirection: 'column',
        alignItems: compact ? 'center' : 'flex-start',
        flexShrink: 0,
      }}>
        <div style={{
          backgroundColor: module.bgColor, borderRadius: '8px',
          padding: '10px', textAlign: 'center', fontSize: '28px',
          marginBottom: compact ? 0 : '10px',
          width: compact ? '44px' : 'auto',
        }}>
          {module.image}
        </div>
        {!compact && (
          <>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.4px', marginBottom: '4px' }}>
              {module.unite}
            </div>
            <div style={{ color: '#fff', fontSize: '12px', fontWeight: '600', lineHeight: '1.4' }}>
              {module.title}
            </div>
          </>
        )}
      </div>

      {/* Liste des sections */}
      <nav style={{ padding: '8px 0', flex: 1, overflowY: 'auto' }}>
        {module.sections.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => handleSectionClick(idx)}
            title={compact ? s.title : undefined}
            style={{
              width: '100%',
              padding: compact ? '10px 0' : '10px 16px',
              backgroundColor: idx === safeIdx ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: 'none',
              borderLeft: idx === safeIdx ? '3px solid var(--sidebar-active)' : '3px solid transparent',
              color: idx === safeIdx ? 'var(--sidebar-active)' : idx < safeIdx ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
              textAlign: compact ? 'center' : 'left',
              cursor: 'pointer',
              fontSize: compact ? '14px' : '12px',
              display: 'flex',
              alignItems: compact ? 'center' : 'flex-start',
              justifyContent: compact ? 'center' : 'flex-start',
              gap: '8px',
              lineHeight: '1.4',
              fontFamily: 'inherit',
            }}
          >
            <span style={{ flexShrink: 0 }}>
              {idx < safeIdx ? '✓' : idx === safeIdx ? '▶' : '○'}
            </span>
            {!compact && <span>{s.title}</span>}
          </button>
        ))}
      </nav>

      {/* Navigation entre modules — version complète */}
      {!compact && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginBottom: '2px' }}>
            Changer de module
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => prevModuleId && onSelectModule(prevModuleId)}
              disabled={!prevModuleId}
              title={prevModuleId ? 'Module précédent' : 'Aucun module précédent'}
              style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: prevModuleId ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)', padding: '8px', borderRadius: '5px', cursor: prevModuleId ? 'pointer' : 'not-allowed', fontSize: '11px', fontFamily: 'inherit' }}
            >
              ⏮ Module
            </button>
            <button
              onClick={() => nextModuleId && onSelectModule(nextModuleId)}
              disabled={!nextModuleId}
              title={nextModuleId ? 'Module suivant' : 'Aucun module suivant'}
              style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: nextModuleId ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)', padding: '8px', borderRadius: '5px', cursor: nextModuleId ? 'pointer' : 'not-allowed', fontSize: '11px', fontFamily: 'inherit' }}
            >
              Module ⏭
            </button>
          </div>
          <button
            onClick={onBack}
            style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', marginTop: '4px', fontFamily: 'inherit' }}
          >
            ← Tous mes modules
          </button>
        </div>
      )}

      {/* Navigation entre modules — version compacte (icônes seulement) */}
      {compact && (
        <div style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <button
            onClick={() => prevModuleId && onSelectModule(prevModuleId)}
            disabled={!prevModuleId}
            title="Module précédent"
            style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: prevModuleId ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)', padding: '7px 4px', borderRadius: '5px', cursor: prevModuleId ? 'pointer' : 'not-allowed', fontSize: '14px', fontFamily: 'inherit' }}
          >⏮</button>
          <button
            onClick={() => nextModuleId && onSelectModule(nextModuleId)}
            disabled={!nextModuleId}
            title="Module suivant"
            style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: nextModuleId ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)', padding: '7px 4px', borderRadius: '5px', cursor: nextModuleId ? 'pointer' : 'not-allowed', fontSize: '14px', fontFamily: 'inherit' }}
          >⏭</button>
          <button
            onClick={onBack}
            title="Tous mes modules"
            style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '7px 4px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}
          >←</button>
        </div>
      )}
    </>
  );

  // ================================================================
  // RENDU PRINCIPAL
  // ================================================================
  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      backgroundColor: 'var(--bg-page)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>

      {/* ===== SIDEBAR MOBILE (overlay) ===== */}
      {isMobile && (
        <>
          {/* Fond semi-transparent */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 199,
              opacity: sidebarOpen ? 1 : 0,
              pointerEvents: sidebarOpen ? 'auto' : 'none',
              transition: 'opacity 0.25s',
            }}
          />
          <aside style={{
            position: 'fixed', top: 0, left: 0,
            height: '100vh', width: '240px',
            backgroundColor: 'var(--sidebar-bg)',
            display: 'flex', flexDirection: 'column',
            zIndex: 200,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
          }}>
            <SidebarContent compact={false} />
          </aside>
        </>
      )}

      {/* ===== SIDEBAR DESKTOP (dans le flux flex) ===== */}
      {!isMobile && (
        <aside style={{
          width: sidebarCollapsed ? '60px' : '240px',
          backgroundColor: 'var(--sidebar-bg)',
          height: '100vh',
          display: 'flex', flexDirection: 'column',
          flexShrink: 0,
          transition: 'width 0.2s ease',
          position: 'relative',
        }}>
          {/* Bouton de bascule (chevron) */}
          <button
            onClick={() => setSidebarCollapsed(c => !c)}
            title={sidebarCollapsed ? 'Déplier le menu' : 'Replier le menu'}
            aria-label={sidebarCollapsed ? 'Déplier le menu' : 'Replier le menu'}
            style={{
              position: 'absolute', top: '24px', right: '-12px',
              width: '24px', height: '24px', borderRadius: '50%',
              backgroundColor: 'var(--bg-surface)', color: 'var(--accent)',
              border: '1px solid var(--border)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '700', zIndex: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)', fontFamily: 'inherit',
            }}
          >
            {sidebarCollapsed ? '›' : '‹'}
          </button>
          <SidebarContent compact={sidebarCollapsed} />
        </aside>
      )}

      {/* ===== CONTENU PRINCIPAL ===== */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        {isMobile ? (
          /* ---- Header MOBILE ---- */
          <header style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '10px 12px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '8px',
            flexShrink: 0,
          }}>
            {/* Retour direct au dashboard */}
            <button
              onClick={onBack}
              aria-label="Retour aux modules"
              style={{
                flexShrink: 0,
                padding: '6px 10px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px', fontWeight: '600',
                color: 'var(--accent)', fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              ← Modules
            </button>

            {/* Info module + section */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {module.unite} · {safeIdx + 1}/{total}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {section.title}
              </div>
            </div>

            {/* Progression */}
            <span style={{ flexShrink: 0, fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>{progressPct}%</span>

            {/* Bouton sections overlay */}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Liste des sections"
              title="Voir toutes les sections"
              style={{
                flexShrink: 0,
                width: '34px', height: '34px', borderRadius: '8px',
                backgroundColor: 'var(--sidebar-bg)',
                border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '3px',
              }}
            >
              <span style={{ display: 'block', width: '14px', height: '2px', backgroundColor: '#fff', borderRadius: '2px' }} />
              <span style={{ display: 'block', width: '14px', height: '2px', backgroundColor: '#fff', borderRadius: '2px' }} />
              <span style={{ display: 'block', width: '14px', height: '2px', backgroundColor: '#fff', borderRadius: '2px' }} />
            </button>
          </header>
        ) : (
          /* ---- Header DESKTOP ---- */
          <header style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '16px 32px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', gap: '12px',
            flexShrink: 0,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {module.unite} · Section {safeIdx + 1} sur {total} · ⏱ Durée estimée : {module.estimatedTime}
              </div>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--accent)' }}>{section.title}</h1>
              {module.subtitle && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontStyle: 'italic' }}>{module.subtitle}</div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Progression</span>
              <div style={{ width: '120px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}>
                <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: '#22c55e', borderRadius: '3px', transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '36px' }}>{progressPct}%</span>
            </div>
          </header>
        )}

        {/* Zone de défilement du cours */}
        <div ref={scrollRef} style={{ flex: 1, padding: isMobile ? '16px' : '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>

            {/* Intro (chapeau) */}
            {section.intro && (
              <div style={{ marginBottom: '20px', padding: '16px 20px', borderLeft: '3px solid #4ade80', backgroundColor: '#f0fdf4', borderRadius: '0 6px 6px 0' }}>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.65', color: '#166534', fontStyle: 'italic', textAlign: 'justify', hyphens: 'auto' }}>
                  {section.intro}
                </p>
              </div>
            )}

            {/* Contenu principal */}
            <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '8px', padding: isMobile ? '16px' : '28px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.85', color: 'var(--text-primary)', whiteSpace: 'pre-line', textAlign: 'justify', hyphens: 'auto' }}>
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
              <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '8px', padding: isMobile ? '16px' : '24px 28px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                {section.details.map((d, i) => (
                  <div key={i} style={{ marginBottom: i < section.details.length - 1 ? '18px' : 0, paddingBottom: i < section.details.length - 1 ? '18px' : 0, borderBottom: i < section.details.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700', color: 'var(--accent)' }}>{d.subtitle}</h4>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.7', color: 'var(--text-primary)', whiteSpace: 'pre-line', textAlign: 'justify', hyphens: 'auto' }}>{d.text}</p>
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
            {(() => {
              const linkedItems = (section.goFurther || []).filter(g => g && typeof g === 'object' && g.url);
              if (linkedItems.length === 0) return null;
              return (
                <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '18px 22px', border: '1px solid #bfdbfe' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '700', color: '#1e40af', letterSpacing: '0.4px' }}>
                    📖 POUR ALLER PLUS LOIN
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '18px', listStyle: 'disc' }}>
                    {linkedItems.map((g, i) => (
                      <li key={i} style={{ fontSize: '12px', color: 'var(--accent)', lineHeight: '1.6', marginBottom: i < linkedItems.length - 1 ? '4px' : 0 }}>
                        <a href={g.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                          {g.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

          </div>
        </div>

        {/* Pied de page — navigation entre SECTIONS */}
        <footer style={{
          padding: isMobile ? '10px 16px' : '16px 32px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: '8px',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setCurrentIdx(i => i - 1)}
            disabled={isFirst}
            style={{
              padding: isMobile ? '8px 10px' : '10px 20px',
              backgroundColor: isFirst ? '#f8fafc' : '#fff',
              color: isFirst ? '#a0aec0' : '#064e3b',
              border: `1px solid ${isFirst ? '#e2e8f0' : '#064e3b'}`,
              borderRadius: '6px', cursor: isFirst ? 'not-allowed' : 'pointer',
              fontWeight: '600', fontSize: isMobile ? '12px' : '14px',
              whiteSpace: 'nowrap', fontFamily: 'inherit',
            }}
          >
            {isMobile ? '← Préc.' : '← Section précédente'}
          </button>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {safeIdx + 1} / {total}
          </span>

          {isLast ? (
            <button
              onClick={onStartQuiz}
              style={{
                padding: isMobile ? '8px 10px' : '10px 24px',
                backgroundColor: '#e65100', color: 'var(--on-brand)',
                border: 'none', borderRadius: '6px', cursor: 'pointer',
                fontWeight: '700', fontSize: isMobile ? '12px' : '14px',
                whiteSpace: 'nowrap', fontFamily: 'inherit',
              }}
            >
              {isMobile ? "S'évaluer →" : "S'évaluer sur ce module →"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(i => i + 1)}
              style={{
                padding: isMobile ? '8px 10px' : '10px 20px',
                backgroundColor: 'var(--sidebar-bg)', color: 'var(--on-brand)',
                border: 'none', borderRadius: '6px', cursor: 'pointer',
                fontWeight: '600', fontSize: isMobile ? '12px' : '14px',
                whiteSpace: 'nowrap', fontFamily: 'inherit',
              }}
            >
              {isMobile ? 'Suiv. →' : 'Section suivante →'}
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}
