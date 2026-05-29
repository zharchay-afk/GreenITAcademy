import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

function timeToSecs(str) {
  const [h, m, s] = (str || '00:00:00').split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

function secsToTime(total) {
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map(n => String(n).padStart(2, '0')).join(':');
}

export default function ProfilePage({ modules, onNavigate, onReset, onImport, onShowLegal, onShowLanding }) {
  const savedName = localStorage.getItem('greenitacademie-name') || '';
  const [name, setName] = useState(savedName);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const fileInputRef = React.useRef(null);

  // Export : sauvegarde de la progression au format JSON
  const handleExport = () => {
    const payload = {
      app: 'green-it-academie',
      version: 1,
      exportedAt: new Date().toISOString(),
      displayName: name || null,
      modules: modules.map(m => ({ id: m.id, started: m.started, score: m.score, tempsPasse: m.tempsPasse })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `green-it-academie-progression-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import : restauration de la progression depuis un JSON
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.app !== 'green-it-academie' || !Array.isArray(data.modules)) {
          setImportMsg({ type: 'error', text: 'Fichier non reconnu.' });
          return;
        }
        if (onImport) onImport(data.modules);
        setImportMsg({ type: 'success', text: `Progression restaurée (export du ${new Date(data.exportedAt).toLocaleDateString('fr-FR')}).` });
      } catch {
        setImportMsg({ type: 'error', text: 'Fichier JSON invalide.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-page)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Sidebar activePage="profil" onNavigate={onNavigate} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: '700', color: 'var(--accent)' }}>Mon profil</h1>

          {/* Nom */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: 'var(--accent)' }}>👤 Informations</h2>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Ton prénom / nom
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                placeholder="Ex : Camille Martin"
                style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              />
              <button
                onClick={handleSaveName}
                style={{ padding: '10px 18px', backgroundColor: 'var(--brand)', color: 'var(--on-brand)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                {saved ? '✓ Enregistré' : 'Enregistrer'}
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: 'var(--accent)' }}>📊 Mes statistiques</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {stats.map((s, i) => (
                <div key={i} style={{ backgroundColor: 'var(--bg-muted)', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent)' }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Barre de progression globale */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: 'var(--accent)' }}>🎯 Progression globale</h2>
            {modules.map(m => (
              <div key={m.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{m.unite} — {m.title}</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: m.score >= 70 ? '#22c55e' : m.score > 0 ? '#f59e0b' : '#94a3b8' }}>
                    {m.score > 0 ? `${m.score}%` : m.started ? 'En cours' : 'Non commencé'}
                  </span>
                </div>
                <div style={{ backgroundColor: 'var(--bg-page)', borderRadius: '4px', height: '6px' }}>
                  <div style={{ width: `${m.score}%`, height: '100%', backgroundColor: m.score >= 70 ? '#22c55e' : '#f59e0b', borderRadius: '4px', transition: 'width 0.4s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Synchronisation multi-appareils */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #bbf7d0' }}>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: 'var(--accent)' }}>🔄 Sauvegarde &amp; synchronisation multi-appareils</h2>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
              L'application étant éco-conçue sans serveur, la synchronisation s'effectue via un fichier de sauvegarde que vous transférez vous-même d'un appareil à l'autre. Aucune donnée n'est envoyée à un tiers.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleExport}
                style={{ padding: '9px 16px', backgroundColor: 'var(--brand)', color: 'var(--on-brand)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                ⬇ Exporter ma progression (.json)
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '9px 16px', backgroundColor: 'var(--bg-surface)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                ⬆ Importer une sauvegarde
              </button>
              <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleImportFile} style={{ display: 'none' }} />
            </div>
            {importMsg && (
              <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', backgroundColor: importMsg.type === 'success' ? '#ecfdf5' : '#fee2e2', color: importMsg.type === 'success' ? '#166534' : '#991b1b', border: `1px solid ${importMsg.type === 'success' ? '#86efac' : '#fca5a5'}` }}>
                {importMsg.text}
              </div>
            )}
            <p style={{ margin: '12px 0 0 0', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              💡 Conseil : exportez régulièrement votre fichier de progression. Sur un autre appareil, installez l'application puis utilisez « Importer » pour restaurer votre avancement.
            </p>
          </div>

          {/* Zone danger */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #fecaca' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '700', color: '#991b1b' }}>⚠️ Réinitialiser la progression</h2>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Efface tous tes scores, temps passés et modules commencés. Cette action est irréversible.
            </p>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                style={{ padding: '9px 18px', backgroundColor: 'var(--bg-surface)', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
              >
                Réinitialiser
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600' }}>Confirmer ?</span>
                <button
                  onClick={handleReset}
                  style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: 'var(--on-brand)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}
                >
                  Oui, tout effacer
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  style={{ padding: '8px 16px', backgroundColor: 'var(--bg-page)', color: 'var(--text-secondary)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
        </div>

        <Footer onShowLegal={onShowLegal} onShowLanding={onShowLanding} />
      </main>
    </div>
  );
}
