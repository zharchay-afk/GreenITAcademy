import React from 'react';
import Sidebar from './Sidebar';

export default function AttestationPage({ modules, onNavigate }) {
  const validatedModules = modules.filter(m => m.score >= 70);
  const startedModules = modules.filter(m => m.started);
  const allValidated = validatedModules.length === 6;
  const avgScore = validatedModules.length > 0
    ? Math.round(validatedModules.reduce((sum, m) => sum + m.score, 0) / validatedModules.length)
    : 0;
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Sidebar activePage="attestation" onNavigate={onNavigate} />

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '700', color: '#064e3b' }}>Mon attestation</h1>
          <p style={{ margin: '0 0 28px 0', color: '#64748b', fontSize: '14px' }}>
            {validatedModules.length} module{validatedModules.length > 1 ? 's' : ''} validé{validatedModules.length > 1 ? 's' : ''} sur 6 · Score moyen : {avgScore > 0 ? `${avgScore}%` : '—'}
          </p>

          {/* Grille des modules */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px', marginBottom: '32px' }}>
            {modules.map(m => {
              const validated = m.score >= 70;
              const inProgress = m.started && !validated;
              const notStarted = !m.started;
              return (
                <div key={m.id} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderLeft: `4px solid ${validated ? '#22c55e' : inProgress ? '#f59e0b' : '#e2e8f0'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '36px', height: '36px', backgroundColor: m.bgColor, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                      {m.image}
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.3px' }}>{m.unite}</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', lineHeight: '1.3' }}>{m.title}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', fontWeight: '600', backgroundColor: validated ? '#dcfce7' : inProgress ? '#fef3c7' : '#f1f5f9', color: validated ? '#166534' : inProgress ? '#92400e' : '#94a3b8' }}>
                      {validated ? '✓ Validé' : inProgress ? '⏳ En cours' : '○ Non commencé'}
                    </span>
                    {m.score > 0 && (
                      <span style={{ fontSize: '14px', fontWeight: '700', color: validated ? '#22c55e' : '#e53e3e' }}>{m.score}%</span>
                    )}
                  </div>
                  {m.started && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8' }}>⏱ Temps : {m.tempsPasse}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Certificat */}
          {allValidated ? (
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #22c55e' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
              <div style={{ fontSize: '11px', color: '#166534', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Attestation de réussite</div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#064e3b' }}>Green IT Académie</h2>
              <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>UE Green IT LURS01 · Master Data Science</div>
              <div style={{ backgroundColor: '#ecfdf5', borderRadius: '8px', padding: '16px 24px', display: 'inline-block', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#166534', lineHeight: '1.8' }}>
                  a complété avec succès les <strong>6 modules</strong> du parcours<br />
                  <strong>Normes, Labels et Certifications Green IT</strong><br />
                  avec un score moyen de <strong>{avgScore}%</strong>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Émis le {today}</div>
              <button
                onClick={() => window.print()}
                style={{ marginTop: '20px', padding: '10px 24px', backgroundColor: '#064e3b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
              >
                🖨️ Imprimer l'attestation
              </button>
            </div>
          ) : (
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '32px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#064e3b', fontWeight: '700' }}>
                {6 - validatedModules.length} module{6 - validatedModules.length > 1 ? 's' : ''} restant{6 - validatedModules.length > 1 ? 's' : ''}
              </h3>
              <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '13px', lineHeight: '1.6' }}>
                Validez les 6 modules avec un score ≥ 70% pour obtenir votre attestation de réussite.
              </p>
              {/* Barre de progression globale */}
              <div style={{ backgroundColor: '#f1f5f9', borderRadius: '8px', height: '10px', maxWidth: '300px', margin: '0 auto' }}>
                <div style={{ width: `${(validatedModules.length / 6) * 100}%`, height: '100%', backgroundColor: '#22c55e', borderRadius: '8px', transition: 'width 0.5s' }} />
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#64748b' }}>{validatedModules.length} / 6 modules validés</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
