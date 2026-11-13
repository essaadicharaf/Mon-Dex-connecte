````markdown
# Mon Dex connecté — Digimon

Application web interactive de type encyclopédie numérique dédiée à l'univers **Digimon**, connectée en temps réel à une API REST. Développée en **HTML5**, **Tailwind CSS** et **JavaScript modulaire (ES6 Modules)**, elle permet d'explorer le catalogue des créatures, de rechercher un Digimon, de consulter ses statistiques détaillées et de sauvegarder ses favoris.

---

## 🌐 Démo en ligne & Dépôt

- **Application déployée (GitHub Pages) :** [https://essaadicharaf.github.io/Mon-Dex-connecte/](https://essaadicharaf.github.io/Mon-Dex-connecte/)
- **Dépôt GitHub :** [https://github.com/essaadicharaf/Mon-Dex-connecte](https://github.com/essaadicharaf/Mon-Dex-connecte)

---

## 🔌 Univers & Source des Données (API)

- **Univers choisi :** Digimon
- **API publique utilisée :** [Digi-API](https://digi-api.com/api/v1) (`https://digi-api.com/api/v1`)
- **Endpoints exploités :**
  - `GET /digimon?pageSize=20&page={page}` — Récupération paginée de la liste des créatures.
  - `GET /digimon/{name|id}` — Récupération des détails complets d'un Digimon (attributs, niveau, description, compétences et images).
- **Normalisation des données :** Chaque réponse brute de l'API est transformée via la fonction `toCreature()` en un objet standardisé :
  ```js
  {
    id: "#001",
    name: "Agumon",
    type: "Vaccine",
    level: "Rookie",
    image: "https://...",
    description: "...",
    stats: { attack: 450, defence: 320, speed: 380 }
  }
  ```
````

---

## ✨ Fonctionnalités Implémentées

### Partie 1 — Liste dynamique & Pagination depuis l'API

- **Suppression des données statiques :** Remplacement intégral de `data.js` par des appels réseau `fetch` avec `async / await`.
- **Chargement parallèle (`Promise.all`) :** Récupération simultanée des détails des 20 créatures de chaque page pour optimiser le temps d'affichage.
- **Pagination incrémentale :** Bouton **« Charger plus »** chargeant les 20 Digimon suivants et les ajoutant à la grille sans écraser les résultats existants, avec mise à jour du compteur global.
- **Filtrage par attribut :** Filtrage dynamique des créatures chargées selon leur type (**Tous**, **Vaccine**, **Data**, **Virus**, **Free**).

### Partie 2 — Recherche API & Panneau de détail

- **Recherche directe dans l'API :** Soumission d'une requête par nom exact ou numéro (`#id`) avec affichage ciblé du résultat.
- **Réinitialisation rapide :** Bouton **« Effacer »** (et détection de vidage du champ) permettant de revenir instantanément à la grille principale.
- **Panneau de détail interactif :** Clic sur une carte déclenchant une requête dédiée et affichant l'image, l'attribut, le niveau, la description ainsi que trois barres de progression proportionnelles sur 999 (**Puissance**, **Défense**, **Vitesse**).
- **Protection anti double-requête :** Désactivation automatique des boutons (`disabled`) et verrouillage des clics pendant qu'une requête réseau est en cours.

### Partie 3 — Gestion des états & Persistance navigateur

- **Gestion complète des 4 états d'interface** (sur la grille, la recherche et le panneau de détail) :
- **Chargement :** Indicateur visuel animé (_spinner_) et désactivation des contrôles.
- **Succès :** Rendu fluide des cartes ou de la fiche détaillée.
- **Vide (`404`) :** Vérification explicite de `response.ok` et affichage du message contextuel _« Aucune créature trouvée pour « … » »_.
- **Erreur réseau / Hors ligne :** Message d'alerte clair accompagné d'un bouton **« Réessayer »** permettant de relancer la requête échouée.

- **Favoris persistants (`localStorage`) :** Ajout ou retrait d'un Digimon via le bouton étoile SVG sur chaque carte, filtre dédié **« Favoris »**, et conservation des données après rechargement (`F5`).
- **Dernière recherche (`sessionStorage`) :** Sauvegarde automatique du dernier terme recherché et restauration dans le champ et la grille lors d'un rechargement de page (effacé à la fermeture de l'onglet).

---

## 📁 Architecture Modulaire du Projet

Le code JavaScript est structuré en modules ES6 indépendants selon le principe de responsabilité unique :

```text
Mon-Dex-connecte/
├── index.html                  # Structure sémantique HTML5 & composants Tailwind
├── tailwind.config.js          # Palette personnalisée (brand, attributs) & breakpoints
├── package.json                # Scripts de build Tailwind CSS
├── dist/
│   └── output.css              # Feuille de style compilée et minifiée
├── src/
│   ├── input.css               # Directives sources Tailwind CSS
│   ├── main.js                 # Point d'entrée : orchestration, événements et état global
│   ├── ui.js                   # Manipulation du DOM, rendu des cartes, détail et 4 états
│   ├── storage.js              # Gestion pure du LocalStorage (favoris) et SessionStorage
│   └── services/
│       └── api.js              # Appels fetch Digi-API, gestion HTTP et normalisation JSON
└── README.md                   # Documentation du projet

```

---

## 🧪 Scénarios de Validation & Tests

| Fonctionnalité              | Scénario testé                                        | Résultat obtenu                                                                                        |
| --------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Chargement & Pagination** | Ouverture initiale + clic sur _Charger plus_          | 20 cartes affichées au démarrage, +20 ajoutées à chaque clic, compteur mis à jour.                     |
| **Recherche & État Vide**   | Recherche de `"Agumon"` puis `"zzzz"`                 | Fiche unique affichée pour `"Agumon"` ; message _Aucune créature trouvée_ (404) pour `"zzzz"`.         |
| **État Erreur & Reprise**   | DevTools › Network › _Offline_ + clic _Réessayer_     | Message d'erreur affiché hors ligne ; rechargement réussi dès le retour de la connexion.               |
| **Persistance Favoris**     | Ajout aux favoris + filtre _Favoris_ + `F5`           | Étoile dorée active, filtrage exact et conservation dans `localStorage` après rechargement.            |
| **Persistance Recherche**   | Recherche `"Gabumon"` + `F5` dans l'onglet            | Requête restaurée automatiquement depuis `sessionStorage` et réinitialisée à la fermeture de l'onglet. |
| **Responsive Design**       | Écrans `360px` (mobile), `768px` (tablette), `1280px` | Grille adaptative (1, 2 puis 3 colonnes) sans débordement horizontal.                                  |

---

## 🚀 Installation & Lancement Local

1. **Cloner le dépôt :**

```bash
git clone [https://github.com/essaadicharaf/Mon-Dex-connecte.git](https://github.com/essaadicharaf/Mon-Dex-connecte.git)
cd Mon-Dex-connecte

```

2. **Installer les dépendances :**

```bash
npm install

```

3. **Compiler Tailwind CSS :**

```bash
# Compilation unique
npm run build

# Ou mode surveillance pendant le développement
npm run watch

```

4. **Lancer l'application :**

- Ouvrir `index.html` via un serveur local (extension **Live Server** sur VS Code ou `npx serve`), requis pour l'exécution des modules ES6 (`type="module"`).

---

## 👤 Auteur

- **Développeur :** ESSAADI CHARAF EDDINE
- **Formation :** YouCode Safi — Développement Web
