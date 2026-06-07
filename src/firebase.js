/**
 * firebase.js — Initialisation Firebase pour Green IT Académie
 *
 * CONFIGURATION :
 * 1. Va sur https://console.firebase.google.com
 * 2. Crée un projet "green-it-academie"
 * 3. Ajoute une app Web → copie la config ci-dessous
 * 4. Active Authentication → Email/Mot de passe
 * 5. Crée une base Firestore (région : europe-west)
 * 6. Crée un fichier .env.local à la racine du projet avec les variables VITE_*
 *    (voir .env.example pour le modèle)
 *
 * Sans configuration : l'app fonctionne en mode localStorage uniquement.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Variables injectées depuis .env.local (voir .env.example)
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase est optionnel : l'app fonctionne sans backend (localStorage uniquement)
const isConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth = null;
let db = null;

if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('[Firebase] Initialisation échouée — mode hors ligne.', err);
  }
}

export { auth, db, isConfigured };
