# Réutilisation du parcours — Guide

L'application Green IT Académie est conçue comme un gabarit pédagogique réutilisable. Cette documentation décrit comment l'adapter à une nouvelle formation sans écrire de code applicatif.

L'effort d'adaptation pour une nouvelle formation se concentre sur :

1. la mise à jour de deux fichiers JSON de contenu,
2. la personnalisation de la marque (titre, illustration, palette),
3. éventuellement l'ajout ou la substitution de schémas pédagogiques,
4. le redéploiement sur un hébergeur statique.

Le code applicatif (lecteur de cours, moteur de quiz adaptatif, attestation, export SCORM, pages légales) reste inchangé.

---

## 1. Remplacement du contenu pédagogique

### 1.1. Modules et sections — `data/modules.json`

Le fichier `data/modules.json` décrit l'intégralité du parcours. Sa structure :

```json
{
  "modules": [
    {
      "id": 1,
      "unite": "MODULE 1",
      "title": "Titre du module",
      "subtitle": "Sous-titre court",
      "image": "🌐",
      "bgColor": "#4299e1",
      "estimatedTime": "00:08:00",
      "sections": [
        {
          "id": "1.1",
          "title": "Titre de la section",
          "intro": "Phrase d'accroche en italique affichée en chapeau.",
          "content": "Texte principal de la section. Peut contenir plusieurs paragraphes séparés par \\n\\n.",
          "visual": "instrumentHierarchy",
          "details": [
            { "subtitle": "Sous-section optionnelle", "text": "Contenu de la sous-section." }
          ],
          "examples": [
            { "title": "Exemple concret 1", "text": "Description de l'exemple." }
          ],
          "keyPoints": [
            "Point clé 1 à retenir",
            "Point clé 2"
          ],
          "goFurther": [
            { "text": "Lien vers une ressource externe", "url": "https://exemple.com" }
          ]
        }
      ]
    }
  ]
}
```

**Champs obligatoires d'un module** : `id`, `unite`, `title`, `image`, `bgColor`, `estimatedTime`, `sections`.

**Champs obligatoires d'une section** : `id`, `title`, `content`, `keyPoints`.

**Champs facultatifs d'une section** : `intro`, `visual` (string ou tableau de strings), `details`, `examples`, `goFurther`.

Le champ `visual` accepte le nom d'un schéma déclaré dans `src/Visuals.jsx` (cf. section 3 ci-dessous).

Le champ `goFurther` accepte un tableau d'objets `{ text, url }`. Les éléments sans `url` sont automatiquement masqués à l'affichage.

### 1.2. Questions du quiz — `data/questions.json`

Le quiz adaptatif s'alimente du fichier `data/questions.json`. Sa structure :

```json
{
  "questions": [
    {
      "id": "q001",
      "moduleId": 1,
      "level": "debutant",
      "question": "Énoncé de la question ?",
      "answers": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
      "correctIndex": 1,
      "explanation": "Explication affichée après la réponse.",
      "source": "Module 1 - Introduction"
    }
  ]
}
```

**Valeurs autorisées pour `level`** : `debutant`, `intermediaire`, `avance`.

Le moteur adaptatif ajuste automatiquement le niveau des questions suivantes en fonction des réponses. Une couverture équilibrée des trois niveaux par module est recommandée (au moins quatre questions de chaque niveau et par module).

### 1.3. Bibliographie — `src/ReferencesPage.jsx`

La page Sources & Références est définie par un tableau `sections` dans `src/ReferencesPage.jsx`. Chaque item suit la structure :

```js
{ ref: 'Intitulé de la source', detail: 'Description courte', url: 'https://...' }
```

L'attribut `url` est facultatif. En son absence, l'intitulé est affiché en texte non cliquable.

---

## 2. Personnalisation de la marque

### 2.1. Titre, sous-titre et description

| Élément | Fichier | Repère |
| --- | --- | --- |
| Titre du hero | `src/LandingPage.jsx` | `<h1>Bienvenue sur Green IT Académie</h1>` |
| Description du parcours | `src/LandingPage.jsx` | bloc `<p>` du hero |
| Liste des modules affichée sur la landing | `src/LandingPage.jsx` | constante `modules` en tête de fichier |
| Titre du dashboard | `GreenIT_Academie_Final.jsx` | `<h1>Mes modules — ...</h1>` |
| Mentions du footer | `src/LandingPage.jsx`, `GreenIT_Academie_Final.jsx` | balise `<footer>` |

### 2.2. Illustration du hero — `src/Logo.jsx`

Le logo des feuilles en éventail est défini par un seul tracé SVG répété par rotation à 0°, 120° et 240°. Pour le remplacer, modifier la valeur de `leafPath` dans `src/Logo.jsx`, ou substituer le composant entier par votre propre illustration vectorielle.

### 2.3. Palette de couleurs

Les couleurs principales sont :

| Usage | Code hexadécimal | Fichiers concernés |
| --- | --- | --- |
| Vert sombre (sidebar, headers) | `#064e3b` | nombreux composants |
| Vert moyen (accents) | `#15803d`, `#166534` | nombreux composants |
| Vert clair (état actif) | `#4ade80` | sidebar, badges, attestation |
| Orange (bouton « Commencer ») | `#e65100` | `GreenIT_Academie_Final.jsx`, `QuizScreen.jsx` |

Pour modifier la palette globalement, un *find & replace* sur la base de code suffit. Une centralisation dans `src/Logo.jsx` ou un fichier `theme.js` est une évolution naturelle pour les déploiements à grande échelle.

### 2.4. Métadonnées PWA

Le fichier `public/manifest.webmanifest` contient le nom de l'application installée, l'icône, les couleurs de thème. L'icône SVG est dans `public/icon.svg`.

---

## 3. Schémas pédagogiques (Visuals)

Le fichier `src/Visuals.jsx` contient 14 schémas SVG inline et HTML/CSS (pyramide, cycle ACV, échelle PUE, frise Green Deal, etc.). Trois opérations sont possibles :

- **Conserver à l'identique** : aucun changement de code si le schéma reste pertinent.
- **Substituer** : remplacer le contenu du composant correspondant.
- **Ajouter** : créer un nouveau composant, l'enregistrer dans la constante `VISUALS` en bas du fichier, et le référencer dans `modules.json` via le champ `visual`.

Le composant `Wrapper` standardisé prend un `caption` et encapsule le contenu, ce qui assure une présentation visuelle homogène entre tous les schémas.

---

## 4. Déploiement

### 4.1. Installation des dépendances

```bash
npm install
```

### 4.2. Développement local

```bash
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

### 4.3. Build de production

```bash
npm run build
```

Le résultat est généré dans `dist/`.

### 4.4. Hébergement statique recommandé

Trois options compatibles, par ordre de simplicité :

- **Vercel** — déploiement automatique sur push GitHub, CDN global, compression Brotli native, certificat HTTPS gratuit.
- **Netlify** — équivalent à Vercel sur les fonctionnalités principales.
- **GitHub Pages** — gratuit, mais sans Brotli ni rewrites avancés (suffisant pour une démo statique).

La taille du bundle final (~150 Ko gzippé) permet un chargement quasi-instantané sur la plupart des connexions.

---

## 5. Licence et attribution

Le code source est publié sous licence libre. Il peut être réutilisé librement à condition de mentionner l'origine du projet (« basé sur Green IT Académie ») dans les mentions légales de la formation dérivée. Les contenus pédagogiques originaux (textes du parcours sur les normes Green IT) doivent quant à eux être substitués pour éviter toute confusion entre formations.

---

## 6. Architecture en bref

```
GreenITAcademy/
├── App.jsx                          # Routeur principal, gestion d'état
├── GreenIT_Academie_Final.jsx       # Dashboard (liste des modules)
├── data/
│   ├── modules.json                 # CONTENU — modules et sections
│   └── questions.json               # CONTENU — banque de questions
├── public/
│   ├── manifest.webmanifest         # Métadonnées PWA
│   ├── icon.svg                     # Icône de l'application
│   └── sw.js                        # Service worker (cache hors-ligne)
├── src/
│   ├── LandingPage.jsx              # Page d'accueil publique
│   ├── Sidebar.jsx                  # Sidebar partagée
│   ├── Logo.jsx                     # Logo réutilisable
│   ├── CourseReader.jsx             # Lecteur de cours
│   ├── QuizScreen.jsx               # Moteur de quiz adaptatif
│   ├── AttestationPage.jsx          # Page d'attestation
│   ├── ProfilePage.jsx              # Profil utilisateur
│   ├── ReferencesPage.jsx           # Bibliographie
│   ├── ScormPlayer.jsx              # Lecteur SCORM
│   ├── LegalPages.jsx               # Mentions, données, cookies, éco-conception, accessibilité
│   ├── Visuals.jsx                  # Bibliothèque de schémas SVG/HTML
│   └── utils/
│       ├── scormExport.js           # Export SCORM 1.2
│       └── scormImport.js           # Import SCORM 1.2
└── package.json
```

---

## 7. Contact

Pour toute question relative à l'adaptation du parcours, ouvrir une *issue* sur le dépôt source du projet.
