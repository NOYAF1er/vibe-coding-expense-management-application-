# Déploiement sur Render

Ce document décrit la procédure complète pour déployer l'application Notes de Frais sur la plateforme [Render](https://render.com).

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Prérequis](#prérequis)
- [Architecture de déploiement](#architecture-de-déploiement)
- [Variables d'environnement](#variables-denvironnement)
- [Déploiement du Backend (API)](#déploiement-du-backend-api)
- [Déploiement du Frontend (SPA)](#déploiement-du-frontend-spa)
- [Configuration SQLite sur Render](#configuration-sqlite-sur-render)
- [Vérification post-déploiement](#vérification-post-déploiement)
- [Dépannage](#dépannage)

---

## Vue d'ensemble

L'application Notes de Frais est déployée en deux services séparés sur Render :

1. **Backend API** - Web Service Node.js (NestJS)
2. **Frontend** - Site statique (React/Vite)

### Fichier de configuration

Le fichier [`render.yaml`](render.yaml) à la racine du projet contient la configuration complète pour les deux services. Vous pouvez :

- **Option A** : Utiliser le fichier `render.yaml` pour un déploiement automatisé
- **Option B** : Créer les services manuellement via le dashboard Render

---

## Prérequis

- Compte [Render](https://render.com) (gratuit ou payant)
- Repository Git avec le code source (GitHub, GitLab, ou Bitbucket)
- Node.js 20+ (spécifié dans les configurations)
- NPM 10+ (spécifié dans les configurations)

---

## Architecture de déploiement

```
┌─────────────────────────────────────────────────────────────┐
│                         RENDER CLOUD                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐       ┌────────────────────────┐ │
│  │   Frontend (Static)  │       │   Backend (Web Service)│ │
│  │                      │       │                        │ │
│  │  - React SPA         │◄──────┤  - NestJS API          │ │
│  │  - Vite Build        │ CORS  │  - TypeORM             │ │
│  │  - Tailwind CSS      │       │  - SQLite Database     │ │
│  │  - Client Routing    │       │  - Swagger Docs        │ │
│  │                      │       │                        │ │
│  │  URL: frontend-url   │       │  URL: backend-url      │ │
│  └──────────────────────┘       └────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Variables d'environnement

### Backend (API)

| Variable | Description | Valeur Production | Requis |
|----------|-------------|-------------------|--------|
| `NODE_ENV` | Environnement Node.js | `production` | ✅ Oui |
| `PORT` | Port d'écoute du serveur | `10000` (Render par défaut) | ✅ Oui |
| `DATABASE_PATH` | Chemin vers la base SQLite | `/opt/render/project/src/backend/database.sqlite` | ✅ Oui |
| `FRONTEND_URL` | URL du frontend pour CORS | `https://votre-frontend.onrender.com` | ✅ Oui |

**⚠️ Important** : `FRONTEND_URL` doit être configuré **après** le déploiement du frontend.

### Frontend (SPA)

| Variable | Description | Valeur Production | Requis |
|----------|-------------|-------------------|--------|
| `VITE_API_URL` | URL de l'API backend | `https://votre-backend.onrender.com/api/v1` | ✅ Oui |

**⚠️ Important** : `VITE_API_URL` doit être configuré **après** le déploiement du backend.

---

## Déploiement du Backend (API)

### Option A : Déploiement automatique avec render.yaml

1. **Connecter votre repository à Render**
   - Allez sur [Render Dashboard](https://dashboard.render.com)
   - Cliquez sur "New +" → "Blueprint"
   - Sélectionnez votre repository
   - Render détectera automatiquement le fichier `render.yaml`

2. **Configurer les variables d'environnement**
   - Laissez `FRONTEND_URL` vide pour l'instant
   - Les autres variables sont déjà configurées dans `render.yaml`

3. **Déployer**
   - Cliquez sur "Apply"
   - Attendez la fin du déploiement (~5-10 minutes)

### Option B : Déploiement manuel

1. **Créer un nouveau Web Service**
   - Allez sur [Render Dashboard](https://dashboard.render.com)
   - Cliquez sur "New +" → "Web Service"
   - Sélectionnez votre repository

2. **Configuration du service**
   ```
   Name: notes-de-frais-api
   Region: Frankfurt (ou autre)
   Branch: main
   Runtime: Node
   Build Command: npm install && npm run build -w shared && npm run build -w backend
   Start Command: npm run start:prod -w backend
   ```

3. **Variables d'environnement**
   - Ajoutez les variables listées ci-dessus
   - Laissez `FRONTEND_URL` vide pour l'instant

4. **Options avancées**
   ```
   Plan: Free (ou autre selon besoins)
   Health Check Path: /api/v1/hello
   ```

5. **Créer le service**
   - Cliquez sur "Create Web Service"
   - Attendez la fin du déploiement

6. **Noter l'URL du backend**
   - Exemple : `https://notes-de-frais-api.onrender.com`
   - Vous en aurez besoin pour configurer le frontend

---

## Déploiement du Frontend (SPA)

### Option A : Déploiement automatique avec render.yaml

Si vous avez utilisé l'Option A pour le backend, le frontend sera déployé automatiquement en même temps.

1. **Configurer la variable d'environnement**
   - Allez dans les paramètres du service frontend
   - Ajoutez `VITE_API_URL` avec l'URL de votre backend
   - Exemple : `https://notes-de-frais-api.onrender.com/api/v1`

2. **Redéployer**
   - Cliquez sur "Manual Deploy" → "Clear build cache & deploy"

### Option B : Déploiement manuel

1. **Créer un nouveau Static Site**
   - Allez sur [Render Dashboard](https://dashboard.render.com)
   - Cliquez sur "New +" → "Static Site"
   - Sélectionnez votre repository

2. **Configuration du service**
   ```
   Name: notes-de-frais-frontend
   Region: Frankfurt (même région que le backend)
   Branch: main
   Build Command: npm install && npm run build -w shared && npm run build -w frontend
   Publish Directory: ./frontend/dist
   ```

3. **Variables d'environnement**
   - Ajoutez `VITE_API_URL` avec l'URL de votre backend
   - Exemple : `https://notes-de-frais-api.onrender.com/api/v1`

4. **Configuration du routage SPA**
   - Dans "Redirects/Rewrites", ajoutez :
     ```
     Source: /*
     Destination: /index.html
     Action: Rewrite
     ```

5. **Créer le service**
   - Cliquez sur "Create Static Site"
   - Attendez la fin du déploiement

6. **Noter l'URL du frontend**
   - Exemple : `https://notes-de-frais-frontend.onrender.com`

---

## Configuration finale : CORS et URLs croisées

### Étape 1 : Mettre à jour FRONTEND_URL dans le backend

1. Allez dans les paramètres du service backend
2. Modifiez la variable `FRONTEND_URL`
3. Valeur : URL complète de votre frontend (ex: `https://notes-de-frais-frontend.onrender.com`)
4. Sauvegardez - le service redémarrera automatiquement

### Étape 2 : Vérifier VITE_API_URL dans le frontend

1. Allez dans les paramètres du service frontend
2. Vérifiez que `VITE_API_URL` pointe vers votre backend
3. Valeur : URL complète de votre backend avec `/api/v1` (ex: `https://notes-de-frais-api.onrender.com/api/v1`)
4. Si vous avez modifié, redéployez le frontend

---

## Configuration SQLite sur Render

### ⚠️ Limitations importantes de SQLite sur Render

**SQLite fonctionne sur Render, mais avec des contraintes importantes :**

1. **Stockage éphémère** : La base de données SQLite est stockée dans le système de fichiers du conteneur. Sur le plan gratuit, le conteneur peut être supprimé et recréé, **entraînant la perte de toutes les données**.

2. **Pas de volume persistant (plan gratuit)** : Le plan gratuit ne supporte pas les volumes persistants. Les données sont perdues à chaque redéploiement.

3. **Recommandations pour la production** :
   - **Court terme** : SQLite est acceptable pour des tests et démonstrations
   - **Moyen/Long terme** : Migrer vers une base de données managée :
     - PostgreSQL (Render propose un service PostgreSQL gratuit avec 90 jours de rétention)
     - MySQL
     - MongoDB Atlas

### Configuration actuelle

Dans [`render.yaml`](render.yaml), la base de données est configurée ainsi :

```yaml
envVars:
  - key: DATABASE_PATH
    value: /opt/render/project/src/backend/database.sqlite
```

### Initialisation de la base de données

Le backend utilise TypeORM avec `synchronize: true` (à vérifier dans la configuration). Cela signifie :

- ✅ Les tables sont créées automatiquement au démarrage
- ✅ Le schéma est synchronisé avec les entités TypeORM
- ⚠️ **Attention** : En production, il est recommandé d'utiliser des migrations plutôt que `synchronize: true`

### Seeding des données

Pour initialiser la base avec des données de test :

1. **Option manuelle** : Via Swagger UI après le déploiement
   - Accédez à `https://votre-backend.onrender.com/api/docs`
   - Utilisez les endpoints pour créer des données

2. **Option Script** : Ajouter un script de seed au déploiement
   - Modifier le `startCommand` dans `render.yaml` :
     ```yaml
     startCommand: npm run seed -w backend && npm run start:prod -w backend
     ```
   - ⚠️ Attention : Le seed sera exécuté à chaque redémarrage

### Migration vers PostgreSQL (recommandé)

Pour une solution plus robuste :

1. **Créer une base PostgreSQL sur Render**
   - Dashboard → "New +" → "PostgreSQL"
   - Plan gratuit disponible (90 jours de rétention)

2. **Modifier les variables d'environnement**
   - Remplacer `DATABASE_PATH` par des variables PostgreSQL
   - Exemple :
     ```
     DATABASE_TYPE=postgres
     DATABASE_HOST=xxx.render.com
     DATABASE_PORT=5432
     DATABASE_USERNAME=xxx
     DATABASE_PASSWORD=xxx
     DATABASE_NAME=xxx
     ```

3. **Installer le driver PostgreSQL**
   - Ajouter `pg` dans [`backend/package.json`](backend/package.json)
   - Mettre à jour la configuration TypeORM

4. **Utiliser des migrations TypeORM**
   - Générer des migrations : `npm run migration:generate`
   - Exécuter au déploiement : `npm run migration:run`

---

## Vérification post-déploiement

### Backend API

1. **Health Check**
   ```bash
   curl https://votre-backend.onrender.com/api/v1/hello
   ```
   Réponse attendue : `200 OK`

2. **Swagger Documentation**
   - Ouvrez : `https://votre-backend.onrender.com/api/docs`
   - Vérifiez que tous les endpoints sont documentés
   - Testez un endpoint simple (ex: GET /api/v1/hello)

3. **Vérifier les logs**
   - Dans le dashboard Render, section "Logs"
   - Recherchez : `🚀 Backend running on`
   - Recherchez : `📚 Swagger docs`

### Frontend

1. **Accès à l'application**
   - Ouvrez : `https://votre-frontend.onrender.com`
   - Vérifiez que l'interface se charge correctement

2. **Routing SPA**
   - Accédez à une route spécifique (ex: `/reports`)
   - Actualisez la page (F5)
   - La page devrait se charger sans erreur 404

3. **Communication avec l'API**
   - Ouvrez les DevTools du navigateur (F12)
   - Onglet "Network"
   - Vérifiez les appels API vers votre backend
   - Vérifiez qu'il n'y a pas d'erreurs CORS

### Tests de bout en bout

1. **Créer un rapport de frais**
   - Testez la création depuis l'interface
   - Vérifiez que les données sont sauvegardées

2. **Ajouter une dépense**
   - Ajoutez une dépense à un rapport
   - Vérifiez la persistance

3. **Vérifier les données via Swagger**
   - Allez sur `/api/docs`
   - Exécutez GET sur les différents endpoints
   - Vérifiez la cohérence des données

---

## Dépannage

### Problème : Build échoue au déploiement

**Symptômes** : Erreur pendant `npm install` ou `npm run build`

**Solutions** :
1. Vérifiez que le `buildCommand` est correct dans `render.yaml`
2. Vérifiez que toutes les dépendances sont dans `package.json`
3. Vérifiez que la version Node.js est compatible (≥20.0.0)
4. Regardez les logs détaillés dans le dashboard Render

### Problème : Backend démarre mais renvoie 503

**Symptômes** : Service déployé mais inaccessible

**Solutions** :
1. Vérifiez que le port utilisé est celui fourni par Render (`process.env.PORT`)
2. Vérifiez le Health Check Path : `/api/v1/hello`
3. Regardez les logs du service pour les erreurs
4. Vérifiez que le `startCommand` est correct : `npm run start:prod -w backend`

### Problème : Erreurs CORS

**Symptômes** : Frontend ne peut pas communiquer avec le backend

**Solutions** :
1. Vérifiez que `FRONTEND_URL` est correctement configuré dans le backend
2. Vérifiez que l'URL inclut le protocole (`https://`)
3. Vérifiez que l'URL ne contient pas de slash final
4. Dans [`backend/src/main.ts`](backend/src/main.ts:14), vérifiez la configuration CORS

### Problème : Frontend affiche une page blanche

**Symptômes** : Page blanche ou erreur 404 sur les routes

**Solutions** :
1. Vérifiez que `VITE_API_URL` est correctement configuré
2. Vérifiez le routing SPA dans les paramètres Render (Rewrite `/*` → `/index.html`)
3. Vérifiez les logs de build pour des erreurs TypeScript
4. Ouvrez les DevTools (F12) et regardez les erreurs console

### Problème : Base de données vide après redéploiement

**Symptômes** : Données perdues après chaque déploiement

**Explication** : C'est normal avec SQLite sur Render (stockage éphémère)

**Solutions** :
1. **Court terme** : Ré-exécuter le script de seed après chaque déploiement
2. **Long terme** : Migrer vers PostgreSQL (voir section "Migration vers PostgreSQL")

### Problème : TypeORM synchronization errors

**Symptômes** : Erreurs liées à la synchronisation du schéma

**Solutions** :
1. Vérifiez que `synchronize` est configuré correctement
2. Pour la production, envisagez d'utiliser des migrations :
   ```typescript
   // Dans la config TypeORM
   synchronize: process.env.NODE_ENV !== 'production',
   migrationsRun: process.env.NODE_ENV === 'production',
   ```

### Problème : Service se met en veille (plan gratuit)

**Symptômes** : Première requête lente (30+ secondes)

**Explication** : Sur le plan gratuit Render, les services se mettent en veille après 15 minutes d'inactivité

**Solutions** :
1. Accepter ce comportement (délai initial uniquement)
2. Utiliser un service de ping externe pour garder le service actif
3. Passer à un plan payant (pas de mise en veille)

---

## Commandes utiles

### Rebuild complet

```bash
# Dans le dashboard Render
Manual Deploy → Clear build cache & deploy
```

### Vérifier les logs en temps réel

```bash
# Dans le dashboard Render
Onglet "Logs" → Activer "Auto-scroll"
```

### Tester l'API en local avant déploiement

```bash
# Depuis la racine du projet
npm install
npm run build
NODE_ENV=production npm run start:prod -w backend
```

### Tester le build frontend en local

```bash
# Depuis la racine du projet
npm install
npm run build -w frontend
npm run preview -w frontend
```

---

## Checklist de déploiement

Avant de déployer :

- [ ] Le code est poussé sur le repository Git
- [ ] `render.yaml` est configuré correctement
- [ ] Les tests passent en local (`npm run test`)
- [ ] Le build fonctionne en local (`npm run build`)
- [ ] Les variables d'environnement sont documentées

Après le déploiement du backend :

- [ ] Le service démarre sans erreurs
- [ ] Health check retourne 200 OK
- [ ] Swagger UI est accessible
- [ ] L'URL du backend est notée

Après le déploiement du frontend :

- [ ] L'interface se charge correctement
- [ ] Le routing SPA fonctionne (actualisation sur une route spécifique)
- [ ] `VITE_API_URL` pointe vers le bon backend

Configuration finale :

- [ ] `FRONTEND_URL` est configuré dans le backend
- [ ] Les appels API fonctionnent (pas d'erreurs CORS)
- [ ] Les données sont persistées correctement
- [ ] Les deux services communiquent correctement

---

## Ressources

- [Documentation Render](https://render.com/docs)
- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
- [Render Static Sites](https://render.com/docs/static-sites)
- [Render Web Services](https://render.com/docs/web-services)
- [NestJS Deployment](https://docs.nestjs.com/faq/deployment)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

---

## Support

Pour toute question ou problème :

1. Consultez la [documentation Render](https://render.com/docs)
2. Vérifiez les logs dans le dashboard Render
3. Consultez les [exemples de déploiement Render](https://github.com/render-examples)
