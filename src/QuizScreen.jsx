import React, { useState, useMemo } from 'react';
import questionsData from '../data/questions.json';

export default function QuizScreen({ moduleId, onComplete, onBack }) {
  const questions = useMemo(
    () => questionsData.questions.filter(q => q.moduleId === moduleId),
    [moduleId]
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIdx];
  const total = questions.length;

  const handleAnswer = (idx) => {
    if (showFeedback) return;
    setSelectedAnswer(idx);
    setShowFeedback(true);
    if (idx === question.correctIndex) {
      setCorrectCount(c => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
    }
  };

  const isCorrect = selectedAnswer === question?.correctIndex;
  const finalScore = Math.round((correctCount / total) * 100);
  const passed = finalScore >= 70;

  // --- Écran résultats ---
  if (finished) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '48px 40px', maxWidth: '480px', width: '90%', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {passed ? '🏆' : '📚'}
          </div>
          <div style={{ fontSize: '48px', fontWeight: '800', color: passed ? '#22c55e' : '#e53e3e', marginBottom: '8px' }}>
            {finalScore}%
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1e3a5f', fontWeight: '700' }}>
            {passed ? 'Module validé !' : 'À retravailler'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.6' }}>
            {passed
              ? `Bravo ! Vous avez répondu correctement à ${correctCount} question${correctCount > 1 ? 's' : ''} sur ${total}. Le module est validé.`
              : `Vous avez obtenu ${correctCount} bonne${correctCount > 1 ? 's' : ''} réponse${correctCount > 1 ? 's' : ''} sur ${total}. Relisez le cours et réessayez !`
            }
          </p>

          <div style={{ backgroundColor: passed ? '#ecfdf5' : '#fff5f5', borderRadius: '8px', padding: '16px', marginBottom: '28px', border: `1px solid ${passed ? '#86efac' : '#fecaca'}` }}>
            <div style={{ fontSize: '13px', color: passed ? '#166534' : '#991b1b' }}>
              {correctCount} / {total} bonnes réponses · Seuil de réussite : 70%
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {!passed && (
              <button
                onClick={() => {
                  setCurrentIdx(0);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                  setCorrectCount(0);
                  setFinished(false);
                }}
                style={{ padding: '12px 20px', backgroundColor: '#fff', color: '#1e3a5f', border: '1px solid #1e3a5f', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
              >
                Réessayer
              </button>
            )}
            <button
              onClick={() => onComplete(moduleId, finalScore)}
              style={{ padding: '12px 24px', backgroundColor: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Aucune question pour ce module ---
  if (!question) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p>Aucune question disponible pour ce module.</p>
          <button onClick={onBack} style={{ marginTop: '16px', padding: '10px 20px', cursor: 'pointer' }}>Retour</button>
        </div>
      </div>
    );
  }

  // --- Écran de question ---
  const answerColors = {
    default: { bg: '#fff', border: '#e2e8f0', color: '#374151' },
    correct: { bg: '#ecfdf5', border: '#22c55e', color: '#166534' },
    wrong: { bg: '#fff5f5', border: '#ef4444', color: '#991b1b' },
    disabled: { bg: '#f8fafc', border: '#e2e8f0', color: '#94a3b8' },
  };

  const getStyle = (idx) => {
    if (!showFeedback) return answerColors.default;
    if (idx === question.correctIndex) return answerColors.correct;
    if (idx === selectedAnswer) return answerColors.wrong;
    return answerColors.disabled;
  };

  const levelLabel = { debutant: '🟢 Débutant', intermediaire: '🟡 Intermédiaire', avance: '🔴 Avancé' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1e3a5f', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#2d5a87', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌿</div>
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Green IT académie — Quiz</span>
        </div>
        <button
          onClick={onBack}
          style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.8)', padding: '6px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}
        >
          ← Abandonner
        </button>
      </header>

      {/* Barre de progression */}
      <div style={{ backgroundColor: '#e2e8f0', height: '4px' }}>
        <div style={{ width: `${((currentIdx + 1) / total) * 100}%`, height: '100%', backgroundColor: '#e65100', transition: 'width 0.3s' }} />
      </div>

      {/* Corps */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '640px' }}>
          {/* Compteur et niveau */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
              Question {currentIdx + 1} / {total}
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {levelLabel[question.level] || question.level}
            </span>
          </div>

          {/* Question */}
          <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '28px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ margin: 0, fontSize: '17px', fontWeight: '600', color: '#1e3a5f', lineHeight: '1.6' }}>
              {question.question}
            </p>
          </div>

          {/* Réponses */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {question.answers.map((answer, idx) => {
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
                    display: 'flex', alignItems: 'center', gap: '12px',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: s.border, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                    {showFeedback && idx === question.correctIndex ? '✓' : showFeedback && idx === selectedAnswer ? '✗' : String.fromCharCode(65 + idx)}
                  </span>
                  {answer}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div style={{ backgroundColor: isCorrect ? '#ecfdf5' : '#fff5f5', border: `1px solid ${isCorrect ? '#86efac' : '#fecaca'}`, borderRadius: '8px', padding: '16px 20px', marginBottom: '16px' }}>
              <div style={{ fontWeight: '700', color: isCorrect ? '#166534' : '#991b1b', marginBottom: '6px', fontSize: '14px' }}>
                {isCorrect ? '✓ Bonne réponse !' : '✗ Mauvaise réponse'}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: isCorrect ? '#166534' : '#991b1b', lineHeight: '1.6' }}>
                {question.explanation}
              </p>
            </div>
          )}

          {/* Bouton Suivant */}
          {showFeedback && (
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={handleNext}
                style={{ padding: '12px 28px', backgroundColor: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
              >
                {currentIdx < total - 1 ? 'Question suivante →' : 'Voir mes résultats'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
