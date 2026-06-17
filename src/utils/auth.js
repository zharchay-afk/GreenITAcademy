// Utilitaires de validation — utilisés par AuthPages et ProfilePage.
// L'authentification effective est déléguée à Firebase Auth.

/** Retourne { ok, message }. Politique OWASP / NIST SP 800-63B. */
export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 10) {
    return { ok: false, message: 'Le mot de passe doit contenir au moins 10 caractères.' };
  }
  let categories = 0;
  if (/[a-z]/.test(password)) categories++;
  if (/[A-Z]/.test(password)) categories++;
  if (/[0-9]/.test(password)) categories++;
  if (/[^a-zA-Z0-9]/.test(password)) categories++;
  if (categories < 3) {
    return { ok: false, message: 'Utilisez au moins 3 types de caractères (minuscule, majuscule, chiffre, symbole).' };
  }
  return { ok: true };
}

/** Score de robustesse 0–4. */
export function passwordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 10) score++;
  if (password.length >= 14) score++;
  let cats = 0;
  if (/[a-z]/.test(password)) cats++;
  if (/[A-Z]/.test(password)) cats++;
  if (/[0-9]/.test(password)) cats++;
  if (/[^a-zA-Z0-9]/.test(password)) cats++;
  if (cats >= 3) score++;
  if (cats === 4) score++;
  return Math.min(4, score);
}

/** Validation e-mail (RFC 5322 simplifiée). */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
