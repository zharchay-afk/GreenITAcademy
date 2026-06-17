import React from 'react';
import { exportScorm } from './utils/scormExport';
import Footer from './Footer';

// Page-wrapper et tabs
export default function LegalPages({ initial = 'notice', onBack, onShowScormPlayer, onShowLegal, onShowLanding, onShowHome, onNavigate }) {
  const [current, setCurrent] = React.useState(initial);

  React.useEffect(() => { setCurrent(initial); }, [initial]);

  const Pane = {
    notice:        LegalNotice,
    privacy:       PrivacyShort,
    cookies:       CookiesPolicy,
    ecoconception: () => <EcoConception onShowScormPlayer={onShowScormPlayer} />,
    accessibilite: Accessibilite,
    sitemap:       () => <SitemapPane onShowLanding={onShowLanding} onShowHome={onShowHome} onShowLegal={onShowLegal} onNavigate={onNavigate} />,
  }[current] || LegalNotice;

  return (
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

      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 24px 40px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <Pane />
        </div>
      </main>

      <Footer onShowLegal={onShowLegal} onShowLanding={onShowLanding} />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Mentions légales
// -----------------------------------------------------------------------------
function LegalNotice() {
  return (
    <Article title="Mentions légales" updated="Dernière mise à jour : mai 2026">
      <Section title="Éditeur du service">
        <p>Le service <strong>« Green IT Académie »</strong> est édité, dans un cadre strictement pédagogique et non commercial, par deux étudiants en <strong>Master Data Science de l'UTBM</strong> (Université de Technologie de Belfort-Montbéliard).</p>
        <p>Il s'agit d'un projet académique sans personnalité morale ni structure commerciale. Le service n'a pas vocation à être exploité au-delà de ce cadre pédagogique.</p>
      </Section>

      <Section title="Hébergement">
        <p>L'application est distribuée sous forme de <strong>Progressive Web App</strong> (PWA) hébergée sur <strong>GitHub Pages</strong> (Microsoft Corporation). Les ressources statiques (HTML, JavaScript, CSS) sont servies depuis l'infrastructure GitHub sans traitement de données personnelles côté hébergeur.</p>
        <p>Le service optionnel de compte utilisateur fait appel à <strong>Firebase</strong> (Google LLC, Dublin, Irlande) pour l'authentification (<em>Firebase Authentication</em>) et la synchronisation de la progression (<em>Cloud Firestore</em>). Ces services sont soumis aux conditions d'utilisation de Google et aux clauses contractuelles types UE pour les transferts de données.</p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>L'ensemble des contenus pédagogiques (textes, schémas SVG, illustrations) a été produit par les auteurs sur la base de sources publiques citées en bibliographie. Les marques et logos évoqués (ISO, EPEAT, Energy Star, Blue Angel, LuxConnect, EBRC, etc.) appartiennent à leurs titulaires respectifs. Leur citation est faite à titre purement informatif et pédagogique.</p>
      </Section>

      <Section title="Limitation de responsabilité">
        <p>Le contenu pédagogique est rédigé avec soin sur la base de sources officielles à la date indiquée. Les auteurs ne peuvent toutefois être tenus pour responsables d'éventuelles inexactitudes ou d'une évolution réglementaire postérieure à la rédaction. Les informations fournies ne constituent pas un avis juridique professionnel.</p>
      </Section>
    </Article>
  );
}

// -----------------------------------------------------------------------------
// Politique de confidentialité — version actualisée (compte optionnel Firebase)
// -----------------------------------------------------------------------------
function PrivacyShort() {
  return (
    <Article title="Données personnelles" updated="Dernière mise à jour : juin 2026">

      <Section title="L'essentiel">
        <Highlight>
          <strong>Green IT Académie est un projet pédagogique.</strong> L'utilisation sans compte est totalement anonyme. Si vous créez un compte (facultatif), seule votre adresse e-mail est transmise à Firebase Authentication (service Google) à des fins d'authentification. Les auteurs n'ont pas accès à vos données de progression.
        </Highlight>
      </Section>

      <Section title="Pourquoi le RGPD s'applique de manière très limitée">
        <p>Le RGPD (Règlement (UE) 2016/679) encadre les traitements de données personnelles effectués par un <em>responsable de traitement</em>. Plusieurs arguments plaident pour une applicabilité réduite ou nulle dans notre contexte :</p>
        <ul>
          <li><strong>Activité strictement pédagogique et non commerciale.</strong> Ce service est édité par deux étudiants dans le cadre d'un projet académique sans finalité commerciale, sans revenu, sans structure juridique propre. Il n'entre pas dans le champ de l'activité économique visée par le RGPD.</li>
          <li><strong>Exemption « activité domestique ».</strong> L'article 2 (2) c du RGPD exclut les traitements effectués « par une personne physique dans le cadre d'une activité strictement personnelle ou domestique ». L'utilisation de l'application sans compte (mode anonyme) correspond exactement à cette situation : vous traitez vos propres données, sur votre propre terminal, sans interaction avec un tiers collecteur.</li>
          <li><strong>Absence d'accès aux données de progression.</strong> Les scores, temps passé et modules complétés restent dans votre navigateur (<code>localStorage</code>). Les auteurs n'y ont physiquement pas accès — il n'y a donc pas de traitement au sens de l'article 4 (2) du règlement.</li>
          <li><strong>Pas de télémétrie, pas d'analytics.</strong> Aucun cookie de mesure d'audience, aucun pixel de tracking, aucun journal d'accès nominatif n'est mis en œuvre.</li>
        </ul>
        <p>Par mesure de transparence — et parce que la création d'un compte fait intervenir Firebase, un service tiers — nous décrivons ci-dessous l'ensemble des données traitées.</p>
      </Section>

      <Section title="Deux modes d'utilisation">
        <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Mode anonyme (sans compte) — aucune donnée personnelle transmise</p>
        <p>L'application fonctionne intégralement dans votre navigateur. Les données suivantes sont stockées <em>uniquement sur votre terminal</em> :</p>
        <ul>
          <li>Modules consultés, scores obtenus, temps passé par module ;</li>
          <li>Préférence de thème (clair / sombre).</li>
        </ul>
        <p>Vous pouvez les effacer à tout moment via le bouton <em>« Réinitialiser ma progression »</em> dans « Mon profil », ou via les paramètres de confidentialité de votre navigateur.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '16px' }}>Mode connecté (compte optionnel) — Firebase Authentication</p>
        <p>Si vous choisissez de créer un compte pour synchroniser votre progression entre appareils :</p>
        <ul>
          <li>Votre <strong>adresse e-mail</strong> est transmise à <strong>Firebase Authentication</strong> (Google LLC) pour sécuriser votre accès.</li>
          <li>Votre <strong>progression pédagogique</strong> (scores, modules, temps passé) est stockée dans <strong>Firestore</strong> (base de données Google), chiffrée au repos.</li>
          <li>Firebase se charge de l'envoi des e-mails de confirmation et de réinitialisation de mot de passe.</li>
        </ul>
        <p>Firebase est soumis à la politique de confidentialité de Google (<em>google.com/intl/fr/policies/privacy/</em>) et aux clauses contractuelles types UE (CCT/SCCs) pour les transferts hors EEE.</p>
      </Section>

      <Section title="Droits des personnes concernées">
        <p>Si vous avez créé un compte, vous disposez, sur les données traitées via Firebase, des droits suivants :</p>
        <ul>
          <li><strong>Accès et rectification</strong> : modifiez votre nom affiché dans « Mon profil ».</li>
          <li><strong>Suppression</strong> : supprimez votre compte depuis « Mon profil » → « Supprimer mon compte ». Toutes vos données Firestore seront effacées.</li>
          <li><strong>Portabilité</strong> : exportez votre progression en JSON depuis « Mon profil ».</li>
          <li><strong>Opposition</strong> : cessez simplement d'utiliser le service en mode connecté — la désinscription supprime toute trace côté Firebase.</li>
        </ul>
        <p>Pour toute demande, contactez les auteurs via l'adresse mentionnée dans les Mentions légales. Le délai de réponse est de 30 jours (article 12 RGPD).</p>
      </Section>

      <Section title="Base légale (si le RGPD était applicable)">
        <p>Si l'on retenait malgré tout l'applicabilité du RGPD, les bases légales seraient :</p>
        <ul>
          <li><strong>Exécution du service</strong> (art. 6 (1) b) : authentification, synchronisation de la progression ;</li>
          <li><strong>Consentement</strong> (art. 6 (1) a) : création de compte — explicitement recueilli lors de l'inscription via la case à cocher.</li>
        </ul>
      </Section>

    </Article>
  );
}

// (Conservée en commentaire pour référence : version étendue style CNIL.)
function PrivacyPolicy_legacy_unused() {
  return (
    <Article title="Données personnelles — Green IT Académie" updated="Dernière mise à jour : mai 2026">
      <Section title="En résumé">
        <Highlight>Green IT Académie est une application pédagogique qui fonctionne <strong>entièrement dans votre navigateur</strong>, sans serveur ni base de données distante. Aucune donnée n'est transmise aux auteurs. Les rares informations stockées (compte facultatif, progression) restent <strong>localement</strong> sur votre terminal.</Highlight>
      </Section>

      <Section title="A — Statut du traitement et applicabilité du RGPD">
        <p>L'application est éditée dans un cadre strictement pédagogique par deux étudiants (cf. « Mentions légales »), sans finalité commerciale ni structure juridique propre.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>1 — Sommes-nous responsables de traitement ?</p>
        <p>Au sens de l'article 4 (7) du RGPD, le responsable du traitement est la personne qui <em>« détermine les finalités et les moyens du traitement »</em>. En l'espèce, la question est délicate :</p>
        <ul>
          <li>Nous avons effectivement défini les <em>moyens techniques</em> du traitement (mécanisme d'authentification, format de stockage, durée de conservation des sessions, etc.) ;</li>
          <li>Mais nous n'avons <em>aucun accès aux données</em> : elles ne sortent jamais du terminal de l'utilisateur. Aucune copie, aucun journal, aucune télémétrie n'est transmise aux éditeurs.</li>
        </ul>
        <p>La jurisprudence européenne (arrêts <em>Wirtschaftsakademie</em> C-210/16, <em>Fashion ID</em> C-40/17) admet qu'une entité puisse être qualifiée de responsable de traitement même sans accès aux données. Dans le doute, et par mesure de transparence pédagogique, <strong>nous appliquons volontairement le cadre du RGPD</strong> comme si nous étions responsables de traitement.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>2 — Le RGPD s'applique-t-il matériellement ?</p>
        <p>L'article 2 (1) du RGPD le rend applicable à tout traitement automatisé de données à caractère personnel. L'article 2 (2) (c) exclut toutefois les traitements effectués <em>« par une personne physique dans le cadre d'une activité strictement personnelle ou domestique »</em>. Lorsque vous utilisez cette application sur votre propre terminal sans interaction avec un tiers, vous pouvez vous-même être considéré comme effectuant un traitement à des fins purement personnelles, et donc hors champ.</p>
        <p>Quoi qu'il en soit, nous estimons que la <strong>meilleure pratique</strong> est de fournir une information complète et transparente sur les opérations effectuées par l'application, ce qui fait l'objet du présent document.</p>
      </Section>

      <Section title="B — Objet du traitement">
        <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>1 — Finalités</p>
        <p>Le traitement de données mis en œuvre par l'application a pour objet :</p>
        <ul>
          <li>de permettre la <strong>création d'un compte facultatif</strong> et l'authentification de son titulaire ;</li>
          <li>d'<strong>enregistrer la progression pédagogique</strong> (modules ouverts, scores obtenus, temps passé) afin de la restituer lors des sessions suivantes ;</li>
          <li>d'<strong>autoriser le suivi multi-appareils</strong> via une fonction d'export/import manuel de la progression ;</li>
          <li>de <strong>délivrer une attestation de réussite</strong> aux utilisateurs ayant atteint le seuil de validation des modules.</li>
        </ul>
        <p>L'application ne met en œuvre aucune autre finalité (pas de profilage, pas de publicité, pas de mesure d'audience, pas de communication marketing).</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>2 — Base légale</p>
        <p>Lorsque le RGPD est applicable, les bases légales mobilisées sont :</p>
        <ul>
          <li><strong>L'exécution du service</strong> (article 6 (1) b RGPD) pour les opérations indispensables (authentification, conservation de la progression) ;</li>
          <li><strong>Le consentement</strong> (article 6 (1) a RGPD) recueilli explicitement à la création du compte pour le traitement des données d'identification facultatives (nom affiché).</li>
        </ul>
      </Section>

      <Section title="C — Données traitées">
        <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>1 — Catégories de données</p>
        <table style={tableStyle}>
          <thead><tr><th style={th}>Donnée</th><th style={th}>Finalité</th><th style={th}>Conservation</th></tr></thead>
          <tbody>
            <tr><td style={td}>Adresse e-mail</td><td style={td}>Identifiant unique du compte</td><td style={td}>Jusqu'à suppression par l'utilisateur</td></tr>
            <tr><td style={td}>Nom affiché (facultatif)</td><td style={td}>Personnalisation de l'interface</td><td style={td}>Jusqu'à suppression</td></tr>
            <tr><td style={td}>Hash PBKDF2 du mot de passe + sel + nombre d'itérations</td><td style={td}>Authentification sécurisée</td><td style={td}>Jusqu'à suppression</td></tr>
            <tr><td style={td}>Progression pédagogique (modules ouverts, scores, temps passé)</td><td style={td}>Suivi du parcours apprenant</td><td style={td}>Jusqu'à réinitialisation ou suppression du compte</td></tr>
            <tr><td style={td}>Token de session aléatoire (256 bits) + horodatage d'expiration</td><td style={td}>Maintien de la connexion</td><td style={td}>12 h maximum, effacé à la fermeture de l'onglet</td></tr>
          </tbody>
        </table>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>2 — Sources des données</p>
        <p>Toutes les données sont collectées directement auprès de l'utilisateur via les formulaires d'inscription et de connexion. Aucune source tierce n'est utilisée.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>3 — Caractère obligatoire</p>
        <p>L'utilisation de l'application <strong>ne requiert aucune donnée personnelle</strong>. Une option « Continuer sans compte » est mise en avant sur la page d'accueil et permet d'accéder à l'intégralité du parcours sans la moindre saisie. La création d'un compte n'est utile que pour retrouver sa progression sur plusieurs appareils.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>4 — Prise de décision automatisée</p>
        <p>Le traitement <strong>ne prévoit aucune prise de décision entièrement automatisée</strong> au sens de l'article 22 du RGPD.</p>
      </Section>

      <Section title="D — Personnes concernées">
        <p>Le traitement concerne exclusivement les personnes qui choisissent de créer un compte ou de poursuivre leur progression dans l'application. Aucun tiers (apprenant, employeur, organisme tiers) n'a accès aux données saisies.</p>
      </Section>

      <Section title="E — Destinataires des données">
        <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>1 — Catégories de destinataires</p>
        <p>Compte tenu de l'architecture exclusivement locale, <strong>aucun destinataire externe</strong> n'a accès aux données saisies dans l'application. Les éditeurs eux-mêmes n'y ont pas accès. Aucun sous-traitant n'est mobilisé pour le traitement.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>2 — Transferts hors UE</p>
        <p>Aucun transfert de données vers un pays tiers ou une organisation internationale n'est réalisé.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>3 — Durée de conservation</p>
        <p>Les données sont conservées tant que l'utilisateur en conserve le bénéfice (compte actif, progression non réinitialisée). Lorsque l'utilisateur vide le stockage de son navigateur, désinstalle la PWA ou utilise les fonctions « Réinitialiser ma progression » et « Supprimer mon compte », les données sont effacées <strong>immédiatement et définitivement</strong>. Aucune sauvegarde n'est conservée par les éditeurs.</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>4 — Sécurité</p>
        <p>Bien que les données ne quittent pas le terminal, des mesures de sécurité robustes sont mises en œuvre :</p>
        <ul>
          <li>Mot de passe jamais stocké en clair — seulement son hash PBKDF2-HMAC-SHA-256 calculé sur <strong>600 000 itérations</strong> (recommandation OWASP, Password Storage Cheat Sheet 2023), avec un sel aléatoire de 16 octets propre à chaque compte ;</li>
          <li>Comparaison des hashs à temps constant pour résister aux attaques temporelles ;</li>
          <li>Token de session de 256 bits généré via le CSPRNG du navigateur (<code>crypto.getRandomValues</code>) avec expiration de 12 heures ;</li>
          <li>Aucune librairie tierce d'authentification : minimisation de la surface d'attaque ;</li>
          <li>Conformité aux principes de l'article 32 du RGPD et de la norme NIST SP 800-63B.</li>
        </ul>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>5 — Vos droits</p>
        <p>Vous disposez à tout moment des droits prévus par les articles 15 à 22 du RGPD :</p>
        <ul>
          <li><strong>Accès</strong> et copie : la rubrique « Mon profil » affiche les données enregistrées ; vous pouvez les exporter au format JSON.</li>
          <li><strong>Rectification</strong> : nom et mot de passe modifiables depuis le profil.</li>
          <li><strong>Effacement</strong> : boutons « Réinitialiser ma progression » et « Supprimer mon compte » dans le profil. Effet immédiat et définitif.</li>
          <li><strong>Portabilité</strong> : export de la progression au format SCORM ou JSON.</li>
          <li><strong>Opposition</strong> et <strong>limitation</strong> : effaçables à tout moment en vidant le stockage du navigateur.</li>
        </ul>
        <p>Compte tenu de l'architecture, ces droits s'exercent <strong>directement depuis l'application</strong>, sans avoir à formuler de demande externe. En cas de difficulté, vous pouvez nous contacter à l'adresse <a href="mailto:greenit-academie@example.lu" style={linkInline}>greenit-academie@example.lu</a> et, à défaut de réponse satisfaisante, introduire une réclamation auprès de la <strong>CNPD</strong> (<a href="https://cnpd.public.lu" target="_blank" rel="noreferrer" style={linkInline}>cnpd.public.lu</a>).</p>

        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px' }}>6 — Cookies</p>
        <p>Aucun cookie n'est déposé. Les seuls éléments enregistrés sur le terminal sont les espaces de stockage Web (<code>localStorage</code> et <code>sessionStorage</code>) strictement nécessaires au fonctionnement du service. À ce titre, ils relèvent de l'exemption prévue à l'article 5.3 de la directive 2002/58/CE et ne nécessitent pas de recueil de consentement préalable (voir l'onglet « Cookies & stockage local »).</p>
      </Section>

      <Section title="Modification de la politique">
        <p>La présente politique pourra être mise à jour pour refléter les évolutions du service ou du cadre légal. La date indiquée en haut de cette page correspond à la dernière révision.</p>
      </Section>
    </Article>
  );
}

// -----------------------------------------------------------------------------
// Cookies & stockage local
// -----------------------------------------------------------------------------
function CookiesPolicy() {
  return (
    <Article title="Cookies et stockage local" updated="Dernière mise à jour : mai 2026">
      <Section title="L'essentiel">
        <Highlight>Green IT Académie <strong>n'utilise aucun cookie</strong>. L'application stocke certaines informations dans le <code>localStorage</code> et le <code>sessionStorage</code> de votre navigateur, exclusivement à des fins techniques et de personnalisation. Aucune donnée n'est transmise à un tiers.</Highlight>
      </Section>

      <Section title="Qu'est-ce que le stockage local ?">
        <p>Le <strong>localStorage</strong> et le <strong>sessionStorage</strong> sont des mécanismes standard du navigateur (Web Storage API, norme W3C) qui permettent à un site de conserver de petites quantités d'information côté client. Contrairement aux cookies, ils ne sont jamais transmis automatiquement au serveur — ce qui en fait des moyens techniquement plus sûrs et plus sobres pour stocker des données qui doivent rester côté utilisateur.</p>
      </Section>

      <Section title="Inventaire détaillé">
        <table style={tableStyle}>
          <thead><tr><th style={th}>Clé</th><th style={th}>Type</th><th style={th}>Contenu</th><th style={th}>Durée</th><th style={th}>Finalité</th></tr></thead>
          <tbody>
            <tr><td style={td}><code>greenitacademie-progress</code></td><td style={td}>localStorage</td><td style={td}>Modules commencés, scores, temps passé</td><td style={td}>Persistant jusqu'à suppression</td><td style={td}>Suivi pédagogique personnel</td></tr>
            <tr><td style={td}><em>Cache PWA</em></td><td style={td}>Cache API (service worker)</td><td style={td}>Fichiers de l'application (HTML, JS, CSS, JSON, SVG)</td><td style={td}>Renouvelé à chaque mise à jour</td><td style={td}>Fonctionnement hors-ligne</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="Pourquoi pas de bannière « cookies » ?">
        <p>La directive « ePrivacy » (2002/58/CE) et son application luxembourgeoise imposent le recueil du consentement pour tout dépôt ou lecture d'information sur le terminal de l'utilisateur, <strong>à l'exception</strong> des traceurs « strictement nécessaires à la fourniture d'un service expressément demandé par l'utilisateur » (article 5.3, transposé). Les stockages listés ci-dessus relèvent tous de cette exemption : ils sont indispensables à l'exécution de la fonctionnalité demandée (s'authentifier, suivre son parcours, utiliser l'application hors-ligne). Aucune bannière de consentement n'est donc requise.</p>
      </Section>

      <Section title="Comment supprimer vos données ?">
        <p>Plusieurs options :</p>
        <ul>
          <li>Depuis l'application : rubrique <em>Mon profil</em> → bouton « Réinitialiser ma progression ».</li>
          <li>Depuis le navigateur : paramètres → confidentialité → effacer les données du site (cela supprime également le cache PWA).</li>
          <li>Pour les utilisateurs avancés : ouvrez la console développeur (F12), onglet « Application » ou « Stockage », et supprimez les clés concernées.</li>
        </ul>
      </Section>

      <Section title="Pour aller plus loin">
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
    <Article title="Éco-conception de l'application" updated="Dernière mise à jour : mai 2026">
      <Section title="Préambule">
        <Highlight>
          Le contenu pédagogique de Green IT Académie porte sur l'éco-conception et la sobriété numérique. La cohérence imposait que l'application elle-même applique ces principes. Cette page documente les choix techniques retenus, leurs effets mesurables, et les limites qui subsistent.
        </Highlight>
      </Section>

      <Section title="1. Architecture sans serveur ni base de données">
        <p>L'application est une <strong>Progressive Web App (PWA)</strong> dont l'intégralité du code et des données s'exécute dans le navigateur de l'utilisateur. Aucun serveur applicatif n'est interrogé, aucune base de données n'est mobilisée, aucune requête réseau n'est émise vers les éditeurs après le chargement initial.</p>
        <p>L'impact direct est la suppression du poste « datacenter » dans le bilan d'une session utilisateur. À titre indicatif, une visite sur un site contemporain déclenche couramment 60 à 100 requêtes HTTP additionnelles à destination de tiers (mesure d'audience, polices, scripts publicitaires, chat support, etc.) ; ce nombre est ramené à zéro ici, hors chargement initial.</p>
      </Section>

      <Section title="2. Absence de traceurs et de tiers">
        <p>Aucun script tiers n'est intégré (Google Analytics, Tag Manager, pixels marketing, services de cartographie, CDN externes…). Cette décision produit deux effets convergents :</p>
        <ul>
          <li><strong>Réduction de l'empreinte réseau</strong> : aucune connexion sortante n'est ouverte pour transmettre de la télémétrie ;</li>
          <li><strong>Conformité <em>privacy by design</em></strong> : aucune donnée personnelle n'est transmise à des tiers (cf. politique « Données personnelles »).</li>
        </ul>
      </Section>

      <Section title="3. Schémas vectoriels intégrés (SVG inline)">
        <p>Les 14 schémas pédagogiques du parcours (pyramide des instruments, cycle ACV, échelle PUE, frise du Green Deal, etc.) sont définis sous forme de <strong>SVG inline</strong>, embarqués directement dans le code source. Ils s'affichent sans requête HTTP supplémentaire et restent nets à toute résolution.</p>
        <p>Une comparaison synthétique : une image bitmap haute résolution équivalente pèse en moyenne 200 à 500 Ko ; les 14 schémas SVG inline représentent ensemble moins de 30 Ko, soit une réduction de poids de l'ordre de 90 %.</p>
      </Section>

      <Section title="4. Polices système, absence de webfont">
        <p>L'application s'appuie sur la <strong>police système</strong> du terminal (San Francisco sur macOS et iOS, Segoe UI sur Windows, Roboto sur Android, polices par défaut sur Linux). Aucune webfont externe n'est téléchargée.</p>
        <p>Une webfont standard (Google Fonts, Adobe Fonts) pèse typiquement entre 100 et 300 Ko et exige plusieurs requêtes réseau supplémentaires. Cette dépendance est ici entièrement évitée.</p>
      </Section>

      <Section title="5. Dépendances limitées au strict nécessaire">
        <p>Trois dépendances seulement sont mobilisées : <code>react</code> et <code>react-dom</code> pour l'interface, <code>jszip</code> pour la génération du package SCORM. Aucun framework UI (Material UI, Ant Design, Bootstrap), aucune bibliothèque d'animation, aucun moteur d'icônes externe — les pictogrammes utilisés sont des emojis Unicode déjà présents dans le système.</p>
        <p>Le bundle JavaScript distribué pèse approximativement <strong>150 Ko gzippé</strong>, à comparer à 500 Ko – 2 Mo couramment observés sur une application React moyenne.</p>
      </Section>

      <Section title="6. Fonctionnement hors-ligne via service worker">
        <p>Un service worker met en cache l'intégralité de l'application au premier chargement. Les visites suivantes s'exécutent sans connexion réseau et ne re-téléchargent pas les ressources statiques tant qu'une nouvelle version n'est pas publiée.</p>
      </Section>

      <Section title="7. Codebase unique web et mobile">
        <p>L'application fonctionne à l'identique sur ordinateur, tablette et smartphone à partir d'un <strong>codebase unique</strong>. Aucune version native Android ou iOS distincte n'est maintenue : la maintenance, la duplication de code et le passage par les magasins d'applications sont entièrement évités.</p>
      </Section>

      <Section title="8. Hébergement statique">
        <p>Lorsque l'application est publiée pour démonstration, elle est servie par un hébergeur de pages statiques (GitHub Pages, Vercel, Netlify) couplé à une distribution CDN. Aucun traitement applicatif n'est exécuté côté serveur pour servir une visite, ce qui correspond à l'un des modèles d'hébergement les moins énergivores disponibles aujourd'hui.</p>
      </Section>

      <Section title="9. Mode sombre par défaut respecté">
        <p>Sur les écrans OLED — désormais majoritaires sur smartphones et présents sur de nombreux ordinateurs portables — l'affichage de pixels noirs consomme nettement moins d'énergie que l'affichage de pixels blancs. Les études disponibles font état d'une économie pouvant atteindre 30 % pour l'affichage en mode sombre sur ces dalles.</p>
        <p>L'application propose un <strong>thème sombre commutable</strong> via le bouton 🌙 / ☀️ présent dans le footer. La préférence système de l'utilisateur (<code>prefers-color-scheme</code>) est respectée par défaut au premier chargement, et le choix manuel est ensuite mémorisé en <code>localStorage</code>. La bascule s'opère sans rechargement de page grâce à un système de variables CSS appliquées au niveau de l'élément racine.</p>
      </Section>

      <Section title="Limites et arbitrages assumés">
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

      <Section title="Interopérabilité : export SCORM 1.2">
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

      <Section title="Réutilisabilité : un parcours servant de gabarit">
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
    <Article title="Accessibilité" updated="Dernière mise à jour : mai 2026">
      <Section title="Préambule">
        <Highlight>
          L'accessibilité numérique est une composante intrinsèque du numérique responsable. Un outil pédagogique qui exclut une partie de ses utilisateurs ne peut prétendre relever de cette catégorie. Cette page documente les dispositions effectivement mises en œuvre, les limites qui subsistent et les arbitrages associés.
        </Highlight>
      </Section>

      <Section title="Référentiel suivi">
        <p>L'application vise le respect du référentiel <strong>WCAG 2.1 niveau AA</strong> du W3C. Au Luxembourg, la <strong>loi du 28 mai 2019</strong> sur l'accessibilité des sites internet et applications mobiles des organismes du secteur public transpose la directive (UE) 2016/2102, qui s'appuie elle-même sur la norme européenne <strong>EN 301 549</strong> reprenant les critères WCAG. La vérification de conformité relève au Luxembourg du <strong>Service Information et Presse (SIP)</strong>.</p>
      </Section>

      <Section title="Dispositions mises en œuvre">
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

      <Section title="Limites et arbitrages assumés">
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

      <Section title="Signalement d'un défaut d'accessibilité">
        <p>Toute difficulté d'accès rencontrée peut être signalée en ouvrant une <em>issue</em> sur le dépôt source du projet. La résolution sera traitée prioritairement.</p>
      </Section>
    </Article>
  );
}

// -----------------------------------------------------------------------------
// Petits composants utilitaires
// -----------------------------------------------------------------------------
function Article({ title, updated, children }) {
  return (
    <article style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '10px', padding: '32px 36px', border: '1px solid var(--border)' }}>
      <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', margin: '0 0 4px 0', fontWeight: '700' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 24px 0' }}>{updated}</p>
      <div style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.75', textAlign: 'justify', hyphens: 'auto' }}>{children}</div>
    </article>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 10px 0', fontWeight: '700', paddingBottom: '6px', borderBottom: '1px solid var(--border-soft)' }}>{title}</h2>
      {children}
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
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px', marginBottom: '10px', fontSize: '13px' };
const th = { textAlign: 'left', padding: '8px 10px', backgroundColor: 'var(--bg-page)', color: 'var(--text-secondary)', borderBottom: '2px solid #e2e8f0', fontWeight: '700' };
const td = { padding: '8px 10px', borderBottom: '1px solid var(--border-soft)', color: 'var(--text-primary)', verticalAlign: 'top' };

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
    <Article title="Plan du site" updated="">
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
