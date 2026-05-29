import React, { useState } from 'react';
import Sidebar from './src/Sidebar';
import Footer from './src/Footer';

// ================================================
// GREEN IT ACADÉMIE - Style SecNum
// ================================================

const modulesData = [
  { id: 1, unite: "MODULE 1", title: "Cadres conceptuels et typologie", image: "🌐", bgColor: "#4299e1", tempsPasse: "00:00:00", score: 0, started: false },
  { id: 2, unite: "MODULE 2", title: "Cadre réglementaire UE & Luxembourg", image: "⚖️", bgColor: "#ed8936", tempsPasse: "00:00:00", score: 0, started: false },
  { id: 3, unite: "MODULE 3", title: "Normes et certifications ISO", image: "📋", bgColor: "#48bb78", tempsPasse: "00:00:00", score: 0, started: false },
  { id: 4, unite: "MODULE 4", title: "Labels environnementaux IT", image: "🏷️", bgColor: "#9f7aea", tempsPasse: "00:00:00", score: 0, started: false },
  { id: 5, unite: "MODULE 5", title: "Codes de conduite et chartes", image: "📜", bgColor: "#f56565", tempsPasse: "00:00:00", score: 0, started: false },
  { id: 6, unite: "MODULE 6", title: "Cas pratiques Luxembourg", image: "🇱🇺", bgColor: "#38b2ac", tempsPasse: "00:00:00", score: 0, started: false },
];

// Palette adoucie (accents discrets sur fond pastel — moins de bruit visuel)
const MODULE_PALETTE = {
  1: { accent: '#0ea5e9', bg: '#e0f2fe' },
  2: { accent: '#f59e0b', bg: '#fef3c7' },
  3: { accent: '#10b981', bg: '#d1fae5' },
  4: { accent: '#8b5cf6', bg: '#ede9fe' },
  5: { accent: '#ef4444', bg: '#fee2e2' },
  6: { accent: '#14b8a6', bg: '#ccfbf1' },
};

// Module Card Component
const ModuleCard = ({ module, onStart, onEvaluate }) => {
  const canEvaluate = module.started;
  const pal = MODULE_PALETTE[module.id] || { accent: '#15803d', bg: '#dcfce7' };
  const validated = module.score >= 70;

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}>
      {/* En-tête : icône + statut */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ width: '44px', height: '44px', backgroundColor: pal.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
          {module.image}
        </div>
        {validated && (
          <span style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)', padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700 }}>✓ Réussi</span>
        )}
      </div>

      <div style={{ fontSize: '10px', fontWeight: 700, color: pal.accent, letterSpacing: '1px', marginBottom: '6px' }}>MODULE {module.id}</div>
      <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.35' }}>{module.title}</h3>

      {/* Métriques */}
      <div style={{ marginBottom: '14px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '14px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>⏱ {module.tempsPasse}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          ★ <span style={{ color: validated ? 'var(--accent)' : module.score > 0 ? '#f59e0b' : 'var(--text-muted)', fontWeight: 600 }}>{module.score}%</span>
        </span>
      </div>

      {/* Boutons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <button
          onClick={() => onStart(module.id)}
          style={{
            flex: 1, padding: '9px 12px',
            backgroundColor: 'var(--brand)', color: 'var(--on-brand)',
            border: 'none', borderRadius: '6px',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Commencer
        </button>
        <button
          onClick={() => canEvaluate && onEvaluate(module.id)}
          disabled={!canEvaluate}
          style={{
            flex: 1, padding: '9px 12px',
            backgroundColor: 'transparent',
            color: canEvaluate ? 'var(--accent)' : 'var(--text-muted)',
            border: `1px solid ${canEvaluate ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '6px',
            fontSize: '13px', fontWeight: 600,
            cursor: canEvaluate ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
          }}
        >
          S'évaluer
        </button>
      </div>
    </div>
  );
};

// Main App Component
export default function GreenITAcademie({ modules: modulesProp, onStart: onStartProp, onEvaluate: onEvaluateProp, onNavigate: onNavigateProp, onShowLegal, onShowLanding }) {
  const [activePage, setActivePage] = useState('accueil');
  const [modulesState, setModulesState] = useState(modulesData);

  const modules = modulesProp ?? modulesState;

  const handleNavigate = (page) => {
    setActivePage(page);
    if (onNavigateProp) onNavigateProp(page);
  };

  const handleStart = (id) => {
    if (onStartProp) {
      onStartProp(id);
    } else {
      setModulesState(prev => prev.map(m =>
        m.id === id ? { ...m, started: true, tempsPasse: "00:" + String(Math.floor(Math.random()*20)+10).padStart(2,'0') + ":" + String(Math.floor(Math.random()*60)).padStart(2,'0') } : m
      ));
    }
  };

  const handleEvaluate = (id) => {
    if (onEvaluateProp) {
      onEvaluateProp(id);
    } else {
      setModulesState(prev => prev.map(m =>
        m.id === id ? { ...m, score: Math.floor(Math.random() * 30) + 70 } : m
      ));
    }
  };

  const totalStarted = modules.filter(m => m.started).length;
  const completedModules = modules.filter(m => m.score >= 70).length;

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-page)',
      color: 'var(--text-primary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      <main style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--accent)' }}>
            Mes modules — Normes, Labels & Certifications Green IT
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            <span>📚 {totalStarted}/6 modules commencés</span>
            <span>✓ {completedModules}/6 validés</span>
          </div>
        </header>

        {/* Contenu */}
        <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto' }}>
          {/* Grille des modules */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onStart={handleStart}
                onEvaluate={handleEvaluate}
              />
            ))}
          </div>

        </div>

        <Footer onShowLegal={onShowLegal} onShowLanding={onShowLanding} />
      </main>
    </div>
  );
}
