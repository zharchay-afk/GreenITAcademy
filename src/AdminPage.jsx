import React, { useState, useEffect, useRef } from 'react';
import {
  collection, doc, getDocs, setDoc, getDoc, deleteDoc, onSnapshot,
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isConfigured } from './firebase';
import Logo from './Logo';
import useIsMobile from './useIsMobile';
import { useTheme } from './theme';
import modulesData from '../data/modules.json';
import questionsData from '../data/questions.json';

// ─────────────────────────────────────────────────────────────
// Palette
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
// Styles partagés
// ─────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '10px 12px',
  border: '1.5px solid var(--border)', borderRadius: '8px',
  fontSize: '13px', fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', backgroundColor: 'var(--bg-surface)',
  color: 'var(--text-primary)',
};
const btnStyle = (variant = 'primary') => ({
  padding: '8px 16px',
  backgroundColor: variant === 'primary' ? 'var(--brand)' : variant === 'danger' ? '#ef4444' : 'var(--bg-soft)',
  color: variant === 'ghost' ? 'var(--text-secondary)' : '#fff',
  border: 'none', borderRadius: '6px', fontSize: '13px',
  fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
});
const cardStyle = {
  backgroundColor: 'var(--bg-surface)', borderRadius: '12px',
  border: '1px solid var(--border)', padding: '20px', marginBottom: '12px',
};
const labelStyle = {
  fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)',
  display: 'block', marginBottom: '5px',
  textTransform: 'uppercase', letterSpacing: '0.4px',
};

// ─────────────────────────────────────────────────────────────
// Toast
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
    }}>✓ {msg}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// SectionEditor — éditeur de sections d'un module
// ─────────────────────────────────────────────────────────────
function SectionEditor({ sections, onChange, moduleId }) {
  const [openId, setOpenId] = useState(null);

  const update = (id, field, value) =>
    onChange(sections.map(s => s.id === id ? { ...s, [field]: value } : s));

  const addSection = () => {
    const newId = `${moduleId}.${sections.length + 1}`;
    const newSection = { id: newId, title: 'Nouvelle section', intro: '', content: '', keyPoints: [] };
    onChange([...sections, newSection]);
    setOpenId(newId);
  };

  const removeSection = (id) => {
    if (!window.confirm('Supprimer cette section ?')) return;
    onChange(sections.filter(s => s.id !== id));
    if (openId === id) setOpenId(null);
  };

  const moveSection = (id, dir) => {
    const idx = sections.findIndex(s => s.id === id);
    const next = idx + dir;
    if (next < 0 || next >= sections.length) return;
    const arr = [...sections];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    onChange(arr);
  };

  return (
    <div>
      {sections.length === 0 && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
          Aucune section. Cliquez sur "Ajouter une section" pour commencer.
        </p>
      )}

      {sections.map((s, idx) => (
        <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '8px', overflow: 'hidden' }}>
          {/* En-tête de section */}
          <div style={{
            padding: '10px 14px', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: openId === s.id ? 'var(--accent-soft)' : 'var(--bg-surface)',
            userSelect: 'none',
          }}>
            <div onClick={() => setOpenId(openId === s.id ? null : s.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>
                {s.id} — {s.title}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
              <button onClick={() => moveSection(s.id, -1)} disabled={idx === 0}
                title="Monter" style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? 'var(--border)' : 'var(--text-muted)', fontSize: '14px', padding: '2px 4px' }}>▲</button>
              <button onClick={() => moveSection(s.id, 1)} disabled={idx === sections.length - 1}
                title="Descendre" style={{ background: 'none', border: 'none', cursor: idx === sections.length - 1 ? 'default' : 'pointer', color: idx === sections.length - 1 ? 'var(--border)' : 'var(--text-muted)', fontSize: '14px', padding: '2px 4px' }}>▼</button>
              <button onClick={() => removeSection(s.id)}
                title="Supprimer la section" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '14px', padding: '2px 6px' }}>✕</button>
              <span onClick={() => setOpenId(openId === s.id ? null : s.id)} style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '4px', cursor: 'pointer' }}>
                {openId === s.id ? '▲ Réduire' : '▼ Modifier'}
              </span>
            </div>
          </div>

          {/* Contenu éditeur */}
          {openId === s.id && (
            <div style={{ padding: '14px 16px', backgroundColor: 'var(--bg-page)', borderTop: '1px solid var(--border)' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Titre de la section</label>
                <input value={s.title || ''} onChange={e => update(s.id, 'title', e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Introduction (texte mis en avant, en italique)</label>
                <textarea rows={3} value={s.intro || ''} onChange={e => update(s.id, 'intro', e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }} placeholder="Phrase d'accroche de la section…" />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Contenu principal</label>
                <textarea rows={8} value={s.content || ''} onChange={e => update(s.id, 'content', e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }} placeholder="Corps de la section…" />
              </div>
              <div style={{ marginBottom: '4px' }}>
                <label style={labelStyle}>Points clés à retenir (un par ligne)</label>
                <textarea
                  rows={4}
                  value={(s.keyPoints || []).join('\n')}
                  onChange={e => update(s.id, 'keyPoints', e.target.value.split('\n').filter(l => l !== undefined))}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Point clé 1&#10;Point clé 2&#10;…"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addSection}
        style={{ width: '100%', marginTop: '8px', padding: '10px', backgroundColor: 'transparent', border: '1.5px dashed var(--accent)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--accent)', fontFamily: 'inherit', fontWeight: '600' }}
      >
        + Ajouter une section
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VersionHistory — affiche l'historique des sauvegardes
// ─────────────────────────────────────────────────────────────
function VersionHistory({ moduleId, onRestore, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    getDocs(collection(db, 'content_modules', String(moduleId), 'versions')).then(snap => {
      const vers = [];
      snap.forEach(d => vers.push({ id: d.id, ...d.data() }));
      vers.sort((a, b) => b.id.localeCompare(a.id));
      setVersions(vers.slice(0, 10));
      setLoading(false);
    });
  }, [moduleId]);

  return (
    <div style={{ ...cardStyle, border: '1.5px solid #f59e0b', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontWeight: '700', color: '#92400e', fontSize: '13px' }}>Historique des versions (10 dernières)</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px' }}>✕</button>
      </div>
      {loading && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Chargement…</p>}
      {!loading && versions.length === 0 && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Aucune version sauvegardée. La première sauvegarde créera l'historique.</p>
      )}
      {versions.map(v => (
        <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {new Date(parseInt(v.id)).toLocaleString('fr-FR')}
            </span>
            {v.title && <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>{v.title}</span>}
          </div>
          <button onClick={() => onRestore(v)} style={{ ...btnStyle('ghost'), fontSize: '11px', padding: '4px 10px' }}>
            Restaurer
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab: Modules
// ─────────────────────────────────────────────────────────────
function ModulesTab({ toast }) {
  const [overrides, setOverrides]     = useState({});
  const [editing, setEditing]         = useState(null);
  const [editTab, setEditTab]         = useState('meta'); // 'meta' | 'sections' | 'history'
  const [form, setForm]               = useState({});
  const [sections, setSections]       = useState([]);
  const [saving, setSaving]           = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [addingModule, setAddingModule] = useState(false);
  const [newModForm, setNewModForm]     = useState({ title: '', subtitle: '', image: '📦', bgColor: '#64748b', intro: '' });
  const fileRef = useRef();

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
    const baseSections = mod.sections || [];
    const fsSections   = ov.sections  || [];
    const merged = baseSections.map(bs => {
      const fs = fsSections.find(s => s.id === bs.id);
      return fs ? { ...bs, ...fs } : { ...bs };
    });
    setSections(merged);
    setEditing(mod.id);
    setEditTab('meta');
  };

  const saveVersion = async (moduleId) => {
    if (!db) return;
    try {
      const current = await getDoc(doc(db, 'content_modules', String(moduleId)));
      if (current.exists()) {
        const versionId = String(Date.now());
        await setDoc(
          doc(db, 'content_modules', String(moduleId), 'versions', versionId),
          { ...current.data(), savedAt: versionId }
        );
      }
    } catch (e) {
      console.warn('Version non sauvegardée :', e);
    }
  };

  const save = async () => {
    if (!db) return;
    setSaving(true);
    try {
      await saveVersion(editing);
      await setDoc(doc(db, 'content_modules', String(editing)), {
        ...form,
        sections,
      }, { merge: true });
      toast('Module sauvegardé');
      setEditing(null);
    } catch (e) {
      alert('Erreur : ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const restoreVersion = async (versionData) => {
    if (!db) return;
    await saveVersion(editing);
    const { savedAt, ...data } = versionData;
    await setDoc(doc(db, 'content_modules', String(editing)), data);
    toast('Version restaurée');
    setEditTab('meta');
    setEditing(null);
  };

  const uploadImage = async (file) => {
    if (!storage || !file) return;
    setUploading(true);
    try {
      const path = `modules/${editing}/cover_${Date.now()}`;
      const snap = await uploadBytes(storageRef(storage, path), file);
      const url  = await getDownloadURL(snap.ref);
      setForm(f => ({ ...f, imageUrl: url }));
      toast('Image téléversée');
    } catch (e) {
      alert('Erreur upload : ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const createModule = async () => {
    if (!db || !newModForm.title.trim()) { alert('Le titre est obligatoire.'); return; }
    setSaving(true);
    try {
      const allIds = [
        ...modulesData.modules.map(m => m.id),
        ...Object.keys(overrides).map(k => parseInt(k)).filter(n => !isNaN(n)),
      ];
      const nextId = Math.max(...allIds) + 1;
      await setDoc(doc(db, 'content_modules', String(nextId)), {
        ...newModForm,
        _custom: true,
        sections: [],
      });
      toast(`Module ${nextId} créé`);
      setAddingModule(false);
      setNewModForm({ title: '', subtitle: '', image: '📦', bgColor: '#64748b', intro: '' });
    } catch (e) {
      alert('Erreur : ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const softDelete = async (moduleId) => {
    if (!db || !window.confirm('Supprimer ce module ? Il sera mis dans la corbeille et récupérable.')) return;
    await saveVersion(moduleId);
    await setDoc(doc(db, 'content_modules', String(moduleId)), {
      _deleted: true, _deletedAt: new Date().toISOString(),
    }, { merge: true });
    toast('Module mis dans la corbeille');
    if (editing === moduleId) setEditing(null);
  };

  const restoreModule = async (moduleId) => {
    if (!db) return;
    await setDoc(doc(db, 'content_modules', String(moduleId)), {
      _deleted: false, _deletedAt: null,
    }, { merge: true });
    toast('Module restauré');
  };

  // Modules de base (JSON) + modules personnalisés (Firestore _custom)
  const customModules  = Object.entries(overrides)
    .filter(([id, d]) => d._custom && !d._deleted && !modulesData.modules.find(m => String(m.id) === id))
    .map(([id, d]) => ({ id: parseInt(id), title: d.title, subtitle: d.subtitle, image: d.image, sections: d.sections || [], _custom: true }));

  const allActiveBase  = modulesData.modules.filter(m => !overrides[String(m.id)]?._deleted);
  const activeModules  = [...allActiveBase, ...customModules];
  const deletedModules = modulesData.modules.filter(m =>  overrides[String(m.id)]?._deleted);

  const EDIT_TABS = [
    { id: 'meta',     label: 'Informations' },
    { id: 'sections', label: 'Contenu (sections)' },
    { id: 'history',  label: 'Historique' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          Modifiez les métadonnées et le contenu des sections. Chaque sauvegarde crée une version récupérable.
        </p>
        <button onClick={() => { setAddingModule(a => !a); setEditing(null); }} style={btnStyle('primary')}>
          {addingModule ? '✕ Annuler' : '+ Nouveau module'}
        </button>
      </div>

      {/* Formulaire nouveau module */}
      {addingModule && (
        <div style={{ ...cardStyle, border: '1.5px solid var(--brand)', marginBottom: '20px' }}>
          <div style={{ fontWeight: '700', color: 'var(--brand)', marginBottom: '16px', fontSize: '13px' }}>Créer un nouveau module</div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <div style={{ flex: '0 0 70px' }}>
              <label style={labelStyle}>Emoji</label>
              <input value={newModForm.image} onChange={e => setNewModForm(f => ({ ...f, image: e.target.value }))}
                style={{ ...inputStyle, textAlign: 'center', fontSize: '22px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Titre *</label>
              <input value={newModForm.title} onChange={e => setNewModForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Titre du module" style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Sous-titre</label>
            <input value={newModForm.subtitle} onChange={e => setNewModForm(f => ({ ...f, subtitle: e.target.value }))}
              placeholder="Sous-titre (facultatif)" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Introduction</label>
            <textarea rows={3} value={newModForm.intro} onChange={e => setNewModForm(f => ({ ...f, intro: e.target.value }))}
              placeholder="Texte d'introduction du module…" style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <button onClick={createModule} disabled={saving} style={{ ...btnStyle('primary'), opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Création…' : '✓ Créer le module'}
          </button>
        </div>
      )}

      {/* Modules actifs */}
      {activeModules.map(mod => {
        const ov  = overrides[String(mod.id)] || {};
        const pal = MODULE_PALETTE[mod.id] || { accent: '#15803d', bg: '#dcfce7' };
        const hasOverride = Object.keys(ov).filter(k => !k.startsWith('_')).length > 0;

        if (editing === mod.id) {
          return (
            <div key={mod.id} style={{ ...cardStyle, border: `1.5px solid ${pal.accent}`, padding: '0', overflow: 'hidden' }}>
              {/* Edit header */}
              <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-page)' }}>
                <span style={{ fontWeight: '700', color: pal.accent }}>MODULE {mod.id} — Édition</span>
                <button onClick={() => setEditing(null)} style={btnStyle('ghost')}>Annuler</button>
              </div>

              {/* Sub-tabs */}
              <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}>
                {EDIT_TABS.map(t => (
                  <button key={t.id} onClick={() => setEditTab(t.id)} style={{
                    padding: '10px 16px', border: 'none', background: 'transparent',
                    borderBottom: editTab === t.id ? `2px solid ${pal.accent}` : '2px solid transparent',
                    color: editTab === t.id ? pal.accent : 'var(--text-secondary)',
                    fontWeight: editTab === t.id ? '700' : '400',
                    cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
                  }}>{t.label}</button>
                ))}
              </div>

              <div style={{ padding: '20px' }}>
                {/* ── Onglet Informations ── */}
                {editTab === 'meta' && (
                  <>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={labelStyle}>Image de couverture</label>
                      {form.imageUrl && (
                        <img src={form.imageUrl} alt="couverture" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                      )}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={btnStyle('ghost')}>
                          {uploading ? 'Téléversement…' : '📷 Choisir une image'}
                        </button>
                        {form.imageUrl && (
                          <button onClick={() => setForm(f => ({ ...f, imageUrl: '' }))} style={{ ...btnStyle('ghost'), color: '#ef4444' }}>Supprimer</button>
                        )}
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={labelStyle}>Icône emoji</label>
                      <input type="text" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                        style={{ ...inputStyle, maxWidth: '80px', fontSize: '20px', textAlign: 'center' }} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={labelStyle}>Titre</label>
                      <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={labelStyle}>Sous-titre</label>
                      <input type="text" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Introduction du module</label>
                      <textarea rows={5} value={form.intro} onChange={e => setForm(f => ({ ...f, intro: e.target.value }))}
                        style={{ ...inputStyle, resize: 'vertical' }} placeholder="Texte affiché en tête du module dans le lecteur de cours…" />
                    </div>
                  </>
                )}

                {/* ── Onglet Sections ── */}
                {editTab === 'sections' && (
                  <>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
                      Cliquez sur une section pour modifier son titre, son introduction, son contenu et ses points clés.
                      Les visuels SVG et les liens "Pour aller plus loin" sont gérés dans les fichiers sources.
                    </p>
                    <SectionEditor sections={sections} onChange={setSections} moduleId={editing} />
                  </>
                )}

                {/* ── Onglet Historique ── */}
                {editTab === 'history' && (
                  <VersionHistory
                    moduleId={mod.id}
                    onRestore={restoreVersion}
                    onClose={() => setEditTab('meta')}
                  />
                )}

                {editTab !== 'history' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button onClick={save} disabled={saving} style={{ ...btnStyle('primary'), opacity: saving ? 0.7 : 1 }}>
                      {saving ? 'Sauvegarde…' : '✓ Sauvegarder'}
                    </button>
                    <button onClick={() => setEditing(null)} style={btnStyle('ghost')}>Annuler</button>
                    <button onClick={() => softDelete(mod.id)} style={{ ...btnStyle('ghost'), marginLeft: 'auto', color: '#ef4444', fontSize: '12px' }}>
                      Supprimer le module
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        }

        return (
          <div key={mod.id} style={cardStyle}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: pal.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0, overflow: 'hidden' }}>
                {ov.imageUrl ? <img src={ov.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (ov.image || mod.image)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: pal.accent, letterSpacing: '1px', marginBottom: '2px' }}>MODULE {mod.id}</div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{ov.title || mod.title}</div>
                {(ov.subtitle || mod.subtitle) && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{ov.subtitle || mod.subtitle}</div>}
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {(ov.sections || mod.sections || []).length} sections
                  {mod._custom && <span style={{ marginLeft: '8px', backgroundColor: '#ede9fe', color: '#6d28d9', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>Personnalisé</span>}
                  {!mod._custom && hasOverride && <span style={{ marginLeft: '8px', backgroundColor: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>✓ Modifié</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button onClick={() => openEdit(mod)} style={btnStyle('ghost')}>Éditer</button>
                <button onClick={() => softDelete(mod.id)} style={{ ...btnStyle('ghost'), color: '#ef4444' }}>Supprimer</button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Corbeille */}
      {deletedModules.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <button
            onClick={() => setShowDeleted(d => !d)}
            style={{ width: '100%', padding: '10px 16px', backgroundColor: 'var(--bg-surface)', border: '1px dashed var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>🗑 Corbeille — {deletedModules.length} module{deletedModules.length > 1 ? 's' : ''} supprimé{deletedModules.length > 1 ? 's' : ''}</span>
            <span>{showDeleted ? '▲' : '▼'}</span>
          </button>
          {showDeleted && (
            <div style={{ marginTop: '10px' }}>
              {deletedModules.map(mod => {
                const ov  = overrides[String(mod.id)] || {};
                const pal = MODULE_PALETTE[mod.id] || { accent: '#15803d', bg: '#dcfce7' };
                return (
                  <div key={mod.id} style={{ ...cardStyle, opacity: 0.7 }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: pal.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                        {mod.image}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '10px', color: pal.accent, fontWeight: '700', letterSpacing: '1px' }}>MODULE {mod.id} — SUPPRIMÉ</div>
                        <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{ov.title || mod.title}</div>
                        {ov._deletedAt && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Supprimé le {new Date(ov._deletedAt).toLocaleString('fr-FR')}</div>}
                      </div>
                      <button onClick={() => restoreModule(mod.id)} style={{ ...btnStyle('ghost'), color: '#15803d', flexShrink: 0 }}>Restaurer</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QuestionForm
// ─────────────────────────────────────────────────────────────
function QuestionForm({ form, setForm, onSave, onCancel, saving, isNew }) {
  return (
    <div style={{ ...cardStyle, border: '1.5px solid var(--accent)', marginBottom: '12px' }}>
      <div style={{ fontWeight: '700', color: 'var(--accent)', marginBottom: '14px', fontSize: '13px' }}>
        {isNew ? 'Nouvelle question' : 'Modifier la question'}
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Module</label>
        <select value={form.moduleId} onChange={e => setForm(f => ({ ...f, moduleId: e.target.value }))} style={{ ...inputStyle, width: 'auto' }}>
          {modulesData.modules.map(m => <option key={m.id} value={String(m.id)}>Module {m.id} — {m.title}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Question</label>
        <textarea rows={3} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Réponses (une par ligne)</label>
        <textarea rows={4} value={form.choices} onChange={e => setForm(f => ({ ...f, choices: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <label style={labelStyle}>Index bonne réponse (0 = première)</label>
          <input type="number" min="0" value={form.correct} onChange={e => setForm(f => ({ ...f, correct: e.target.value }))} style={{ ...inputStyle, width: '80px' }} />
        </div>
        <div style={{ flex: 1, minWidth: '140px' }}>
          <label style={labelStyle}>Difficulté</label>
          <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} style={{ ...inputStyle, width: 'auto' }}>
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Explication (après le quiz)</label>
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
// ModuleQuestionsSection — accordion par module
// ─────────────────────────────────────────────────────────────
function ModuleQuestionsSection({ mod, questions, editing, form, setForm, onEdit, onSave, onCancel, onAddNew, saving }) {
  const [open, setOpen] = useState(false);
  const pal = MODULE_PALETTE[mod.id] || { accent: '#15803d', bg: '#dcfce7' };
  const newKey = `__new_${mod.id}__`;
  const isAddingNew = editing === newKey;

  return (
    <div style={{ marginBottom: '10px', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '13px 16px', cursor: 'pointer', userSelect: 'none',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: open ? 'var(--bg-page)' : 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>{mod.image}</span>
          <div>
            <span style={{ fontSize: '10px', fontWeight: '700', color: pal.accent, letterSpacing: '1px' }}>MODULE {mod.id}</span>
            <span style={{ marginLeft: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{mod.title}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ backgroundColor: pal.bg, color: pal.accent, padding: '2px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
            {questions.length} question{questions.length !== 1 ? 's' : ''}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-page)' }}>
          {isAddingNew && (
            <QuestionForm form={form} setForm={setForm} onSave={onSave} onCancel={onCancel} saving={saving} isNew />
          )}

          {questions.length === 0 && !isAddingNew && (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
              Aucune question pour ce module.
            </p>
          )}

          {questions.map(q => {
            if (editing === q._id) {
              return <QuestionForm key={q._id} form={form} setForm={setForm} onSave={onSave} onCancel={onCancel} saving={saving} />;
            }
            const level = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' }[q.difficulty || q.level] || q.difficulty;
            return (
              <div key={q._id} style={{ ...cardStyle, marginBottom: '8px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span>{level}</span>
                      {q._source === 'firestore' && (
                        <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '1px 5px', borderRadius: '4px' }}>Firestore</span>
                      )}
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600', lineHeight: '1.45' }}>
                      {q.text || q.question}
                    </p>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {(q.choices || q.options || []).map((c, i) => (
                        <span key={i} style={{
                          fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                          backgroundColor: i === (q.correct ?? q.correctIndex) ? '#dcfce7' : 'var(--bg-soft)',
                          color: i === (q.correct ?? q.correctIndex) ? '#166534' : 'var(--text-secondary)',
                          fontWeight: i === (q.correct ?? q.correctIndex) ? '700' : '400',
                        }}>
                          {i === (q.correct ?? q.correctIndex) ? '✓ ' : ''}{c}
                        </span>
                      ))}
                    </div>
                    {q.explanation && (
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', marginBottom: 0, fontStyle: 'italic' }}>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                  <button onClick={() => onEdit(q)} style={{ ...btnStyle('ghost'), fontSize: '11px', flexShrink: 0 }}>Éditer</button>
                </div>
              </div>
            );
          })}

          {!isAddingNew && (
            <button
              onClick={onAddNew}
              style={{ width: '100%', padding: '9px', backgroundColor: 'transparent', border: `1px dashed ${pal.accent}`, borderRadius: '7px', cursor: 'pointer', fontSize: '12px', color: pal.accent, fontFamily: 'inherit', marginTop: '4px' }}
            >
              + Ajouter une question au module {mod.id}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab: Questions — groupées par module
// ─────────────────────────────────────────────────────────────
function QuestionsTab({ toast }) {
  const [questions, setQuestions] = useState([]);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState({});
  const [saving, setSaving]       = useState(false);

  const loadQuestions = async () => {
    if (!db) {
      setQuestions(questionsData.questions.map((q, i) => ({ ...q, _id: String(q.id ?? i), _source: 'json' })));
      return;
    }
    const snap = await getDocs(collection(db, 'content_questions'));
    const fsMap = {};
    snap.forEach(d => { fsMap[d.id] = { ...d.data(), _id: d.id, _source: 'firestore' }; });

    const jsonQs = questionsData.questions.map((q, i) => {
      const fsKey = String(q.id ?? i);
      return fsMap[fsKey] ? { ...q, ...fsMap[fsKey] } : { ...q, _id: fsKey, _source: 'json' };
    });
    const fsOnly = Object.values(fsMap).filter(f => !jsonQs.find(j => j._id === f._id));
    setQuestions([...jsonQs, ...fsOnly]);
  };

  useEffect(() => { loadQuestions(); }, []);

  const openEdit = (q) => {
    setForm({
      moduleId:    String(q.moduleId || '1'),
      text:        q.text || q.question || '',
      choices:     (q.choices || q.options || []).join('\n'),
      correct:     String(q.correct ?? q.correctIndex ?? '0'),
      difficulty:  q.difficulty || q.level || 'intermediaire',
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
      const isNew = editing?.startsWith('__new_');
      const id = isNew ? `q_${Date.now()}` : editing;
      await setDoc(doc(db, 'content_questions', id), data, { merge: true });
      toast('Question sauvegardée');
      setEditing(null);
      await loadQuestions();
    } catch (e) {
      alert('Erreur : ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const total = questions.length;

  return (
    <div>
      <p style={{ margin: '0 0 18px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
        {total} questions au total · Cliquez sur un module pour voir et modifier ses questions.
      </p>

      {modulesData.modules.map(mod => {
        const modQuestions = questions.filter(q => String(q.moduleId) === String(mod.id));
        return (
          <ModuleQuestionsSection
            key={mod.id}
            mod={mod}
            questions={modQuestions}
            editing={editing}
            form={form}
            setForm={setForm}
            onEdit={openEdit}
            onSave={saveQuestion}
            onCancel={() => setEditing(null)}
            onAddNew={() => {
              setForm({ moduleId: String(mod.id), text: '', choices: 'Choix A\nChoix B\nChoix C\nChoix D', correct: '0', difficulty: 'intermediaire', explanation: '' });
              setEditing(`__new_${mod.id}__`);
            }}
            saving={saving}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab: Utilisateurs
// ─────────────────────────────────────────────────────────────
function UsersTab({ toast }) {
  const [users, setUsers]     = useState([]);
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
// Bleu admin — distinct du vert de la formation
const ADMIN_BLUE   = '#1e40af';  // header fond
const ADMIN_ACTIVE = '#3b82f6';  // onglet actif / accent
const ADMIN_BADGE  = { bg: '#dbeafe', color: '#1e3a8a' };

export default function AdminPage({ firebaseUser, isAdmin, onNavigate }) {
  const [tab, setTab]           = useState('modules');
  const [toastMsg, setToastMsg] = useState('');
  const isMobile                = useIsMobile();
  const [theme, setTheme]       = useTheme();

  const toast = (msg) => setToastMsg(msg);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  if (!firebaseUser) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-page)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
          <h2 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Accès refusé</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Connectez-vous pour accéder à cette page.</p>
          <button onClick={() => onNavigate('landing')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: ADMIN_BLUE, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Retour à l'accueil</button>
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '320px' }}>Votre compte ne dispose pas des droits d'administration.</p>
          <button onClick={() => onNavigate('accueil')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: ADMIN_BLUE, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Retour à la formation</button>
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

      {/* ── Header bleu admin ── */}
      <header style={{
        flexShrink: 0,
        backgroundColor: ADMIN_BLUE,
        padding: `calc(14px + env(safe-area-inset-top)) ${isMobile ? '16px' : '24px'} 14px`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 12px rgba(30,64,175,0.35)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => onNavigate('accueil')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', color: '#fff', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            ← Formation
          </button>
          <Logo size={22} />
          {!isMobile && <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Administration</span>}
          <span style={{ backgroundColor: ADMIN_BADGE.bg, color: ADMIN_BADGE.color, fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '8px', letterSpacing: '0.5px' }}>
            ADMIN
          </span>
        </div>

        {/* Infos utilisateur + toggle thème */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isMobile && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#fff', fontWeight: '600' }}>
                {firebaseUser.displayName || firebaseUser.email?.split('@')[0]}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>{firebaseUser.email}</div>
            </div>
          )}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ── Navigation par onglets (bleu) ── */}
      <nav style={{ flexShrink: 0, backgroundColor: 'var(--bg-surface)', borderBottom: `2px solid ${ADMIN_ACTIVE}22`, padding: '0 24px', display: 'flex', gap: '4px' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '13px 18px', background: 'transparent', border: 'none',
            borderBottom: tab === t.id ? `3px solid ${ADMIN_ACTIVE}` : '3px solid transparent',
            color: tab === t.id ? ADMIN_ACTIVE : 'var(--text-secondary)',
            fontWeight: tab === t.id ? '700' : '500',
            cursor: 'pointer', fontSize: isMobile ? '12px' : '13px',
            fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>{t.label}</button>
        ))}
      </nav>

      <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px 32px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {!isConfigured && (
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#78350f' }}>
              ⚠️ Firebase non configuré — les modifications ne seront pas sauvegardées.
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
