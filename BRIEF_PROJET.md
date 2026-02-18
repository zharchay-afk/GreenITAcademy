# BRIEF PROJET : Green IT Académie

## Contexte du projet

Application pédagogique interactive sur les **Normes, Labels et Certifications Green IT** pour le Master Data Science (UE Green IT LURS01).

**Binôme** : Charles DE MEDEIROS & Ziad HARCHAY
**Deadline** : À préciser
**Livrables attendus** :
1. Application web + mobile (React Native / Expo)
2. Package SCORM exportable
3. Documentation projet (8-10 pages)

---

## Design de référence

L'interface doit reproduire le style **SecNum académie** (ANSSI) :
- Sidebar bleu marine (#1e3a5f) avec logo, menu vertical, bouton aide
- Cartes de modules avec : illustration colorée, bandeau gris "UNITÉ X", titre, métriques (temps passé, score %), boutons "Commencer" / "S'évaluer"
- Bouton "Commencer" orange (#e65100), "S'évaluer" grisé tant que le cours n'est pas commencé
- Footer avec crédits et mention "Éco-conçu"

---

## Structure des 6 modules

| Module | Titre | Contenu clé |
|--------|-------|-------------|
| 1 | Cadres conceptuels et typologie | Réglementation vs Normes vs Labels vs Codes, Directive vs Règlement UE |
| 2 | Cadre réglementaire | Green Deal, CSRD, Taxonomie, EED, DEEE, RoHS, cadre luxembourgeois |
| 3 | Normes et certifications | ISO 14001, ISO 14040/44 (ACV), ISO 50001, EN 50600 |
| 4 | Labels environnementaux | EPEAT, Energy Star, Blue Angel |
| 5 | Codes de conduite | EU Code of Conduct DC, CNDCP, chartes internes |
| 6 | Cas pratiques Luxembourg | LuxConnect, EBRC, facteurs clés de succès |

---

## Stack technique

```
Framework     : React Native + Expo (web + iOS + Android)
Navigation    : expo-router
Stockage      : AsyncStorage (progression locale)
Style         : StyleSheet inline (pas de Tailwind en React Native pur)
Backend       : Aucun (tout en local) ou Firebase si besoin
Format export : SCORM 1.2
```

---

## Structure de fichiers cible

```
GreenITAcademy/
├── app/
│   ├── _layout.jsx           # Layout principal avec sidebar
│   ├── index.jsx             # Écran d'accueil / liste modules
│   ├── module/
│   │   └── [id].jsx          # Lecture d'un module
│   ├── quiz/
│   │   └── [moduleId].jsx    # Quiz d'un module
│   └── results/
│       └── [quizId].jsx      # Résultats quiz
│
├── components/
│   ├── Sidebar.jsx
│   ├── ModuleCard.jsx
│   ├── CourseReader.jsx
│   ├── QuizQuestion.jsx
│   ├── ProgressBar.jsx
│   └── FeedbackModal.jsx
│
├── data/
│   ├── modules.json          # Contenu des 6 modules
│   └── questions.json        # 70+ questions de quiz
│
├── hooks/
│   └── useProgress.js        # Hook pour gérer la progression
│
├── utils/
│   ├── storage.js            # Wrapper AsyncStorage
│   └── scormAPI.js           # Communication SCORM
│
├── scorm-package/            # Export SCORM
│   ├── imsmanifest.xml
│   └── content/
│
└── assets/
    └── images/
```

---

## Fichiers déjà créés

### 1. Composant principal (GreenIT_Academie_Final.jsx)

Le composant React complet avec :
- Sidebar style SecNum
- Grille de cartes de modules
- Métriques (temps, score)
- Boutons Commencer / S'évaluer
- Section export SCORM

### 2. Données des modules

```json
{
  "modules": [
    {
      "id": 1,
      "unite": "UNITÉ 1",
      "title": "Cadres conceptuels et typologie",
      "image": "🌐",
      "bgColor": "#4299e1",
      "sections": [...]
    }
  ]
}
```

---

## Ce qui reste à faire

### Priorité 1 (MVP)
- [ ] Setup projet Expo avec expo-router
- [ ] Intégrer le composant principal
- [ ] Créer l'écran de lecture de cours (module/[id].jsx)
- [ ] Créer l'écran de quiz avec logique de scoring
- [ ] Générer le fichier modules.json complet
- [ ] Générer le fichier questions.json (70 questions)

### Priorité 2
- [ ] Persistance de la progression (AsyncStorage)
- [ ] Écran de résultats avec analyse par thème
- [ ] Attestation de réussite (si score > 70%)

### Priorité 3
- [ ] Export SCORM fonctionnel
- [ ] Tests sur mobile (Expo Go)
- [ ] Documentation projet

---

## Principes Green IT à respecter

Le projet doit **incarner** les principes qu'il enseigne :

1. **Sobriété** : Pas de dépendances inutiles, bundle size minimal
2. **Efficacité** : Images en WebP/SVG, lazy loading
3. **Réutilisabilité** : Export SCORM pour interopérabilité LMS
4. **Accessibilité** : Mode sombre par défaut, contraste suffisant
5. **Pérennité** : Technologies standards, pas de lock-in

---

## Commandes utiles

```bash
# Créer le projet
npx create-expo-app GreenITAcademy
cd GreenITAcademy

# Installer les dépendances
npx expo install expo-router react-native-safe-area-context react-native-screens
npm install @react-native-async-storage/async-storage

# Lancer en dev
npx expo start

# Tester sur web
npx expo start --web
```

---

## Sources du contenu pédagogique

Le contenu est basé sur la présentation PowerPoint "Harchay_DeMedeiros_Green_IT_V_2.pptx" qui contient 48 slides couvrant tous les modules.

Normes référencées :
- ISO 14001:2015, ISO 50001:2018, ISO 14040/44
- EN 50600 (Datacenters)
- EPEAT, Energy Star, Blue Angel
- Code de conduite UE Datacenters, CNDCP

---

## Contact

Pour toute question sur le contenu métier (normes, réglementation), Ziad a une expertise en protection des données et conformité (ex-Banque de France, actuellement juriste DPO à l'ACD Luxembourg).
