# PlayMyJob

**Vis le métier avant de postuler.**

PlayMyJob part d'une vraie offre d'emploi, dans n'importe quel domaine, et te fait vivre une journée de travail sur ce poste. Tu discutes librement avec des collègues, des clients ou des patients générés par l'IA. Ils réagissent à ce que tu écris ou dis à voix haute, des urgences tombent, des documents sont à consulter, et des jauges suivent ta journée. À la fin, tu obtiens un score de compatibilité avec le poste, tes points forts et un conseil.

Projet du cours d'Angular, Master MIAGE, Université Paris 1 Panthéon-Sorbonne, par **Malak Melhaoui** et **Insafe**.

## Fonctionnalités

| # | Fonctionnalité | Ce que fait l'utilisateur | API |
|---|---|---|---|
| 1 | Authentification | Il crée un compte, se connecte et se déconnecte. Les pages privées sont protégées. | `/api/auth` |
| 2 | Offres | Il cherche de vraies offres (Adzuna) par métier, ville et contrat, avec une pagination, puis consulte le détail d'une offre. | `/api/offers` |
| 3 | Simulation | Il badge à son arrivée, puis vit une journée générée par l'IA dans une scène animée : l'équipe dans le décor du lieu, répliques écrites lettre par lettre, humeurs, horloge et soleil qui avancent, urgences chronométrées, documents, jauges et effets après chaque réponse. | `/api/simulations` |
| 4 | Résultat | Il voit son score sur 100, le verdict d'embauche du manager (avec confettis s'il est embauché), un titre, ses points forts, un conseil et le résumé de sa journée. | `/api/simulations/:id` |
| 5 | Favoris | Il garde des offres pour plus tard et les retire après une confirmation. | `/api/favorites` |
| 6 | Profil et historique | Il modifie ses informations, voit le radar de ses compétences et l'historique de ses parties, et peut les supprimer. | `/api/profile`, `/api/simulations` |

**Bonus voix :** les personnages lisent leurs répliques à voix haute, chacun avec sa propre voix, et un bouton coupe le son. Le joueur peut aussi répondre au micro, mais le clavier reste toujours disponible. La voix utilise les API du navigateur (Web Speech), le micro fonctionne sous Chrome et Edge.

## Technologies

- **Frontend :** Angular 22 (composants standalone, signals, formulaires réactifs typés, routes chargées à la demande, garde et intercepteur fonctionnels), Angular Material 22 et Vitest.
- **Backend :** Node.js qui exécute le TypeScript directement, Express 5, Zod 4 pour valider toutes les entrées, lowdb (fichier JSON), bcryptjs et JSON Web Token.
- **API externes :**
  - [Adzuna](https://developer.adzuna.com/) pour les offres d'emploi ;
  - [Gemini](https://aistudio.google.com/) et [Groq](https://console.groq.com/) pour l'IA.

## Installation

### Prérequis

- **Node.js 26**, la version utilisée pendant le développement. Il faut au minimum Node 23.6, car le backend exécute le TypeScript sans compilation.
- Un compte gratuit sur chacun de ces services, pour obtenir les clés :
  - [Google AI Studio](https://aistudio.google.com/apikey) ;
  - [Groq](https://console.groq.com/keys) ;
  - [Adzuna](https://developer.adzuna.com/signup).

### 1. Le backend

```bash
cd backend
npm ci
cp .env.example .env
```

Remplis le fichier `.env` :

| Variable | Valeur |
|---|---|
| `AI_PRIMARY` | L'IA appelée en premier, `gemini` ou `groq`. L'autre prend le relais si elle échoue. |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | La clé Google AI Studio et le modèle (`gemini-3.5-flash-lite` par défaut). |
| `GROQ_API_KEY`, `GROQ_MODEL` | La clé Groq et le modèle (`qwen/qwen3.8-27b` par défaut). |
| `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` | Les identifiants Adzuna. |
| `JWT_SECRET` | Au moins 32 caractères aléatoires, par exemple le résultat de `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. |

S'il manque une valeur, le serveur refuse de démarrer et affiche la liste des variables à remplir.

```bash
npm run dev
```

L'API démarre sur http://localhost:3000. Les comptes, les favoris et les parties sont enregistrés dans `backend/src/data/db.json`, créé automatiquement et jamais envoyé sur GitHub.

### 2. Le frontend

Dans un deuxième terminal :

```bash
cd frontend
npm ci
npm start
```

L'application s'ouvre sur http://localhost:4200. Le serveur Angular redirige les appels `/api` vers le backend (voir `proxy.conf.json`).

## Organisation du code

```
backend/src/
├── config/        lecture et validation du .env
├── routes/        une route par ressource
├── controllers/   reçoivent la requête et renvoient la réponse
├── services/      la logique : Adzuna, IA, simulations, favoris, profil
├── models/        types et schémas Zod
├── middlewares/   authentification et validation
├── errors/        erreurs HTTP
└── data/          base lowdb

frontend/src/app/
├── components/    tous les composants (pages et éléments réutilisables)
├── services/      les seuls à appeler l'API, plus la voix et le micro
├── interfaces/    tous les types partagés
├── guards/        protection des pages privées
├── interceptors/  ajout du jeton et déconnexion si la session expire
├── pipes/         affichage des contrats et des salaires
├── validators/    vérification des mots de passe
├── utils/         messages d'erreur
└── app.routes.ts  toutes les routes, dont la page 404
```

## API

Toutes les routes, sauf l'authentification et les offres, demandent l'en-tête `Authorization: Bearer <jeton>`. Chaque utilisateur ne voit que ses propres données.

| Méthode | Route | Rôle |
|---|---|---|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter |
| GET | `/api/offers?job=&city=&contract=&page=` | Chercher des offres |
| GET | `/api/offers/:id` | Détail d'une offre |
| GET / POST | `/api/favorites` | Lister les favoris, en ajouter un |
| DELETE | `/api/favorites/:id` | Retirer un favori |
| GET / PUT | `/api/profile` | Lire et modifier son profil |
| POST | `/api/simulations` | Démarrer une journée à partir d'une offre |
| GET | `/api/simulations` | Historique des parties |
| GET / DELETE | `/api/simulations/:id` | Lire ou supprimer une partie |
| POST | `/api/simulations/:id/replies` | Répondre à la situation en cours |
| POST | `/api/simulations/:id/finish` | Terminer la journée et obtenir le résultat |

## Tests

```bash
cd frontend
npm test -- --watch=false   # 78 tests unitaires (composants, services, garde, intercepteur, pipes)
npm run build               # compilation de production

cd ../backend
npm run typecheck           # vérification des types
```

## Choix techniques

- **Tout est typé :** il n'y a aucun `any`. Les réponses de l'IA sont vérifiées avec Zod avant d'être utilisées.
- **Une IA de secours :** si la première IA ne répond pas, le serveur réessaie une fois après 2 secondes, puis passe à l'autre. Si aucune ne répond, une journée générique de secours permet quand même de jouer, et l'interface le signale.
- **Une interface soignée :** chaque page gère le chargement, les erreurs (avec un bouton pour réessayer) et l'état vide. Le site s'adapte aux téléphones, et les jauges, le radar et les messages sont lisibles par les lecteurs d'écran.
- **Sécurité :**
  - les mots de passe sont hachés avec bcrypt et ne sont jamais stockés en clair ;
  - les sessions utilisent des jetons JWT valables 7 jours ;
  - toutes les entrées sont validées ;
  - les clés restent côté serveur, dans un `.env` ignoré par Git.
