import React, { useState, useMemo, useEffect } from 'react';
import questionsData from '../data/questions.json';
import Logo from './Logo';
import useIsMobile from './useIsMobile';

// --- Logique adaptative ---
// Niveaux : 0 = débutant, 1 = intermédiaire, 2 = avancé
const LEVELS = ['debutant', 'intermediaire', 'avance'];
const LEVEL_LABEL = { debutant: '🟢 Débutant', intermediaire: '🟡 Intermédiaire', avance: '🔴 Avancé' };
const LEVEL_WEIGHT = { debutant: 1, intermediaire: 1.5, avance: 2 };

// Nombre de questions par session de quiz
const QUIZ_LENGTH = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Sélectionne la prochaine question selon la cible et l'historique des id déjà posés
function pickNextQuestion(pool, targetLevelIdx, askedIds) {
  const remaining = pool.filter(q => !askedIds.has(q.id));
  if (remaining.length === 0) return null;

  // Cherche d'abord au niveau cible
  let candidates = remaining.filter(q => LEVELS.indexOf(q.level) === targetLevelIdx);
  // Sinon, niveau le plus proche disponible
  if (candidates.length === 0) {
    let best = remaining[0];
    let bestDist = Math.abs(LEVELS.indexOf(best.level) - targetLevelIdx);
    for (const q of remaining) {
      const d = Math.abs(LEVELS.indexOf(q.level) - targetLevelIdx);
      if (d < bestDist) { best = q; bestDist = d; }
    }
    candidates = remaining.filter(q => LEVELS.indexOf(q.level) === LEVELS.indexOf(best.level));
  }
  return shuffle(candidates)[0];
}

export default function QuizScreen({ moduleId, onComplete, onBack, onReviewCourse }) {
  const isMobile = useIsMobile();
  // Banque de questions du module
  const pool = useMemo(() => questionsData.questions.filter(q => q.moduleId === moduleId), [moduleId]);

  const [askedIds, setAskedIds] = useState(() => new Set());
  const [history, setHistory] = useState([]); // { question, selectedIdx, correct }
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0); // commence en débutant
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  // Initialisation : tirer la première question
  useEffect(() => {
    const first = pickNextQuestion(pool, 0, new Set());
    if (first) {
      setCurrentQuestion(first);
      setAskedIds(new Set([first.id]));
    }
  }, [pool]);

  const totalToAsk = Math.min(QUIZ_LENGTH, pool.length);
  const answeredCount = history.length;

  const handleAnswer = (idx) => {
    if (showFeedback || !currentQuestion) return;
    const correct = idx === currentQuestion.correctIndex;
    setSelectedAnswer(idx);
    setShowFeedback(true);
    setHistory(h => [...h, { question: currentQuestion, selectedIdx: idx, correct, levelAt: LEVELS[currentLevelIdx] }]);

    // Ajustement adaptatif : juste = monte d'un cran, faux = redescend d'un cran
    if (correct) {
      setStreak(s => s + 1);
      setCurrentLevelIdx(l => Math.min(2, l + 1));
    } else {
      setStreak(0);
      setCurrentLevelIdx(l => Math.max(0, l - 1));
    }
  };

  const handleNext = () => {
    // Fin du quiz ?
    if (history.length >= totalToAsk) {
      setFinished(true);
      return;
    }
    const next = pickNextQuestion(pool, currentLevelIdx, askedIds);
    if (!next) {
      setFinished(true);
      return;
    }
    setCurrentQuestion(next);
    setAskedIds(prev => new Set([...prev, next.id]));
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  // Score pondéré : récompense les bonnes réponses sur questions difficiles
  const { finalScore, weightedMax, weightedScore, correctCount } = useMemo(() => {
    let wMax = 0, wScore = 0, correct = 0;
    for (const h of history) {
      const w = LEVEL_WEIGHT[h.levelAt] || 1;
      wMax += w;
      if (h.correct) { wScore += w; correct += 1; }
    }
    return {
      correctCount: correct,
      weightedMax: wMax,
      weightedScore: wScore,
      finalScore: wMax > 0 ? Math.round((wScore / wMax) * 100) : 0,
    };
  }, [history]);

  const passed = finalScore >= 70;

  // --- Écran résultats ---
  if (finished) {
    const levelStats = LEVELS.map(lv => {
      const items = history.filter(h => h.levelAt === lv);
      return { level: lv, total: items.length, correct: items.filter(h => h.correct).length };
    });

    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '12px', padding: '40px 36px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>{passed ? '🏆' : '📚'}</div>
          <div style={{ fontSize: '44px', fontWeight: '800', color: passed ? '#22c55e' : '#e53e3e', marginBottom: '4px' }}>{finalScore}%</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.5px' }}>SCORE PONDÉRÉ PAR DIFFICULTÉ</div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: 'var(--accent)', fontWeight: '700' }}>
            {passed ? 'Module validé !' : 'À retravailler'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 20px 0', lineHeight: '1.6' }}>
            {correctCount} bonne{correctCount > 1 ? 's' : ''} réponse{correctCount > 1 ? 's' : ''} sur {history.length} questions · seuil de réussite : 70 %
          </p>

          {/* Répartition par niveau */}
          <div style={{ backgroundColor: 'var(--bg-muted)', borderRadius: '8px', padding: '14px', marginBottom: '20px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: '600', letterSpacing: '0.4px' }}>RÉPARTITION PAR NIVEAU</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px' }}>
              {levelStats.map(s => (
                <div key={s.level} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{LEVEL_LABEL[s.level]}</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: s.total === 0 ? '#cbd5e0' : 'var(--accent)' }}>
                    {s.total === 0 ? '—' : `${s.correct}/${s.total}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: passed ? '#ecfdf5' : '#fff5f5', borderRadius: '8px', padding: '14px', marginBottom: '24px', border: `1px solid ${passed ? '#86efac' : '#fecaca'}`, fontSize: '12px', color: passed ? '#166534' : '#991b1b', lineHeight: '1.5' }}>
            {passed
              ? 'Vous maîtrisez les notions du module, y compris sur les questions avancées qui valent davantage.'
              : 'Reprenez le cours en vous concentrant sur les sections où vous avez échoué — le quiz s\'adapte à votre niveau pour vous faire progresser.'
            }
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!passed && (
              <button
                onClick={() => {
                  setHistory([]); setAskedIds(new Set()); setCurrentLevelIdx(0);
                  setSelectedAnswer(null); setShowFeedback(false); setStreak(0);
                  setFinished(false);
                  const first = pickNextQuestion(pool, 0, new Set());
                  if (first) { setCurrentQuestion(first); setAskedIds(new Set([first.id])); }
                }}
                style={{ padding: '12px 18px', backgroundColor: 'var(--bg-surface)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
              >
                Réessayer
              </button>
            )}
            {onReviewCourse && (
              <button
                onClick={() => onReviewCourse(moduleId, finalScore)}
                style={{ padding: '12px 18px', backgroundColor: 'var(--bg-surface)', color: '#166534', border: '1px solid #166534', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
              >
                📖 Revoir le cours
              </button>
            )}
            <button
              onClick={() => onComplete(moduleId, finalScore)}
              style={{ padding: '12px 20px', backgroundColor: 'var(--sidebar-bg)', color: 'var(--on-brand)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p>Aucune question disponible pour ce module.</p>
          <button onClick={onBack} style={{ marginTop: '16px', padding: '10px 20px', cursor: 'pointer' }}>Retour</button>
        </div>
      </div>
    );
  }

  const answerColors = {
    default: { bg: '#fff', border: '#e2e8f0', color: 'var(--text-primary)' },
    correct: { bg: '#ecfdf5', border: '#22c55e', color: '#166534' },
    wrong: { bg: '#fff5f5', border: '#ef4444', color: '#991b1b' },
    disabled: { bg: '#f8fafc', border: '#e2e8f0', color: 'var(--text-muted)' },
  };

  const getStyle = (idx) => {
    if (!showFeedback) return answerColors.default;
    if (idx === currentQuestion.correctIndex) return answerColors.correct;
    if (idx === selectedAnswer) return answerColors.wrong;
    return answerColors.disabled;
  };

  const isCorrect = selectedAnswer === currentQuestion.correctIndex;
  const questionNumber = history.length + (showFeedback ? 0 : 1);
  const progressPct = (history.length / totalToAsk) * 100;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'var(--sidebar-bg)', padding: isMobile ? '10px 14px' : '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <Logo size={isMobile ? 24 : 32} />
          <span style={{ color: '#fff', fontWeight: '700', fontSize: isMobile ? '13px' : '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isMobile ? 'Quiz adaptatif' : 'Green IT académie — Quiz adaptatif'}
          </span>
        </div>
        <button
          onClick={onBack}
          style={{ flexShrink: 0, backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.8)', padding: isMobile ? '6px 10px' : '6px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
        >
          ← Abandonner
        </button>
      </header>

      {/* Barre de progression */}
      <div style={{ backgroundColor: '#e2e8f0', height: '4px' }}>
        <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: '#e65100', transition: 'width 0.3s' }} />
      </div>

      {/* Bandeau adaptatif */}
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: isMobile ? '8px 14px' : '10px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', gap: '8px' }}>
        <div style={{ display: 'flex', gap: isMobile ? '8px' : '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
            {isMobile ? `Q ${questionNumber}/${totalToAsk}` : `Question ${questionNumber} / ${totalToAsk}`}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', backgroundColor: 'var(--bg-page)', borderRadius: '12px', color: 'var(--accent)', fontWeight: '600', fontSize: isMobile ? '11px' : '12px' }}>
            {LEVEL_LABEL[currentQuestion.level]}
          </span>
          {streak >= 2 && (
            <span style={{ color: '#e65100', fontWeight: '600' }}>🔥{isMobile ? ` ×${streak}` : ` Série de ${streak}`}</span>
          )}
        </div>
        {!isMobile && (
          <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            Difficulté ajustée à vos réponses
          </div>
        )}
      </div>

      {/* Corps */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: isMobile ? '14px' : '32px 20px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '680px' }}>
          {/* Question */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '28px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ margin: 0, fontSize: '17px', fontWeight: '600', color: 'var(--accent)', lineHeight: '1.6' }}>
              {currentQuestion.question}
            </p>
          </div>

          {/* Réponses */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {currentQuestion.answers.map((answer, idx) => {
              const s = getStyle(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showFeedback}
                  style={{
                    padding: '14px 18px', borderRadius: '8px', border: `2px solid ${s.border}`,
                    backgroundColor: s.bg, color: s.color, fontSize: '14px', fontWeight: '500',
                    textAlign: 'left', cursor: showFeedback ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.15s',
                  }}
                >
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: s.border, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                    {showFeedback && idx === currentQuestion.correctIndex ? '✓' : showFeedback && idx === selectedAnswer ? '✗' : String.fromCharCode(65 + idx)}
                  </span>
                  {answer}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div style={{ backgroundColor: isCorrect ? '#ecfdf5' : '#fff5f5', border: `1px solid ${isCorrect ? '#86efac' : '#fecaca'}`, borderRadius: '8px', padding: '16px 20px', marginBottom: '16px' }}>
              <div style={{ fontWeight: '700', color: isCorrect ? '#166534' : '#991b1b', marginBottom: '6px', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{isCorrect ? '✓ Bonne réponse' : '✗ Mauvaise réponse'}</span>
                <span style={{ fontSize: '11px', fontWeight: '500', opacity: 0.8 }}>
                  {isCorrect ? '→ prochaine question plus difficile' : '→ prochaine question plus accessible'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: isCorrect ? '#166534' : '#991b1b', lineHeight: '1.6' }}>
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Bouton suivant */}
          {showFeedback && (
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={handleNext}
                style={{ padding: '12px 28px', backgroundColor: 'var(--sidebar-bg)', color: 'var(--on-brand)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
              >
                {history.length < totalToAsk ? 'Question suivante →' : 'Voir mes résultats'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
