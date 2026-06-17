import React, { useState, useEffect, useRef } from 'react';
import { loadScormPackage } from './utils/scormImport';
import Sidebar from './Sidebar';

const STATUS_LABELS = {
  'passed':    { label: '✓ Réussi',          color: '#22c55e', bg: '#dcfce7' },
  'completed': { label: '✓ Terminé',          color: '#22c55e', bg: '#dcfce7' },
  'failed':    { label: '✗ Échoué',           color: '#ef4444', bg: '#fee2e2' },
  'incomplete':{ label: '⏳ En cours',         color: '#f59e0b', bg: '#fef3c7' },
  'not attempted': { label: '○ Non commencé', color: 'var(--text-muted)', bg: '#f1f5f9' },
};

export default function ScormPlayer({ onNavigate, scormUrl }) {
  const [status, setStatus] = useState('idle');    // idle | loading | ready | error
  const [packageInfo, setPackageInfo] = useState(null);
  const [score, setScore] = useState(null);
  const [lessonStatus, setLessonStatus] = useState('not attempted');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Auto-charge depuis une URL Firebase Storage si fournie
  useEffect(() => {
    if (!scormUrl) return;
    setStatus('loading');
    setScore(null);
    setLessonStatus('not attempted');
    fetch(scormUrl)
      .then(r => r.blob())
      .then(blob => loadScormPackage(new File([blob], 'package.zip', { type: 'application/zip' })))
      .then(info => { setPackageInfo(info); setStatus('ready'); })
      .catch(err => { setErrorMsg(err.message || 'Erreur de chargement SCORM.'); setStatus('error'); });
  }, [scormUrl]);

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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-page)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Sidebar activePage="scorm" onNavigate={onNavigate} />

      {/* Contenu principal */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'var(--bg-surface)', padding: '14px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: 'var(--accent)' }}>
            📦 {packageInfo ? packageInfo.title : 'Lecteur SCORM'}
          </h1>
          <button
            onClick={() => fileInputRef.current.click()}
            style={{ padding: '8px 16px', backgroundColor: 'var(--sidebar-bg)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
          >
            {status === 'ready' ? '↻ Changer de package' : '📂 Charger un package SCORM'}
          </button>
          <input ref={fileInputRef} type="file" accept=".zip" style={{ display: 'none' }} onChange={handleFile} />
        </header>

        {/* Bandeau d'état du package (visible si chargé) */}
        {packageInfo && (
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>État du package :</span>
            <span style={{ backgroundColor: statusInfo.bg, borderRadius: '12px', padding: '4px 10px', fontWeight: '600', color: statusInfo.color }}>{statusInfo.label}</span>
            {score !== null && (
              <span style={{ color: passed ? '#16a34a' : '#dc2626', fontWeight: '700' }}>Score : {score}%</span>
            )}
          </div>
        )}

        {/* Zone principale */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* État : idle */}
          {status === 'idle' && (
            <div style={{ textAlign: 'center', maxWidth: '480px', padding: '40px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', color: 'var(--accent)', fontWeight: '700' }}>Charger un package SCORM</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
                Importe n'importe quel package SCORM 1.2 (.zip) pour le lire directement dans l'application.
                Les scores et l'état de complétion sont suivis automatiquement.
              </p>
              <button
                onClick={() => fileInputRef.current.click()}
                style={{ padding: '14px 32px', backgroundColor: 'var(--sidebar-bg)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}
              >
                📂 Sélectionner un fichier .zip
              </button>
              <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Compatible SCORM 1.2 · Traitement entièrement local, aucun envoi de données
              </div>
            </div>
          )}

          {/* État : chargement */}
          {status === 'loading' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 1s linear infinite' }}>⏳</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Extraction du package SCORM en cours...</p>
            </div>
          )}

          {/* État : erreur */}
          {status === 'error' && (
            <div style={{ textAlign: 'center', maxWidth: '480px', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#dc2626' }}>Erreur de chargement</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>{errorMsg}</p>
              <button
                onClick={() => fileInputRef.current.click()}
                style={{ padding: '12px 24px', backgroundColor: 'var(--sidebar-bg)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
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
