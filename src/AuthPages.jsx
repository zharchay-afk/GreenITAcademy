import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, isConfigured } from './firebase';
import { validatePassword, passwordStrength, isValidEmail } from './utils/auth';
import Logo from './Logo';

// ─────────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────────

const wrapStyle = {
  minHeight: '100dvh',
  backgroundColor: 'var(--bg-page)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const cardStyle = {
  backgroundColor: 'var(--bg-surface)',
  borderRadius: '16px',
  padding: '40px',
  maxWidth: '460px',
  width: '100%',
  boxShadow: '0 8px 32px rgba(15,23,42,0.10)',
  border: '1px solid var(--border)',
};

const inputStyle = (focused) => ({
  width: '100%',
  padding: '12px 14px',
  borderRadius: '8px',
  border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  transition: 'border-color 0.15s',
});

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '700',
  color: 'var(--text-secondary)',
  marginBottom: '6px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
};

const btnPrimary = {
  width: '100%',
  padding: '13px',
  backgroundColor: 'var(--brand)',
  color: 'var(--on-brand)',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
  marginTop: '8px',
  fontFamily: 'inherit',
  transition: 'opacity 0.15s',
};

const linkBtn = {
  background: 'none',
  border: 'none',
  color: 'var(--accent)',
  cursor: 'pointer',
  fontSize: '13px',
  textDecoration: 'underline',
  padding: 0,
  fontWeight: '600',
  fontFamily: 'inherit',
};

function FocusInput({ type, value, onChange, placeholder, autoComplete, required, style: extraStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...inputStyle(focused), ...extraStyle }}
    />
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', lineHeight: '1.45' }}>
      {msg}
    </div>
  );
}

function SuccessBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', lineHeight: '1.45' }}>
      {msg}
    </div>
  );
}

// Firebase error codes → messages en français
function fbError(code) {
  return {
    'auth/user-not-found':         'E-mail ou mot de passe incorrect.',
    'auth/wrong-password':         'E-mail ou mot de passe incorrect.',
    'auth/invalid-credential':     'E-mail ou mot de passe incorrect.',
    'auth/email-already-in-use':   'Un compte existe déjà avec cette adresse.',
    'auth/invalid-email':          'Adresse e-mail invalide.',
    'auth/too-many-requests':      'Trop de tentatives — réessayez dans quelques minutes.',
    'auth/network-request-failed': 'Erreur réseau — vérifiez votre connexion.',
    'auth/weak-password':          'Mot de passe trop faible (6 caractères min.).',
  }[code] || 'Une erreur inattendue s\'est produite.';
}

// ─────────────────────────────────────────────
// Header commun (logo + titre + bouton retour)
// ─────────────────────────────────────────────
function AuthHeader({ onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
      {onBack && (
        <button onClick={onBack} style={{ ...linkBtn, marginRight: '6px', fontSize: '18px', textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '400' }}>
          ←
        </button>
      )}
      <Logo size={28} />
      <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Green IT Académie</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// LoginPage
// ─────────────────────────────────────────────
export function LoginPage({ onSuccess, onGoRegister, onGoForgot, onBack, onSkip, onShowLegal }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!isConfigured || !auth) throw new Error('Firebase non configuré.');
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      onSuccess();
    } catch (err) {
      setError(fbError(err.code) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <AuthHeader onBack={onBack} />

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '22px', color: 'var(--text-primary)', fontWeight: '800' }}>Connexion</h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            Retrouvez votre progression sur tous vos appareils.
          </p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Adresse e-mail</label>
            <FocusInput type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com" />
          </div>

          <div style={{ marginBottom: '6px' }}>
            <label style={labelStyle}>Mot de passe</label>
            <FocusInput type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button type="button" onClick={onGoForgot} style={{ ...linkBtn, fontSize: '12px', fontWeight: '500', textDecoration: 'none', color: 'var(--text-secondary)' }}>
              Mot de passe oublié ?
            </button>
          </div>

          <ErrorBanner msg={error} />

          <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '20px' }}>
          Pas encore de compte ?{' '}
          <button onClick={onGoRegister} style={linkBtn}>Créer un compte</button>
        </p>

        {onSkip && (
          <div style={{ marginTop: '16px', textAlign: 'center', paddingTop: '16px', borderTop: '1px dashed var(--border)' }}>
            <button onClick={onSkip} style={{ ...linkBtn, color: 'var(--text-secondary)', fontWeight: '500', textDecoration: 'none' }}>
              Continuer sans compte →
            </button>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '5px 0 0 0' }}>
              La connexion sert à synchroniser votre progression entre appareils.
            </p>
          </div>
        )}

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 6px 0' }}>
            En vous connectant, vous acceptez nos conditions d'utilisation.
          </p>
          <button
            type="button"
            onClick={() => onShowLegal && onShowLegal('privacy')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--accent)', fontWeight: '600', textDecoration: 'underline', fontFamily: 'inherit' }}
          >
            📋 Données personnelles &amp; Mentions légales
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RegisterPage
// ─────────────────────────────────────────────
export function RegisterPage({ onSuccess, onGoLogin, onBack, onSkip, onShowLegal }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [consent, setConsent]         = useState(false);
  const [error, setError]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [verifyStep, setVerifyStep]   = useState(false);

  const strength      = passwordStrength(password);
  const strengthLabel = ['Trop faible', 'Faible', 'Acceptable', 'Bon', 'Excellent'][strength];
  const strengthColor = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'][strength];

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) { setError('Adresse e-mail invalide.'); return; }
    const pv = validatePassword(password);
    if (!pv.ok) { setError(pv.message); return; }
    if (password !== confirm) { setError('Les deux mots de passe ne correspondent pas.'); return; }
    if (!consent) { setError('Vous devez accepter la politique de confidentialité.'); return; }

    setLoading(true);
    try {
      if (!isConfigured || !auth) throw new Error('Firebase non configuré — création de compte impossible.');

      const credential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const user = credential.user;

      // Mettre à jour le nom affiché
      const name = (displayName || '').trim() || email.split('@')[0];
      await updateProfile(user, { displayName: name });

      // Envoyer un e-mail de confirmation
      await sendEmailVerification(user, {
        url: window.location.origin + window.location.pathname,
      });

      // Créer le document utilisateur dans Firestore
      if (db) {
        await setDoc(doc(db, 'users', user.uid), {
          email:       user.email,
          displayName: name,
          role:        'user',
          createdAt:   new Date().toISOString(),
        }, { merge: true });
      }

      setVerifyStep(true);
    } catch (err) {
      setError(fbError(err.code) || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Étape 2 : vérification e-mail envoyée ───
  if (verifyStep) {
    return (
      <div style={wrapStyle}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <AuthHeader />
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>📧</div>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>Confirmez votre e-mail</h2>
          <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Un lien de confirmation a été envoyé à <strong>{email}</strong>.
            Cliquez sur ce lien pour activer votre compte.
          </p>
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px 16px', fontSize: '12px', color: '#92400e', marginBottom: '24px', textAlign: 'left' }}>
            <strong>Vous ne trouvez pas l'e-mail ?</strong>
            <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px', lineHeight: '1.7' }}>
              <li>Vérifiez vos spams</li>
              <li>L'e-mail peut mettre quelques minutes</li>
              <li>Expéditeur : <em>noreply@votre-projet.firebaseapp.com</em></li>
            </ul>
          </div>
          <button onClick={onSuccess} style={btnPrimary}>
            Accéder à la formation →
          </button>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '14px', lineHeight: '1.5' }}>
            Vous pouvez continuer sans confirmer votre e-mail. La confirmation permet de récupérer votre compte en cas d'oubli de mot de passe.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <AuthHeader onBack={onBack} />

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '22px', color: 'var(--text-primary)', fontWeight: '800' }}>Créer un compte</h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            Progression sauvegardée dans le cloud et accessible partout.
          </p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Prénom (facultatif)</label>
            <FocusInput type="text" autoComplete="given-name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Votre prénom" />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Adresse e-mail</label>
            <FocusInput type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com" />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>Mot de passe</label>
            <FocusInput type="password" required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="≥ 10 car., minuscule + majuscule + chiffre" />
            {password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: i < strength ? strengthColor : 'var(--border)', transition: 'background-color 0.2s' }} />
                  ))}
                </div>
                <div style={{ marginTop: '5px', fontSize: '11px', color: strengthColor, fontWeight: '600' }}>
                  Robustesse : {strengthLabel}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Confirmer le mot de passe</label>
            <FocusInput type="password" required autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              style={{ marginTop: '3px', flexShrink: 0 }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
              J'accepte que mon adresse e-mail soit traitée par Firebase (Google) dans le seul but de sécuriser mon accès à ce parcours pédagogique.{' '}
              <button type="button" onClick={() => onShowLegal && onShowLegal('privacy')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent)', textDecoration: 'underline', fontSize: '12px', fontFamily: 'inherit', fontWeight: '600' }}>
                Voir la politique de confidentialité →
              </button>
            </span>
          </label>

          <ErrorBanner msg={error} />

          <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '20px' }}>
          Déjà un compte ?{' '}
          <button onClick={onGoLogin} style={linkBtn}>Se connecter</button>
        </p>

        {onSkip && (
          <div style={{ marginTop: '16px', textAlign: 'center', paddingTop: '16px', borderTop: '1px dashed var(--border)' }}>
            <button onClick={onSkip} style={{ ...linkBtn, color: 'var(--text-secondary)', fontWeight: '500', textDecoration: 'none' }}>
              Continuer sans compte →
            </button>
          </div>
        )}

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => onShowLegal && onShowLegal('privacy')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--accent)', fontWeight: '600', textDecoration: 'underline', fontFamily: 'inherit' }}
          >
            📋 Données personnelles &amp; Mentions légales
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ForgotPasswordPage
// ─────────────────────────────────────────────
export function ForgotPasswordPage({ onGoLogin, onBack }) {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!isConfigured || !auth) throw new Error('Firebase non configuré.');
      await sendPasswordResetEmail(auth, email.trim().toLowerCase(), {
        url: window.location.origin + window.location.pathname,
      });
      setSent(true);
    } catch (err) {
      // Anti-énumération : on affiche la même réponse succès même si l'e-mail n'existe pas
      // (Firebase renvoie une erreur auth/user-not-found — on l'absorbe intentionnellement)
      if (err.code === 'auth/user-not-found') {
        setSent(true);
      } else {
        setError(fbError(err.code) || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <AuthHeader onBack={onBack} />

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>✉️</div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>Lien envoyé</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Si un compte existe pour <strong>{email}</strong>, un lien de réinitialisation vient d'être envoyé.
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.55' }}>
              Vérifiez vos spams si vous ne recevez rien dans les 5 minutes. Le lien expire dans 1 heure.
            </p>
            <button onClick={onGoLogin} style={btnPrimary}>
              Retour à la connexion
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ margin: '0 0 6px 0', fontSize: '22px', color: 'var(--text-primary)', fontWeight: '800' }}>Mot de passe oublié</h1>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                Saisissez votre e-mail pour recevoir un lien de réinitialisation.
              </p>
            </div>

            <form onSubmit={submit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Adresse e-mail</label>
                <FocusInput type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com" />
              </div>

              <ErrorBanner msg={error} />

              <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}>
                {loading ? 'Envoi…' : 'Envoyer le lien de réinitialisation'}
              </button>
            </form>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '20px' }}>
              <button onClick={onGoLogin} style={linkBtn}>← Retour à la connexion</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EmailVerificationBanner (utilisé dans App.jsx)
// ─────────────────────────────────────────────
export function EmailVerificationBanner({ user }) {
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user || user.emailVerified) return null;

  const resend = async () => {
    if (sent) return;
    setLoading(true);
    try {
      await sendEmailVerification(user);
      setSent(true);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#fffbeb',
      borderBottom: '1px solid #fcd34d',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '12px',
      color: '#78350f',
      flexWrap: 'wrap',
    }}>
      <span>⚠️ Votre adresse e-mail n'est pas confirmée.</span>
      <button
        onClick={resend}
        disabled={sent || loading}
        style={{ background: 'none', border: 'none', color: '#92400e', cursor: sent ? 'default' : 'pointer', fontWeight: '700', fontSize: '12px', textDecoration: sent ? 'none' : 'underline', padding: 0, fontFamily: 'inherit' }}
      >
        {sent ? '✓ Lien envoyé' : loading ? 'Envoi…' : 'Renvoyer le lien'}
      </button>
    </div>
  );
}
