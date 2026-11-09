# Mon Dex — Digimon

Une encyclopédie web interactive dédiée à l'univers **Digimon**, développée en HTML5, Tailwind CSS et JavaScript moderne (Vanilla JS). Ce projet transforme une maquette statique en une application dynamique permettant d'explorer une collection de créatures numériques, d'afficher leurs statistiques détaillées en barres interactives, d'exécuter des recherches et filtrages combinés, de composer une équipe de combat limitée à 6 membres et d'ajouter de nouveaux Digimon sécurisés par validation d'expressions régulières.

---

## 🎯 Univers et Données

* **Univers choisi :** Digimon
* **Attributs (Types) :** Vaccine, Data, Virus
* **Niveaux d'évolution :** Rookie, Champion, Ultimate, Mega
* **Statistiques évaluées :** Puissance (ATK), Défense (DEF), Vitesse (SPD) — échelonnées de 0 à 999
* **Source des données et visuels :** [Digimon Public Database (Shadowsmith)](https://digimon.shadowsmith.com/)

---

## ✨ Fonctionnalités JavaScript Implémentées (Partie 2)

1. **Affichage dynamique de la grille :** Les cartes codées en dur dans le HTML ont été supprimées. La grille principale est générée dynamiquement à partir de la collection `creatures` de `data.js`.
2. **Panneau de détail :** Le clic sur une carte affiche ses visuels, sa description textuelle et ses 3 statistiques sous forme de barres de progression proportionnelles calculées dynamiquement sur une échelle maximale de 999 :
   $$\text{Pourcentage} = \min\left(100, \operatorname{round}\left(\frac{\text{valeur}}{999} \times 100\right)\right)$$
3. **Recherche en temps réel :** Filtrage instantané lors de la saisie d'un nom (`input`), sans sensibilité aux majuscules/minuscules.
4. **Filtres par attribut :** Boutons de sélection d'attribut (*Tous*, *Vaccine*, *Data*, *Virus*) qui fonctionnent en synergie totale avec la barre de recherche.
5. **Formulaire de création de créature :** Ajout d'un nouveau Digimon avec validation par expressions régulières. Contrôle visuel déclenché à la perte de focus (`blur`), feedback immédiat en cours de saisie corrective (`input`), et blocage de la soumission (`submit`) en cas d'erreur.
6. **Gestion de l'équipe (Event Delegation) :** Ajout et suppression de créatures gérés de manière centralisée grâce à un seul écouteur d'événements sur la grille (`#grid`) et un seul écouteur sur la liste de l'équipe (`#team-list`).
7. **Règles métier de l'équipe :**
   * Limite stricte de 6 créatures au maximum.
   * Interdiction absolue des doublons.
   * Messages explicites d'alerte en cas d'action refusée.
   * Compteurs d'équipe synchronisés en temps réel ($x/6$) dans la barre de navigation et dans la section équipe.
   * Désactivation automatique des boutons d'ajout (`disabled`, `opacity-50`, `cursor-not-allowed`) si la créature est déjà dans l'équipe ou si l'équipe a atteint sa capacité maximale.

---

## 🧪 Tests des Expressions Régulières (Console Tests)

Chaque expression régulière a été testée dans la console JavaScript avec au moins 2 valeurs valides et 2 valeurs invalides :

| Champ | Règle Métier | Expression Régulière | Valeurs Valides (`true`) | Valeurs Invalides (`false`) |
| :--- | :--- | :--- | :--- | :--- |
| **Numéro** | `#` suivi de 3 chiffres, unicité dans la liste | `/^#\d{3}$/` | `"#013"`<br>`"#999"` | `"013"` *(absence de #)*<br>`"#12"` *(2 chiffres au lieu de 3)* |
| **Nom** | 2 à 30 caractères, commence par lettre ou chiffre ; lettres, chiffres, espaces, `.`, `'` et `-` autorisés | `/^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 .'-]{1,29}$/` | `"Agumon"`<br>`"War-Greymon 2"` | `"A"` *(inférieur à 2 caractères)*<br>`" Agumon"` *(commence par un espace)* |
| **Statistique** | Nombre entier compris entre 0 et 999 | `/^\d{1,3}$/` | `"0"`<br>`"450"` | `"1000"` *(dépasse 3 chiffres)*<br>`"-50"` *(signe négatif interdit)* |
| **Image** | URL https valide se terminant par `.png`, `.jpg`, `.jpeg`, `.webp` ou `.gif` | `/^https:\/\/\S+\.(png\|jpe?g\|webp\|gif)$/i` | `"https://site.com/agumon.png"`<br>`"https://domain.org/image.webp"` | `"http://site.com/image.png"` *(insecure, protocole http)*<br>`"https://site.com/doc.pdf"` *(extension non supportée)* |
| **Description** | Longueur comprise entre 10 et 200 caractères inclus | `/^[\s\S]{10,200}$/` | `"Un Digimon courageux."`<br>`"Guerrier numérique protégeant le serveur réseau."` | `"Court"` *(moins de 10 caractères)*<br>`"a".repeat(201)` *(dépasse 200 caractères)* |

---

## 🎨 États et Accessibilité (Partie 1 — Tailwind CSS)

* **Survol (Hover) :** Légère élévation des cartes au survol (`hover:-translate-y-1 hover:border-brand hover:shadow-lg transition-all`).
* **Focus visible :** Accessibilité clavier préservée sur tous les éléments interactifs (`focus:outline-none focus:ring-2 focus:ring-brand`).
* **États de validation :**
  * Bordure verte pour les champs validés (`!border-attribute-vaccine`).
  * Bordure rouge et affichage du message contextuel d'erreur pour les champs invalides (`!border-attribute-virus`).
* **États désactivés :** Verrouillage visuel et fonctionnel du bouton d'ajout d'équipe (`opacity-50 cursor-not-allowed pointer-events-none`).

---

## 📂 Architecture des Fichiers

```text
Mon-Dex/
├── data.js               # Collection source (tableau d'au moins 12 créatures initiales)
├── index.html            # Structure sémantique HTML5 & classes utilitaires Tailwind
├── script.js             # Logique applicative : rendu DOM, filtres, regex, équipe
├── tailwind.config.js    # Palette de couleurs personnalisée et configuration des polices
├── package.json          # Dépendances de développement et scripts de build
├── src/
│   └── input.css         # Directives de base Tailwind CSS
├── dist/
│   └── output.css        # Fichier CSS compilé
└── README.md             # Documentation complète du projet et jeux d'essais
```

---

## 🚀 Installation et Lancement

1. **Cloner le projet :**
   ```bash
   git clone https://github.com/essaadicharaf/Sprint-2-Brief-1-Mon-Dex.git
   cd Sprint-2-Brief-1-Mon-Dex
   ```

2. **Installer les dépendances de développement :**
   ```bash
   npm install
   ```

3. **Compiler le fichier CSS Tailwind :**
   ```bash
   # Mode surveillance (watch) lors du développement :
   npm run watch

   # Compilation de production minifiée :
   npm run build
   ```

4. **Lancer l'application :**
   Ouvrez `index.html` dans un navigateur moderne ou via l'extension **Live Server** dans VS Code.

---

## 👨‍💻 Auteur

* **Développeur :** CHARAF EDDINE ESSAADI
