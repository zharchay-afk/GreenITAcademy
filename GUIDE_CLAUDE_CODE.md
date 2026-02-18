# Comment utiliser Claude Code pour ce projet

## Étape 1 : Installer Claude Code

```bash
# Via npm (recommandé)
npm install -g @anthropic-ai/claude-code

# Vérifier l'installation
claude --version
```

## Étape 2 : Préparer le dossier projet

```bash
# Créer le dossier
mkdir GreenITAcademy
cd GreenITAcademy

# Copier les fichiers fournis
# - BRIEF_PROJET.md (ce fichier de contexte)
# - GreenIT_Academie_Final.jsx (composant principal)
# - modules.json (quand généré)
# - questions.json (quand généré)
```

## Étape 3 : Lancer Claude Code

```bash
# Dans le dossier du projet
claude
```

## Étape 4 : Prompt initial à donner à Claude Code

Copie-colle ce prompt au démarrage :

---

```
Lis le fichier BRIEF_PROJET.md pour comprendre le contexte complet du projet.

Je développe une application pédagogique "Green IT Académie" avec React Native + Expo.
L'interface doit reproduire le style SecNum académie de l'ANSSI.

Fichiers déjà disponibles :
- BRIEF_PROJET.md : contexte complet, structure, stack technique
- GreenIT_Academie_Final.jsx : composant React principal avec sidebar et cartes de modules

Ce que je veux faire maintenant :
1. Initialiser le projet Expo avec expo-router
2. Intégrer le composant existant dans la structure expo-router
3. Créer les écrans de navigation

Commence par lire le BRIEF_PROJET.md, puis propose-moi les premières étapes concrètes.
```

---

## Étape 5 : Prompts de suivi utiles

### Pour créer l'écran de lecture de cours :
```
Crée le composant CourseReader.jsx qui affiche le contenu d'un module.
Il doit :
- Recevoir le moduleId en paramètre
- Afficher les sections du module une par une
- Permettre la navigation entre sections (précédent/suivant)
- Tracker le temps passé
- Style cohérent avec le reste de l'app (mode sombre, couleurs vertes)
```

### Pour créer le système de quiz :
```
Crée le composant Quiz.jsx avec :
- Sélection aléatoire de 15 questions du module
- Affichage une question à la fois
- 4 boutons de réponse
- Feedback immédiat (vert/rouge + explication)
- Barre de progression (question X/15)
- Score final à la fin
- Utilise le fichier data/questions.json
```

### Pour générer le contenu :
```
Génère le fichier data/modules.json complet avec les 6 modules.
Le contenu doit être basé sur les normes Green IT :
- Module 1 : Cadres conceptuels (Réglementation, Normes, Labels, Codes)
- Module 2 : Réglementation UE (CSRD, Taxonomie, EED, DEEE)
- Module 3 : Normes ISO (14001, 50001, 14040, EN 50600)
- Module 4 : Labels (EPEAT, Energy Star, Blue Angel)
- Module 5 : Codes de conduite (EU Code DC, CNDCP)
- Module 6 : Cas pratiques Luxembourg (LuxConnect, EBRC)

Format JSON avec sections et keyPoints pour chaque module.
```

### Pour le package SCORM :
```
Crée la structure du package SCORM 1.2 :
- imsmanifest.xml avec les 6 modules + quiz
- index.html point d'entrée
- scormAPI.js pour la communication LMS
- Export des contenus HTML statiques

Le package doit être un ZIP uploadable sur Moodle.
```

---

## Commandes Claude Code utiles

```bash
# Lancer Claude Code
claude

# Lancer avec un fichier de contexte spécifique
claude --context BRIEF_PROJET.md

# Lancer en mode conversation continue
claude --continue

# Voir l'aide
claude --help
```

---

## Structure finale attendue

```
GreenITAcademy/
├── BRIEF_PROJET.md          ← Contexte pour Claude Code
├── app/
│   ├── _layout.jsx
│   ├── index.jsx
│   ├── module/[id].jsx
│   ├── quiz/[moduleId].jsx
│   └── results/[quizId].jsx
├── components/
│   ├── Sidebar.jsx
│   ├── ModuleCard.jsx
│   ├── CourseReader.jsx
│   ├── QuizQuestion.jsx
│   └── ...
├── data/
│   ├── modules.json
│   └── questions.json
├── hooks/
│   └── useProgress.js
├── utils/
│   ├── storage.js
│   └── scormAPI.js
├── scorm-package/
│   ├── imsmanifest.xml
│   └── content/
├── package.json
└── app.json
```

---

## Tips pour travailler avec Claude Code

1. **Sois spécifique** : "Crée le fichier X avec la fonction Y" plutôt que "fais le truc"

2. **Donne du contexte** : Mentionne les fichiers existants et leur contenu

3. **Itère** : Commence simple, ajoute des fonctionnalités progressivement

4. **Vérifie** : Teste après chaque modification (`npx expo start`)

5. **Commite** : Sauvegarde régulièrement (`git commit`)
