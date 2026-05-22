// =============================================================================
// auth.js — Authentification côté client avec primitives de sécurité robustes
// =============================================================================
//
// Démarche : l'application étant une PWA sans backend (cf. architecture
// Green IT, cf. DOCUMENTATION_PROJET.md), l'authentification est strictement
// locale. Les données utilisateur ne quittent jamais le terminal.
//
// Choix de sécurité (alignés sur les recommandations OWASP 2023 et NIST
// 800-63B) :
//   • Mot de passe jamais stocké ; uniquement le hash PBKDF2 + sel.
//   • PBKDF2-HMAC-SHA-256, 600 000 itérations (OWASP Password Storage Cheat
//     Sheet, version juin 2023).
//   • Sel aléatoire de 16 octets par utilisateur, généré via
//     crypto.getRandomValues (CSPRNG).
//   • Comparaison à temps constant pour neutraliser les attaques temporelles.
//   • Session matérialisée par un token aléatoire de 32 octets en
//     sessionStorage (cleared on close), avec timestamp d'expiration.
//   • Politique de mot de passe : ≥ 10 caractères, ≥ 3 catégories parmi
//     {minuscule, majuscule, chiffre, symbole}.
//
// Limite assumée : sans backend, on ne peut pas révoquer une session côté
// serveur, ni empêcher l'inspection du localStorage sur un terminal compromis.
// Cette implémentation est donc adaptée à un usage pédagogique / mono-poste.
// Pour un déploiement production, voir DOCUMENTATION_PROJET.md § Perspectives.
// =============================================================================

const USERS_KEY = 'greenit-users';
const SESSION_KEY = 'greenit-session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 heures

// --- Encodage / utilitaires ---------------------------------------------------

const enc = new TextEncoder();

function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  return arr;
}

/** Comparaison à temps constant de deux chaînes hexadécimales. */
function constantTimeEqual(aHex, bHex) {
  if (aHex.length !== bHex.length) return false;
  let diff = 0;
  for (let i = 0; i < aHex.length; i++) {
    diff |= aHex.charCodeAt(i) ^ bHex.charCodeAt(i);
  }
  return diff === 0;
}

// --- Dérivation PBKDF2 --------------------------------------------------------

async function derivePBKDF2(password, saltBytes, iterations = 600000) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return bytesToHex(new Uint8Array(bits));
}

// --- Validation du mot de passe ----------------------------------------------

/** Retourne un objet { ok, message }. */
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

/** Évalue la robustesse d'un mot de passe (0 = nul, 4 = excellent). */
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

/** Email valide (RFC 5322 simplifiée). */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// --- Lecture / écriture des utilisateurs en local ---------------------------

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

// --- API publique : Register / Login / Logout / Session ---------------------

/**
 * Crée un nouveau compte. Lance une erreur si invalide ou existant.
 * @returns {{ email, displayName }}
 */
export async function register({ email, password, displayName }) {
  email = normalizeEmail(email);
  if (!isValidEmail(email)) throw new Error('Adresse e-mail invalide.');
  const pv = validatePassword(password);
  if (!pv.ok) throw new Error(pv.message);

  const users = readUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error('Un compte existe déjà avec cette adresse.');
  }

  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePBKDF2(password, saltBytes);

  const user = {
    email,
    displayName: (displayName || '').trim() || email.split('@')[0],
    saltHex: bytesToHex(saltBytes),
    hashHex: hash,
    iterations: 600000,
    createdAt: Date.now(),
  };
  users.push(user);
  writeUsers(users);

  // Connexion automatique après inscription
  return openSession(user);
}

/**
 * Connecte un utilisateur existant. Lance une erreur si identifiants invalides.
 * Réponse identique en cas de email inexistant ou mot de passe faux (anti-énumération).
 */
export async function login({ email, password }) {
  email = normalizeEmail(email);
  const users = readUsers();
  const user = users.find((u) => u.email === email);

  // Anti-énumération : on hache même si l'utilisateur n'existe pas (temps comparable)
  const saltBytes = user
    ? hexToBytes(user.saltHex)
    : crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePBKDF2(password, saltBytes, user?.iterations ?? 600000);

  if (!user || !constantTimeEqual(hash, user.hashHex)) {
    throw new Error('E-mail ou mot de passe incorrect.');
  }
  return openSession(user);
}

function openSession(user) {
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const session = {
    email: user.email,
    displayName: user.displayName,
    token: bytesToHex(tokenBytes),
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { email: session.email, displayName: session.displayName };
}

/** Renvoie la session active ou null si expirée / absente. */
export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return { email: session.email, displayName: session.displayName, expiresAt: session.expiresAt };
  } catch {
    return null;
  }
}

/** Déconnexion. */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

/** Pour debug / pages internes : nombre de comptes locaux. */
export function getUserCount() {
  return readUsers().length;
}
