# 🎓 Edumaster — ERP & SaaS de Gestion Scolaire

**Edumaster** est une solution SaaS ERP moderne et complète dédiée à la gestion administrative, pédagogique et financière des établissements scolaires (Écoles, Collèges, Lycées).

---

## 🚀 Démarrage Rapide (Lancement de l'application)

### Prérequis
- **Node.js** (v18 ou supérieur)
- **npm** (v9 ou supérieur)

### Instructions de lancement

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement Vite** :
   ```bash
   npm run dev
   ```
   L'application sera accessible localement à l'adresse **`http://localhost:5173`** (ou port indiqué dans le terminal).

3. **Compiler pour la production** :
   ```bash
   npm run build
   ```

---

## 🛠️ Stack Technique

- **Frontend Core** : React 18 (Vite JS)
- **Styling & UI** : Tailwind CSS, Lucide React Icons
- **Gestion d'État & Persistance** : React Context API (`AppContext`), `localStorage` (sauvegarde automatique)
- **Backend & Base de données** : Intégration Supabase (`@supabase/supabase-js`)
- **Import / Export de données** : SheetJS (`xlsx`)
- **Impression** : Styles CSS dédiés `@media print` pour génération de bulletins PDF

---

## 🔄 Démonstration & Sélecteur de Rôle (MVP)

En haut de l'application, un **bandeau interactif de sélection de rôle** permet de switcher en un clic entre les 4 profils utilisateurs pour tester l'intégralité des fonctionnalités :

1. **🛡️ Administrateur** (`Directeur des Études - Jean-Baptiste Koffi`)
2. **👨‍🏫 Professeur** (`Prof. Amadou Diallo`)
3. **👨‍👩‍👧 Parent d'Élève** (`Mme Fatou Sow`)
4. **🎓 Élève** (`Cheick Diallo`)

---

## 📖 Documentation Détaillée des Fonctionnalités par Rôle

### 1. 🛡️ Espace Administrateur (Direction & Secrétariat)

L'administrateur dispose d'une vue d'ensemble sur l'ensemble de l'établissement articulée autour de 5 modules principaux :

#### A. Tableau de Bord (Dashboard KPI)
- **Indicateurs Clés (KPIs)** :
  - Nombre total d'élèves inscrits et nombre de classes.
  - Effectif du corps professoral.
  - **Montant total des encaissements** et **Taux de recouvrement (%)**.
  - **Reste à recouvrer** et nombre d'élèves en retard de paiement.
- **Barre de progression financière multi-segments** : Visualisation du ratio d'élèves ayant soldé, payé partiellement ou en retard.
- **Flux des derniers règlements** : Affichage en direct des derniers paiements enregistrés.

#### B. Gestion des Élèves
- **Inscription & Édition** : Ajout et modification des fiches d'élèves (Nom, sexe, date de naissance, classe d'affectation, tuteur/parent, numéro de téléphone et montant de la scolarité).
- **Recherche & Filtrage** : Recherche instantanée par nom ou matricule (`EDU-2025-XXX`) et filtrage par classe.
- **Suivi des soldes** : Badges de couleur indiquant le statut financier (`Soldé`, `Partiel`, `En Retard`).
- **Suppression d'élèves** : Suppression sécurisée avec cascade sur l'historique des notes.

#### C. Gestion des Professeurs
- **Fiches Enseignants** : Création et gestion des enseignants avec leurs coordonnées (Email, Téléphone, Spécialité).
- **Affectation des Classes & Matières** : Attribution dynamique des classes enseignées et matières sous leur responsabilité.

#### D. Classes & Emplois du Temps
- **Création de Classes** : Ajout de nouvelles classes par niveau (`Collège`, `Lycée`, `Primaire`).
- **Emploi du Temps Hebdomadaire** : Visualisation par jour (Lundi au Vendredi) des créneaux horaires, matières, salles de cours et professeurs assignés.

#### E. Finances & Paiements de Scolarité
- **Enregistrement des Règlements** : Saisie des paiements reçus par l'établissement avec choix du mode de règlement (`Wave`, `Orange Money`, `MTN MoMo`, `Espèces`, `Virement Bancaire`, `Chèque`).
- **Calcul automatique du Solde** : Le paiement crédite automatiquement le solde de l'élève et met à jour son statut financier (`Soldé`, `Partiel`, `En Retard`).
- **Historique & Traçabilité** : Journal chronologique des transactions avec numéro de référence, date et identité de l'agent saisisseur.

#### F. Import & Export Excel (XLSX / CSV)
- **Exportation en 1 clic** : Génération d'un fichier Excel `.xlsx` complet contenant la liste des élèves, coordonnées des parents et états de scolarité.
- **Importation Massive** : Injection de fichiers Excel `.xlsx` ou `.csv` d'effectifs avec prévisualisation des données avant confirmation.

---

### 2. 👨‍🏫 Espace Professeur

L'espace enseignant est optimisé pour simplifier la saisie des notes et le suivi des cours :

#### A. Saisie des Notes & Évaluations
- **Sélection du Contexte** : Choix de la classe, de la matière enseignée et du trimestre (`Trimestre 1`, `Trimestre 2`, `Trimestre 3`).
- **Saisie Groupée** : Grille permettant d'attribuer une note sur 20, un coefficient et une appréciation individuelle pour chaque élève de la classe.
- **Publication Immédiate** : Enregistrement qui met à jour instantanément les bulletins des élèves et la vue des parents.
- **Historique & Suppression** : Consultation des dernières notes attribuées avec possibilité d'annuler ou modifier une saisie.

#### B. Exportation des Relevés de Notes
- Téléchargement des relevés de notes de la classe sous format Excel `.xlsx`.

#### C. Emploi du Temps Enseignant
- Planning hebdomadaire des cours attribués à l'enseignant avec indication des salles.

---

### 3. 👨‍👩‍👧 Espace Parent d'Élève

L'espace parent offre une transparence totale sur le parcours scolaire et la scolarité des enfants :

#### A. Multi-Enfants
- Commutateur permettant de basculer facilement entre ses différents enfants inscrits dans l'établissement.

#### B. Suivi Académique
- Affichage de la **Moyenne Générale** mise à jour en temps réel.
- **Relevé des Évaluations** : Consultation des notes par matière, coefficients, dates et observations du corps professoral.

#### C. Paiement de la Scolarité en Ligne (Mobile Money)
- **Passerelle de Paiement Directe** : Simulation du règlement des frais de scolarité en ligne via **Wave**, **Orange Money**, **MTN MoMo** ou **Carte VISA**.
- **Mise à Jour Instantanée** : Le solde restant dû s'actualise immédiatement dès la validation du paiement.

---

### 4. 🎓 Espace Élève (Bulletin Officiel)

L'espace élève est centré sur la consultation et l'impression du bulletin trimestriel :

#### A. Bulletin de Notes Trimestriel
- **Bandeau Officiel** : En-tête de l'établissement, année académique, photo et matricule.
- **Tableau détaillé par Discipline** : Matières, coefficients, notes sur 20, totaux pondérés et appréciations des professeurs.
- **Bilan Général** : Total des points, total des coefficients, moyenne générale et mention attribuée (`Tableau d'Honneur`, `Très Bien`, etc.).
- **Bloc des Visas** : Emplacement pour les signatures du professeur principal et de la direction des études.

#### B. Impression PDF
- Bouton **"Imprimer le Bulletin (PDF)"** déclenchant une mise en page épurée spécialement formatée pour l'impression ou la sauvegarde PDF sans les éléments de navigation Web (`@media print`).

---

## 🗄️ Structure du Projet

```text
Edumaster/
├── src/
│   ├── components/
│   │   ├── admin/             # Modules Administrateur (Dashboard, Élèves, Profs, Classes, Finance, Excel)
│   │   ├── teacher/           # Module Professeur (Saisie notes, Emploi du temps)
│   │   ├── parent/            # Module Parent (Notes, Paiement Mobile Money)
│   │   ├── student/           # Module Élève (Bulletin imprimable PDF)
│   │   └── Header.jsx         # Navigation principale & Sélecteur de rôle
│   ├── context/
│   │   └── AppContext.jsx     # State global, logiques CRUD & calculs de moyennes
│   ├── data/
│   │   └── initialData.js     # Jeu de données de démonstration complet
│   ├── lib/
│   │   └── supabase.js        # Client Supabase
│   ├── App.jsx                # Layout principal et routage des rôles
│   └── main.jsx               # Point d'entrée React
├── package.json
├── tailwind.config.js
└── README.md                  # Documentation de l'application
```

---

## 🔒 Intégration Supabase & Persistance

L'application utilise un système de double stockage :
1. **Mode Local / Démo** : Les modifications (ajout d'élèves, notes, règlements) sont enregistrées dans le `localStorage` de votre navigateur pour conserver vos tests au rafraîchissement.
2. **Mode Supabase Production** : La structure des données est synchronisée avec les schémas Supabase définis dans `src/lib/supabase.js`.

---

© 2025-2026 **Edumaster SaaS ERP**. Économie du savoir & réussite éducative.
