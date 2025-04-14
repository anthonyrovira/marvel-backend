# Marvel Backend API

Cette API backend fournit les fonctionnalités nécessaires pour une application frontend permettant aux utilisateurs de gérer leurs personnages et comics Marvel favoris. Elle inclut l'authentification des utilisateurs et l'interaction avec une API externe (probablement l'API officielle Marvel, bien que non spécifié ici) pour récupérer des données sur les comics et les personnages.

## Fonctionnalités

*   Inscription et connexion des utilisateurs (JWT).
*   Ajout/Suppression de personnages et comics aux favoris de l'utilisateur.
*   Récupération des listes de favoris par utilisateur.
*   Recherche et récupération d'informations sur les comics Marvel.
*   Recherche et récupération d'informations sur les personnages Marvel.

## Prérequis

*   Node.js (version recommandée: 18.x ou supérieure)
*   pnpm (peut être installé via `npm install -g pnpm`)
*   Une base de données MongoDB (locale ou via un service comme MongoDB Atlas)

## Installation

1.  Clonez le dépôt :
    ```bash
    git clone <URL_DU_REPO>
    cd marvel-backend
    ```
2.  Installez les dépendances :
    ```bash
    pnpm install
    ```

## Configuration

1.  Créez un fichier `.env` à la racine du projet en vous basant sur le contenu ci-dessous ou un éventuel fichier `.env.example`.
2.  Remplissez les variables d'environnement nécessaires :

    ```dotenv
    MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
    JWT_SECRET=VOTRE_SECRET_JWT_TRES_SECURISE
    MARVEL_API_KEY=VOTRE_CLE_API_MARVEL
    PORT=3000 # Ou le port de votre choix
    ```

    *   `MONGODB_URI`: Votre chaîne de connexion MongoDB.
    *   `JWT_SECRET`: Une chaîne secrète aléatoire et complexe pour signer les tokens JWT.
    *   `MARVEL_API_KEY`: Votre clé API obtenue depuis [Marvel Developer Portal](https://developer.marvel.com/).
    *   `PORT`: Le port sur lequel le serveur écoutera.

## Lancement

Pour démarrer le serveur en mode développement (avec rechargement automatique via `nodemon` ou `ts-node-dev`, selon la configuration dans `package.json`) :

```bash
pnpm run dev
```

Pour démarrer le serveur en mode production (après compilation TypeScript) :

```bash
pnpm run build
pnpm start
```

## Endpoints API

L'API nécessite un token JWT (Bearer Token) dans l'en-tête `Authorization` pour la plupart des routes protégées (notamment celles liées aux favoris).

### 1. Utilisateur (`/user`)

| Méthode | URL            | Description                                     | Corps de la requête                                                 | Réponse (Succès 200 OK)                                                                                                          | Autres Codes de réponse |
| ------- | -------------- | ----------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| POST    | `/signup`      | Inscription d'un nouvel utilisateur             | `{ "email": "string", "username": "string", "password": "string" }` | `{ "_id": "...", "username": "...", "email": "...", "favorites": { "characters": [], "comics": [] }, "token": "..." }`             | 400 (Bad Request), 409 (Conflict) |
| POST    | `/login`       | Connexion d'un utilisateur existant             | `{ "email": "string", "password": "string" }`                       | `{ "_id": "...", "username": "...", "email": "...", "token": "..." }`                                                              | 400 (Bad Request), 401 (Unauthorized), 404 (Not Found) |
| GET     | `/user/:token` | Récupère les informations utilisateur par token | - (Token dans l'URL)                                                | `{ "user": { "_id": "...", "username": "...", "email": "...", "favorites": { "characters": [...], "comics": [...] } } }` | 400 (Bad Request), 404 (Not Found) |

### 2. Favoris (`/favorites`)

*Nécessite une authentification (Bearer Token)*

| Méthode | URL                     | Description                                  | Corps de la requête (Exemple)                                                                                                                  | Réponse (Succès 200 OK)                 | Autres Codes de réponse |
| ------- | ----------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------- |
| POST    | `/comics`               | Ajouter/Retirer un comic des favoris         | `{ "_id": "...", "title": "...", "description": "...", "thumbnail": { "path": "...", "extension": "..." } }`                                    | `{ "isFavorite": true/false }`          | 400, 401                |
| POST    | `/characters`           | Ajouter/Retirer un personnage des favoris    | `{ "_id": "...", "name": "...", "description": "...", "thumbnail": { "path": "...", "extension": "..." }, "comics": [...] }`                 | `{ "isFavorite": true/false }`          | 400, 401                |
| GET     | `/`                     | Obtenir la liste des favoris de l'utilisateur| -                                                                                                                                              | `{ "comics": [...], "characters": [...] }` | 400, 401                |
| DELETE  | `/`                     | Vider la liste des favoris de l'utilisateur  | -                                                                                                                                              | `{ "message": "Favorites cleared" }`   | 400, 401                |

### 3. Comics (`/comics`)

| Méthode | URL           | Description                            | Paramètres de requête (Query Params) | Réponse (Succès 200 OK)                       | Autres Codes de réponse |
| ------- | ------------- | -------------------------------------- | ------------------------------------ | --------------------------------------------- | ----------------------- |
| GET     | `/`           | Obtenir une liste de comics            | `title`, `limit`, `skip`             | `{ "count": Number, "results": [...] }`       | 400, 500                |
| GET     | `/:comicId`   | Obtenir un comic spécifique par son ID | - (ID dans l'URL)                    | `{ Comic Object }`                            | 400, 500                |

### 4. Personnages (`/characters`)

| Méthode    | URL                      | Description                               | Paramètres de requête (Query Params) | Réponse (Succès 200 OK)                                | Autres Codes de réponse |
| ---------- | ------------------------ | ----------------------------------------- | ------------------------------------ | ------------------------------------------------------ | ----------------------- |
| GET        | `/`                      | Obtenir une liste de personnages          | `name`, `limit`, `skip`              | `{ "count": Number, "results": [...] }`                | 400, 500                |
| GET        | `/comics/:characterId`   | Obtenir les comics liés à un personnage | - (ID dans l'URL)                    | `{ "comics": [...], "characterName": "..." }`          | 400, 500                |
| GET        | `/:characterId`          | Obtenir un personnage spécifique par ID | - (ID dans l'URL)                    | `{ Character Object }`                                 | 400, 404, 500           |

---

