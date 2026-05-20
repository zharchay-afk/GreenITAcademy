import React from 'react';

// Page-wrapper et tabs
export default function LegalPages({ initial = 'notice', onBack }) {
  const [current, setCurrent] = React.useState(initial);

  React.useEffect(() => { setCurrent(initial); }, [initial]);

  const Pane = { notice: LegalNotice, privacy: PrivacyShort, cookies: CookiesPolicy }[current];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ backgroundColor: '#064e3b', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#15803d', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📋</div>
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Informations légales</span>
        </div>
        <button onClick={onBack} style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.85)', padding: '6px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>← Retour</button>
      </header>

      {/* Tabs */}
      <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', gap: '4px' }}>
        {[
          { id: 'notice',  label: 'Mentions légales' },
          { id: 'privacy', label: 'Données personnelles' },
          { id: 'cookies', label: 'Cookies & stockage local' },
        ].map((t) => (
          <button key={t.id} onClick={() => setCurrent(t.id)} style={{
            padding: '14px 18px', backgroundColor: 'transparent', border: 'none',
            borderBottom: current === t.id ? '3px solid #166534' : '3px solid transparent',
            color: current === t.id ? '#166534' : '#64748b',
            fontWeight: current === t.id ? '700' : '500',
            cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
          }}>{t.label}</button>
        ))}
      </nav>

      <main style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 24px 60px' }}>
        <Pane />
      </main>
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
        <p>L'application est distribuée sous forme de <strong>Progressive Web App</strong> exécutée intégralement dans le navigateur de l'utilisateur. Aucun serveur applicatif n'est mobilisé, aucune base de données n'est interrogée. Lorsqu'elle est mise en ligne pour démonstration, l'hébergement est assuré par un service de pages statiques (GitHub&nbsp;Pages, Vercel ou équivalent), sans capacité de traitement de données personnelles côté serveur.</p>
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
// Politique de confidentialité (RGPD)
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Politique de confidentialité — version concise (RGPD non-applicable)
// -----------------------------------------------------------------------------
function PrivacyShort() {
  return (
    <Article title="Données personnelles" updated="Dernière mise à jour : mai 2026">
      <Section title="L'essentiel">
        <Highlight>
          <strong>Le RGPD ne s'applique pas à ce service.</strong> Green IT Académie est une application 100 % locale : aucune donnée ne quitte votre terminal. Les auteurs n'ont pas accès aux informations que vous saisissez et n'effectuent aucun traitement de données personnelles.
        </Highlight>
      </Section>

      <Section title="Pourquoi le RGPD ne s'applique pas ici ?">
        <p>Le RGPD (Règlement (UE) 2016/679) encadre les traitements de données personnelles effectués par un responsable de traitement. Or, dans le cas présent :</p>
        <ul>
          <li>L'application s'exécute <strong>intégralement dans votre navigateur</strong>. Aucun serveur, aucune base de données distante, aucun service tiers n'est mobilisé.</li>
          <li>Les auteurs n'ont <strong>aucun accès aux données</strong> que vous saisissez (progression dans les modules, scores, temps passé). Ces informations ne sont jamais transmises et n'existent que sur votre terminal.</li>
          <li>Aucune collecte n'a lieu côté éditeur : ni télémétrie, ni analytics, ni journalisation, ni cookie de mesure d'audience.</li>
        </ul>
        <p>Lorsque vous utilisez l'application, vous traitez vos propres données dans votre propre environnement — ce qui correspond typiquement à l'exemption « activité strictement personnelle ou domestique » prévue à l'article 2 (2) c du RGPD pour l'utilisateur, et qui ne fait pas des auteurs des responsables de traitement au sens de l'article 4 (7) faute d'accès et de finalité propres.</p>
      </Section>

      <Section title="Ce qui est stocké sur votre terminal">
        <p>L'application enregistre dans le <code>localStorage</code> de votre navigateur :</p>
        <ul>
          <li>la liste des modules que vous avez ouverts ;</li>
          <li>vos scores aux quiz ;</li>
          <li>le temps cumulé passé dans chaque module.</li>
        </ul>
        <p>Ces données restent uniquement chez vous. Vous pouvez à tout moment les effacer&nbsp;:</p>
        <ul>
          <li>depuis l'application — bouton <em>« Réinitialiser ma progression »</em> dans la rubrique « Mon profil » ;</li>
          <li>depuis votre navigateur — paramètres → confidentialité → effacer les données du site.</li>
        </ul>
      </Section>

      <Section title="Aucun transfert, aucun tiers">
        <p>Aucune donnée n'est transmise à un serveur, à un sous-traitant ou à un service tiers. L'application est conçue pour fonctionner totalement hors ligne après son chargement initial.</p>
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

        <p style={{ fontWeight: '600', color: '#0f172a' }}>1 — Sommes-nous responsables de traitement ?</p>
        <p>Au sens de l'article 4 (7) du RGPD, le responsable du traitement est la personne qui <em>« détermine les finalités et les moyens du traitement »</em>. En l'espèce, la question est délicate :</p>
        <ul>
          <li>Nous avons effectivement défini les <em>moyens techniques</em> du traitement (mécanisme d'authentification, format de stockage, durée de conservation des sessions, etc.) ;</li>
          <li>Mais nous n'avons <em>aucun accès aux données</em> : elles ne sortent jamais du terminal de l'utilisateur. Aucune copie, aucun journal, aucune télémétrie n'est transmise aux éditeurs.</li>
        </ul>
        <p>La jurisprudence européenne (arrêts <em>Wirtschaftsakademie</em> C-210/16, <em>Fashion ID</em> C-40/17) admet qu'une entité puisse être qualifiée de responsable de traitement même sans accès aux données. Dans le doute, et par mesure de transparence pédagogique, <strong>nous appliquons volontairement le cadre du RGPD</strong> comme si nous étions responsables de traitement.</p>

        <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>2 — Le RGPD s'applique-t-il matériellement ?</p>
        <p>L'article 2 (1) du RGPD le rend applicable à tout traitement automatisé de données à caractère personnel. L'article 2 (2) (c) exclut toutefois les traitements effectués <em>« par une personne physique dans le cadre d'une activité strictement personnelle ou domestique »</em>. Lorsque vous utilisez cette application sur votre propre terminal sans interaction avec un tiers, vous pouvez vous-même être considéré comme effectuant un traitement à des fins purement personnelles, et donc hors champ.</p>
        <p>Quoi qu'il en soit, nous estimons que la <strong>meilleure pratique</strong> est de fournir une information complète et transparente sur les opérations effectuées par l'application, ce qui fait l'objet du présent document.</p>
      </Section>

      <Section title="B — Objet du traitement">
        <p style={{ fontWeight: '600', color: '#0f172a' }}>1 — Finalités</p>
        <p>Le traitement de données mis en œuvre par l'application a pour objet :</p>
        <ul>
          <li>de permettre la <strong>création d'un compte facultatif</strong> et l'authentification de son titulaire ;</li>
          <li>d'<strong>enregistrer la progression pédagogique</strong> (modules ouverts, scores obtenus, temps passé) afin de la restituer lors des sessions suivantes ;</li>
          <li>d'<strong>autoriser le suivi multi-appareils</strong> via une fonction d'export/import manuel de la progression ;</li>
          <li>de <strong>délivrer une attestation de réussite</strong> aux utilisateurs ayant atteint le seuil de validation des modules.</li>
        </ul>
        <p>L'application ne met en œuvre aucune autre finalité (pas de profilage, pas de publicité, pas de mesure d'audience, pas de communication marketing).</p>

        <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>2 — Base légale</p>
        <p>Lorsque le RGPD est applicable, les bases légales mobilisées sont :</p>
        <ul>
          <li><strong>L'exécution du service</strong> (article 6 (1) b RGPD) pour les opérations indispensables (authentification, conservation de la progression) ;</li>
          <li><strong>Le consentement</strong> (article 6 (1) a RGPD) recueilli explicitement à la création du compte pour le traitement des données d'identification facultatives (nom affiché).</li>
        </ul>
      </Section>

      <Section title="C — Données traitées">
        <p style={{ fontWeight: '600', color: '#0f172a' }}>1 — Catégories de données</p>
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

        <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>2 — Sources des données</p>
        <p>Toutes les données sont collectées directement auprès de l'utilisateur via les formulaires d'inscription et de connexion. Aucune source tierce n'est utilisée.</p>

        <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>3 — Caractère obligatoire</p>
        <p>L'utilisation de l'application <strong>ne requiert aucune donnée personnelle</strong>. Une option « Continuer sans compte » est mise en avant sur la page d'accueil et permet d'accéder à l'intégralité du parcours sans la moindre saisie. La création d'un compte n'est utile que pour retrouver sa progression sur plusieurs appareils.</p>

        <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>4 — Prise de décision automatisée</p>
        <p>Le traitement <strong>ne prévoit aucune prise de décision entièrement automatisée</strong> au sens de l'article 22 du RGPD.</p>
      </Section>

      <Section title="D — Personnes concernées">
        <p>Le traitement concerne exclusivement les personnes qui choisissent de créer un compte ou de poursuivre leur progression dans l'application. Aucun tiers (apprenant, employeur, organisme tiers) n'a accès aux données saisies.</p>
      </Section>

      <Section title="E — Destinataires des données">
        <p style={{ fontWeight: '600', color: '#0f172a' }}>1 — Catégories de destinataires</p>
        <p>Compte tenu de l'architecture exclusivement locale, <strong>aucun destinataire externe</strong> n'a accès aux données saisies dans l'application. Les éditeurs eux-mêmes n'y ont pas accès. Aucun sous-traitant n'est mobilisé pour le traitement.</p>

        <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>2 — Transferts hors UE</p>
        <p>Aucun transfert de données vers un pays tiers ou une organisation internationale n'est réalisé.</p>

        <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>3 — Durée de conservation</p>
        <p>Les données sont conservées tant que l'utilisateur en conserve le bénéfice (compte actif, progression non réinitialisée). Lorsque l'utilisateur vide le stockage de son navigateur, désinstalle la PWA ou utilise les fonctions « Réinitialiser ma progression » et « Supprimer mon compte », les données sont effacées <strong>immédiatement et définitivement</strong>. Aucune sauvegarde n'est conservée par les éditeurs.</p>

        <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>4 — Sécurité</p>
        <p>Bien que les données ne quittent pas le terminal, des mesures de sécurité robustes sont mises en œuvre :</p>
        <ul>
          <li>Mot de passe jamais stocké en clair — seulement son hash PBKDF2-HMAC-SHA-256 calculé sur <strong>600 000 itérations</strong> (recommandation OWASP, Password Storage Cheat Sheet 2023), avec un sel aléatoire de 16 octets propre à chaque compte ;</li>
          <li>Comparaison des hashs à temps constant pour résister aux attaques temporelles ;</li>
          <li>Token de session de 256 bits généré via le CSPRNG du navigateur (<code>crypto.getRandomValues</code>) avec expiration de 12 heures ;</li>
          <li>Aucune librairie tierce d'authentification : minimisation de la surface d'attaque ;</li>
          <li>Conformité aux principes de l'article 32 du RGPD et de la norme NIST SP 800-63B.</li>
        </ul>

        <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>5 — Vos droits</p>
        <p>Vous disposez à tout moment des droits prévus par les articles 15 à 22 du RGPD :</p>
        <ul>
          <li><strong>Accès</strong> et copie : la rubrique « Mon profil » affiche les données enregistrées ; vous pouvez les exporter au format JSON.</li>
          <li><strong>Rectification</strong> : nom et mot de passe modifiables depuis le profil.</li>
          <li><strong>Effacement</strong> : boutons « Réinitialiser ma progression » et « Supprimer mon compte » dans le profil. Effet immédiat et définitif.</li>
          <li><strong>Portabilité</strong> : export de la progression au format SCORM ou JSON.</li>
          <li><strong>Opposition</strong> et <strong>limitation</strong> : effaçables à tout moment en vidant le stockage du navigateur.</li>
        </ul>
        <p>Compte tenu de l'architecture, ces droits s'exercent <strong>directement depuis l'application</strong>, sans avoir à formuler de demande externe. En cas de difficulté, vous pouvez nous contacter à l'adresse <a href="mailto:greenit-academie@example.lu" style={linkInline}>greenit-academie@example.lu</a> et, à défaut de réponse satisfaisante, introduire une réclamation auprès de la <strong>CNPD</strong> (<a href="https://cnpd.public.lu" target="_blank" rel="noreferrer" style={linkInline}>cnpd.public.lu</a>).</p>

        <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>6 — Cookies</p>
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
        <p>Les principes appliqués ici (minimisation, locality first, privacy by design) sont l'application concrète d'enseignements du module 4 du parcours sur les labels et de l'unité 2 sur le cadre réglementaire européen. Une application Green IT bien conçue est aussi une application qui respecte la vie privée par construction.</p>
      </Section>
    </Article>
  );
}

// -----------------------------------------------------------------------------
// Petits composants utilitaires
// -----------------------------------------------------------------------------
function Article({ title, updated, children }) {
  return (
    <article style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '32px 36px', border: '1px solid #e2e8f0' }}>
      <h1 style={{ fontSize: '24px', color: '#0f172a', margin: '0 0 4px 0', fontWeight: '700' }}>{title}</h1>
      <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 24px 0' }}>{updated}</p>
      <div style={{ color: '#334155', fontSize: '14px', lineHeight: '1.75' }}>{children}</div>
    </article>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '15px', color: '#1e293b', margin: '0 0 10px 0', fontWeight: '700', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' }}>{title}</h2>
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
const th = { textAlign: 'left', padding: '8px 10px', backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0', fontWeight: '700' };
const td = { padding: '8px 10px', borderBottom: '1px solid #f1f5f9', color: '#334155', verticalAlign: 'top' };
