import React, { useState, useEffect } from 'react';
import GreenITAcademie from './GreenIT_Academie_Final';
import CourseReader from './src/CourseReader';
import QuizScreen from './src/QuizScreen';

// État initial des 6 modules
const initialModules = [
  { id: 1, unite: 'UNITÉ 1', title: 'Cadres conceptuels et typologie', image: '🌐', bgColor: '#4299e1', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 2, unite: 'UNITÉ 2', title: 'Cadre réglementaire UE & Luxembourg', image: '⚖️', bgColor: '#ed8936', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 3, unite: 'UNITÉ 3', title: 'Normes et certifications ISO', image: '📋', bgColor: '#48bb78', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 4, unite: 'UNITÉ 4', title: 'Labels environnementaux IT', image: '🏷️', bgColor: '#9f7aea', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 5, unite: 'UNITÉ 5', title: 'Codes de conduite et chartes', image: '📜', bgColor: '#f56565', tempsPasse: '00:00:00', score: 0, started: false },
  { id: 6, unite: 'UNITÉ 6', title: 'Cas pratiques Luxembourg', image: '🇱🇺', bgColor: '#38b2ac', tempsPasse: '00:00:00', score: 0, started: false },
];

// Charge la progression sauvegardée, ou les valeurs initiales si rien n'est sauvegardé
function loadProgress() {
  try {
    const saved = localStorage.getItem('greenitacademie-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return initialModules.map(m => {
        const s = parsed.find(p => p.id === m.id);
        return s ? { ...m, started: s.started, score: s.score } : m;
      });
    }
  } catch (e) {}
  return initialModules;
}

export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'module' | 'quiz'
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [modules, setModules] = useState(loadProgress);

  // Sauvegarde automatique à chaque changement de progression
  useEffect(() => {
    localStorage.setItem(
      'greenitacademie-progress',
      JSON.stringify(modules.map(m => ({ id: m.id, started: m.started, score: m.score })))
    );
  }, [modules]);

  // Clic sur "Commencer" → ouvrir le cours
  const handleStart = (id) => {
    setSelectedModuleId(id);
    setModules(prev => prev.map(m =>
      m.id === id ? { ...m, started: true } : m
    ));
    setScreen('module');
  };

  // Clic sur "S'évaluer" → ouvrir le quiz
  const handleEvaluate = (id) => {
    setSelectedModuleId(id);
    setScreen('quiz');
  };

  // Quiz terminé → sauvegarder le score et retourner à l'accueil
  const handleQuizComplete = (moduleId, score) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, score } : m
    ));
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
      />
    );
  }

  return (
    <GreenITAcademie
      modules={modules}
      onStart={handleStart}
      onEvaluate={handleEvaluate}
    />
  );
}
