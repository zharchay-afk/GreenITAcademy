import React, { useState } from 'react';

function timeToSecs(str) {
  const [h, m, s] = (str || '00:00:00').split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

function secsToTime(total) {
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map(n => String(n).padStart(2, '0')).join(':');
}

export default function ProfilePage({ modules, onBack, onReset }) {
  const savedName = localStorage.getItem('greenitacademie-name') || '';
  const [name, setName] = useState(savedName);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const validatedModules = modules.filter(m => m.score >= 70);
  const startedModules = modules.filter(m => m.started);
  const totalSecs = modules.reduce((sum, m) => sum + timeToSecs(m.tempsPasse), 0);
  const avgScore = validatedModules.length > 0
    ? Math.round(validatedModules.reduce((s, m) => s + m.score, 0) / validatedModules.length)
    : 0;

  const handleSaveName = () => {
    localStorage.setItem('greenitacademie-name', name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    localStorage.removeItem('greenitacademie-progress');
    localStorage.removeItem('greenitacademie-name');
    onReset();
  };

  const stats = [
    { label: 'Modules commencés', value: `${startedModules.length} / 6`, icon: '📚' },
    { label: 'Modules validés', value: `${validatedModules.length} / 6`, icon: '✅' },
    { label: 'Score moyen', value: avgScore > 0 ? `${avgScore}%` : '—', icon: '⭐' },
    { label: 'Temps total de formation', value: totalSecs > 0 ? secsToTime(totalSecs) : '—', icon: '⏱' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '180px', backgroundColor: '#1e3a5f', minHeight: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#2d5a87', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🌿</div>
            <div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Green IT</div>
              <div style={{ color: '#7cb3d9', fontSize: '10px', fontStyle: 'italic' }}>académie</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px', flex: 1 }}>
          <button
            onClick={onBack}
            style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}
          >
            ← Retour à l'accueil
          </button>
        </div>
      </aside>

      {/* Contenu */}
      <main style={{ flex: 1, padding: '32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: '700', color: '#1e3a5f' }}>Mon profil</h1>

          {/* Nom */}
          <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#1e3a5f' }}>👤 Informations</h2>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
              Ton prénom / nom
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                placeholder="Ex : Ziad Harchay"
                style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              />
              <button
                onClick={handleSaveName}
                style={{ padding: '10px 18px', backgroundColor: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                {saved ? '✓ Enregistré' : 'Enregistrer'}
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#1e3a5f' }}>📊 Mes statistiques</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {stats.map((s, i) => (
                <div key={i} style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e3a5f' }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Barre de progression globale */}
          <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#1e3a5f' }}>🎯 Progression globale</h2>
            {modules.map(m => (
              <div key={m.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#374151' }}>{m.unite} — {m.title}</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: m.score >= 70 ? '#22c55e' : m.score > 0 ? '#f59e0b' : '#94a3b8' }}>
                    {m.score > 0 ? `${m.score}%` : m.started ? 'En cours' : 'Non commencé'}
                  </span>
                </div>
                <div style={{ backgroundColor: '#f1f5f9', borderRadius: '4px', height: '6px' }}>
                  <div style={{ width: `${m.score}%`, height: '100%', backgroundColor: m.score >= 70 ? '#22c55e' : '#f59e0b', borderRadius: '4px', transition: 'width 0.4s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Zone danger */}
          <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #fecaca' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '700', color: '#991b1b' }}>⚠️ Réinitialiser la progression</h2>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
              Efface tous tes scores, temps passés et modules commencés. Cette action est irréversible.
            </p>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                style={{ padding: '9px 18px', backgroundColor: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
              >
                Réinitialiser
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600' }}>Confirmer ?</span>
                <button
                  onClick={handleReset}
                  style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}
                >
                  Oui, tout effacer
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
