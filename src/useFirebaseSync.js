/**
 * useFirebaseSync — Synchronisation bidirectionnelle progression ↔ Firestore
 *
 * Comportement :
 * - Au login : charge la progression cloud et fusionne avec localStorage
 *   (prend le score le plus élevé, marque "commencé" si l'un ou l'autre est vrai)
 * - À chaque changement de modules : envoie la progression vers Firestore
 *   avec un débounce de 1,5 s pour ne pas spammer l'API
 * - Si Firebase n'est pas configuré ou si l'utilisateur n'est pas connecté :
 *   ne fait rien (localStorage continue à être utilisé normalement)
 */

import { useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export function useFirebaseSync(user, modules, setModules) {
  // ---- Chargement au login ----
  useEffect(() => {
    if (!user || !db) return;

    const docRef = doc(db, 'users', user.uid);
    getDoc(docRef)
      .then(snap => {
        if (!snap.exists()) return; // Premier login : rien à charger

        const data = snap.data();
        if (!Array.isArray(data.modules)) return;

        // Fusion : prend le meilleur entre cloud et localStorage
        setModules(prev => prev.map(m => {
          const cloud = data.modules.find(fm => fm.id === m.id);
          if (!cloud) return m;
          return {
            ...m,
            started:    m.started || cloud.started || false,
            score:      Math.max(m.score || 0, cloud.score || 0),
            tempsPasse: cloud.tempsPasse || m.tempsPasse,
          };
        }));
      })
      .catch(err => console.warn('[Firebase] Chargement progression :', err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  // ---- Sauvegarde à chaque modification ----
  useEffect(() => {
    if (!user || !db) return;

    // Débounce : attend 1,5 s après le dernier changement
    const timer = setTimeout(() => {
      const docRef = doc(db, 'users', user.uid);
      setDoc(docRef, {
        email:       user.email || null,
        displayName: localStorage.getItem('greenitacademie-name') || user.displayName || null,
        modules:     modules.map(m => ({
          id:          m.id,
          started:     m.started,
          score:       m.score,
          tempsPasse:  m.tempsPasse,
        })),
        lastSync: new Date().toISOString(),
      }, { merge: true })
        .catch(err => console.warn('[Firebase] Sauvegarde progression :', err));
    }, 1500);

    return () => clearTimeout(timer);
  }, [modules, user?.uid]);
}
