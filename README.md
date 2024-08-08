# Marvel Backend API

Cette API permet de gérer l'inscription, la connexion, et la récupération d'informations utilisateur dans le cadre d'une application de gestion de favoris de comics et de personnages Marvel.


## Endpoints

### 1. Utilisateur


| Méthode | URL            | Description                                     | Paramètres d'URL | Corps de la requête                                                 | Réponse en cas de succès                                                                                                           | Codes de réponse           |
| ------- | -------------- | ----------------------------------------------- | ---------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| POST    | `/user/signup` | Inscription d'un nouvel utilisateur             | -                | `{ "email": "string", "username": "string", "password": "string" }` | `{ "_id": "string", "username": "string", "email": "string", "favorites": { "characters": [], "comics": [] }, "token": "string" }` | `200`, `400`, `409`        |
| POST    | `/user/login`  | Connexion d'un utilisateur existant             | -                | `{ "email": "string", "password": "string" }`                       | `{ "_id": "string", "username": "string", "email": "string", "token": "string" }`                                                  | `200`, `400`, `401`, `404` |
| GET     | `/user/:token` | Récupère les informations utilisateur par token | `token`          | -                                                                   | `{ "user": { "_id": "string", "username": "string", "email": "string", "favorites": { "characters": [], "comics": [] } } }`        | `200`, `400`, `404`        |



### 2. Favoris

| Méthode | URL                     | Description                                  | Paramètres d'URL | Corps de la requête                                                                                                                           | Réponse en cas de succès                       | Codes de réponse    |
| ------- | ----------------------- | -------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------- |
| POST    | `/favorites/comics`     | Ajouter ou retirer un comic des favoris      | -                | `{ "_id": "string", "title": "string", "description": "string", "thumbnail": { "path": "string", "extension": "string" } }`                   | `{ "isFavorite": true/false }`                 | `200`, `400`, `401` |
| POST    | `/favorites/characters` | Ajouter ou retirer un personnage des favoris | -                | `{ "_id": "string", "name": "string", "description": "string", "thumbnail": { "path": "string", "extension": "string" }, "comics": "array" }` | `{ "isFavorite": true/false }`                 | `200`, `400`, `401` |
| GET     | `/favorites`            | Obtenir la liste des favoris                 | -                | -                                                                                                                                             | `{ "comics": "array", "characters": "array" }` | `200`, `400`, `401` |
| DELETE  | `/favorites`            | Vider la liste des favoris                   | -                | -                                                                                                                                             | `{ "message": "Database is now empty" }`       | `200`, `400`, `401` |


### 3. Comics 
## Endpoints

| Méthode | URL           | Description                            | Paramètres d'URL | Paramètres de requête    | Réponse en cas de succès | Codes de réponse    |
| ------- | ------------- | -------------------------------------- | ---------------- | ------------------------ | ------------------------ | ------------------- |
| GET     | `/comics`     | Obtenir une liste de comics            | -                | `title`, `limit`, `skip` | `{ "data": [ ... ] }`    | `200`, `400`, `500` |
| GET     | `/comics/:id` | Obtenir un comic spécifique par son ID | `id`             | -                        | `{ "data": { ... } }`    | `200`, `400`, `500` |



### 4. Personnages

## Endpoints

| Méthode | URL           | Description                      | Paramètres d'URL | Paramètres de requête   | Réponse en cas de succès | Codes de réponse    |
| ------- | ------------- | -------------------------------- | ---------------- | ----------------------- | ------------------------ | ------------------- |
| GET     | `/characters` | Obtenir une liste de personnages | -                | `name`, `limit`, `skip` | `{ "data": [ ... ] }`    | `200`, `400`, `500` |
