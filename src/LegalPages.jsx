import React, { useContext, useEffect, useState } from 'react';
import { exportScorm } from './utils/scormExport';
import Footer from './Footer';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// ── Contexte admin/config partagé entre toutes les sous-pages ─────────────
const LegalCtx = React.createContext({ cfg: {}, isAdmin: false, onSave: () => {} });

// Champ inline (petit texte) ou bloc paragraphe (multiline) éditable par l'admin
function E({ field, def, multiline = false }) {
  const { cfg, isAdmin, onSave } = useContext(LegalCtx);
  const value = cfg[field] ?? def;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isAdmin) return <>{value}</>;

  const doSave = async () => {
    setSaving(true);
    await onSave(field, draft);
    setSaving(false);
    setEditing(false);
  };

  // ── mode édition ──────────────────────────────────────────────────
  if (editing && multiline) {
    return (
      <span style={{ display: 'block', margin: '4px 0' }}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          autoFocus
          rows={Math.max(4, draft.split('\n').length + 1)}
          style={{
            width: '100%', padding: '8px 10px',
            border: '2px solid #2563eb', borderRadius: '6px',
            fontSize: 'inherit', fontFamily: 'inherit', lineHeight: '1.75',
            resize: 'vertical', boxSizing: 'border-box',
          }}
        />
        <span style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
          <button onClick={doSave} disabled={saving} style={{ padding: '4px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>{saving ? '…' : '✓ Sauvegarder'}</button>
          <button onClick={() => setEditing(false)} style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✕ Annuler</button>
        </span>
      </span>
    );
  }

  if (editing) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', verticalAlign: 'middle' }}>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          autoFocus
          onKeyDown={async e => {
            if (e.key === 'Enter')  doSave();
            if (e.key === 'Escape') setEditing(false);
          }}
          style={{ padding: '2px 8px', border: '2px solid #2563eb', borderRadius: '4px', fontSize: 'inherit', fontFamily: 'inherit', width: `${Math.max((draft.length || 10) + 4, 14)}ch`, minWidth: '80px' }}
        />
        <button onClick={doSave} disabled={saving} style={{ padding: '2px 8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>{saving ? '…' : '✓'}</button>
        <button onClick={() => setEditing(false)} style={{ padding: '2px 6px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
      </span>
    );
  }

  // ── mode affichage ────────────────────────────────────────────────
  if (multiline) {
    return (
      <span
        onClick={() => { setDraft(value); setEditing(true); }}
        title="Cliquer pour modifier ce paragraphe"
        style={{
          display: 'block', cursor: 'pointer',
          outline: '2px dashed #93c5fd', borderRadius: '6px',
          padding: '6px 32px 6px 8px',
          position: 'relative', transition: 'outline-color 0.15s',
          whiteSpace: 'pre-wrap',
        }}
      >
        {value}
        <span style={{
          position: 'absolute', top: '4px', right: '4px',
          fontSize: '11px', color: '#2563eb',
          backgroundColor: '#dbeafe', border: '1px solid #93c5fd',
          padding: '1px 5px', borderRadius: '3px', lineHeight: '1.4',
        }}>✏</span>
      </span>
    );
  }

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      title="Cliquer pour modifier"
      style={{
        backgroundColor: '#dbeafe', color: '#1e40af',
        border: '1px solid #93c5fd', borderRadius: '4px',
        padding: '1px 6px', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontWeight: 600, verticalAlign: 'middle',
      }}
    >
      {value}
      <span style={{ fontSize: '11px', opacity: 0.8 }}>✏</span>
    </span>
  );
}


// Page-wrapper et tabs
export default function LegalPages({ initial = 'notice', onBack, onShowScormPlayer, onShowLegal, onShowLanding, onShowHome, onNavigate, isAdmin = false }) {
  const [current, setCurrent] = useState(initial);
  const [legalCfg, setLegalCfg] = useState({});

  useEffect(() => { setCurrent(initial); }, [initial]);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(doc(db, 'config', 'legal'), snap => {
      if (snap.exists()) setLegalCfg(snap.data());
    }, () => {});
  }, []);

  const [saveError, setSaveError] = useState('');

  const saveLegal = async (field, value) => {
    if (!db) return;
    try {
      await setDoc(doc(db, 'config', 'legal'), { [field]: value }, { merge: true });
      setLegalCfg(prev => ({ ...prev, [field]: value }));
      setSaveError('');
    } catch (err) {
      setSaveError(`Erreur sauvegarde : ${err.message}`);
    }
  };

  const Pane = {
    notice:        LegalNotice,
    privacy:       PrivacyShort,
    cookies:       CookiesPolicy,
    ecoconception: () => <EcoConception onShowScormPlayer={onShowScormPlayer} />,
    accessibilite: Accessibilite,
    sitemap:       () => <SitemapPane onShowLanding={onShowLanding} onShowHome={onShowHome} onShowLegal={onShowLegal} onNavigate={onNavigate} />,
  }[current] || LegalNotice;

  return (
    <LegalCtx.Provider value={{ cfg: legalCfg, isAdmin, onSave: saveLegal }}>
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ flexShrink: 0, backgroundColor: 'var(--sidebar-bg)', paddingTop: 'calc(14px + env(safe-area-inset-top))', paddingRight: '32px', paddingBottom: '14px', paddingLeft: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📋</div>
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Informations du site</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onShowHome && (
            <button onClick={onShowHome} style={{ backgroundColor: '#fff', border: 'none', color: '#15803d', padding: '6px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>📚 Retour à la formation</button>
          )}
          <button onClick={onBack} style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', padding: '6px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>← Retour</button>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ flexShrink: 0, backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '0 32px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {[
          { id: 'notice',        label: 'Mentions légales' },
          { id: 'privacy',       label: 'Données personnelles' },
          { id: 'cookies',       label: 'Cookies & stockage' },
          { id: 'ecoconception', label: '🌱 Éco-conception' },
          { id: 'accessibilite', label: '♿ Accessibilité' },
          { id: 'sitemap',       label: '🗺️ Plan du site' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setCurrent(t.id);
              // Synchronise l'URL : passe par onShowLegal pour mettre à jour
              // legalTab dans App.jsx, ce qui déclenche la pushState du hash.
              if (onShowLegal) onShowLegal(t.id);
            }}
            style={{
              padding: '14px 18px', backgroundColor: 'transparent', border: 'none',
              borderBottom: current === t.id ? '3px solid var(--accent)' : '3px solid transparent',
              color: current === t.id ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: current === t.id ? '700' : '500',
              cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
            }}
          >{t.label}</button>
        ))}
      </nav>

      {isAdmin && (
        <div style={{ flexShrink: 0, backgroundColor: '#1e40af', color: '#fff', padding: '8px 24px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700 }}>🔧 Mode administration</span>
          <span style={{ opacity: 0.85 }}>— <span style={{ backgroundColor: '#93c5fd', color: '#1e3a8a', borderRadius: '3px', padding: '0 4px', fontWeight: 600 }}>cliquer</span> sur un titre ou une valeur bleue pour l'éditer · bouton <strong>✏ Contenu</strong> pour éditer tout le texte d'une section</span>
          {saveError && <span style={{ marginLeft: 'auto', backgroundColor: '#ef4444', borderRadius: '4px', padding: '2px 8px' }}>{saveError}</span>}
        </div>
      )}

      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 24px 40px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <Pane />
        </div>
      </main>

      <Footer onShowLegal={onShowLegal} onShowLanding={onShowLanding} />
    </div>
    </LegalCtx.Provider>
  );
}

// -----------------------------------------------------------------------------
// Mentions légales
// -----------------------------------------------------------------------------
function LegalNotice() {
  return (
    <Article title="Mentions légales" titleField="page_title_notice" dateField="updatedNotice" dateDef="mai 2026">
      <Section title="Éditeur du service" sectionKey="notice_editor">
        <p>Le service <strong>« Green IT Académie »</strong> est édité, dans un cadre strictement pédagogique et non commercial, par <strong><E field="orgDescription" def="deux étudiants en Master Data Science de l'UTBM" /></strong>.</p>
        <p>Il s'agit d'un projet académique sans personnalité morale ni structure commerciale. Le service n'a pas vocation à être exploité au-delà de ce cadre pédagogique.</p>
        <p>Contact : <strong><E field="contactEmail" def="xxx@utbm.fr" /></strong></p>
      </Section>

      <Section title="Hébergement" sectionKey="notice_hosting">
        <p>L'application est distribuée sous forme de <strong>Progressive Web App</strong> (PWA) hébergée sur <strong>GitHub Pages</strong> (Microsoft Corporation). Les ressources statiques (HTML, JavaScript, CSS) sont servies depuis l'infrastructure GitHub sans traitement de données personnelles côté hébergeur.</p>
        <p>Le service optionnel de compte utilisateur fait appel à <strong>Firebase</strong> (Google LLC, Dublin, Irlande) pour l'authentification (<em>Firebase Authentication</em>) et la synchronisation de la progression (<em>Cloud Firestore</em>). Ces services sont soumis aux conditions d'utilisation de Google et aux clauses contractuelles types UE pour les transferts de données.</p>
      </Section>

      <Section title="Propriété intellectuelle" sectionKey="notice_ip">
        <p>L'ensemble des contenus pédagogiques (textes, schémas SVG, illustrations) a été produit par les auteurs sur la base de sources publiques citées en bibliographie. Les marques et logos évoqués (ISO, EPEAT, Energy Star, Blue Angel, LuxConnect, EBRC, etc.) appartiennent à leurs titulaires respectifs. Leur citation est faite à titre purement informatif et pédagogique.</p>
      </Section>

      <Section title="Limitation de responsabilité" sectionKey="notice_disclaimer">
        <p>Le contenu pédagogique est rédigé avec soin sur la base de sources officielles à la date indiquée. Les auteurs ne peuvent toutefois être tenus pour responsables d'éventuelles inexactitudes ou d'une évolution réglementaire postérieure à la rédaction. Les informations fournies ne constituent pas un avis juridique professionnel.</p>
      </Section>
    </Article>
  );
}

// -----------------------------------------------------------------------------
// Politique de confidentialité — conforme RGPD
// -----------------------------------------------------------------------------
function PrivacyShort() {
  return (
    <Article title="Données personnelles" titleField="page_title_privacy" dateField="updatedPrivacy" dateDef="juin 2026">

      <Section title="L'essentiel" sectionKey="privacy_essential">
        <Highlight>
          Green IT Académie peut être utilisé <strong>sans créer de compte</strong> : dans ce cas, aucune donnée ne quitte votre navigateur.
          Si vous créez un compte (facultatif), votre adresse e-mail et votre progression sont transmises à <strong>Firebase (Google)</strong> pour faire fonctionner le service que vous avez demandé.
        </Highlight>
      </Section>

      <Section title="Responsable du traitement" sectionKey="privacy_responsible">
        <p>Ce site a été développé par des étudiants en Master Data Science dans le cadre d'un projet pédagogique commandité par l'<strong>UTBM</strong> (Université de Technologie de Belfort-Montbéliard). Les étudiants ont agi en qualité de développeurs pour le compte de l'établissement, dans le respect des consignes de leur enseignant.</p>
        <p>Pour toute question relative à vos données : <strong><E field="contactEmail" def="xxx@utbm.fr" /></strong> — ou adressez-vous au DPO de l'UTBM.</p>
      </Section>

      <Section title="Ce qui est stocké — selon votre mode d'utilisation" sectionKey="privacy_stored">
        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>A — Sans compte (mode anonyme)</p>
        <p>Toutes les données restent <strong>exclusivement sur votre navigateur</strong>, dans le <code>localStorage</code> (mécanisme Web Storage, distinct des cookies — les données ne sont jamais envoyées au serveur) :</p>
        <table style={tableStyle}>
          <thead><tr><th style={th}>Donnée</th><th style={th}>Emplacement</th><th style={th}>Durée</th></tr></thead>
          <tbody>
            <tr><td style={td}>Modules ouverts, scores, temps passé</td><td style={td}><code>localStorage</code></td><td style={td}>Persistant jusqu'à réinitialisation</td></tr>
            <tr><td style={td}>Préférence thème (clair/sombre)</td><td style={td}><code>localStorage</code></td><td style={td}>Persistant</td></tr>
            <tr><td style={td}>État sidebar (réduite/étendue)</td><td style={td}><code>localStorage</code></td><td style={td}>Persistant</td></tr>
            <tr><td style={td}>Fichiers de l'application (PWA)</td><td style={td}>Cache Service Worker</td><td style={td}>Renouvelé à chaque mise à jour</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: '10px' }}>Les auteurs n'ont aucun accès à ces données. Vous pouvez les effacer depuis « Mon profil » → « Réinitialiser ma progression », ou depuis les paramètres de confidentialité de votre navigateur.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>B — Avec compte (mode connecté)</p>
        <p>Si vous créez un compte, les données suivantes sont traitées par les éditeurs via Firebase :</p>
        <table style={tableStyle}>
          <thead><tr><th style={th}>Donnée</th><th style={th}>Où</th><th style={th}>Base légale</th><th style={th}>Durée de conservation</th></tr></thead>
          <tbody>
            <tr><td style={td}>Adresse e-mail</td><td style={td}>Firebase Authentication (Google)</td><td style={td}>Exécution du service (art. 6.1.b)</td><td style={td}>Jusqu'à suppression du compte</td></tr>
            <tr><td style={td}>Prénom affiché (facultatif)</td><td style={td}>Firebase Auth + Firestore</td><td style={td}>Exécution du service (art. 6.1.b)</td><td style={td}>Jusqu'à suppression du compte</td></tr>
            <tr><td style={td}>Scores, modules, temps passé</td><td style={td}>Cloud Firestore (Google)</td><td style={td}>Exécution du service (art. 6.1.b)</td><td style={td}>Jusqu'à suppression du compte</td></tr>
            <tr><td style={td}>Token d'authentification</td><td style={td}><code>IndexedDB</code> local</td><td style={td}>Exécution du service (art. 6.1.b)</td><td style={td}>Jusqu'à déconnexion</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Aucun profilage, aucune publicité, aucune mesure d'audience, aucune revente de données.
        </p>
      </Section>

      <Section title="Sous-traitant — Firebase (Google)" sectionKey="privacy_subcontractor">
        <p>Le service utilise <strong>Firebase</strong>, produit de Google LLC (siège : Dublin, Irlande pour les services européens). Firebase agit en qualité de sous-traitant au sens de l'article 28 RGPD.</p>
        <ul>
          <li><strong>Firebase Authentication</strong> : gestion des identifiants, envoi des e-mails de confirmation et de réinitialisation de mot de passe.</li>
          <li><strong>Cloud Firestore</strong> : base de données NoSQL hébergeant la progression synchronisée.</li>
        </ul>
        <p>Les transferts éventuels hors EEE sont encadrés par les <strong>clauses contractuelles types (CCT)</strong> adoptées par la Commission européenne. Politique de confidentialité Google : <em>policies.google.com/privacy</em>.</p>
        <p>Les mots de passe ne sont jamais transmis aux éditeurs ; Firebase gère leur stockage sécurisé côté serveur.</p>
      </Section>

      <Section title="Vos droits (art. 15–22 RGPD)" sectionKey="privacy_rights">
        <p>Pour les données traitées dans le cadre d'un compte :</p>
        <ul>
          <li><strong>Accès</strong> : consultez vos données dans « Mon profil ».</li>
          <li><strong>Rectification</strong> : modifiez votre prénom depuis « Mon profil ».</li>
          <li><strong>Effacement</strong> : supprimez votre compte depuis « Mon profil » → « Supprimer mon compte ». Toutes les données Firebase associées sont effacées.</li>
          <li><strong>Portabilité</strong> : exportez votre progression en JSON depuis « Mon profil ».</li>
          <li><strong>Opposition</strong> (art. 21) : cessez d'utiliser le service en mode connecté et supprimez votre compte — toute trace est effacée côté Firebase.</li>
          <li><strong>Réclamation</strong> : vous pouvez introduire une réclamation auprès de la <strong>CNIL</strong> (France — <em>cnil.fr</em>) ou de la <strong>CNPD</strong> (Luxembourg — <em>cnpd.public.lu</em>).</li>
        </ul>
        <p>Pour exercer vos droits : <strong><E field="contactEmail" def="xxx@utbm.fr" /></strong>.</p>
      </Section>

      <Section title="Cookies" sectionKey="privacy_cookies">
        <p><strong>Aucun cookie n'est utilisé.</strong> Le stockage local repose sur <code>localStorage</code> et <code>IndexedDB</code> (Web Storage API), qui ne sont pas des cookies au sens de la directive ePrivacy et ne sont pas transmis au serveur lors des requêtes HTTP. Voir l'onglet « Cookies &amp; stockage » pour l'inventaire complet.</p>
      </Section>

      <Section title="Mise à jour de cette politique" sectionKey="privacy_update">
        <p>Toute modification substantielle sera notifiée aux utilisateurs connectés par e-mail ou via une bannière dans l'application. La date en haut de page indique la dernière révision.</p>
      </Section>

    </Article>
  );
}

// -----------------------------------------------------------------------------
// Cookies & stockage local
// -----------------------------------------------------------------------------
function CookiesPolicy() {
  return (
    <Article title="Cookies et stockage local" titleField="page_title_cookies" dateField="updatedCookies" dateDef="mai 2026">
      <Section title="L'essentiel" sectionKey="cookies_essential">
        <Highlight>Green IT Académie <strong>n'utilise aucun cookie</strong>. L'application stocke certaines informations dans le <code>localStorage</code> et le <code>sessionStorage</code> de votre navigateur, exclusivement à des fins techniques et de personnalisation. Aucune donnée n'est transmise à un tiers.</Highlight>
      </Section>

      <Section title="Qu'est-ce que le stockage local ?" sectionKey="cookies_what">
        <p>Le <strong>localStorage</strong> et le <strong>sessionStorage</strong> sont des mécanismes standard du navigateur (Web Storage API, norme W3C) qui permettent à un site de conserver de petites quantités d'information côté client. Contrairement aux cookies, ils ne sont jamais transmis automatiquement au serveur — ce qui en fait des moyens techniquement plus sûrs et plus sobres pour stocker des données qui doivent rester côté utilisateur.</p>
      </Section>

      <Section title="Inventaire détaillé" sectionKey="cookies_inventory">
        <table style={tableStyle}>
          <thead><tr><th style={th}>Clé</th><th style={th}>Type</th><th style={th}>Contenu</th><th style={th}>Durée</th><th style={th}>Finalité</th></tr></thead>
          <tbody>
            <tr><td style={td}><code>greenitacademie-progress</code></td><td style={td}>localStorage</td><td style={td}>Modules commencés, scores, temps passé</td><td style={td}>Persistant jusqu'à suppression</td><td style={td}>Suivi pédagogique (mode anonyme)</td></tr>
            <tr><td style={td}><code>greenit-sidebar-collapsed</code></td><td style={td}>localStorage</td><td style={td}>Préférence repli du menu (0 ou 1)</td><td style={td}>Persistant</td><td style={td}>Interface</td></tr>
            <tr><td style={td}><code>firebase:authUser:*</code></td><td style={td}>IndexedDB (navigateur)</td><td style={td}>Token d'authentification Firebase (si compte créé)</td><td style={td}>Jusqu'à déconnexion</td><td style={td}>Maintien de la session (mode connecté uniquement)</td></tr>
            <tr><td style={td}><em>Cache PWA</em></td><td style={td}>Cache API (service worker)</td><td style={td}>Fichiers de l'application (HTML, JS, CSS, JSON, SVG)</td><td style={td}>Renouvelé à chaque mise à jour</td><td style={td}>Fonctionnement hors-ligne</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="Pourquoi pas de bannière « cookies » ?" sectionKey="cookies_nobanner">
        <p>La directive « ePrivacy » (2002/58/CE) et son application luxembourgeoise imposent le recueil du consentement pour tout dépôt ou lecture d'information sur le terminal de l'utilisateur, <strong>à l'exception</strong> des traceurs « strictement nécessaires à la fourniture d'un service expressément demandé par l'utilisateur » (article 5.3, transposé). Les stockages listés ci-dessus relèvent tous de cette exemption : ils sont indispensables à l'exécution de la fonctionnalité demandée (s'authentifier, suivre son parcours, utiliser l'application hors-ligne). Aucune bannière de consentement n'est donc requise.</p>
      </Section>

      <Section title="Comment supprimer vos données ?" sectionKey="cookies_delete">
        <p>Plusieurs options :</p>
        <ul>
          <li>Depuis l'application : rubrique <em>Mon profil</em> → bouton « Réinitialiser ma progression ».</li>
          <li>Depuis le navigateur : paramètres → confidentialité → effacer les données du site (cela supprime également le cache PWA).</li>
          <li>Pour les utilisateurs avancés : ouvrez la console développeur (F12), onglet « Application » ou « Stockage », et supprimez les clés concernées.</li>
        </ul>
      </Section>

      <Section title="Pour aller plus loin" sectionKey="cookies_more">
        <p>Les principes appliqués ici (minimisation, locality first, privacy by design) sont l'application concrète d'enseignements du module 4 du parcours sur les labels et de le module 2 sur le cadre réglementaire européen. Une application Green IT bien conçue est aussi une application qui respecte la vie privée par construction.</p>
      </Section>
    </Article>
  );
}

// -----------------------------------------------------------------------------
// Éco-conception
// -----------------------------------------------------------------------------
function EcoConception({ onShowScormPlayer }) {
  return (
    <Article title="Éco-conception de l'application" titleField="page_title_eco" dateField="updatedEco" dateDef="mai 2026">
      <Section title="Préambule" sectionKey="eco_preambule">
        <Highlight>Le contenu pédagogique de Green IT Académie porte sur l'éco-conception et la sobriété numérique. La cohérence imposait que l'application elle-même applique ces principes. Cette page documente les choix techniques retenus, leurs effets mesurables, et les limites qui subsistent.</Highlight>
      </Section>

      <Section title="1. Architecture sans serveur ni base de données" sectionKey="eco_arch">
        <p>L'application est une <strong>Progressive Web App (PWA)</strong> dont l'intégralité du code et des données s'exécute dans le navigateur de l'utilisateur. Aucun serveur applicatif n'est interrogé, aucune base de données n'est mobilisée, aucune requête réseau n'est émise vers les éditeurs après le chargement initial.</p>
        <p>L'impact direct est la suppression du poste « datacenter » dans le bilan d'une session utilisateur. À titre indicatif, une visite sur un site contemporain déclenche couramment 60 à 100 requêtes HTTP additionnelles à destination de tiers (mesure d'audience, polices, scripts publicitaires, chat support, etc.) ; ce nombre est ramené à zéro ici, hors chargement initial.</p>
      </Section>

      <Section title="2. Absence de traceurs et de tiers" sectionKey="eco_trackers">
        <p>Aucun script tiers n'est intégré (Google Analytics, Tag Manager, pixels marketing, services de cartographie, CDN externes…). Cette décision produit deux effets convergents :</p>
        <ul>
          <li><strong>Réduction de l'empreinte réseau</strong> : aucune connexion sortante n'est ouverte pour transmettre de la télémétrie ;</li>
          <li><strong>Conformité <em>privacy by design</em></strong> : aucune donnée personnelle n'est transmise à des tiers (cf. politique « Données personnelles »).</li>
        </ul>
      </Section>

      <Section title="3. Schémas vectoriels intégrés (SVG inline)" sectionKey="eco_svg">
        <p>Les 14 schémas pédagogiques du parcours (pyramide des instruments, cycle ACV, échelle PUE, frise du Green Deal, etc.) sont définis sous forme de <strong>SVG inline</strong>, embarqués directement dans le code source. Ils s'affichent sans requête HTTP supplémentaire et restent nets à toute résolution.</p>
        <p>Une comparaison synthétique : une image bitmap haute résolution équivalente pèse en moyenne 200 à 500 Ko ; les 14 schémas SVG inline représentent ensemble moins de 30 Ko, soit une réduction de poids de l'ordre de 90 %.</p>
      </Section>

      <Section title="4. Polices système, absence de webfont" sectionKey="eco_polices">
        <p>L'application s'appuie sur la <strong>police système</strong> du terminal (San Francisco sur macOS et iOS, Segoe UI sur Windows, Roboto sur Android, polices par défaut sur Linux). Aucune webfont externe n'est téléchargée.</p>
        <p>Une webfont standard (Google Fonts, Adobe Fonts) pèse typiquement entre 100 et 300 Ko et exige plusieurs requêtes réseau supplémentaires. Cette dépendance est ici entièrement évitée.</p>
      </Section>

      <Section title="5. Dépendances limitées au strict nécessaire" sectionKey="eco_deps">
        <p>Trois dépendances seulement sont mobilisées : <code>react</code> et <code>react-dom</code> pour l'interface, <code>jszip</code> pour la génération du package SCORM. Aucun framework UI (Material UI, Ant Design, Bootstrap), aucune bibliothèque d'animation, aucun moteur d'icônes externe — les pictogrammes utilisés sont des emojis Unicode déjà présents dans le système.</p>
        <p>Le bundle JavaScript distribué pèse approximativement <strong><E field="bundleSize" def="150 Ko gzippé" /></strong>, à comparer à 500 Ko – 2 Mo couramment observés sur une application React moyenne.</p>
      </Section>

      <Section title="6. Fonctionnement hors-ligne via service worker" sectionKey="eco_offline">
        <p>Un service worker met en cache l'intégralité de l'application au premier chargement. Les visites suivantes s'exécutent sans connexion réseau et ne re-téléchargent pas les ressources statiques tant qu'une nouvelle version n'est pas publiée.</p>
      </Section>

      <Section title="7. Codebase unique web et mobile" sectionKey="eco_codebase">
        <p>L'application fonctionne à l'identique sur ordinateur, tablette et smartphone à partir d'un <strong>codebase unique</strong>. Aucune version native Android ou iOS distincte n'est maintenue : la maintenance, la duplication de code et le passage par les magasins d'applications sont entièrement évités.</p>
      </Section>

      <Section title="8. Hébergement statique" sectionKey="eco_hosting">
        <p>Lorsque l'application est publiée pour démonstration, elle est servie par un hébergeur de pages statiques (GitHub Pages, Vercel, Netlify) couplé à une distribution CDN. Aucun traitement applicatif n'est exécuté côté serveur pour servir une visite, ce qui correspond à l'un des modèles d'hébergement les moins énergivores disponibles aujourd'hui.</p>
      </Section>

      <Section title="9. Mode sombre par défaut respecté" sectionKey="eco_dark">
        <p>Sur les écrans OLED — désormais majoritaires sur smartphones et présents sur de nombreux ordinateurs portables — l'affichage de pixels noirs consomme nettement moins d'énergie que l'affichage de pixels blancs. Les études disponibles font état d'une économie pouvant atteindre 30 % pour l'affichage en mode sombre sur ces dalles.</p>
        <p>L'application propose un <strong>thème sombre commutable</strong> via le bouton 🌙 / ☀️ présent dans le footer. La préférence système de l'utilisateur (<code>prefers-color-scheme</code>) est respectée par défaut au premier chargement, et le choix manuel est ensuite mémorisé en <code>localStorage</code>. La bascule s'opère sans rechargement de page grâce à un système de variables CSS appliquées au niveau de l'élément racine.</p>
      </Section>

      <Section title="Limites et arbitrages assumés" sectionKey="eco_limits">
        <p>Plusieurs optimisations supplémentaires sont identifiées dans la littérature de l'éco-conception. Leur non-mise en œuvre dans le présent projet résulte d'arbitrages explicites, exposés ci-dessous.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>Lazy-loading des modules</p>
        <p>L'ensemble du contenu pédagogique (modules.json, questions.json, schémas) est aujourd'hui chargé en une seule passe. Une stratégie de chargement à la demande aurait pu être mise en place via le découpage Vite.</p>
        <p><em>Raison de l'arbitrage</em> : la totalité du contenu pédagogique pèse environ 80 Ko gzippés. Le découpage introduirait plusieurs requêtes supplémentaires et une complexité de cache non triviale, pour un gain net marginal — voire négatif sur un usage typique où l'apprenant parcourt l'ensemble des modules. Le seuil d'utilité du lazy-loading est plutôt atteint sur des applications de plusieurs Mo de contenu.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>Compression Brotli</p>
        <p>La compression Brotli offre typiquement un gain de 15 à 20 % sur le poids transféré par rapport à gzip.</p>
        <p><em>Raison de l'arbitrage</em> : la compression dépend de la configuration de l'hébergeur, pas du code applicatif. Les principaux hébergeurs statiques visés (Vercel, Netlify, Cloudflare Pages) activent Brotli par défaut lorsque le navigateur le supporte ; le gain est donc obtenu automatiquement lors d'un déploiement réel. Aucune action côté code n'est nécessaire ou même possible.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>Mesure d'audience écoresponsable</p>
        <p>Aucune mesure d'audience n'est implémentée, y compris parmi les solutions souveraines et sobres (Plausible, Matomo auto-hébergé).</p>
        <p><em>Raison de l'arbitrage</em> : ajouter de la mesure d'audience contredirait directement les principes affichés (« aucune donnée ne quitte le terminal »). Le compromis a été tranché en faveur de la sobriété maximale, au prix de l'absence de statistiques d'usage pour les éditeurs.</p>
      </Section>

      <Section title="Interopérabilité : export SCORM 1.2" sectionKey="eco_scorm">
        <p>Le parcours peut être exporté au format <strong>SCORM 1.2</strong>, standard de l'<em>Advanced Distributed Learning Initiative</em>, et intégré dans tout système de gestion d'apprentissage compatible (Moodle, Canvas, Blackboard, 360Learning, etc.). L'interopérabilité avec les LMS institutionnels existants évite la duplication d'infrastructures pédagogiques et réduit la charge d'hébergement supplémentaire associée à un parcours autonome.</p>
        <p>Une fonction d'import est également proposée : tout package SCORM 1.2 tiers peut être chargé et lu directement dans l'application, sans envoi de données à un serveur externe.</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}>
          <button
            onClick={() => exportScorm()}
            style={{ backgroundColor: '#166534', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            ⬇ Télécharger le package SCORM
          </button>
          {onShowScormPlayer && (
            <button
              onClick={onShowScormPlayer}
              style={{ backgroundColor: 'var(--bg-surface)', color: '#166534', border: '1px solid #166534', padding: '10px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              📂 Importer un SCORM tiers
            </button>
          )}
        </div>
      </Section>

      <Section title="Réutilisabilité : un parcours servant de gabarit" sectionKey="eco_reuse">
        <p>L'architecture du projet sépare strictement le <strong>cadre applicatif</strong> (composants d'interface, lecteur de cours, moteur de quiz adaptatif, sidebar, pages légales) du <strong>contenu pédagogique</strong>, intégralement décrit dans deux fichiers JSON : <code>data/modules.json</code> pour les cours et <code>data/questions.json</code> pour le quiz.</p>
        <p>Cette séparation permet de réutiliser l'ensemble du dispositif pour une formation différente sans réécrire la moindre ligne de code applicatif. Le remplacement du contenu des deux fichiers JSON, accompagné de l'ajustement de quelques éléments de marque (titre, palette, illustration) et d'un redéploiement, suffit. Il s'agit de la mise en pratique d'un principe clé du Green IT : <em>conçu une fois, réutilisé largement</em>.</p>
        <p>Le bénéfice environnemental est double. Le développement répété d'applications de formation depuis zéro, opération chronophage et énergivore, est évité. Plusieurs formations partagent par ailleurs le même socle technique, donc le même cache navigateur, le même bundle et la même distribution CDN — autant de ressources mutualisées plutôt que dupliquées.</p>
        <p>Le guide de réutilisation détaillé est consultable dans le dépôt source du projet, sous le fichier <code>REUSE.md</code>. Il couvre quatre points :</p>
        <ul>
          <li><strong>Remplacement du contenu</strong> : structure attendue des fichiers <code>modules.json</code> et <code>questions.json</code>, champs obligatoires et facultatifs.</li>
          <li><strong>Personnalisation de la marque</strong> : titre, sous-titre, illustration SVG du hero, palette principale.</li>
          <li><strong>Adaptation des schémas pédagogiques</strong> : conservation ou substitution des visuels SVG, ajout de nouveaux visuels au registre <code>Visuals.jsx</code>.</li>
          <li><strong>Déploiement</strong> : commandes de build, options d'hébergement statique recommandées.</li>
        </ul>
      </Section>
    </Article>
  );
}

// -----------------------------------------------------------------------------
// Accessibilité
// -----------------------------------------------------------------------------
function Accessibilite() {
  return (
    <Article title="Accessibilité" titleField="page_title_access" dateField="updatedAccess" dateDef="mai 2026">
      <Section title="Préambule" sectionKey="access_preambule">
        <Highlight>L'accessibilité numérique est une composante intrinsèque du numérique responsable. Un outil pédagogique qui exclut une partie de ses utilisateurs ne peut prétendre relever de cette catégorie. Cette page documente les dispositions effectivement mises en œuvre, les limites qui subsistent et les arbitrages associés.</Highlight>
      </Section>

      <Section title="Référentiel suivi" sectionKey="access_ref">
        <p>L'application vise le respect du référentiel <strong>WCAG 2.1 niveau AA</strong> du W3C. Au Luxembourg, la <strong>loi du 28 mai 2019</strong> sur l'accessibilité des sites internet et applications mobiles des organismes du secteur public transpose la directive (UE) 2016/2102, qui s'appuie elle-même sur la norme européenne <strong>EN 301 549</strong> reprenant les critères WCAG. La vérification de conformité relève au Luxembourg du <strong>Service Information et Presse (SIP)</strong>.</p>
      </Section>

      <Section title="Dispositions mises en œuvre" sectionKey="access_measures">
        <ul>
          <li><strong>Contrastes des textes</strong> : le texte blanc sur fond vert (#fff sur #15803d) atteint un ratio de 4,9:1, au-dessus du seuil AA (4,5:1). Les textes secondaires gris (#6b7280 sur fond blanc) se situent à 4,7:1.</li>
          <li><strong>Mode sombre disponible</strong> : un thème alternatif à dominante sombre est proposé via le bouton 🌙 / ☀️ du footer. Le choix est mémorisé et la préférence système (<code>prefers-color-scheme</code>) est respectée par défaut.</li>
          <li><strong>Navigation au clavier</strong> : tous les éléments interactifs sont des éléments HTML natifs (<code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>) accessibles par la touche Tab. L'ordre de tabulation reproduit la logique visuelle.</li>
          <li><strong>Sémantique HTML</strong> : l'arborescence repose sur des balises sémantiques (<code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;footer&gt;</code>) afin de permettre une navigation par régions au moyen des technologies d'assistance.</li>
          <li><strong>Schémas vectoriels</strong> : les visuels SVG décoratifs portent l'attribut <code>aria-hidden="true"</code> ; l'information qu'ils restituent est par ailleurs disponible dans le texte du cours.</li>
          <li><strong>Police redimensionnable</strong> : la taille des textes suit les paramètres du navigateur (niveau de zoom, taille de police par défaut).</li>
          <li><strong>Absence de mouvement automatique</strong> : aucune animation déclenchée automatiquement, aucun carrousel, aucun contenu clignotant.</li>
          <li><strong>Fonctionnement hors-ligne</strong> : l'application reste utilisable sans connexion réseau, ce qui bénéficie également aux utilisateurs disposant d'une connectivité limitée.</li>
        </ul>
      </Section>

      <Section title="Limites et arbitrages assumés" sectionKey="access_limits">
        <p>Plusieurs dispositions complémentaires n'ont pas été mises en œuvre dans le présent projet. Leur statut et la justification de cet arbitrage sont exposés ci-dessous.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>Audit professionnel</p>
        <p>Aucun audit WCAG conduit par un expert tiers indépendant n'a été réalisé. La présente page constitue une auto-déclaration et non une déclaration d'accessibilité officielle au sens de la directive (UE) 2016/2102 et de la loi luxembourgeoise du 28 mai 2019.</p>
        <p><em>Justification</em> : un audit professionnel représente un investissement significatif, sans rapport avec le périmètre d'un livrable pédagogique. La transparence sur cette limite permet à l'utilisateur de qualifier la portée du présent document.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>Tests systématiques avec lecteurs d'écran</p>
        <p>L'application n'a pas fait l'objet de tests systématiques avec les principaux lecteurs d'écran (NVDA, JAWS, VoiceOver). Certains libellés ARIA sont susceptibles d'être manquants ou perfectibles.</p>
        <p><em>Justification</em> : ces tests requièrent un environnement et une expertise spécifiques. La sémantique HTML stricte appliquée par défaut fournit toutefois un socle d'accessibilité raisonnable pour les technologies d'assistance modernes.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>Restitution textuelle des indicateurs visuels du quiz</p>
        <p>Le suivi de progression et le résultat des questions du parcours d'évaluation reposent sur des indicateurs visuels (barre de progression, code couleur vert/rouge). Une restitution textuelle équivalente, plus explicite pour les utilisateurs de lecteurs d'écran, mériterait d'être ajoutée.</p>
        <p><em>Justification</em> : amélioration identifiée et consignée comme évolution prioritaire.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>Mode à contraste élevé</p>
        <p>Aucune bascule « contraste maximal » n'est proposée, et la requête CSS <code>prefers-contrast: more</code> n'est pas explicitement prise en charge.</p>
        <p><em>Justification</em> : les contrastes par défaut respectent déjà le seuil AA (cf. dispositions mises en œuvre) et un mode sombre est désormais proposé. L'ajout d'un troisième thème dédié au contraste maximal demanderait la définition d'une palette supplémentaire couvrant l'ensemble des schémas vectoriels, charge sans commune mesure avec le bénéfice marginal observé sur les configurations conformes par défaut.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>Sous-titrage et alternatives audio</p>
        <p>Aucune disposition de sous-titrage ni d'alternative audio n'est mise en place.</p>
        <p><em>Justification</em> : le parcours actuel ne contient ni contenu vidéo, ni contenu sonore. Cette disposition deviendrait pertinente si du contenu multimédia était introduit ultérieurement.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>Tests utilisateurs en situation de handicap</p>
        <p>Aucun test n'a été conduit avec des utilisateurs en situation de handicap.</p>
        <p><em>Justification</em> : la mise en place de tels tests requiert un protocole formel et des partenariats associatifs hors du périmètre du projet pédagogique. La démarche serait nécessaire avant toute mise en exploitation commerciale.</p>
      </Section>

      <Section title="Signalement d'un défaut d'accessibilité" sectionKey="access_signalement">
        <p>Toute difficulté d'accès rencontrée peut être signalée en ouvrant une <em>issue</em> sur le dépôt source du projet. La résolution sera traitée prioritairement.</p>
      </Section>
    </Article>
  );
}

// -----------------------------------------------------------------------------
// Petits composants utilitaires
// -----------------------------------------------------------------------------
function Article({ title, titleField, dateField, dateDef, children }) {
  return (
    <article style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '32px 36px', border: '1px solid var(--border)' }}>
      <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', margin: '0 0 4px 0', fontWeight: '700' }}>
        {titleField ? <E field={titleField} def={title} /> : title}
      </h1>
      {dateField && (
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 24px 0' }}>
          Dernière mise à jour : <E field={dateField} def={dateDef || ''} />
        </p>
      )}
      <div style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.75', textAlign: 'justify', hyphens: 'auto' }}>{children}</div>
    </article>
  );
}

function extractText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('\n');
  if (node.props?.children) return extractText(node.props.children);
  return '';
}

function Section({ title, sectionKey, children }) {
  const { cfg, isAdmin, onSave } = useContext(LegalCtx);
  const stored = sectionKey ? (cfg[sectionKey] || '') : '';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const canEdit = isAdmin && !!sectionKey;

  const startEdit = () => {
    setDraft(stored || extractText(children).replace(/[ \t]+/g, ' ').trim());
    setEditing(true);
  };

  const doSave = async () => {
    setSaving(true);
    await onSave(sectionKey, draft);
    setSaving(false);
    setEditing(false);
  };

  const titleKey = sectionKey ? `${sectionKey}_title` : null;

  return (
    <section style={{ marginBottom: '24px', position: 'relative' }}>
      <h2 style={{ fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 10px 0', fontWeight: '700', paddingBottom: '6px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <span style={{ flex: 1 }}>{titleKey ? <E field={titleKey} def={title} /> : title}</span>
        {canEdit && !editing && (
          <button
            onClick={startEdit}
            style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', flexShrink: 0 }}
          >✏ Contenu</button>
        )}
      </h2>
      {editing ? (
        <div>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            rows={Math.max(6, draft.split('\n').length + 2)}
            style={{ width: '100%', padding: '10px', border: '2px solid #2563eb', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', lineHeight: '1.75', resize: 'vertical', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
            <button onClick={doSave} disabled={saving} style={{ padding: '6px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>{saving ? '…' : '✓ Sauvegarder'}</button>
            <button onClick={() => setEditing(false)} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit', backgroundColor: 'transparent', color: 'var(--text-secondary)' }}>✕ Annuler</button>
            {stored && (
              <button onClick={async () => { await onSave(sectionKey, ''); setEditing(false); }} style={{ padding: '6px 12px', border: '1px solid #fca5a5', borderRadius: '4px', cursor: 'pointer', color: '#dc2626', fontFamily: 'inherit', backgroundColor: 'transparent', marginLeft: 'auto' }}>↩ Rétablir l'original</button>
            )}
          </div>
        </div>
      ) : stored ? (
        <div style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.75' }}>
          {stored.split('\n\n').filter(p => p.trim()).map((para, i) => <p key={i} style={{ margin: '0 0 12px' }}>{para}</p>)}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

function Highlight({ children }) {
  return (
    <div style={{ padding: '14px 16px', backgroundColor: '#ecfdf5', border: '1px solid #86efac', borderRadius: '8px', fontSize: '14px', color: '#166534', marginBottom: '12px' }}>
      {children}
    </div>
  );
}

const linkInline = { color: '#166534', fontWeight: '600' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px', marginBottom: '10px', fontSize: '13px', tableLayout: 'fixed' };
const th = { textAlign: 'left', padding: '8px 10px', backgroundColor: 'var(--bg-page)', color: 'var(--text-secondary)', borderBottom: '2px solid #e2e8f0', fontWeight: '700', whiteSpace: 'nowrap' };
const td = { padding: '8px 10px', borderBottom: '1px solid var(--border-soft)', color: 'var(--text-primary)', verticalAlign: 'top', textAlign: 'left', hyphens: 'none', wordBreak: 'break-word' };

// -----------------------------------------------------------------------------
// Plan du site
// -----------------------------------------------------------------------------
function SitemapPane({ onShowLanding, onShowHome, onShowLegal, onNavigate }) {
  const navBtn = {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--accent)', textDecoration: 'underline',
    fontSize: '14px', fontFamily: 'inherit', padding: 0,
    textAlign: 'left',
  };
  const staticItem = {
    fontSize: '14px', color: 'var(--text-secondary)',
  };
  const listStyle = {
    listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px',
    padding: 0, margin: 0,
  };

  return (
    <Article title="Plan du site">
      <Section title="Pages principales">
        <ul style={listStyle}>
          <li>
            {onShowLanding
              ? <button onClick={onShowLanding} style={navBtn}>🏠 Page de présentation</button>
              : <span style={staticItem}>🏠 Page de présentation</span>}
          </li>
          <li>
            {onShowHome
              ? <button onClick={onShowHome} style={navBtn}>📊 Dashboard de formation</button>
              : <span style={staticItem}>📊 Dashboard de formation</span>}
          </li>
        </ul>
      </Section>

      <Section title="Modules de formation">
        <ul style={{ ...listStyle, gap: '6px' }}>
          {[
            { id: 1, title: 'Cadres conceptuels et typologie' },
            { id: 2, title: 'Cadre réglementaire UE & Luxembourg' },
            { id: 3, title: 'Normes et certifications ISO' },
            { id: 4, title: 'Labels environnementaux IT' },
            { id: 5, title: 'Codes de conduite et chartes' },
            { id: 6, title: 'Cas pratiques Luxembourg' },
          ].map((m) => (
            <li key={m.id} style={staticItem}>
              📖 Module {m.id} — {m.title}
            </li>
          ))}
        </ul>
        <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Les modules sont accessibles depuis le dashboard de formation.
        </p>
      </Section>

      <Section title="Pages personnelles">
        <ul style={listStyle}>
          <li>
            {onNavigate
              ? <button onClick={() => onNavigate('attestation')} style={navBtn}>🎓 Attestation de réussite</button>
              : <span style={staticItem}>🎓 Attestation de réussite</span>}
          </li>
          <li>
            {onNavigate
              ? <button onClick={() => onNavigate('profil')} style={navBtn}>👤 Mon profil</button>
              : <span style={staticItem}>👤 Mon profil</span>}
          </li>
          <li>
            {onNavigate
              ? <button onClick={() => onNavigate('references')} style={navBtn}>📚 Références bibliographiques</button>
              : <span style={staticItem}>📚 Références bibliographiques</span>}
          </li>
        </ul>
      </Section>

      <Section title="Informations légales et techniques">
        <ul style={listStyle}>
          {[
            { id: 'notice',        label: '📋 Mentions légales' },
            { id: 'privacy',       label: '🔒 Données personnelles (RGPD)' },
            { id: 'cookies',       label: '🍪 Cookies & stockage local' },
            { id: 'accessibilite', label: '♿ Accessibilité (WCAG 2.1)' },
            { id: 'ecoconception', label: '🌱 Éco-conception' },
          ].map((item) => (
            <li key={item.id}>
              {onShowLegal
                ? <button onClick={() => onShowLegal(item.id)} style={navBtn}>{item.label}</button>
                : <span style={staticItem}>{item.label}</span>}
            </li>
          ))}
        </ul>
      </Section>
    </Article>
  );
}
