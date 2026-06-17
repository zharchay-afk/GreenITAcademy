import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, isConfigured } from './firebase';
import { useTheme } from './theme';

// Section authentification Firebase (login / inscription / déconnexion)
function FirebaseAuthSection({ firebaseUser }) {
  const [theme]               = useTheme();
  const dark                  = theme === 'dark';
  const [tab, setTab]         = useState('login');   // 'login' | 'signup'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const clearMessages = () => { setError(null); setSuccess(null); };

  const handleLogin = async () => {
    if (!email || !password) { setError('Remplis l\'e-mail et le mot de passe.'); return; }
    setLoading(true); clearMessages();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Connecté ! Ta progression est synchronisée.');
      setEmail(''); setPassword('');
    } catch (e) {
      const msg = {
        'auth/user-not-found':   'Aucun compte avec cet e-mail.',
        'auth/wrong-password':   'Mot de passe incorrect.',
        'auth/invalid-email':    'Adresse e-mail invalide.',
        'auth/too-many-requests':'Trop de tentatives. Réessaie dans quelques minutes.',
        'auth/invalid-credential': 'E-mail ou mot de passe incorrect.',
      }[e.code] || 'Erreur de connexion. Vérifie tes identifiants.';
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleSignup = async () => {
    if (!email || !password) { setError('Remplis l\'e-mail et le mot de passe.'); return; }
    if (password.length < 6)  { setError('Le mot de passe doit faire au moins 6 caractères.'); return; }
    setLoading(true); clearMessages();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Compte créé ! Ta progression sera désormais sauvegardée dans le cloud.');
      setEmail(''); setPassword('');
    } catch (e) {
      const msg = {
        'auth/email-already-in-use': 'Un compte existe déjà avec cet e-mail.',
        'auth/invalid-email':        'Adresse e-mail invalide.',
        'auth/weak-password':        'Mot de passe trop faible (6 caractères minimum).',
      }[e.code] || 'Erreur lors de la création du compte.';
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleLogout = async () => {
    try { await signOut(auth); setSuccess('Déconnecté.'); }
    catch { /* ignore */ }
  };

  // Firebase non configuré
  if (!isConfigured) {
    return (
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px dashed #94a3b8' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '700', color: 'var(--accent)' }}>☁️ Compte cloud & synchronisation</h2>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Firebase n'est pas encore configuré. Suis les instructions dans <code>src/firebase.js</code> et crée ton fichier <code>.env.local</code> pour activer la synchronisation multi-appareils.
        </p>
      </div>
    );
  }

  // Utilisateur connecté
  if (firebaseUser) {
    const gcBg     = dark ? 'rgba(34,197,94,0.08)'  : '#f0fdf4';
    const gcBorder = dark ? 'rgba(34,197,94,0.25)'  : '#86efac';
    const gcText   = dark ? '#4ade80'                : '#166534';
    const gcSub    = dark ? 'rgba(74,222,128,0.75)' : 'rgba(22,101,52,0.75)';
    return (
      <div style={{ backgroundColor: gcBg, borderRadius: '10px', padding: '20px 24px', marginBottom: '20px', border: `1px solid ${gcBorder}` }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: '700', color: gcText }}>☁️ Synchronisation cloud active</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', color: gcText, fontWeight: '600' }}>✅ Connecté</div>
            <div style={{ fontSize: '12px', color: gcSub }}>{firebaseUser.email}</div>
            <div style={{ fontSize: '11px', color: gcSub, marginTop: '4px' }}>
              Ta progression est automatiquement sauvegardée dans le cloud.
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 14px', backgroundColor: 'transparent', color: dark ? '#f87171' : '#991b1b', border: `1px solid ${dark ? 'rgba(248,113,113,0.4)' : '#fca5a5'}`, borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap' }}
          >
            Se déconnecter
          </button>
        </div>
        {success && <div style={{ marginTop: '10px', fontSize: '12px', color: gcText }}>{success}</div>}
      </div>
    );
  }

  // Non connecté → formulaire
  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '8px', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' };
  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #bfdbfe' }}>
      <h2 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: 'var(--accent)' }}>☁️ Compte cloud & synchronisation</h2>
      <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
        Crée un compte pour sauvegarder ta progression dans le cloud et y accéder depuis n'importe quel appareil.
      </p>

      {/* Onglets */}
      <div style={{ display: 'flex', marginBottom: '14px', gap: '4px' }}>
        {[['login','Se connecter'],['signup','Créer un compte']].map(([t, label]) => (
          <button key={t} onClick={() => { setTab(t); clearMessages(); }}
            style={{ flex: 1, padding: '7px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px',
              backgroundColor: tab === t ? 'var(--brand)' : 'var(--bg-muted)',
              color: tab === t ? 'var(--on-brand)' : 'var(--text-secondary)' }}>
            {label}
          </button>
        ))}
      </div>

      <input type="email" placeholder="Adresse e-mail" value={email}
        onChange={e => { setEmail(e.target.value); clearMessages(); }}
        onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleSignup())}
        style={inputStyle} />
      <input type="password" placeholder="Mot de passe (6 caractères min.)" value={password}
        onChange={e => { setPassword(e.target.value); clearMessages(); }}
        onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleSignup())}
        style={inputStyle} />

      <button
        onClick={tab === 'login' ? handleLogin : handleSignup}
        disabled={loading}
        style={{ width: '100%', padding: '10px', backgroundColor: 'var(--brand)', color: 'var(--on-brand)', border: 'none', borderRadius: '6px', cursor: loading ? 'wait' : 'pointer', fontWeight: '700', fontSize: '13px' }}
      >
        {loading ? '…' : tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
      </button>

      {error   && <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: dark ? 'rgba(239,68,68,0.12)'  : '#fee2e2', color: dark ? '#f87171' : '#991b1b', borderRadius: '6px', fontSize: '12px', border: `1px solid ${dark ? 'rgba(239,68,68,0.25)' : '#fca5a5'}` }}>{error}</div>}
      {success && <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: dark ? 'rgba(34,197,94,0.1)'  : '#ecfdf5', color: dark ? '#4ade80' : '#166534', borderRadius: '6px', fontSize: '12px', border: `1px solid ${dark ? 'rgba(34,197,94,0.25)' : '#86efac'}` }}>{success}</div>}
    </div>
  );
}

function timeToSecs(str) {
  const [h, m, s] = (str || '00:00:00').split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

function secsToTime(total) {
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map(n => String(n).padStart(2, '0')).join(':');
}

export default function ProfilePage({ modules, onNavigate, onReset, onImport, onShowLegal, onShowLanding, firebaseUser, isAdmin, onSignOut }) {
  const [theme]   = useTheme();
  const dark      = theme === 'dark';
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
    <div className="with-sidebar-nav" style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-page)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Sidebar activePage="profil" onNavigate={onNavigate} isAdmin={isAdmin} firebaseUser={firebaseUser} onSignOut={onSignOut} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="m-pb-nav" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: '700', color: 'var(--accent)' }}>Mon profil</h1>

          {/* Compte cloud Firebase */}
          <FirebaseAuthSection firebaseUser={firebaseUser} />

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
                style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
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
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
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
              <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '6px', fontSize: '12px',
                backgroundColor: importMsg.type === 'success'
                  ? (dark ? 'rgba(34,197,94,0.1)'  : '#ecfdf5')
                  : (dark ? 'rgba(239,68,68,0.1)'  : '#fee2e2'),
                color: importMsg.type === 'success'
                  ? (dark ? '#4ade80' : '#166534')
                  : (dark ? '#f87171' : '#991b1b'),
                border: `1px solid ${importMsg.type === 'success'
                  ? (dark ? 'rgba(34,197,94,0.25)'  : '#86efac')
                  : (dark ? 'rgba(239,68,68,0.25)'  : '#fca5a5')}`,
              }}>
                {importMsg.text}
              </div>
            )}
            <p style={{ margin: '12px 0 0 0', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              💡 Conseil : exportez régulièrement votre fichier de progression. Sur un autre appareil, installez l'application puis utilisez « Importer » pour restaurer votre avancement.
            </p>
          </div>

          {/* Zone danger */}
          {(() => {
            const dangerBorder = dark ? 'rgba(239,68,68,0.25)' : '#fecaca';
            const dangerTitle  = dark ? '#f87171'               : '#991b1b';
            const dangerBtn    = dark ? '#f87171'               : '#dc2626';
            const dangerBtnBorder = dark ? 'rgba(248,113,113,0.4)' : '#dc2626';
            return (
              <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${dangerBorder}` }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '700', color: dangerTitle }}>⚠️ Réinitialiser la progression</h2>
                <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Efface tous tes scores, temps passés et modules commencés. Cette action est irréversible.
                </p>
                {!confirmReset ? (
                  <button
                    onClick={() => setConfirmReset(true)}
                    style={{ padding: '9px 18px', backgroundColor: 'transparent', color: dangerBtn, border: `1px solid ${dangerBtnBorder}`, borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                  >
                    Réinitialiser
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: dangerTitle, fontWeight: '600' }}>Confirmer ?</span>
                    <button
                      onClick={handleReset}
                      style={{ padding: '8px 16px', backgroundColor: dark ? 'rgba(220,38,38,0.8)' : '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}
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
            );
          })()}

        </div>
        </div>

        <Footer onShowLegal={onShowLegal} onShowLanding={onShowLanding} />
      </main>
    </div>
  );
}
