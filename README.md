# 🎮 PlayMyJob

> **Joue d'abord. Choisis ensuite.**

PlayMyJob est une web app qui permet aux étudiants de **tester un métier avant de s'y engager**, sous forme de jeu interactif.

L'utilisateur choisit un métier (Product Owner, développeur, data analyst, UX designer), puis une **IA lui fait vivre une journée type** à travers des situations réalistes et des choix à faire. À la fin, il obtient un **score de compatibilité** avec le métier, ses points forts, et les **offres d'emploi ou d'alternance réelles** correspondantes.

---

## 👥 Équipe

| Membre | Rôle |
|---|---|
| Malak Melhaoui | Développement / Gestion de projet |
| Insafe [nom] | Développement |

Projet réalisé dans le cadre du cours d'Angular – Master MIAGE, Université Paris 1 Panthéon-Sorbonne.

---

## 💡 Le problème

Beaucoup d'étudiants choisissent une orientation ou une alternance **sans vraiment savoir à quoi ressemble le quotidien du métier**. Les fiches métiers sont théoriques, et les stages arrivent souvent trop tard pour changer de voie.

## ✅ La solution

PlayMyJob propose une **immersion ludique et personnalisée** : en quelques minutes, l'étudiant vit une journée type, découvre ses points forts et accède directement aux offres du métier qui lui correspond.

---

## ✨ Fonctionnalités

| # | Fonctionnalité | Description |
|---|---|---|
| 1 | 🔐 **Authentification** | Inscription et connexion des utilisateurs |
| 2 | 📚 **Catalogue des métiers** | Liste et fiche détaillée de chaque métier (missions, compétences, salaire moyen) |
| 3 | 🎮 **Simulation d'une journée** | Génération par l'IA de 6 scènes interactives avec des choix à faire |
| 4 | 🏆 **Résultat de la simulation** | Score de compatibilité, points forts et conseils générés par l'IA, puis sauvegardés |
| 5 | 💼 **Offres d'emploi réelles** | Offres correspondant au métier testé, avec gestion des favoris |
| 6 | 📊 **Mon profil métier** | Historique des simulations, radar des compétences et modification du profil |

### Parcours utilisateur

```
Inscription → Découverte des métiers → Simulation d'une journée
→ Résultat et score → Offres d'emploi → Évolution du profil
```

---

## 🏗️ Architecture

```
┌───────────┐        ┌──────────────────┐        ┌────────────────────────┐
│  Angular  │ ─────► │  Back            │ ─────► │ Google Gemini (IA)     │
│  (front)  │ ◄───── │  Node + Express  │ ─────► │ Adzuna (offres d'emploi)│
└───────────┘        │                  │        └────────────────────────┘
                     │  Stockage JSON   │
                     │  ou SQLite       │
                     └──────────────────┘
```

- Le **front Angular** communique uniquement avec notre back.
- Le **back Express** expose l'API, stocke les données (comptes, simulations, favoris, profil) et appelle les API externes.
- Les **clés des API externes** restent côté serveur et ne sont jamais exposées dans le navigateur. Cela évite aussi les problèmes de CORS.
- Des **scénarios de secours** sont prévus pour que l'application reste fonctionnelle si l'IA ne répond pas.

---

## 🛠️ Stack technique

| Couche | Technologies |
|---|---|
| Front | Angular, Angular Material ou Bootstrap, Chart.js (ng2-charts) |
| Back | Node.js, Express, JWT, bcrypt, lowdb ou SQLite, dotenv |
| API externes | Google Gemini (IA), Groq (secours IA), Adzuna (offres d'emploi) |
| Outils | Git, GitLab / GitHub |

---

## 🔌 API du back

### Authentification
| Méthode | Route | Rôle |
|---|---|---|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter (renvoie un token JWT) |

### Catalogue des métiers
| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/jobs` | Liste des métiers |
| GET | `/api/jobs/:id` | Fiche d'un métier |

### Simulation et résultat
| Méthode | Route | Rôle |
|---|---|---|
| POST | `/api/simulations` | Démarrer une partie (génération des scènes par l'IA) |
| PUT | `/api/simulations/:id/choices` | Enregistrer un choix |
| POST | `/api/simulations/:id/finish` | Terminer la partie (analyse par l'IA et sauvegarde du score) |

### Historique
| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/simulations` | Liste des parties de l'utilisateur |
| GET | `/api/simulations/:id` | Détail (replay) d'une partie |
| DELETE | `/api/simulations/:id` | Supprimer une partie |

### Offres et favoris
| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/offers?job=...&city=...` | Offres d'emploi réelles (via Adzuna) |
| GET | `/api/favorites` | Liste des offres sauvegardées |
| POST | `/api/favorites` | Ajouter une offre en favori |
| DELETE | `/api/favorites/:id` | Retirer un favori |

### Profil
| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/profile` | Afficher le profil |
| PUT | `/api/profile` | Modifier le profil |
| GET | `/api/profile/skills` | Compétences moyennes (radar) |

---

## 🚀 Installation

> Section à compléter au fil du développement.

### Prérequis
- Node.js (version LTS)
- Angular CLI : `npm install -g @angular/cli`

### Back
```bash
cd backend
npm install
cp .env.example .env   # puis renseigner les clés API
npm start
```

Variables d'environnement (`.env`) :
```
GEMINI_API_KEY=...
GROQ_API_KEY=...
ADZUNA_APP_ID=...
ADZUNA_APP_KEY=...
JWT_SECRET=...
```

⚠️ Le fichier `.env` ne doit **jamais** être commité (il est dans le `.gitignore`).

### Front
```bash
cd frontend
npm install
ng serve
```

L'application est disponible sur `http://localhost:4200`.

---

## 📅 Planning

| Semaine | Dates | Objectifs |
|---|---|---|
| 1 | 26/10 → 01/11 | Validation des fonctionnalités, création du dépôt, tests des API externes, squelette Angular et Express |
| 2 | 02/11 → 08/11 | Authentification, catalogue des métiers, offres d'emploi |
| 3 | 09/11 → 15/11 | Moteur de simulation (scènes, choix, appels IA, scénarios de secours) |
| 4 | 16/11 → 22/11 | Résultats, historique, profil et radar, design et animations |
| 5 | 23/11 → 01/12 | Corrections, tests, préparation et répétition de la démo |

📦 **Rendu** : 01/12/2026 à 23h59
🎤 **Démo** : 02/12/2026 (15 minutes)

---

## 📁 Structure du dépôt

```
projet-playmyjob-malak-insafe/
├── frontend/     # Application Angular
├── backend/      # API Node.js / Express
└── README.md
```
