import React, { useState, useEffect, useRef } from 'react';
import { loadScormPackage } from './utils/scormImport';

const STATUS_LABELS = {
  'passed':    { label: '✓ Réussi',          color: '#22c55e', bg: '#dcfce7' },
  'completed': { label: '✓ Terminé',          color: '#22c55e', bg: '#dcfce7' },
  'failed':    { label: '✗ Échoué',           color: '#ef4444', bg: '#fee2e2' },
  'incomplete':{ label: '⏳ En cours',         color: '#f59e0b', bg: '#fef3c7' },
  'not attempted': { label: '○ Non commencé', color: '#94a3b8', bg: '#f1f5f9' },
};

export default function ScormPlayer({ onBack }) {
  const [status, setStatus] = useState('idle');    // idle | loading | ready | error
  const [packageInfo, setPackageInfo] = useState(null);
  const [score, setScore] = useState(null);
  const [lessonStatus, setLessonStatus] = useState('not attempted');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Écouter les messages SCORM API venant de l'iframe
  useEffect(() => {
    const handler = (e) => {
      if (!e.data || e.data.type !== 'scorm') return;
      if (e.data.fn === 'set') {
        if (e.data.e === 'cmi.core.score.raw') setScore(Math.round(parseFloat(e.data.v)));
        if (e.data.e === 'cmi.core.lesson_status') setLessonStatus(e.data.v);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStatus('loading');
    setErrorMsg('');
    setScore(null);
    setLessonStatus('not attempted');
    try {
      const info = await loadScormPackage(file);
      setPackageInfo(info);
      setStatus('ready');
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors du chargement du package.');
      setStatus('error');
    }
  };

  const statusInfo = STATUS_LABELS[lessonStatus] || STATUS_LABELS['not attempted'];
  const passed = packageInfo && score !== null && score >= packageInfo.masteryscore;

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

        {/* Infos du package chargé */}
        {packageInfo && (
          <div style={{ padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: '600', marginBottom: '6px' }}>PACKAGE CHARGÉ</div>
            <div style={{ color: '#fff', fontSize: '12px', fontWeight: '600', lineHeight: '1.4', marginBottom: '10px' }}>{packageInfo.title}</div>
            <div style={{ backgroundColor: statusInfo.bg, borderRadius: '6px', padding: '6px 10px', fontSize: '11px', fontWeight: '600', color: statusInfo.color }}>
              {statusInfo.label}
            </div>
            {score !== null && (
              <div style={{ marginTop: '8px', color: passed ? '#4ade80' : '#fca5a5', fontSize: '20px', fontWeight: '800', textAlign: 'center' }}>
                {score}%
              </div>
            )}
          </div>
        )}

        <div style={{ padding: '16px', flex: 1 }}>
          <button
            onClick={onBack}
            style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}
          >
            ← Retour à l'accueil
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ backgroundColor: '#fff', padding: '14px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1e3a5f' }}>
            📦 {packageInfo ? packageInfo.title : 'Lecteur SCORM'}
          </h1>
          <button
            onClick={() => fileInputRef.current.click()}
            style={{ padding: '8px 16px', backgroundColor: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
          >
            {status === 'ready' ? '↻ Changer de package' : '📂 Charger un package SCORM'}
          </button>
          <input ref={fileInputRef} type="file" accept=".zip" style={{ display: 'none' }} onChange={handleFile} />
        </header>

        {/* Zone principale */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* État : idle */}
          {status === 'idle' && (
            <div style={{ textAlign: 'center', maxWidth: '480px', padding: '40px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#1e3a5f', fontWeight: '700' }}>Charger un package SCORM</h2>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
                Importe n'importe quel package SCORM 1.2 (.zip) pour le lire directement dans l'application.
                Les scores et l'état de complétion sont suivis automatiquement.
              </p>
              <button
                onClick={() => fileInputRef.current.click()}
                style={{ padding: '14px 32px', backgroundColor: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}
              >
                📂 Sélectionner un fichier .zip
              </button>
              <div style={{ marginTop: '16px', fontSize: '12px', color: '#94a3b8' }}>
                Compatible SCORM 1.2 · Traitement entièrement local, aucun envoi de données
              </div>
            </div>
          )}

          {/* État : chargement */}
          {status === 'loading' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 1s linear infinite' }}>⏳</div>
              <p style={{ color: '#64748b', fontSize: '15px' }}>Extraction du package SCORM en cours...</p>
            </div>
          )}

          {/* État : erreur */}
          {status === 'error' && (
            <div style={{ textAlign: 'center', maxWidth: '480px', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#dc2626' }}>Erreur de chargement</h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>{errorMsg}</p>
              <button
                onClick={() => fileInputRef.current.click()}
                style={{ padding: '12px 24px', backgroundColor: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
              >
                Réessayer avec un autre fichier
              </button>
            </div>
          )}

          {/* État : prêt — afficher le SCO dans un iframe */}
          {status === 'ready' && packageInfo && (
            <iframe
              src={packageInfo.entrySrc}
              style={{ width: '100%', height: '100%', border: 'none', minHeight: 'calc(100vh - 57px)' }}
              title={packageInfo.title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          )}
        </div>
      </main>
    </div>
  );
}
