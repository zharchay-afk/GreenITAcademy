import React, { useState, useEffect, useRef } from 'react';
import GreenITAcademie from './GreenIT_Academie_Final';
import CourseReader from './src/CourseReader';
import QuizScreen from './src/QuizScreen';
import AttestationPage from './src/AttestationPage';
import ProfilePage from './src/ProfilePage';
import ScormPlayer from './src/ScormPlayer';
import ReferencesPage from './src/ReferencesPage';
import LandingPage from './src/LandingPage';
import LegalPages from './src/LegalPages';
import AdminPage from './src/AdminPage';
import { LoginPage, RegisterPage, ForgotPasswordPage, EmailVerificationBanner } from './src/AuthPages';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './src/firebase';
import { useFirebaseSync } from './src/useFirebaseSync';

const initialModules = [
  { id: 1, unite: 'MODULE 1', title: 'Cadres conceptuels et typologie', image: '🌐', bgColor: '#4299e1', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 2, unite: 'MODULE 2', title: 'Cadre réglementaire UE & Luxembourg', image: '⚖️', bgColor: '#ed8936', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 3, unite: 'MODULE 3', title: 'Normes et certifications ISO', image: '📋', bgColor: '#48bb78', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 4, unite: 'MODULE 4', title: 'Labels environnementaux IT', image: '🏷️', bgColor: '#9f7aea', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 5, unite: 'MODULE 5', title: 'Codes de conduite et chartes', image: '📜', bgColor: '#f56565', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 6, unite: 'MODULE 6', title: 'Cas pratiques Luxembourg', image: '🇱🇺', bgColor: '#38b2ac', tempsPasse: '00:00:00', score: 0, started: false },
];

const STORAGE_KEY = 'greenitacademie-progress';

function secsToTime(total) {
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map(n => String(n).padStart(2, '0')).join(':');
}
function timeToSecs(str) {
  const [h, m, s] = (str || '00:00:00').split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return initialModules.map(m => {
        const s = parsed.find(p => p.id === m.id);
        return s ? { ...m, started: s.started, score: s.score, tempsPasse: s.tempsPasse ?? m.tempsPasse } : m;
      });
    }
  } catch (e) {}
  return initialModules;
}

// ---- Routage par hash URL ----
// Permet au bouton « Précédent » du navigateur de fonctionner correctement.
// Format des hash : #landing, #home, #module/3, #quiz/3, #attestation, #profil,
// #references, #scorm, #legal/notice, #legal/privacy, etc.
function buildHash(screen, opts = {}) {
  switch (screen) {
    case 'landing':      return '';
    case 'home':         return '#home';
    case 'module':       return opts.moduleId ? `#module/${opts.moduleId}` : '#home';
    case 'quiz':         return opts.moduleId ? `#quiz/${opts.moduleId}` : '#home';
    case 'attestation':  return '#attestation';
    case 'profil':       return '#profil';
    case 'references':   return '#references';
    case 'scorm-player': return '#scorm';
    case 'legal':        return `#legal/${opts.legalTab || 'notice'}`;
    default:             return '';
  }
}

function parseHash(hash) {
  const h = (hash || '').replace(/^#/, '');
  if (!h || h === 'landing')   return { screen: 'landing' };
  if (h === 'home')            return { screen: 'home' };
  if (h === 'attestation')     return { screen: 'attestation' };
  if (h === 'profil')          return { screen: 'profil' };
  if (h === 'references')      return { screen: 'references' };
  if (h === 'scorm')           return { screen: 'scorm-player' };
  if (h.startsWith('module/')) {
    const id = parseInt(h.slice(7), 10);
    return Number.isFinite(id) ? { screen: 'module', moduleId: id } : { screen: 'home' };
  }
  if (h.startsWith('quiz/')) {
    const id = parseInt(h.slice(5), 10);
    return Number.isFinite(id) ? { screen: 'quiz', moduleId: id } : { screen: 'home' };
  }
  if (h.startsWith('legal/')) return { screen: 'legal', legalTab: h.slice(6) };
  return { screen: 'landing' };
}

export default function App() {
  // État initial dérivé de l'URL (permet de partager un lien direct vers une page)
  const initial = parseHash(window.location.hash);

  // 'landing' | 'home' | 'auth' | 'admin' | 'module' | 'quiz' | 'attestation' | 'profil' | 'scorm-player' | 'references' | 'legal'
  const [screen, setScreen] = useState(initial.screen);
  const [legalTab, setLegalTab] = useState(initial.legalTab || 'notice');
  const [legalReturnTo, setLegalReturnTo] = useState('landing');
  const [selectedModuleId, setSelectedModuleId] = useState(initial.moduleId || null);
  const [modules, setModules] = useState(loadProgress);
  const startTimeRef = useRef(null);
  const skipNextHashEffect = useRef(false);

  // Firebase Auth — suivi de l'état de connexion
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      // Vérification du rôle admin dans Firestore
      if (user && db) {
        getDoc(doc(db, 'users', user.uid)).then(snap => {
          setIsAdmin(snap.exists() && snap.data()?.role === 'admin');
        }).catch(() => setIsAdmin(false));
      } else {
        setIsAdmin(false);
      }
    });
  }, []);

  // Synchronisation bidirectionnelle progression ↔ Firestore
  useFirebaseSync(firebaseUser, modules, setModules);

  // Écoute du bouton Précédent / Suivant du navigateur
  useEffect(() => {
    const onPopState = () => {
      skipNextHashEffect.current = true; // évite de re-pousser dans l'historique
      const parsed = parseHash(window.location.hash);
      setScreen(parsed.screen);
      if (parsed.moduleId) setSelectedModuleId(parsed.moduleId);
      if (parsed.legalTab) setLegalTab(parsed.legalTab);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Synchronise l'URL avec l'état actuel à chaque navigation interne
  useEffect(() => {
    if (skipNextHashEffect.current) {
      skipNextHashEffect.current = false;
      return;
    }
    const newHash = buildHash(screen, { moduleId: selectedModuleId, legalTab });
    const current = window.location.hash;
    if (newHash !== current) {
      window.history.pushState(null, '', newHash || window.location.pathname);
    }
  }, [screen, selectedModuleId, legalTab]);

  // Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(modules.map(m => ({ id: m.id, started: m.started, score: m.score, tempsPasse: m.tempsPasse })))
    );
  }, [modules]);

  // Suivi du temps passé sur les cours
  useEffect(() => {
    if (screen !== 'module' && startTimeRef.current && selectedModuleId) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setModules(prev => prev.map(m => {
        if (m.id !== selectedModuleId) return m;
        return { ...m, tempsPasse: secsToTime(timeToSecs(m.tempsPasse) + elapsed) };
      }));
      startTimeRef.current = null;
    }
  }, [screen]);

  // ---- Navigation handlers ----
  const handleStart = (id) => {
    startTimeRef.current = Date.now();
    setSelectedModuleId(id);
    setModules(prev => prev.map(m => m.id === id ? { ...m, started: true } : m));
    setScreen('module');
  };
  const handleEvaluate = (id) => { setSelectedModuleId(id); setScreen('quiz'); };
  const handleQuizComplete = (moduleId, score) => {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, score: Math.max(m.score, score) } : m));
    setScreen('home');
  };
  const handleNavigate = (page) => {
    if (page === 'landing') setScreen('landing');
    if (page === 'accueil') setScreen('home');
    if (page === 'attestation') setScreen('attestation');
    if (page === 'profil') setScreen('profil');
    if (page === 'scorm-player') setScreen('scorm-player');
    if (page === 'references') setScreen('references');
    if (page === 'admin') setScreen('admin');
  };

  const handleGoToAuth = (mode = 'login') => {
    setAuthMode(mode);
    setScreen('auth');
  };
  const handleReset = () => {
    setModules(initialModules);
    localStorage.removeItem(STORAGE_KEY);
    setScreen('home');
  };
  const showLegal = (tab) => {
    setLegalTab(tab);
    // On mémorise l'écran de départ pour que le bouton « Retour » y ramène,
    // qu'il vienne de la landing ou d'une autre page (dashboard, etc.).
    if (screen !== 'legal') setLegalReturnTo(screen);
    setScreen('legal');
  };

  // ----- Rendering -----
  if (screen === 'landing') {
    return (
      <LandingPage
        onStart={() => setScreen('home')}
        onShowLegal={showLegal}
        onGoToAuth={handleGoToAuth}
        firebaseUser={firebaseUser}
      />
    );
  }

  if (screen === 'auth') {
    if (authMode === 'register') {
      return (
        <RegisterPage
          onSuccess={() => setScreen('home')}
          onGoLogin={() => setAuthMode('login')}
          onBack={() => setScreen('landing')}
          onSkip={() => setScreen('home')}
          onShowLegal={showLegal}
        />
      );
    }
    if (authMode === 'forgot') {
      return (
        <ForgotPasswordPage
          onGoLogin={() => setAuthMode('login')}
          onBack={() => setAuthMode('login')}
        />
      );
    }
    return (
      <LoginPage
        onSuccess={() => setScreen('home')}
        onGoRegister={() => setAuthMode('register')}
        onGoForgot={() => setAuthMode('forgot')}
        onBack={() => setScreen('landing')}
        onSkip={() => setScreen('home')}
        onShowLegal={showLegal}
      />
    );
  }

  if (screen === 'admin') {
    return (
      <AdminPage
        firebaseUser={firebaseUser}
        isAdmin={isAdmin}
        onNavigate={handleNavigate}
      />
    );
  }

  if (screen === 'legal') {
    return (
      <LegalPages
        initial={legalTab}
        onBack={() => setScreen(legalReturnTo)}
        onShowScormPlayer={() => setScreen('scorm-player')}
        onShowLegal={showLegal}
        onShowLanding={() => setScreen('landing')}
        onShowHome={() => setScreen('home')}
        onNavigate={handleNavigate}
      />
    );
  }

  if (screen === 'module') {
    return (
      <CourseReader
        moduleId={selectedModuleId}
        onBack={() => setScreen('home')}
        onStartQuiz={() => setScreen('quiz')}
        onSelectModule={(id) => {
          // Démarre le nouveau module et reset le chrono de lecture
          startTimeRef.current = Date.now();
          setSelectedModuleId(id);
          setModules(prev => prev.map(m => m.id === id ? { ...m, started: true } : m));
        }}
      />
    );
  }

  if (screen === 'quiz') {
    return (
      <QuizScreen
        moduleId={selectedModuleId}
        onComplete={handleQuizComplete}
        onBack={() => setScreen('home')}
        onReviewCourse={(id, score) => {
          setModules(prev => prev.map(m => m.id === id ? { ...m, score: Math.max(m.score, score) } : m));
          startTimeRef.current = Date.now();
          setScreen('module');
        }}
      />
    );
  }

  if (screen === 'attestation') return <AttestationPage modules={modules} onNavigate={handleNavigate} onShowLegal={showLegal} onShowLanding={() => setScreen('landing')} />;
  if (screen === 'scorm-player') return <ScormPlayer onNavigate={handleNavigate} />;
  if (screen === 'references') return <ReferencesPage onNavigate={handleNavigate} onShowLegal={showLegal} onShowLanding={() => setScreen('landing')} />;

  if (screen === 'profil') {
    return (
      <ProfilePage
        modules={modules}
        onNavigate={handleNavigate}
        onShowLegal={showLegal}
        onShowLanding={() => setScreen('landing')}
        onReset={handleReset}
        firebaseUser={firebaseUser}
        onImport={(imported) => {
          setModules(prev => prev.map(m => {
            const found = imported.find(i => i.id === m.id);
            if (!found) return m;
            return {
              ...m,
              started: m.started || found.started,
              score: Math.max(m.score, found.score || 0),
              tempsPasse: found.tempsPasse || m.tempsPasse,
            };
          }));
        }}
      />
    );
  }

  // home (dashboard)
  return (
    <>
      <EmailVerificationBanner user={firebaseUser} />
      <GreenITAcademie
        modules={modules}
        onStart={handleStart}
        onEvaluate={handleEvaluate}
        onNavigate={handleNavigate}
        onShowLegal={showLegal}
        onShowLanding={() => setScreen('landing')}
        firebaseUser={firebaseUser}
        isAdmin={isAdmin}
        onGoToAuth={handleGoToAuth}
      />
    </>
  );
}
