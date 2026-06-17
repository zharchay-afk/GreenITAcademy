import React, { useState, useEffect, useRef } from 'react';
import {
  collection, doc, getDocs, setDoc, getDoc, deleteDoc, onSnapshot,
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isConfigured } from './firebase';
import Logo from './Logo';
import useIsMobile from './useIsMobile';
import modulesData from '../data/modules.json';
import questionsData from '../data/questions.json';

// ─────────────────────────────────────────────────────────────
// Palette commune
// ─────────────────────────────────────────────────────────────
const MODULE_PALETTE = {
  1: { accent: '#0ea5e9', bg: '#e0f2fe' },
  2: { accent: '#f59e0b', bg: '#fef3c7' },
  3: { accent: '#10b981', bg: '#d1fae5' },
  4: { accent: '#8b5cf6', bg: '#ede9fe' },
  5: { accent: '#ef4444', bg: '#fee2e2' },
  6: { accent: '#14b8a6', bg: '#ccfbf1' },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1.5px solid var(--border)',
  borderRadius: '8px',
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: 'var(--bg-surface)',
  color: 'var(--text-primary)',
};

const btnStyle = (variant = 'primary') => ({
  padding: '8px 16px',
  backgroundColor: variant === 'primary' ? 'var(--brand)' : variant === 'danger' ? '#ef4444' : 'var(--bg-soft)',
  color: variant === 'ghost' ? 'var(--text-secondary)' : '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'inherit',
});

const cardStyle = {
  backgroundColor: 'var(--bg-surface)',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  padding: '20px',
  marginBottom: '14px',
};

// ─────────────────────────────────────────────────────────────
// Toast notification
// ─────────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [msg]);
  if (!msg) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
      backgroundColor: '#15803d', color: '#fff', padding: '10px 20px',
      borderRadius: '8px', fontSize: '13px', fontWeight: '600', zIndex: 999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    }}>
      ✓ {msg}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab: Modules
// ─────────────────────────────────────────────────────────────
function ModulesTab({ toast }) {
  const [overrides, setOverrides] = useState({});
  const [editing, setEditing]     = useState(null); // moduleId en cours d'édition
  const [form, setForm]           = useState({});
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  // Charger les overrides Firestore
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(collection(db, 'content_modules'), snap => {
      const map = {};
      snap.forEach(d => { map[d.id] = d.data(); });
      setOverrides(map);
    });
    return unsub;
  }, []);

  const openEdit = (mod) => {
    const ov = overrides[String(mod.id)] || {};
    setForm({
      title:    ov.title    || mod.title    || '',
      subtitle: ov.subtitle || mod.subtitle || '',
      image:    ov.image    || mod.image    || '',
      imageUrl: ov.imageUrl || '',
      intro:    ov.intro    || '',
    });
    setEditing(mod.id);
  };

  const save = async () => {
    if (!db) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'content_modules', String(editing)), form, { merge: true });
      toast('Module sauvegardé');
      setEditing(null);
    } catch (e) {
      alert('Erreur : ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file) => {
    if (!storage || !file) return;
    setUploading(true);
    try {
      const path = `modules/${editing}/cover_${Date.now()}`;
      const snap = await uploadBytes(storageRef(storage, path), file);
      const url = await getDownloadURL(snap.ref);
      setForm(f => ({ ...f, imageUrl: url }));
      toast('Image téléversée');
    } catch (e) {
      alert('Erreur upload : ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const resetModule = async (moduleId) => {
    if (!db || !window.confirm('Supprimer les modifications de ce module ?')) return;
    await deleteDoc(doc(db, 'content_modules', String(moduleId)));
    toast('Modifications supprimées');
  };

  return (
    <div>
      <p style={{ margin: '0 0 18px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Modifiez le titre, l'image et l'intro de chaque module. Les modifications s'appliquent immédiatement à l'application.
      </p>

      {modulesData.modules.map(mod => {
        const ov  = overrides[String(mod.id)] || {};
        const pal = MODULE_PALETTE[mod.id] || { accent: '#15803d', bg: '#dcfce7' };
        const hasOverride = Object.keys(ov).length > 0;

        if (editing === mod.id) {
          return (
            <div key={mod.id} style={{ ...cardStyle, border: `1.5px solid ${pal.accent}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontWeight: '700', color: pal.accent }}>MODULE {mod.id} — Édition</span>
                <button onClick={() => setEditing(null)} style={btnStyle('ghost')}>Annuler</button>
              </div>

              {/* Image cover */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Image de couverture
                </label>
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="couverture" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px', border: '1px solid var(--border)' }} />
                )}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    style={btnStyle('ghost')}
                  >
                    {uploading ? 'Téléversement…' : '📷 Choisir une image'}
                  </button>
                  {form.imageUrl && (
                    <button onClick={() => setForm(f => ({ ...f, imageUrl: '' }))} style={{ ...btnStyle('ghost'), color: '#ef4444' }}>Supprimer</button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => e.target.files[0] && uploadImage(e.target.files[0])}
                />
              </div>

              {/* Emoji (affiché si pas d'image) */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Icône emoji (si pas d'image)
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  style={{ ...inputStyle, maxWidth: '80px', fontSize: '20px', textAlign: 'center' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Titre</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Sous-titre</label>
                <input type="text" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} style={inputStyle} placeholder="Sous-titre affiché sous le titre" />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Introduction (paragraphe d'intro du module)</label>
                <textarea
                  rows={5}
                  value={form.intro}
                  onChange={e => setForm(f => ({ ...f, intro: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Texte d'introduction affiché en haut du module dans le lecteur de cours…"
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={save} disabled={saving} style={{ ...btnStyle('primary'), opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Sauvegarde…' : '✓ Sauvegarder'}
                </button>
                <button onClick={() => setEditing(null)} style={btnStyle('ghost')}>Annuler</button>
              </div>
            </div>
          );
        }

        return (
          <div key={mod.id} style={cardStyle}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: pal.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0, overflow: 'hidden' }}>
                {ov.imageUrl ? (
                  <img src={ov.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (ov.image || mod.image)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: pal.accent, letterSpacing: '1px', marginBottom: '2px' }}>MODULE {mod.id}</div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{ov.title || mod.title}</div>
                {(ov.subtitle || mod.subtitle) && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{ov.subtitle || mod.subtitle}</div>}
                {hasOverride && <span style={{ fontSize: '10px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', marginTop: '4px', display: 'inline-block' }}>✓ Modifié</span>}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button onClick={() => openEdit(mod)} style={btnStyle('ghost')}>Éditer</button>
                {hasOverride && <button onClick={() => resetModule(mod.id)} style={{ ...btnStyle('ghost'), color: '#ef4444' }}>Reset</button>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab: Questions
// ─────────────────────────────────────────────────────────────
function QuestionsTab({ toast }) {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter]       = useState('all'); // moduleId or 'all'
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState({});
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    if (!db) {
      // Fallback : charger depuis JSON
      setQuestions(questionsData.questions.map((q, i) => ({ ...q, _id: String(i), _source: 'json' })));
      return;
    }
    // Charger les overrides Firestore et fusionner avec JSON
    getDocs(collection(db, 'content_questions')).then(snap => {
      const fsMap = {};
      snap.forEach(d => { fsMap[d.id] = { ...d.data(), _id: d.id, _source: 'firestore' }; });

      const jsonQs = questionsData.questions.map((q, i) => {
        const fsKey = String(q.id ?? i);
        return fsMap[fsKey] ? { ...q, ...fsMap[fsKey] } : { ...q, _id: fsKey, _source: 'json' };
      });
      // Ajouter questions créées uniquement dans Firestore (nouvelles)
      const fsOnly = Object.values(fsMap).filter(f => f._source === 'firestore' && !jsonQs.find(j => j._id === f._id));
      setQuestions([...jsonQs, ...fsOnly]);
    });
  }, []);

  const filtered = filter === 'all' ? questions : questions.filter(q => String(q.moduleId) === filter);

  const openEdit = (q) => {
    setForm({
      moduleId:    String(q.moduleId || ''),
      text:        q.text || q.question || '',
      choices:     (q.choices || q.options || []).join('\n'),
      correct:     String(q.correct ?? q.correctIndex ?? ''),
      difficulty:  q.difficulty || 'intermediaire',
      explanation: q.explanation || '',
    });
    setEditing(q._id);
  };

  const saveQuestion = async () => {
    if (!db) { toast('Firestore non configuré'); return; }
    setSaving(true);
    try {
      const data = {
        moduleId:    parseInt(form.moduleId, 10) || 1,
        text:        form.text,
        choices:     form.choices.split('\n').map(s => s.trim()).filter(Boolean),
        correct:     parseInt(form.correct, 10) || 0,
        difficulty:  form.difficulty,
        explanation: form.explanation,
      };
      const id = editing || `q_${Date.now()}`;
      await setDoc(doc(db, 'content_questions', id), data, { merge: true });
      toast('Question sauvegardée');
      setEditing(null);
      // Reload
      const snap = await getDocs(collection(db, 'content_questions'));
      const fsMap = {};
      snap.forEach(d => { fsMap[d.id] = { ...d.data(), _id: d.id, _source: 'firestore' }; });
      const jsonQs = questionsData.questions.map((q, i) => {
        const fsKey = String(q.id ?? i);
        return fsMap[fsKey] ? { ...q, ...fsMap[fsKey] } : { ...q, _id: fsKey, _source: 'json' };
      });
      const fsOnly = Object.values(fsMap).filter(f => !jsonQs.find(j => j._id === f._id));
      setQuestions([...jsonQs, ...fsOnly]);
    } catch (e) {
      alert('Erreur : ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const addNew = () => {
    setForm({ moduleId: '1', text: '', choices: 'Choix A\nChoix B\nChoix C\nChoix D', correct: '0', difficulty: 'intermediaire', explanation: '' });
    setEditing('__new__');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', flex: 1 }}>
          {questions.length} questions · Les modifications sont sauvegardées dans Firestore.
        </p>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
          <option value="all">Tous les modules</option>
          {modulesData.modules.map(m => <option key={m.id} value={String(m.id)}>Module {m.id}</option>)}
        </select>
        <button onClick={addNew} style={btnStyle('primary')}>+ Ajouter</button>
      </div>

      {editing === '__new__' && (
        <QuestionForm form={form} setForm={setForm} onSave={saveQuestion} onCancel={() => setEditing(null)} saving={saving} isNew />
      )}

      {filtered.map((q) => {
        if (editing === q._id) {
          return <QuestionForm key={q._id} form={form} setForm={setForm} onSave={saveQuestion} onCancel={() => setEditing(null)} saving={saving} />;
        }
        return (
          <div key={q._id} style={cardStyle}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                  MODULE {q.moduleId} · {q.difficulty || 'N/A'}
                  {q._source === 'firestore' && <span style={{ marginLeft: '8px', backgroundColor: '#dbeafe', color: '#1e40af', padding: '1px 5px', borderRadius: '4px' }}>Firestore</span>}
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600', lineHeight: '1.45' }}>{q.text || q.question}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(q.choices || q.options || []).map((c, i) => (
                    <span key={i} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: i === (q.correct ?? q.correctIndex) ? '#dcfce7' : 'var(--bg-soft)', color: i === (q.correct ?? q.correctIndex) ? '#166534' : 'var(--text-secondary)', fontWeight: i === (q.correct ?? q.correctIndex) ? '700' : '400' }}>
                      {i === (q.correct ?? q.correctIndex) ? '✓ ' : ''}{c}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => openEdit(q)} style={btnStyle('ghost')}>Éditer</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuestionForm({ form, setForm, onSave, onCancel, saving, isNew }) {
  return (
    <div style={{ ...cardStyle, border: '1.5px solid var(--accent)', marginBottom: '14px' }}>
      <div style={{ fontWeight: '700', color: 'var(--accent)', marginBottom: '14px' }}>{isNew ? 'Nouvelle question' : 'Modifier la question'}</div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Module</label>
        <select value={form.moduleId} onChange={e => setForm(f => ({ ...f, moduleId: e.target.value }))} style={{ ...inputStyle, width: 'auto' }}>
          {modulesData.modules.map(m => <option key={m.id} value={String(m.id)}>Module {m.id} — {m.title}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Question</label>
        <textarea rows={3} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Réponses (une par ligne)</label>
        <textarea rows={4} value={form.choices} onChange={e => setForm(f => ({ ...f, choices: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Index bonne réponse (0=première)</label>
          <input type="number" min="0" value={form.correct} onChange={e => setForm(f => ({ ...f, correct: e.target.value }))} style={{ ...inputStyle, width: '80px' }} />
        </div>
        <div style={{ flex: 1, minWidth: '140px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Difficulté</label>
          <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} style={{ ...inputStyle, width: 'auto' }}>
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Explication (affichée après le quiz)</label>
        <textarea rows={3} value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onSave} disabled={saving} style={{ ...btnStyle('primary'), opacity: saving ? 0.7 : 1 }}>{saving ? 'Sauvegarde…' : '✓ Sauvegarder'}</button>
        <button onClick={onCancel} style={btnStyle('ghost')}>Annuler</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab: Utilisateurs
// ─────────────────────────────────────────────────────────────
function UsersTab({ toast }) {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!db) { setLoading(false); return; }
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list = [];
      snap.forEach(d => list.push({ uid: d.id, ...d.data() }));
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setUsers(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleAdmin = async (user) => {
    if (!db) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (newRole === 'admin' && !window.confirm(`Donner les droits admin à ${user.email} ?`)) return;
    await setDoc(doc(db, 'users', user.uid), { role: newRole }, { merge: true });
    toast(`Rôle de ${user.email} → ${newRole}`);
    load();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chargement…</div>;
  if (!users.length) return (
    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
      <p>Aucun utilisateur trouvé dans Firestore.</p>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Les utilisateurs apparaissent après leur première connexion.</p>
    </div>
  );

  return (
    <div>
      <p style={{ margin: '0 0 18px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
        {users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
      </p>
      {users.map(u => (
        <div key={u.uid} style={cardStyle}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: u.role === 'admin' ? '#dcfce7' : 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              {u.role === 'admin' ? '👑' : '👤'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{u.displayName || '—'}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
              {u.createdAt && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Inscrit le {new Date(u.createdAt).toLocaleDateString('fr-FR')}</div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', backgroundColor: u.role === 'admin' ? '#dcfce7' : 'var(--bg-soft)', color: u.role === 'admin' ? '#166534' : 'var(--text-muted)', fontWeight: '600' }}>
                {u.role || 'user'}
              </span>
              <button onClick={() => toggleAdmin(u)} style={{ ...btnStyle('ghost'), fontSize: '11px', padding: '5px 10px' }}>
                {u.role === 'admin' ? 'Rétrograder' : 'Admin →'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AdminPage — composant principal
// ─────────────────────────────────────────────────────────────
export default function AdminPage({ firebaseUser, isAdmin, onNavigate }) {
  const [tab, setTab]         = useState('modules');
  const [toastMsg, setToastMsg] = useState('');
  const isMobile              = useIsMobile();

  const toast = (msg) => setToastMsg(msg);

  // Pas connecté ou pas admin
  if (!firebaseUser) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-page)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
          <h2 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Accès refusé</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Connectez-vous pour accéder à cette page.</p>
          <button onClick={() => onNavigate('landing')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'var(--brand)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-page)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚫</div>
          <h2 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Droits insuffisants</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '320px' }}>Votre compte ne dispose pas des droits d'administration. Contactez un administrateur.</p>
          <button onClick={() => onNavigate('accueil')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'var(--brand)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
            Retour à la formation
          </button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'modules',   label: '📚 Modules' },
    { id: 'questions', label: '❓ Questions' },
    { id: 'users',     label: '👥 Utilisateurs' },
  ];

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* Header */}
      <header style={{
        flexShrink: 0,
        backgroundColor: 'var(--sidebar-bg)',
        padding: 'calc(14px + env(safe-area-inset-top)) 24px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => onNavigate('accueil')} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: '#fff', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit' }}>
            ← Formation
          </button>
          <Logo size={24} />
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Administration</span>
          <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '8px' }}>ADMIN</span>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
          {firebaseUser.email}
        </div>
      </header>

      {/* Tabs nav */}
      <nav style={{ flexShrink: 0, backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '0 24px', display: 'flex', gap: '4px' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '14px 18px',
              background: 'transparent',
              border: 'none',
              borderBottom: tab === t.id ? '3px solid var(--accent)' : '3px solid transparent',
              color: tab === t.id ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: tab === t.id ? '700' : '500',
              cursor: 'pointer',
              fontSize: isMobile ? '12px' : '13px',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >{t.label}</button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px 32px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {!isConfigured && (
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#78350f' }}>
              ⚠️ Firebase non configuré — les modifications ne seront pas sauvegardées. Vérifiez votre <code>.env.local</code>.
            </div>
          )}
          {tab === 'modules'   && <ModulesTab   toast={toast} />}
          {tab === 'questions' && <QuestionsTab toast={toast} />}
          {tab === 'users'     && <UsersTab     toast={toast} />}
        </div>
      </main>

      <Toast msg={toastMsg} onDone={() => setToastMsg('')} />
    </div>
  );
}
