import React, { useState, useEffect, useRef } from 'react';
import GreenITAcademie from './GreenIT_Academie_Final';
import CourseReader from './src/CourseReader';
import QuizScreen from './src/QuizScreen';
import AttestationPage from './src/AttestationPage';
import ProfilePage from './src/ProfilePage';
import ScormPlayer from './src/ScormPlayer';
import ReferencesPage from './src/ReferencesPage';

const initialModules = [
  { id: 1, unite: 'UNITÉ 1', title: 'Cadres conceptuels et typologie', image: '🌐', bgColor: '#4299e1', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 2, unite: 'UNITÉ 2', title: 'Cadre réglementaire UE & Luxembourg', image: '⚖️', bgColor: '#ed8936', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 3, unite: 'UNITÉ 3', title: 'Normes et certifications ISO', image: '📋', bgColor: '#48bb78', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 4, unite: 'UNITÉ 4', title: 'Labels environnementaux IT', image: '🏷️', bgColor: '#9f7aea', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 5, unite: 'UNITÉ 5', title: 'Codes de conduite et chartes', image: '📜', bgColor: '#f56565', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 6, unite: 'UNITÉ 6', title: 'Cas pratiques Luxembourg', image: '🇱🇺', bgColor: '#38b2ac', tempsPasse: '00:00:00', score: 0, started: false },
];

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
    const saved = localStorage.getItem('greenitacademie-progress');
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

export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'module' | 'quiz' | 'attestation'
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [modules, setModules] = useState(loadProgress);
  const startTimeRef = useRef(null); // horodatage du début de la lecture

  // Sauvegarde automatique (inclut maintenant tempsPasse)
  useEffect(() => {
    localStorage.setItem(
      'greenitacademie-progress',
      JSON.stringify(modules.map(m => ({ id: m.id, started: m.started, score: m.score, tempsPasse: m.tempsPasse })))
    );
  }, [modules]);

  // Quand on quitte l'écran du cours, enregistre le temps écoulé
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

  const handleStart = (id) => {
    startTimeRef.current = Date.now(); // démarre le chronomètre
    setSelectedModuleId(id);
    setModules(prev => prev.map(m => m.id === id ? { ...m, started: true } : m));
    setScreen('module');
  };

  const handleEvaluate = (id) => {
    setSelectedModuleId(id);
    setScreen('quiz');
  };

  // Conserve le meilleur score (ne remplace pas si le nouveau est inférieur)
  const handleQuizComplete = (moduleId, score) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, score: Math.max(m.score, score) } : m
    ));
    setScreen('home');
  };

  const handleNavigate = (page) => {
    if (page === 'attestation') setScreen('attestation');
    if (page === 'profil') setScreen('profil');
    if (page === 'scorm-player') setScreen('scorm-player');
    if (page === 'references') setScreen('references');
  };

  const handleReset = () => {
    setModules(initialModules);
    setScreen('home');
  };

  if (screen === 'module') {
    return (
      <CourseReader
        moduleId={selectedModuleId}
        onBack={() => setScreen('home')}
        onStartQuiz={() => setScreen('quiz')}
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

  if (screen === 'attestation') {
    return (
      <AttestationPage
        modules={modules}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'scorm-player') {
    return <ScormPlayer onBack={() => setScreen('home')} />;
  }

  if (screen === 'references') {
    return <ReferencesPage onBack={() => setScreen('home')} />;
  }

  if (screen === 'profil') {
    return (
      <ProfilePage
        modules={modules}
        onBack={() => setScreen('home')}
        onReset={handleReset}
      />
    );
  }

  return (
    <GreenITAcademie
      modules={modules}
      onStart={handleStart}
      onEvaluate={handleEvaluate}
      onNavigate={handleNavigate}
    />
  );
}
