import React, { useState } from 'react';

// ================================================
// GREEN IT ACADÉMIE - Style SecNum
// ================================================

const modulesData = [
  { id: 1, unite: "UNITÉ 1", title: "Cadres conceptuels et typologie", image: "🌐", bgColor: "#4299e1", tempsPasse: "00:00:00", score: 0, started: false },
  { id: 2, unite: "UNITÉ 2", title: "Cadre réglementaire UE & Luxembourg", image: "⚖️", bgColor: "#ed8936", tempsPasse: "00:00:00", score: 0, started: false },
  { id: 3, unite: "UNITÉ 3", title: "Normes et certifications ISO", image: "📋", bgColor: "#48bb78", tempsPasse: "00:00:00", score: 0, started: false },
  { id: 4, unite: "UNITÉ 4", title: "Labels environnementaux IT", image: "🏷️", bgColor: "#9f7aea", tempsPasse: "00:00:00", score: 0, started: false },
  { id: 5, unite: "UNITÉ 5", title: "Codes de conduite et chartes", image: "📜", bgColor: "#f56565", tempsPasse: "00:00:00", score: 0, started: false },
  { id: 6, unite: "UNITÉ 6", title: "Cas pratiques Luxembourg", image: "🇱🇺", bgColor: "#38b2ac", tempsPasse: "00:00:00", score: 0, started: false },
];

// Sidebar Component
const Sidebar = ({ activePage, onNavigate }) => (
  <aside style={{
    width: '180px',
    backgroundColor: '#1e3a5f',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  }}>
    {/* Logo */}
    <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', backgroundColor: '#2d5a87', borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
        }}>🌿</div>
        <div>
          <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Green IT</div>
          <div style={{ color: '#7cb3d9', fontSize: '10px', fontStyle: 'italic' }}>académie</div>
        </div>
      </div>
    </div>
    
    {/* Navigation */}
    <nav style={{ padding: '12px 0', flex: 1 }}>
      {[
        { id: 'accueil', icon: '🏠', label: 'Accueil' },
        { id: 'attestation', icon: '📄', label: 'Mon attestation' },
        { id: 'profil', icon: '👤', label: 'Mon profil' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: activePage === item.id ? 'rgba(255,255,255,0.08)' : 'transparent',
            border: 'none',
            borderLeft: activePage === item.id ? '3px solid #4ade80' : '3px solid transparent',
            color: activePage === item.id ? '#4ade80' : 'rgba(255,255,255,0.85)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: activePage === item.id ? '600' : '400',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '15px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
    
    {/* Aide */}
    <div style={{ padding: '16px' }}>
      <button style={{
        width: '100%',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#4ade80',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        padding: '8px 0'
      }}>
        <span style={{
          width: '18px', height: '18px', borderRadius: '50%',
          border: '2px solid #4ade80',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px'
        }}>?</span>
        <span>Aide</span>
      </button>
    </div>
  </aside>
);

// Module Card Component
const ModuleCard = ({ module, onStart, onEvaluate }) => {
  const canEvaluate = module.started;
  
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Illustration */}
      <div style={{
        height: '100px',
        backgroundColor: module.bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.12,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,255,255,0.4) 6px, rgba(255,255,255,0.4) 7px)'
        }} />
        <span style={{
          fontSize: '44px',
          position: 'relative',
          filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))'
        }}>{module.image}</span>
        
        {module.score >= 70 && (
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            backgroundColor: '#22c55e', color: 'white',
            padding: '3px 8px', borderRadius: '10px',
            fontSize: '10px', fontWeight: '600'
          }}>✓ Réussi</div>
        )}
      </div>
      
      {/* Badge Unité */}
      <div style={{ backgroundColor: '#4a5568', padding: '6px 12px' }}>
        <span style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.4px'
        }}>{module.unite}</span>
      </div>
      
      {/* Contenu */}
      <div style={{ padding: '12px' }}>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          fontWeight: '700',
          color: '#1a202c',
          lineHeight: '1.35',
          minHeight: '38px'
        }}>{module.title}</h3>
        
        {/* Métriques */}
        <div style={{ marginBottom: '12px', fontSize: '12px', color: '#4a5568' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ color: '#3182ce' }}>⏱</span>
            <span>Temps passé : </span>
            <span style={{ fontWeight: '600' }}>{module.tempsPasse}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#ecc94b' }}>★</span>
            <span>Score : </span>
            <span style={{
              fontWeight: '600',
              color: module.score > 0 ? '#22c55e' : '#e53e3e'
            }}>{module.score}%</span>
          </div>
        </div>
        
        {/* Boutons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onStart(module.id)}
            style={{
              flex: 1,
              padding: '10px 12px',
              backgroundColor: '#e65100',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Commencer
          </button>
          <button
            onClick={() => canEvaluate && onEvaluate(module.id)}
            disabled={!canEvaluate}
            style={{
              flex: 1,
              padding: '10px 12px',
              backgroundColor: canEvaluate ? '#fff' : '#f1f5f9',
              color: canEvaluate ? '#4a5568' : '#a0aec0',
              border: canEvaluate ? '1px solid #cbd5e0' : '1px solid #e2e8f0',
              borderRadius: '5px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: canEvaluate ? 'pointer' : 'not-allowed'
            }}
          >
            S'évaluer
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function GreenITAcademie({ modules: modulesProp, onStart: onStartProp, onEvaluate: onEvaluateProp }) {
  const [activePage, setActivePage] = useState('accueil');
  const [modulesState, setModulesState] = useState(modulesData);

  // Si des modules sont passés depuis App.jsx, on les utilise ; sinon on utilise l'état local
  const modules = modulesProp ?? modulesState;

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
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      
      <main style={{ flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          backgroundColor: '#fff',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e3a5f' }}>
            Module 1 : Normes, Labels & Certifications Green IT
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <span>📚 {totalStarted}/6 modules commencés</span>
            <span>✓ {completedModules}/6 validés</span>
          </div>
        </header>

        {/* Contenu */}
        <div style={{ padding: '20px 24px', flex: 1 }}>
          {/* Bouton retour */}
          <button style={{
            backgroundColor: '#22c55e',
            color: '#fff',
            border: 'none',
            padding: '7px 14px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            ← Accueil
          </button>

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

          {/* Section SCORM */}
          <div style={{
            padding: '20px',
            backgroundColor: '#ecfdf5',
            borderRadius: '8px',
            border: '1px solid #86efac',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}>
            <span style={{ fontSize: '28px' }}>📦</span>
            <div>
              <h3 style={{ margin: '0 0 6px 0', color: '#166534', fontSize: '14px', fontWeight: '600' }}>
                Export SCORM disponible
              </h3>
              <p style={{ margin: '0 0 12px 0', color: '#4d7c0f', fontSize: '12px', lineHeight: '1.5' }}>
                Intégrez ce parcours dans Moodle, Canvas ou tout LMS compatible SCORM 1.2.
                Une démarche conforme aux principes Green IT : réutilisabilité et sobriété numérique.
              </p>
              <button style={{
                backgroundColor: '#166534',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                ⬇ Télécharger le package SCORM
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          padding: '14px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          color: '#64748b',
          fontSize: '11px'
        }}>
          <span>© 2026 Charles DE MEDEIROS – Ziad HARCHAY | Master Data Science, UE Green IT LURS01</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            🌱 Éco-conçu selon les principes du Green IT
          </span>
        </footer>
      </main>
    </div>
  );
}
