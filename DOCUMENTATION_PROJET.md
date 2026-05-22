# Documentation Projet — Green IT Académie

**UE LUPT01 — Projet Tutoré 2025-2026**
**Thème n°8 : Normes, Labels et Certifications Green IT**
**Binôme :** Charles DE MEDEIROS & Ziad HARCHAY
**Master Data Science — Université du Luxembourg**

---

## Sommaire

1. Présentation du projet
2. Architecture technique
3. Choix pédagogiques
4. Intégration des principes Green IT dans la conception
5. Quiz : conception et logique d'évaluation
6. Export SCORM et interopérabilité
7. Retour réflexif et perspectives
8. Bibliographie et références

---

## 1. Présentation du projet

### 1.1 Contexte et objectifs

Le projet **Green IT Académie** s'inscrit dans le cadre de l'UE LUPT01. Il consiste à concevoir une application pédagogique interactive, disponible en version web et mobile, couvrant le thème n°8 de la répartition proposée : **les normes, labels et certifications Green IT**.

L'application poursuit une **double finalité** :

- **Transmettre un savoir structuré** sur les instruments d'encadrement du Green IT (réglementation, normes, labels, codes de conduite) ;
- **Permettre une auto-évaluation** des connaissances grâce à un quiz aléatoire avec feedback contextualisé.

### 1.2 Public cible

L'application s'adresse en priorité :

- aux **étudiants** en informatique, data science, droit du numérique ou développement durable ;
- aux **professionnels** souhaitant se former aux exigences ESG appliquées au numérique (DPO, RSSI, responsables RSE) ;
- aux **organisations** souhaitant intégrer le module dans leur LMS (Moodle, Canvas) via l'export SCORM.

### 1.3 Périmètre fonctionnel

L'application est structurée autour de **6 modules pédagogiques progressifs** :

| Module | Titre | Durée estimée |
|--------|-------|---------------|
| 1 | Cadres conceptuels et typologie des instruments | 25 min |
| 2 | Cadre réglementaire européen et luxembourgeois | 30 min |
| 3 | Normes et certifications ISO | 25 min |
| 4 | Labels environnementaux IT | 20 min |
| 5 | Codes de conduite et chartes | 20 min |
| 6 | Cas pratiques Luxembourg | 25 min |

Chaque module comporte :

- Un **cours structuré** en sections (lecture progressive)
- Des **points clés** mis en évidence
- Un **quiz d'auto-évaluation** avec questions de 3 niveaux de difficulté
- Une **attestation** délivrée si le score est supérieur ou égal à 70 %

---

## 2. Architecture technique

### 2.1 Stack technologique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Framework | React 18 | Mature, performant, large écosystème |
| Build / dev | Vite 7 | Build ultra-rapide, bundle minimal, HMR efficace |
| Distribution | **Progressive Web App (PWA)** | Une seule base de code, installable sur web, iOS et Android |
| Service Worker | Manuel (sans Workbox) | Mode hors-ligne, mise en cache des assets, sans dépendance lourde |
| Stockage local | `localStorage` | Persistance de la progression, zéro backend, zéro serveur à alimenter |
| Export | JSZip + format SCORM 1.2 | Standard d'interopérabilité reconnu par les LMS |
| Style | Inline (style objects) | Évite l'overhead d'un framework type Tailwind/Bootstrap |

### 2.2 Stratégie web ET mobile : la PWA

L'exigence du cahier des charges est une application disponible « à la fois en version web et en version mobile (iOS et Android) ». Plutôt que de maintenir **deux codebases distinctes** (React Native d'une part, React Web d'autre part), nous avons fait le choix d'une **Progressive Web App**.

Une PWA est un site web qui, grâce à trois éléments standards, se comporte comme une application native :

1. Un **manifeste** (`manifest.webmanifest`) décrivant l'application (nom, icônes, couleurs, orientation, mode d'affichage) ;
2. Un **service worker** (`sw.js`) qui met en cache les ressources et permet le fonctionnement **hors-ligne** ;
3. Des **meta tags** dédiés (iOS, Android, Windows) pour adapter l'expérience à chaque plateforme.

L'utilisateur peut alors **installer l'application** depuis le navigateur (« Ajouter à l'écran d'accueil » sur iOS, « Installer l'application » sur Chrome Android) — elle apparaît avec son icône, démarre en plein écran sans barre d'URL, fonctionne sans connexion, et offre une expérience équivalente à une application native.

**Pourquoi pas React Native ?** L'écosystème React Native impose en pratique une codebase distincte (composants `<View>` / `<Text>` au lieu de `<div>` / `<span>`, navigation séparée, gestion des styles différente). Cela double le travail de maintenance, alourdit l'infrastructure de build, et impose des stores d'applications (Apple App Store, Google Play) avec leurs coûts et délais de validation. Pour un parcours pédagogique éco-conçu, la PWA est nettement plus alignée avec les principes Green IT : **un seul build, distribution directe, mise à jour instantanée**.

### 2.3 Structure du projet

```
GreenITAcademy/
├── index.html                  # Hôte HTML + meta PWA + enregistrement SW
├── App.jsx                     # Routeur principal
├── GreenIT_Academie_Final.jsx  # Écran d'accueil avec grille de modules
├── public/                     # Assets servis tels quels
│   ├── manifest.webmanifest    # Manifeste PWA
│   ├── sw.js                   # Service worker (hors-ligne)
│   └── icon.svg                # Icône installable (vectorielle, < 1 Ko)
├── src/
│   ├── main.jsx                # Bootstrap React
│   ├── CourseReader.jsx        # Lecteur de cours par module
│   ├── QuizScreen.jsx          # Quiz adaptatif (difficulté ajustée)
│   ├── Visuals.jsx             # Bibliothèque de 14 schémas SVG inline
│   ├── AttestationPage.jsx     # Attestation de réussite
│   ├── ProfilePage.jsx         # Suivi de progression
│   ├── ReferencesPage.jsx      # Bibliographie complète
│   ├── ScormPlayer.jsx         # Lecteur SCORM importé
│   └── utils/
│       ├── scormExport.js      # Génération du package SCORM
│       └── scormImport.js      # Lecture d'un package SCORM
├── data/
│   ├── modules.json            # 6 modules, contenu pédagogique
│   └── questions.json          # Base de 98 questions du quiz
└── package.json
```

### 2.4 Justification des choix techniques au regard du Green IT

| Choix | Impact environnemental |
|-------|------------------------|
| **Pas de backend** | Aucun serveur à maintenir, à climatiser ou à alimenter |
| **Stockage local** | Aucune transmission de données utilisateur sur le réseau |
| **Bundle Vite optimisé** | Tree-shaking automatique, code non utilisé éliminé |
| **Émojis natifs au lieu d'images** | Aucune image bitmap à télécharger (gain de bande passante) |
| **Pas de framework CSS lourd** | Réduction du poids final de l'application |
| **Police système** | Pas de téléchargement de webfont (économie réseau) |

---

## 3. Choix pédagogiques

### 3.1 Approche pédagogique : progression structurée

Le contenu est découpé en **sections progressives** (cf. consigne du PDF), du général au particulier :

- **Module 1** → poser les concepts (qu'est-ce qu'une norme ? un label ? un code de conduite ?)
- **Modules 2 à 5** → entrer dans le détail de chaque famille d'instruments
- **Module 6** → application concrète au contexte luxembourgeois

Chaque section est constituée de :

1. Un **titre clair** (questionnement ou affirmation)
2. Un **paragraphe explicatif** de 80-150 mots (lecture rapide, mobile-friendly)
3. Des **points clés** sous forme de puces (mémorisation visuelle)

### 3.2 Découpage cours / quiz

Pour favoriser l'apprentissage actif :

- Le bouton **« S'évaluer »** d'un module reste **désactivé tant que le cours n'a pas été ouvert** : on impose la lecture avant l'évaluation.
- Le quiz peut être **rejoué autant de fois que souhaité** : la consigne de « possibilité de rejouer » est respectée.
- Après le quiz, l'utilisateur revient à l'accueil et peut **relire le cours** si son score est insuffisant.

### 3.3 Visuels et navigation

- **Style inspiré de SecNum Académie (ANSSI)** : référence connue dans le monde de la formation institutionnelle.
- **Codes couleurs cohérents par module** (vert, bleu, orange, violet…) pour faciliter le repérage.
- **Design épuré, sans surcharge graphique** : respecte la consigne de fluidité sur machines peu puissantes.

---

## 4. Intégration des principes Green IT dans la conception

L'application **incarne** les principes qu'elle enseigne. C'est une démarche pédagogique en soi : *« montrer plutôt que dire »*.

### 4.1 Sobriété numérique

- **Bundle minimal** : seuls React, React DOM, Expo runtime et JSZip sont importés.
- **Aucune dépendance superflue** : pas de framework UI (Material UI, Ant Design), pas de bibliothèque d'animation, pas de moteur d'icônes (utilisation d'émojis Unicode natifs).
- **Pas de tracking analytique** : aucune requête tierce, aucun cookie, aucune télémétrie.

### 4.2 Efficacité énergétique

- **Architecture 100 % statique** : pas de calcul serveur, pas de base de données interrogée.
- **Stockage local du progrès** : pas de synchronisation cloud répétée.
- **Images en émojis Unicode** : poids zéro côté réseau.

### 4.3 Pérennité et réutilisabilité

- **Technologies standards** : React, JSON, SCORM 1.2 — aucun lock-in à un éditeur propriétaire.
- **Export SCORM** : le contenu peut être réutilisé sans dépendre de notre application.
- **Données pédagogiques en JSON pur** : modifiables sans recompilation.

### 4.4 Accessibilité

- **Contrastes forts** (palette sombre/claire conforme aux recommandations WCAG AA).
- **Police système** : pas de webfont à télécharger, rendu instantané.
- **Compatible mobile et desktop** : un seul code base, accessible aux utilisateurs n'ayant qu'un smartphone.

---

## 5. Quiz : conception et logique d'évaluation

### 5.1 Base de questions

Le fichier `questions.json` contient une base de questions associées à chaque module. Chaque question comprend :

- Un énoncé clair
- 3 ou 4 propositions de réponse
- L'index de la bonne réponse
- Un **niveau de difficulté** (`debutant`, `intermediaire`, `avance`)
- Une **explication contextualisée** affichée après la réponse (favorise la mémorisation active)

### 5.2 Sélection aléatoire

À chaque lancement, les questions du module sont **mélangées via l'algorithme de Fisher-Yates**. Le quiz est donc différent à chaque tentative, ce qui :

- évite la mémorisation de l'ordre des réponses
- favorise la consolidation de la connaissance plutôt que la reconnaissance

### 5.3 Feedback immédiat

Après chaque réponse :

- La bonne réponse est colorée en vert, la mauvaise en rouge.
- Une **explication s'affiche systématiquement** (qu'on ait juste ou faux), conformément à la consigne de « feedback contextualisé ».
- L'utilisateur ne peut passer à la question suivante qu'après avoir lu le feedback.

### 5.4 Évaluation finale

- **Seuil de réussite : 70 %** (standard équivalent à celui de SecNum Académie).
- En cas d'échec : bouton **« Réessayer »** disponible immédiatement.
- En cas de réussite : module marqué comme validé, attestation accessible.

---

## 6. Export SCORM et interopérabilité

L'application propose un **export au format SCORM 1.2**, standard reconnu par les LMS institutionnels (Moodle, Canvas, Blackboard…).

### 6.1 Pourquoi SCORM ?

Le SCORM permet :

- D'**intégrer le cours dans un LMS existant** sans le réécrire.
- De **mutualiser les ressources pédagogiques** entre établissements (principe de réutilisabilité Green IT).
- De **suivre la progression et les scores** depuis le LMS.

### 6.2 Implémentation

- Génération côté client via JSZip (pas de backend nécessaire).
- Le package contient : `imsmanifest.xml`, le contenu HTML/JS standalone, et l'API SCORM JavaScript.
- L'application sait aussi **importer et lire un package SCORM** via le composant `ScormPlayer.jsx`.

---

## 7. Retour réflexif et perspectives

### 7.1 Difficultés rencontrées

- **Conciliation cross-platform** : faire fonctionner le même code sur web et mobile a nécessité d'éviter certaines API React Native non disponibles côté web.
- **Volumétrie du contenu** : produire un contenu rigoureux sur 6 modules a représenté l'essentiel du temps de travail (sources réglementaires, normes ISO, textes du Green Deal).
- **Export SCORM** : la génération d'un package conforme à la norme a demandé une étude attentive du standard.

### 7.2 Ce qui pourrait être amélioré

- **Tri des questions par niveau de difficulté** : actuellement aléatoire pur, on pourrait construire un parcours progressif (débutant → avancé).
- **Verrouillage progressif des modules** : exiger la validation du module N pour débloquer le module N+1.
- **Ajout de schémas visuels** (diagrammes ISO, frise chronologique du Green Deal) pour enrichir la dimension visuelle.
- **Mode hors-ligne complet via PWA** : permettrait une utilisation totalement déconnectée.

### 7.3 Apport personnel du projet

Au-delà de la dimension technique, ce projet nous a permis de **structurer et synthétiser** un domaine réglementaire en pleine expansion. La transposition d'un savoir juridique (normes, directives) en format pédagogique interactif a constitué un exercice à part entière.

---

## 8. Bibliographie et références

### Cadre réglementaire européen

- **Pacte Vert pour l'Europe** (Green Deal), Communication de la Commission européenne, COM(2019) 640 final, décembre 2019.
- **Directive CSRD** (Corporate Sustainability Reporting Directive), Directive (UE) 2022/2464 du 14 décembre 2022.
- **Règlement Taxonomie**, Règlement (UE) 2020/852 du 18 juin 2020.
- **Directive EED** (Energy Efficiency Directive), Directive (UE) 2023/1791 du 13 septembre 2023.
- **Directive DEEE**, Directive 2012/19/UE relative aux déchets d'équipements électriques et électroniques.
- **Directive RoHS**, Directive 2011/65/UE relative à la limitation de l'utilisation de certaines substances dangereuses.
- **Règlement Écoconception**, Règlement (UE) 2024/1781 du 13 juin 2024.
- **SFDR**, Règlement (UE) 2019/2088 sur la publication d'informations en matière de durabilité.
- **DORA**, Règlement (UE) 2022/2554 sur la résilience opérationnelle numérique du secteur financier.

### Normes ISO et européennes

- **ISO 14001:2015** — Systèmes de management environnemental.
- **ISO 14040:2006 / ISO 14044:2006** — Analyse du cycle de vie (ACV).
- **ISO 50001:2018** — Systèmes de management de l'énergie.
- **EN 50600** — Installations et infrastructures de datacenters.

### Labels et codes de conduite

- **EPEAT** — Electronic Product Environmental Assessment Tool, Green Electronics Council.
- **Energy Star** — EPA / Commission européenne.
- **Blue Angel** — Umweltbundesamt (Allemagne).
- **EU Code of Conduct on Data Centre Energy Efficiency** — Joint Research Centre, Commission européenne.
- **CNDCP** — Code of Conduct on Data Centre Power, ETSI.

### Contexte luxembourgeois

- **ILNAS** — Institut Luxembourgeois de la Normalisation, de l'Accréditation, de la Sécurité et qualité des produits et services.
- **INDR** — Institut National pour le Développement durable et la Responsabilité sociale des entreprises.
- **Luxinnovation** — Agence nationale d'innovation.
- **LuxConnect** — Opérateur de datacenters durables Tier IV.
- **EBRC** — European Business Reliance Centre.

### Sources techniques

- **Standard SCORM 1.2** — Advanced Distributed Learning (ADL).
- **Documentation officielle React Native** — Meta, https://reactnative.dev
- **Documentation officielle Expo** — https://docs.expo.dev
- **Vite — Next Generation Frontend Tooling** — https://vitejs.dev

### Sources sur le Green IT et l'empreinte numérique

- **ADEME / ARCEP** — *Évaluation de l'impact environnemental du numérique en France*, 2022.
- **The Shift Project** — *Lean ICT : Pour une sobriété numérique*, rapport 2018.
- **GreenIT.fr** — Référentiel d'éco-conception web (115 bonnes pratiques).

---

*Document rédigé dans le cadre de l'UE LUPT01 — Master Data Science — 2026.*
*Eco-conçu : ce document est produit en Markdown, format léger, modifiable et durable.*
