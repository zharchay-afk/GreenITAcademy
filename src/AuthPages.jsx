import React, { useState } from 'react';
import { register, login, validatePassword, passwordStrength, isValidEmail } from './utils/auth';

const wrapStyle = {
  minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const cardStyle = {
  backgroundColor: '#fff', borderRadius: '14px', padding: '40px', maxWidth: '440px', width: '100%',
  boxShadow: '0 10px 30px rgba(15,23,42,0.08)', border: '1px solid #e2e8f0',
};

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e0',
  fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px', letterSpacing: '0.3px' };

const btnPrimary = {
  width: '100%', padding: '13px', backgroundColor: '#166534', color: '#fff', border: 'none',
  borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '8px',
};

const linkBtn = {
  background: 'none', border: 'none', color: '#166534', cursor: 'pointer', fontSize: '13px',
  textDecoration: 'underline', padding: 0, fontWeight: '600', fontFamily: 'inherit',
};

// -----------------------------------------------------------------------------
// LoginPage
// -----------------------------------------------------------------------------
export function LoginPage({ onSuccess, onGoRegister, onBack, onSkip }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const session = await login({ email, password });
      onSuccess(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <button onClick={onBack} style={{ ...linkBtn, marginBottom: '20px', display: 'inline-block' }}>← Retour</button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>🔐</div>
          <h1 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '700' }}>Connexion</h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>Accédez à votre parcours Green IT Académie.</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>ADRESSE E-MAIL</label>
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="vous@exemple.com" />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>MOT DE PASSE</label>
            <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••••" />
          </div>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Vérification…' : 'Se connecter'}
          </button>
        </form>

        <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginTop: '20px' }}>
          Pas encore de compte ?{' '}
          <button onClick={onGoRegister} style={linkBtn}>Créer un compte</button>
        </p>

        {onSkip && (
          <div style={{ marginTop: '16px', textAlign: 'center', paddingTop: '16px', borderTop: '1px dashed #e2e8f0' }}>
            <button onClick={onSkip} style={{ ...linkBtn, color: '#64748b', fontWeight: '500' }}>
              → Continuer sans compte
            </button>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 0 0' }}>
              La connexion sert uniquement à retrouver votre progression sur plusieurs appareils.
            </p>
          </div>
        )}

        <div style={{ marginTop: '24px', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>
          🔒 Vos identifiants ne quittent jamais votre terminal. Mot de passe hashé via PBKDF2-SHA-256 (600 000 itérations, OWASP 2023).
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// RegisterPage
// -----------------------------------------------------------------------------
export function RegisterPage({ onSuccess, onGoLogin, onBack, onSkip }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(password);
  const strengthLabel = ['Trop faible', 'Faible', 'Acceptable', 'Bon', 'Excellent'][strength];
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) { setError('Adresse e-mail invalide.'); return; }
    const pv = validatePassword(password);
    if (!pv.ok) { setError(pv.message); return; }
    if (password !== confirm) { setError('Les deux mots de passe ne correspondent pas.'); return; }
    if (!consent) { setError('Vous devez accepter la politique de confidentialité pour créer un compte.'); return; }

    setLoading(true);
    try {
      const session = await register({ email, password, displayName });
      onSuccess(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <button onClick={onBack} style={{ ...linkBtn, marginBottom: '20px', display: 'inline-block' }}>← Retour</button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>👤</div>
          <h1 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '700' }}>Créer un compte</h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>Le compte est local à votre navigateur. Aucune donnée n'est envoyée à un serveur.</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>NOM AFFICHÉ (facultatif)</label>
            <input type="text" autoComplete="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={inputStyle} placeholder="Votre prénom" />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>ADRESSE E-MAIL</label>
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="vous@exemple.com" />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>MOT DE PASSE</label>
            <input type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="≥ 10 caractères, 3 types de caractères" />
            {password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: i < strength ? strengthColors[strength] : '#e2e8f0', transition: 'background-color 0.2s' }} />
                  ))}
                </div>
                <div style={{ marginTop: '6px', fontSize: '11px', color: strengthColors[strength], fontWeight: '600' }}>
                  Robustesse : {strengthLabel}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>CONFIRMER LE MOT DE PASSE</label>
            <input type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle} />
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: '3px' }} />
            <span style={{ fontSize: '12px', color: '#475569', lineHeight: '1.55' }}>
              J'ai lu et j'accepte la politique de protection des données personnelles. Mes données restent locales à mon navigateur.
            </span>
          </label>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginTop: '20px' }}>
          Déjà un compte ?{' '}
          <button onClick={onGoLogin} style={linkBtn}>Se connecter</button>
        </p>

        {onSkip && (
          <div style={{ marginTop: '16px', textAlign: 'center', paddingTop: '16px', borderTop: '1px dashed #e2e8f0' }}>
            <button onClick={onSkip} style={{ ...linkBtn, color: '#64748b', fontWeight: '500' }}>
              → Continuer sans compte
            </button>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 0 0' }}>
              La connexion sert uniquement à retrouver votre progression sur plusieurs appareils.
            </p>
          </div>
        )}

        <div style={{ marginTop: '24px', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>
          🔒 Mot de passe stocké uniquement sous forme de hash PBKDF2-SHA-256 (600 000 itérations, sel aléatoire 16 octets par compte). Conforme aux recommandations OWASP 2023 et NIST SP 800-63B.
        </div>
      </div>
    </div>
  );
}
