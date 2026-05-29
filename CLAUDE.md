# CLAUDE.md — Green IT Académie

Contexte projet pour reprendre rapidement une session. À lire en premier.

## Le projet

Application pédagogique **Green IT Académie** : parcours de formation sur les
**normes, labels et certifications du Green IT** (cadre réglementaire UE et
luxembourgeois). Projet tutoré UE LUPT01 — **Master Data Science de l'UTBM**,
binôme de deux étudiants (les noms n'apparaissent PAS dans l'app, uniquement
« deux étudiants en Master Data Science de l'UTBM » dans les mentions légales).

- **Repo** : https://github.com/zharchay-afk/GreenITAcademy
- **Branche par défaut** : `master`
- **Déploiement** : GitHub Pages, base path `/GreenITAcademy/`
- **URL locale** : `http://localhost:5173/GreenITAcademy/` (⚠️ avec le base path)

## Stack

- **React 18 + Vite 7**, distribué en **PWA** (web + mobile, un seul codebase)
- **Pas de backend, pas de base de données** : tout est local (localStorage)
- Styles **inline** (objets JS), pas de framework CSS
- Contenu pédagogique dans `data/modules.json` + `data/questions.json`
- Export/import **SCORM 1.2** (JSZip)

## Commandes

```bash
npm install
npm run dev      # http://localhost:5173/GreenITAcademy/
npm run build
```

## Architecture (fichiers clés)

```
App.jsx                       # Routeur principal + routage par hash URL
GreenIT_Academie_Final.jsx    # Dashboard « Mes modules »
src/
  LandingPage.jsx             # Page de présentation (3 sections : Accueil / Intérêt / Programme)
  Sidebar.jsx                 # Sidebar partagée, repliable (collapse persistant localStorage)
  Logo.jsx                    # Logo SVG (3 feuilles à 120°) — réutilisé partout
  Footer.jsx                  # Footer partagé (liens légaux + sélecteur de thème)
  ThemeSelector.jsx           # Sélecteur clair/sombre déroulant
  theme.js                    # Hook useTheme + setTheme/toggleTheme (attribut data-theme)
  CourseReader.jsx            # Lecteur de cours (sidebar contextuelle = liste des sections)
  QuizScreen.jsx              # Quiz adaptatif (difficulté ajustée aux réponses)
  AttestationPage.jsx         # Attestation (délivrée si 6/6 modules ≥ 70 %)
  ProfilePage.jsx             # Profil + export/import progression JSON
  ReferencesPage.jsx          # Bibliographie (liens hypertextes)
  LegalPages.jsx              # « Informations du site » : 5 onglets
                              #   (mentions / données / cookies / éco-conception / accessibilité)
  Visuals.jsx                 # 14 schémas SVG/HTML inline
  utils/scormExport.js, scormImport.js
data/modules.json             # 6 modules, contenu pédagogique
data/questions.json           # ~98 questions, 3 niveaux (debutant/intermediaire/avance)
public/{manifest.webmanifest, sw.js, icon.svg}
REUSE.md                      # Guide pour réutiliser le gabarit pour une autre formation
```

## Conventions et décisions importantes

### Thème clair / sombre
- Variables CSS définies dans `index.html` (`:root` et `html[data-theme="dark"]`)
- Couleurs principales via `var(--bg-page)`, `var(--bg-surface)`, `var(--text-primary)`,
  `var(--text-secondary)`, `var(--border)`, `var(--accent)`, `var(--brand)`,
  `var(--sidebar-bg)`, `var(--sidebar-active)`, `var(--on-brand)`
- **Mode clair** : vert `#15803d` = identité (sidebar, boutons, accents)
- **Mode sombre** : volontairement **neutre slate** ; le vert est quasi absent,
  réservé au petit logo et à de discrets accents sage (`#74b893`). Ne PAS
  réintroduire du vert vif en sombre.
- Toujours utiliser les variables CSS pour les nouvelles surfaces, jamais de
  couleurs hardcodées clair-only.

### Service worker (PWA)
- `public/sw.js` met en cache cache-first. **Il ne s'enregistre QU'EN PRODUCTION.**
- En dev (localhost), `index.html` le désinscrit et vide les caches → sinon il
  court-circuite le HMR de Vite (« rien ne change » en local).
- Après un déploiement, bumper `CACHE_VERSION` dans `sw.js` pour purger l'ancien cache.

### Routage
- Routage par **hash URL** dans `App.jsx` (`#home`, `#module/3`, `#quiz/3`,
  `#legal/notice`, etc.). `buildHash` / `parseHash` + écoute `popstate`.
- Le bouton Précédent du navigateur fonctionne ; liens partageables.

### Palette des modules (cohérente partout)
Pastels avec accent coloré sur fond clair (pas de gros bandeaux colorés) :
```
1 bleu (#0ea5e9/#e0f2fe)  2 ambre (#f59e0b/#fef3c7)  3 vert (#10b981/#d1fae5)
4 violet (#8b5cf6/#ede9fe) 5 rouge (#ef4444/#fee2e2)  6 teal (#14b8a6/#ccfbf1)
```
En sombre, fonds d'icônes neutralisés en `rgba(255,255,255,0.06)`.

### Pédagogie / contenu
- Durées réalistes : ~38 min au total (pas 3 h).
- Attestation délivrée uniquement si **les 6 modules** sont validés (score ≥ 70 %).
- Quiz **adaptatif** : monte d'un niveau si bonne réponse, descend sinon ;
  score pondéré par difficulté.
- Textes en français ; justification des paragraphes longs (`text-align: justify`).
- Pas de référence « France/RGAA » côté accessibilité : contexte luxembourgeois
  (loi du 28 mai 2019, directive UE 2016/2102, EN 301 549, SIP).
- RGPD : page « Données personnelles » explique qu'il **ne s'applique pas**
  (architecture 100 % locale, aucun accès des auteurs aux données).

## ⚠️ Workflow Git — IMPORTANT (éviter le « ping-pong PR »)

Le déploiement écoute `master`. Les changements arrivent en ligne **uniquement
après merge d'une PR**. Règle apprise à la dure :

> **Toujours merger la PR en cours AVANT de pousser un nouveau commit.**
> Si on pousse un commit après qu'une PR a été mergée, il reste « en plan » sur
> la branche fermée → il faut recréer une branche depuis `master`.

Procédure type pour une nouvelle série de changements :
```bash
git fetch origin master
git checkout -b feat/ma-fonctionnalite origin/master
# ... modifs ...
git add -A && git commit -m "..."
git push -u origin feat/ma-fonctionnalite
# créer la PR, puis la MERGER sur GitHub avant de repartir
```

Les PRs ont été créées via l'API GitHub (le token est dans le credential helper
Git). `gh` CLI n'est pas installé. Le compte GitHub est `zharchay-afk` ; un
`git config --global credential.https://github.com.username zharchay-afk` a été
nécessaire pour pousser.

## État au moment de la rédaction

- PR #11 (neutralisation du vert en sombre) : **à merger** si pas déjà fait.
- Fonctionnalités en place : landing 3 sections, dashboard, lecteur de cours,
  quiz adaptatif, attestation, profil + export/import, références, pages légales
  (5 onglets), mode sombre neutre, sidebar repliable, routage URL, PWA, SCORM.

## Pistes d'évolution (mentionnées comme perspectives, non implémentées)
- Éditeur no-code pour adapter le contenu sans toucher au JSON (cf. discussions ;
  Option 1 « édition inline » = sweet spot, Option 3 « plateforme type SharePoint »
  = projet à part entière).
- Lazy-loading des modules, compression Brotli (gérée par l'hébergeur), audit
  d'accessibilité professionnel, tests lecteurs d'écran.
