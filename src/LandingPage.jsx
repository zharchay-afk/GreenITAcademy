import React, { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import LogoPicker from './LogoPicker';
import modulesData from '../data/modules.json';
import questionsData from '../data/questions.json';
import { useTheme } from './theme';
import useIsMobile from './useIsMobile';
import Footer from './Footer';
import { doc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// ============================================================================
// LandingPage — header & footer sticky, 3 sections (Accueil / Intérêt / Programme)
// ============================================================================

const MODULE_PALETTE = {
  1: { accent: '#0ea5e9', bg: '#e0f2fe' },
  2: { accent: '#f59e0b', bg: '#fef3c7' },
  3: { accent: '#10b981', bg: '#d1fae5' },
  4: { accent: '#8b5cf6', bg: '#ede9fe' },
  5: { accent: '#ef4444', bg: '#fee2e2' },
  6: { accent: '#14b8a6', bg: '#ccfbf1' },
};

const MODULE_TEASER = {
  1: 'Comprendre le gradient de contrainte entre lois, normes, labels et codes.',
  2: 'Panorama complet des réglementations qui s\'imposent aux organisations.',
  3: 'Mettre en œuvre les principales normes ISO et la norme EN 50600 des datacenters.',
  4: 'Choisir et utiliser les labels pour des achats IT responsables.',
  5: 'Les engagements volontaires des opérateurs et le rôle de la profession.',
  6: 'Deux success stories qui illustrent concrètement la mise en œuvre.',
};

const IconScale = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18" /><path d="M3 7l4 8-2 1c-.5.5-1 .5-2 0v-1l4-8" /><path d="M17 7l4 8-2 1c-.5.5-1 .5-2 0v-1l4-8" /><path d="M5 21h14" />
  </svg>
);
const IconCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);
const IconCompass = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
  </svg>
);

const INTEREST_DEFAULTS = [
  {
    Icon: IconScale,
    bg: '#dcfce7',
    title: 'Connaître les obligations réglementaires',
    text: 'Green Deal, CSRD, Taxonomie, EED, DEEE, Écoconception : depuis 2019, l\'Union européenne multiplie les textes qui imposent aux organisations de mesurer et de réduire leur empreinte numérique. Environ 50 000 entreprises européennes sont directement concernées.',
  },
  {
    Icon: IconCheck,
    bg: '#dcfce7',
    title: 'Maîtriser les outils techniques',
    text: 'Normes ISO (14001, 14040/44, 50001, EN 50600) et labels environnementaux (EPEAT, Energy Star, Blue Angel) : ces référentiels permettent d\'objectiver les choix d\'achat, de structurer une démarche, et de fournir des preuves crédibles aux parties prenantes.',
  },
  {
    Icon: IconCompass,
    bg: '#cffafe',
    title: 'Anticiper l\'évolution du cadre légal',
    text: 'Ce qui est volontaire aujourd\'hui devient souvent obligatoire demain. Les acteurs déjà engagés dans une démarche structurée prennent un avantage compétitif et évitent les coûts d\'une mise en conformité dans l\'urgence.',
  },
];

const BASE_MODULES   = modulesData.modules.length;
const BASE_SECTIONS  = modulesData.modules.reduce((s, m) => s + m.sections.length, 0);
const BASE_QUESTIONS = questionsData.questions.length;

const toMinutes = (str) => {
  const [h, m] = (str || '00:00:00').split(':').map(Number);
  return h * 60 + m;
};

// ─── Inline admin editor ──────────────────────────────────────────────────────
// Wraps any block of content. In admin mode, adds a dashed blue outline on
// hover and a pencil button. Clicking the pencil replaces the content with
// a textarea/input + save & cancel buttons that write directly to Firestore.
function Editable({ fieldKey, value, isAdmin, onUpdate, multiline = false, children }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState('');
  const [hover,   setHover]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const startEdit = (e) => {
    e.stopPropagation();
    setDraft(value || '');
    setEditing(true);
    setHover(false);
  };

  const save = async () => {
    if (!db) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'config', 'pages'), { [fieldKey]: draft }, { merge: true });
      onUpdate(fieldKey, draft);
      setEditing(false);
    } catch (e) {
      alert('Erreur : ' + e.message);
    }
    setSaving(false);
  };

  const cancel = () => setEditing(false);

  if (!isAdmin) return <>{children(value)}</>;

  if (editing) {
    return (
      <div style={{ width: '100%' }}>
        {multiline ? (
          <textarea
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px', fontFamily: 'inherit', borderRadius: '6px', border: '2px solid #3b82f6', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontSize: '13px', lineHeight: '1.5', color: '#111', backgroundColor: '#fff' }}
          />
        ) : (
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
            style={{ width: '100%', padding: '6px 8px', fontFamily: 'inherit', borderRadius: '6px', border: '2px solid #3b82f6', outline: 'none', boxSizing: 'border-box', fontSize: '13px', color: '#111', backgroundColor: '#fff' }}
          />
        )}
        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
          <button onClick={save} disabled={saving} style={{ padding: '4px 12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', cursor: saving ? 'wait' : 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: 'inherit' }}>
            {saving ? '…' : '✓ Enregistrer'}
          </button>
          <button onClick={cancel} style={{ padding: '4px 10px', background: 'transparent', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        borderRadius: '6px',
        ...(hover ? { outline: '2px dashed #3b82f6', outlineOffset: '4px' } : {}),
      }}
    >
      {children(value)}
      {hover && (
        <button
          onClick={startEdit}
          title={`Modifier : ${fieldKey}`}
          style={{
            position: 'absolute', top: '4px', right: '4px',
            width: '24px', height: '24px',
            backgroundColor: '#2563eb', color: '#fff',
            border: 'none', borderRadius: '5px',
            cursor: 'pointer', fontSize: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 20, padding: 0, boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
          }}
        >
          ✏
        </button>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LandingPage({ onStart, onShowLegal, onGoToAuth, firebaseUser, isAdmin, onGoToAdmin }) {
  const mainRef = useRef(null);
  const [activeSection, setActiveSection] = useState('accueil');
  const [theme] = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  const [pageCfg, setPageCfg] = useState({});
  const [extraModules,   setExtraModules]   = useState(0);
  const [extraSections,  setExtraSections]  = useState(0);
  const [extraQuestions, setExtraQuestions] = useState(0);
  const [customModules,  setCustomModules]  = useState([]);
  const [editingSiteName, setEditingSiteName] = useState(false);
  const [siteNameDraft,   setSiteNameDraft]   = useState('');
  const [showLogoPicker,  setShowLogoPicker]  = useState(false);

  useEffect(() => {
    if (!db) return;
    const unsubPages = onSnapshot(doc(db, 'config', 'pages'), snap => {
      if (snap.exists()) setPageCfg(snap.data());
    }, () => {});

    const unsubMods = onSnapshot(
      query(collection(db, 'content_modules'), where('_custom', '==', true)),
      (snap) => {
        const active = snap.docs
          .map(d => ({ id: parseInt(d.id), ...d.data() }))
          .filter(d => !d._deleted)
          .sort((a, b) => a.id - b.id);
        setExtraModules(active.length);
        setExtraSections(active.reduce((s, d) => s + (d.sections?.length || 0), 0));
        setCustomModules(active);
      },
      () => {}
    );

    const unsubQ = onSnapshot(
      collection(db, 'content_questions'),
      (snap) => setExtraQuestions(snap.docs.filter(d => !d.data()._deleted).length),
      () => {}
    );

    return () => { unsubPages(); unsubMods(); unsubQ(); };
  }, []);

  const handleUpdate = (key, val) => setPageCfg(cfg => ({ ...cfg, [key]: val }));

  const saveSiteName = async () => {
    if (!db) return;
    try {
      await setDoc(doc(db, 'config', 'pages'), { siteName: siteNameDraft }, { merge: true });
      setPageCfg(cfg => ({ ...cfg, siteName: siteNameDraft }));
    } catch (e) { alert(e.message); }
    setEditingSiteName(false);
  };

  const stats = [
    { value: BASE_MODULES   + extraModules,   label: 'Modules' },
    { value: BASE_SECTIONS  + extraSections,  label: 'Leçons' },
    { value: BASE_QUESTIONS + extraQuestions, label: 'Questions' },
  ];

  const activeInterests = INTEREST_DEFAULTS.map((d, i) => ({
    ...d,
    title: pageCfg[`interetCard${i}Title`] || d.title,
    text:  pageCfg[`interetCard${i}Text`]  || d.text,
  }));

  useEffect(() => {
    if (!mainRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: mainRef.current, rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    mainRef.current.querySelectorAll('section[id]').forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const E = (props) => <Editable {...props} isAdmin={isAdmin} onUpdate={handleUpdate} />;

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* ──── Header sticky ──── */}
      <header style={{
        flexShrink: 0,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        paddingTop: isMobile ? 'calc(10px + env(safe-area-inset-top))' : 'calc(12px + env(safe-area-inset-top))',
        paddingRight: isMobile ? '16px' : '32px',
        paddingBottom: isMobile ? '10px' : '12px',
        paddingLeft: isMobile ? '16px' : '32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        {editingSiteName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Logo size={isMobile ? 26 : 32} />
            <input
              value={siteNameDraft}
              onChange={e => setSiteNameDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveSiteName(); if (e.key === 'Escape') setEditingSiteName(false); }}
              autoFocus
              placeholder="Green IT Académie"
              style={{ padding: '4px 8px', borderRadius: '5px', border: '2px solid #3b82f6', fontSize: '15px', fontFamily: 'inherit', fontWeight: 700, outline: 'none', width: '200px' }}
            />
            <button onClick={saveSiteName} style={{ width: '26px', height: '26px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, fontFamily: 'inherit' }}>✓</button>
            <button onClick={() => setEditingSiteName(false)} style={{ width: '26px', height: '26px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, fontFamily: 'inherit' }}>✕</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => scrollTo('accueil')} style={brandBtnStyle}>
              <Logo size={isMobile ? 26 : 32} />
              {!isMobile && (
                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{pageCfg.siteName || 'Green IT Académie'}</span>
              )}
              {isMobile && (
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{(pageCfg.siteName || 'Green IT').split(' ')[0]}</span>
              )}
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => setShowLogoPicker(true)}
                  title="Changer le logo"
                  style={{ width: '20px', height: '20px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 }}
                >🖼</button>
                <button
                  onClick={() => { setSiteNameDraft(pageCfg.siteName || ''); setEditingSiteName(true); }}
                  title="Modifier le nom du site"
                  style={{ width: '20px', height: '20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 }}
                >✏</button>
              </>
            )}
          </div>
        )}
        {showLogoPicker && (
          <LogoPicker
            currentVariant={pageCfg.logoVariant || 'leaf'}
            currentUrl={pageCfg.logoUrl || ''}
            onClose={() => setShowLogoPicker(false)}
            toast={toast}
          />
        )}

        <nav style={{ display: 'flex', gap: isMobile ? '6px' : '8px', alignItems: 'center' }}>
          {!isMobile && [
            { id: 'accueil',   label: 'Accueil' },
            { id: 'interet',   label: 'Intérêt' },
            { id: 'programme', label: 'Programme' },
          ].map((it) => (
            <button
              key={it.id}
              onClick={() => scrollTo(it.id)}
              style={navLinkStyle(activeSection === it.id)}
            >
              {it.label}
            </button>
          ))}
          {firebaseUser ? (
            <button onClick={onStart} style={ctaSmallStyle}>Ma formation →</button>
          ) : (
            <>
              {!isMobile && (
                <button onClick={() => onGoToAuth && onGoToAuth('login')} style={{ ...ctaSmallStyle, backgroundColor: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', marginLeft: 0 }}>
                  Connexion
                </button>
              )}
              <button onClick={onStart} style={ctaSmallStyle}>Commencer →</button>
            </>
          )}
        </nav>
      </header>

      {/* ──── Admin banner ──── */}
      {isAdmin && (
        <div style={{
          flexShrink: 0,
          backgroundColor: '#eff6ff',
          borderBottom: '2px solid #bfdbfe',
          padding: '7px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12px',
        }}>
          <span style={{ fontSize: '15px' }}>🛠</span>
          <span style={{ fontWeight: 700, color: '#1e40af' }}>Mode admin</span>
          <span style={{ color: '#3b82f6' }}>· Survolez un texte et cliquez sur ✏ pour le modifier en ligne</span>
          <div style={{ flex: 1 }} />
          {onGoToAdmin && (
            <button
              onClick={onGoToAdmin}
              style={{ padding: '3px 12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}
            >
              Panneau admin →
            </button>
          )}
        </div>
      )}

      {/* ──── Contenu scrollable ──── */}
      <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', scrollBehavior: 'smooth' }}>

        {/* ── Section Accueil ── */}
        {(() => {
          const hasHeroImg = !!pageCfg.heroImage;
          const heroBg = hasHeroImg
            ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${pageCfg.heroImage}) center/cover no-repeat`
            : isDark
              ? 'linear-gradient(135deg, #0f172a 0%, #16241d 100%)'
              : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 60%, #a7f3d0 100%)';
          const h1Color   = hasHeroImg ? '#fff'                    : isDark ? '#e8edf4' : '#064e3b';
          const subColor  = hasHeroImg ? 'rgba(255,255,255,0.85)' : isDark ? '#94a3b8' : '#166534';
          const badgeBg   = hasHeroImg ? 'rgba(255,255,255,0.12)' : isDark ? 'rgba(255,255,255,0.06)' : '#fff';
          const badgeBord = hasHeroImg ? 'rgba(255,255,255,0.25)' : isDark ? 'rgba(255,255,255,0.12)' : '#bbf7d0';
          const badgeTxt  = hasHeroImg ? '#a7f3d0'                : isDark ? '#74b893'                : '#15803d';
          const statNumCol = hasHeroImg ? '#a7f3d0'               : isDark ? '#74b893'                : '#15803d';
          const statLblCol = hasHeroImg ? 'rgba(255,255,255,0.7)' : isDark ? '#94a3b8'               : '#166534';
          return (
        <section id="accueil" style={sectionStyle({ background: heroBg, color: h1Color })}>
          <div style={containerStyle}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px 5px 6px', backgroundColor: badgeBg, border: `1px solid ${badgeBord}`, borderRadius: '20px', marginBottom: '24px' }}>
              <Logo size={20} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: badgeTxt, letterSpacing: '1.5px' }}>GREEN IT ACADÉMIE</span>
            </div>

            <E fieldKey="heroTitle" value={pageCfg.heroTitle} multiline>
              {(val) => (
                <h1 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 800, lineHeight: '1.1', margin: '0 0 18px 0', color: h1Color, whiteSpace: 'pre-line' }}>
                  {val || 'Formez-vous au\nNumérique Responsable'}
                </h1>
              )}
            </E>

            <E fieldKey="heroSubtitle" value={pageCfg.heroSubtitle} multiline>
              {(val) => (
                <p style={{ fontSize: '17px', color: subColor, maxWidth: '640px', lineHeight: '1.6', margin: '0 0 32px 0' }}>
                  {val || 'Comprenez le cadre réglementaire européen et luxembourgeois, maîtrisez les normes ISO et les labels environnementaux qui structurent le numérique responsable.'}
                </p>
              )}
            </E>

            {/* CTA */}
            {firebaseUser ? (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '40px' }}>
                <button onClick={onStart} style={ctaPrimaryStyle}>Reprendre la formation →</button>
                <span style={{ fontSize: '13px', color: isDark ? '#74b893' : '#166534', fontWeight: '500' }}>
                  Bonjour, {firebaseUser.displayName || firebaseUser.email?.split('@')[0]} 👋
                </span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <button onClick={() => onGoToAuth && onGoToAuth('login')} style={ctaPrimaryStyle}>
                    🔐 {pageCfg.loginLabel || 'Connexion / Inscription'}
                  </button>
                  <button onClick={() => scrollTo('programme')} style={ctaSecondaryStyle}>Voir le programme</button>
                </div>
                <div style={{ marginBottom: '40px' }}>
                  <button onClick={onStart} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: isDark ? '#74b893' : '#166534', textDecoration: 'underline', padding: 0, fontFamily: 'inherit' }}>
                    Continuer sans compte →
                  </button>
                  <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#166534', marginLeft: '8px', opacity: 0.7 }}>
                    (votre progression restera locale)
                  </span>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              {stats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: statNumCol }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: statLblCol, marginTop: '2px', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
          );
        })()}

        {/* ── Section Intérêt ── */}
        <section id="interet" style={sectionStyle({ background: 'var(--bg-surface)' })}>
          <div style={containerStyle}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <E fieldKey="interetTitle" value={pageCfg.interetTitle}>
                {(val) => (
                  <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px 0' }}>
                    {val || 'Pourquoi suivre cette formation ?'}
                  </h2>
                )}
              </E>
              <E fieldKey="interetSubtitle" value={pageCfg.interetSubtitle} multiline>
                {(val) => (
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto', lineHeight: '1.65' }}>
                    {val || <>Le Green IT ne se résume pas à de bonnes intentions : il s'inscrit dans un cadre réglementaire, normatif et certificatoire en pleine expansion. Cette formation va au-delà des principes pour fournir les <strong>outils opérationnels</strong>.</>}
                  </p>
                )}
              </E>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {INTEREST_DEFAULTS.map((r, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '8px' }}>
                  <div style={{ width: '64px', height: '64px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : r.bg, borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                    <r.Icon />
                  </div>
                  <E fieldKey={`interetCard${i}Title`} value={pageCfg[`interetCard${i}Title`]}>
                    {(val) => (
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
                        {val || r.title}
                      </h3>
                    )}
                  </E>
                  <E fieldKey={`interetCard${i}Text`} value={pageCfg[`interetCard${i}Text`]} multiline>
                    {(val) => (
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.65', margin: 0 }}>
                        {val || r.text}
                      </p>
                    )}
                  </E>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section Programme ── */}
        <section id="programme" style={sectionStyle({ background: 'var(--bg-page)' })}>
          <div style={containerStyle}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <E fieldKey="programmeTitle" value={pageCfg.programmeTitle}>
                {(val) => (
                  <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px 0' }}>
                    {val || 'Le parcours en 6 modules'}
                  </h2>
                )}
              </E>
              <E fieldKey="programmeSubtitle" value={pageCfg.programmeSubtitle} multiline>
                {(val) => (
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
                    {val || 'Une progression structurée : des concepts généraux aux cas pratiques luxembourgeois.'}
                  </p>
                )}
              </E>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '36px' }}>
              {/* Modules de base (JSON) */}
              {modulesData.modules.map((m) => {
                const pal = MODULE_PALETTE[m.id] || { accent: '#15803d', bg: '#dcfce7' };
                const minutes = toMinutes(m.estimatedTime);
                return (
                  <div key={m.id} style={{
                    backgroundColor: 'var(--bg-surface)', borderRadius: '12px',
                    border: '1px solid var(--border)', padding: '20px',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div style={{ width: '44px', height: '44px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : pal.bg, borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                        {pageCfg[`moduleImage${m.id}`]
                          ? <img src={pageCfg[`moduleImage${m.id}`]} alt={`Module ${m.id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : m.image}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        ⏱ {minutes} min
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: isDark ? '#86efac' : pal.accent, letterSpacing: '1px', marginBottom: '6px' }}>MODULE {m.id}</div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.35' }}>{m.title}</h3>
                    {m.subtitle && (
                      <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4', fontStyle: 'italic' }}>{m.subtitle}</p>
                    )}
                    <E fieldKey={`moduleTeaser${m.id}`} value={pageCfg[`moduleTeaser${m.id}`]} multiline>
                      {(val) => {
                        const text = val || MODULE_TEASER[m.id];
                        return text ? (
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{text}</p>
                        ) : null;
                      }}
                    </E>
                  </div>
                );
              })}
              {/* Modules personnalisés (Firestore) */}
              {customModules.map((m) => {
                const isNew = m.createdAt && (Date.now() - m.createdAt < 30 * 24 * 60 * 60 * 1000);
                return (
                <div key={m.id} style={{
                  backgroundColor: 'var(--bg-surface)', borderRadius: '12px',
                  border: `1px solid ${isDark ? 'rgba(139,92,246,0.3)' : '#e9d5ff'}`,
                  padding: '20px', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ width: '44px', height: '44px', backgroundColor: isDark ? 'rgba(139,92,246,0.15)' : '#f3e8ff', borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                      {m.imageUrl
                        ? <img src={m.imageUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : (m.image || '📦')}
                    </div>
                    {isNew && (
                      <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: isDark ? 'rgba(139,92,246,0.2)' : '#f3e8ff', color: isDark ? '#c4b5fd' : '#7c3aed', padding: '2px 7px', borderRadius: '8px' }}>
                        Nouveau
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: isDark ? '#c4b5fd' : '#7c3aed', letterSpacing: '1px', marginBottom: '6px' }}>MODULE {m.id}</div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.35' }}>{m.title || 'Nouveau module'}</h3>
                  {m.subtitle && (
                    <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4', fontStyle: 'italic' }}>{m.subtitle}</p>
                  )}
                  {m.intro && (
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{m.intro}</p>
                  )}
                </div>
              );})}

            </div>

            <div style={{ textAlign: 'center' }}>
              {firebaseUser ? (
                <button onClick={onStart} style={ctaPrimaryStyle}>Reprendre la formation →</button>
              ) : (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => onGoToAuth && onGoToAuth('register')} style={ctaPrimaryStyle}>Créer un compte gratuit →</button>
                  <button onClick={onStart} style={ctaSecondaryStyle}>Commencer sans compte</button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ──── Footer sticky ──── */}
      <Footer onShowLegal={onShowLegal} />
    </div>
  );
}

// ============================================================================
// Styles
// ============================================================================

const sectionStyle = (extra = {}) => ({
  minHeight: '100%',
  padding: '60px 32px',
  display: 'flex', alignItems: 'center',
  ...extra,
});

const containerStyle = {
  maxWidth: '1100px', margin: '0 auto', width: '100%',
};

const brandBtnStyle = {
  display: 'flex', alignItems: 'center', gap: '10px',
  background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
  fontFamily: 'inherit',
};

const navLinkStyle = (active) => ({
  background: active ? 'var(--accent-soft)' : 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: active ? 'var(--accent)' : 'var(--text-secondary)',
  fontSize: '13px',
  fontWeight: active ? 700 : 500,
  padding: '8px 14px',
  borderRadius: '6px',
  fontFamily: 'inherit',
  transition: 'all 0.15s',
});

const ctaSmallStyle = {
  padding: '8px 18px', backgroundColor: 'var(--brand)', color: 'var(--on-brand)', border: 'none',
  borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  marginLeft: '12px',
};

const ctaPrimaryStyle = {
  padding: '12px 26px', backgroundColor: 'var(--brand)', color: 'var(--on-brand)', border: 'none',
  borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  boxShadow: '0 4px 12px rgba(21,128,61,0.18)',
};

const ctaSecondaryStyle = {
  padding: '12px 26px', backgroundColor: 'transparent', color: 'var(--accent)',
  border: '1px solid var(--accent)', borderRadius: '10px',
  fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
};
