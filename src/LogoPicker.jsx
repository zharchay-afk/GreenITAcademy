import React, { useRef, useState } from 'react';
import Logo, { LOGO_VARIANTS } from './Logo';
import { doc, setDoc } from 'firebase/firestore';
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export default function LogoPicker({ currentVariant = 'leaf', currentUrl = '', onClose, toast }) {
  const fileRef   = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function selectVariant(id) {
    if (!db) return;
    await setDoc(doc(db, 'config', 'pages'), { logoVariant: id, logoUrl: '' }, { merge: true });
    toast?.('Logo mis à jour');
    onClose();
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file || !storage) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const ref = sRef(storage, `pages/logo_${Date.now()}.${ext}`);
      await uploadBytes(ref, file);
      const url = await getDownloadURL(ref);
      await setDoc(doc(db, 'config', 'pages'), { logoUrl: url, logoVariant: 'custom' }, { merge: true });
      toast?.('Logo personnalisé chargé');
      onClose();
    } catch {
      toast?.('Erreur lors du chargement');
    } finally {
      setUploading(false);
    }
  }

  const isCustom = currentVariant === 'custom' && currentUrl;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '24px',
          width: '380px', maxWidth: '92vw',
          boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Titre */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Choisir un logo
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Grille des variantes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '18px' }}>
          {LOGO_VARIANTS.map(v => {
            const active = currentVariant === v.id && !isCustom;
            return (
              <button
                key={v.id}
                onClick={() => selectVariant(v.id)}
                style={{
                  padding: '10px 6px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  border: active ? '2px solid #2563eb' : '2px solid var(--border)',
                  borderRadius: '10px', cursor: 'pointer',
                  backgroundColor: active ? '#eff6ff' : 'var(--bg-page)',
                  transition: 'border-color 0.15s, background-color 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {/* Force la variante via prop pour que la prop prenne le dessus sur le context */}
                <Logo size={40} variant={v.id} url="" />
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: active ? 700 : 400 }}>
                  {v.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Upload image personnalisée */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Ou utiliser votre propre image :
          </p>
          {isCustom && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <img
                src={currentUrl}
                alt="logo actuel"
                style={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'contain', border: '2px solid #2563eb' }}
              />
              <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>Logo actuel</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              width: '100%', padding: '9px 12px',
              border: '1px dashed var(--border)', borderRadius: '8px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'inherit',
              opacity: uploading ? 0.6 : 1,
            }}
          >
            {uploading ? '⏳ Chargement…' : '📁 Charger une image (PNG, SVG, JPG…)'}
          </button>
        </div>
      </div>
    </div>
  );
}
