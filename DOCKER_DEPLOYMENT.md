# Guide de Déploiement Docker - Notes de Frais

Ce guide explique comment dockeriser et déployer l'application Notes de Frais en utilisant Docker et Render.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture Docker](#architecture-docker)
- [Prérequis](#prérequis)
- [Build des images Docker](#build-des-images-docker)
- [Test local avec Docker Compose](#test-local-avec-docker-compose)
- [Déploiement sur Render](#déploiement-sur-render)
- [Variables d'environnement](#variables-denvironnement)
- [SQLite dans Docker](#sqlite-dans-docker)
- [Dépannage](#dépannage)

---

## Vue d'ensemble

L'application est maintenant entièrement dockerisée avec :
- ✅ **Backend Dockerfile** : Image optimisée multi-stage pour l'API NestJS
- ✅ **Frontend Dockerfile** : Image optimisée multi-stage pour le SPA React
- ✅ **docker-compose.yml** : Orchestration locale pour tests (non utilisé en production)
- ✅ **render.yaml** : Configuration Render pour déploiement Docker

### Avantages de la dockerisation

- **Cohérence** : Environnement identique en développement, test et production
- **Isolation** : Dépendances encapsulées dans les conteneurs
- **Portabilité** : Déploiement facile sur n'importe quelle plateforme Docker
- **Reproductibilité** : Builds déterministes et prévisibles

---

## Architecture Docker

### Structure des fichiers Docker

```
notes-de-frais/
├── backend/
│   └── Dockerfile              # Image backend (multi-stage)
├── frontend/
│   └── Dockerfile              # Image frontend (multi-stage)
├── docker-compose.yml          # Orchestration locale uniquement
├── .dockerignore               # Exclusions pour build Docker
└── render.yaml                 # Configuration Render (mode Docker)
```

### Images Docker

#### Backend (NestJS)
- **Base** : `node:20-alpine` (image légère)
- **Build multi-stage** : Séparation build/production
- **Port** : 10000 (configurable via `PORT`)
- **Health check** : `/api/v1/hello`
- **Taille finale** : ~250 MB

#### Frontend (React + Vite)
- **Base** : `node:20-alpine`
- **Serveur** : `serve` (serveur statique Node.js)
- **Build multi-stage** : Optimisation de la taille
- **Port** : 3000 (configurable via `PORT`)
- **SPA routing** : Gestion automatique du fallback vers `index.html`
- **Taille finale** : ~150 MB

---

## Prérequis

### Logiciels requis

- **Docker** : ≥ 20.10 ([Installation](https://docs.docker.com/get-docker/))
- **Docker Compose** : ≥ 2.0 (inclus avec Docker Desktop)
- **Git** : Pour cloner/pousser le code

### Vérification

```bash
# Vérifier Docker
docker --version
# Docker version 24.0.0 ou supérieur

# Vérifier Docker Compose
docker compose version
# Docker Compose version 2.20.0 ou supérieur
```

---

## Build des images Docker

### Backend

```bash
# Depuis la racine du projet
docker build -f backend/Dockerfile -t notes-frais-backend:latest .
```

**Détails du build** :
- Contexte : `.` (racine du projet, requis pour le monorepo)
- Dockerfile : `backend/Dockerfile`
- Tag : `notes-frais-backend:latest`
- Durée : ~3-5 minutes (première fois)

### Frontend

```bash
# Depuis la racine du projet
docker build -f frontend/Dockerfile -t notes-frais-frontend:latest .
```

**Détails du build** :
- Contexte : `.` (racine du projet, requis pour le monorepo)
- Dockerfile : `frontend/Dockerfile`
- Tag : `notes-frais-frontend:latest`
- Durée : ~2-4 minutes (première fois)

### Build des deux services

```bash
# Build backend et frontend ensemble
docker build -f backend/Dockerfile -t notes-frais-backend:latest . && \
docker build -f frontend/Dockerfile -t notes-frais-frontend:latest .
```

### Vérification des images

```bash
# Lister les images créées
docker images | grep notes-frais

# Résultat attendu :
# notes-frais-backend    latest    abc123...    2 minutes ago    250MB
# notes-frais-frontend   latest    def456...    1 minute ago     150MB
```

---

## Test local avec Docker Compose

### ⚠️ Avertissement important

Le fichier [`docker-compose.yml`](docker-compose.yml) est **UNIQUEMENT pour les tests locaux**. Ne l'utilisez jamais en production ou sur Render.

### Lancement de l'application

```bash
# Depuis la racine du projet

# Démarrer tous les services
docker compose up

# Ou en mode détaché (arrière-plan)
docker compose up -d
```

**Services démarrés** :
- Backend : http://localhost:3000
- Frontend : http://localhost:3001
- API Swagger : http://localhost:3000/api/docs

### Configuration locale

Les services utilisent les configurations suivantes :

| Service | Port | URL | Health Check |
|---------|------|-----|--------------|
| Backend | 3000 | http://localhost:3000 | ✅ Oui |
| Frontend | 3001 | http://localhost:3001 | ✅ Oui |

### Commandes utiles

```bash
# Voir les logs en temps réel
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f backend
docker compose logs -f frontend

# Vérifier l'état des services
docker compose ps

# Arrêter les services
docker compose down

# Arrêter et supprimer les volumes (efface la base de données)
docker compose down -v

# Rebuild complet
docker compose up --build

# Rebuild d'un service spécifique
docker compose up --build backend
```

### Vérifications post-démarrage

1. **Health checks** :
```bash
# Backend health check
curl http://localhost:3000/api/v1/hello

# Frontend health check
curl http://localhost:3001
```

2. **Accès Swagger** :
   - Ouvrir : http://localhost:3000/api/docs
   - Tester un endpoint

3. **Accès Frontend** :
   - Ouvrir : http://localhost:3001
   - Vérifier que l'interface se charge
   - Tester le routing SPA

4. **Communication Backend-Frontend** :
   - Ouvrir DevTools (F12)
   - Vérifier les appels API vers `http://localhost:3000/api/v1`
   - Aucune erreur CORS

### Persistance des données (local)

Docker Compose utilise un volume nommé pour persister la base SQLite :

```yaml
volumes:
  sqlite-data:
    driver: local
```

**Comportement** :
- Les données survivent aux redémarrages : `docker compose restart`
- Les données sont effacées avec : `docker compose down -v`

---

## Déploiement sur Render

### Architecture Render avec Docker

```
┌─────────────────────────────────────────────────────────────┐
│                         RENDER CLOUD                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐       ┌────────────────────────┐ │
│  │  Frontend (Docker)   │       │  Backend (Docker)      │ │
│  │                      │       │                        │ │
│  │  - Node:20-alpine    │◄──────┤  - Node:20-alpine      │ │
│  │  - Serve static      │ CORS  │  - NestJS API          │ │
│  │  - SPA routing       │       │  - SQLite (ephemeral)  │ │
│  │                      │       │  - Health checks       │ │
│  │  Port: 10000         │       │  Port: 10000           │ │
│  └──────────────────────┘       └────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Méthode 1 : Déploiement automatique avec render.yaml

**Étapes** :

1. **Pousser le code sur Git**
   ```bash
   git add .
   git commit -m "Add Docker configuration"
   git push origin main
   ```

2. **Créer un Blueprint sur Render**
   - Aller sur [Render Dashboard](https://dashboard.render.com)
   - Cliquer sur "New +" → "Blueprint"
   - Sélectionner votre repository
   - Render détecte automatiquement [`render.yaml`](render.yaml)

3. **Configurer les variables d'environnement**
   
   **Backend** :
   - `NODE_ENV` : `production` (auto-configuré)
   - `PORT` : `10000` (auto-configuré)
   - `DATABASE_PATH` : `/app/backend/database.sqlite` (auto-configuré)
   - `FRONTEND_URL` : ⚠️ **À configurer manuellement après le déploiement du frontend**

   **Frontend** :
   - `VITE_API_URL` : ⚠️ **À configurer manuellement après le déploiement du backend**
   - `PORT` : `10000` (auto-configuré)

4. **Déployer**
   - Cliquer sur "Apply"
   - Attendre la fin du build (~5-10 minutes)

5. **Configuration post-déploiement**
   
   a. **Noter les URLs** :
   - Backend : `https://notes-de-frais-api.onrender.com`
   - Frontend : `https://notes-de-frais-frontend.onrender.com`
   
   b. **Configurer FRONTEND_URL dans le backend** :
   - Aller dans les paramètres du service backend
   - Modifier `FRONTEND_URL` : `https://notes-de-frais-frontend.onrender.com`
   - Le service redémarre automatiquement
   
   c. **Configurer VITE_API_URL dans le frontend** :
   - Aller dans les paramètres du service frontend
   - Modifier `VITE_API_URL` : `https://notes-de-frais-api.onrender.com/api/v1`
   - Redéployer : "Manual Deploy" → "Clear build cache & deploy"

### Méthode 2 : Déploiement manuel

#### Backend

1. **Créer un Web Service**
   - Dashboard → "New +" → "Web Service"
   - Sélectionner votre repository

2. **Configuration**
   ```
   Name: notes-de-frais-api
   Region: Frankfurt
   Branch: main
   Environment: Docker
   Dockerfile Path: ./backend/Dockerfile
   Docker Context: .
   ```

3. **Variables d'environnement**
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_PATH=/app/backend/database.sqlite
   FRONTEND_URL=(à configurer après frontend)
   ```

4. **Health Check Path** : `/api/v1/hello`

5. **Créer le service** et attendre le déploiement

#### Frontend

1. **Créer un Web Service**
   - Dashboard → "New +" → "Web Service"
   - Sélectionner votre repository

2. **Configuration**
   ```
   Name: notes-de-frais-frontend
   Region: Frankfurt
   Branch: main
   Environment: Docker
   Dockerfile Path: ./frontend/Dockerfile
   Docker Context: .
   ```

3. **Variables d'environnement**
   ```
   VITE_API_URL=https://notes-de-frais-api.onrender.com/api/v1
   PORT=10000
   ```

4. **Créer le service** et attendre le déploiement

5. **Retourner configurer FRONTEND_URL dans le backend** (voir ci-dessus)

---

## Variables d'environnement

### Backend

| Variable | Local (Docker Compose) | Production (Render) | Description |
|----------|------------------------|---------------------|-------------|
| `NODE_ENV` | `production` | `production` | Environnement Node.js |
| `PORT` | `3000` | `10000` | Port d'écoute du serveur |
| `DATABASE_PATH` | `/app/backend/database.sqlite` | `/app/backend/database.sqlite` | Chemin base SQLite |
| `FRONTEND_URL` | `http://localhost:3001` | `https://your-frontend.onrender.com` | URL du frontend (CORS) |

### Frontend

| Variable | Local (Docker Compose) | Production (Render) | Description |
|----------|------------------------|---------------------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api/v1` | `https://your-backend.onrender.com/api/v1` | URL de l'API backend |
| `PORT` | `3000` | `10000` | Port serveur statique |

### Notes importantes

- **Variables Vite** : Les variables `VITE_*` doivent être définies au moment du **build**, pas au runtime
- **Render PORT** : Render injecte automatiquement `$PORT`, mais on peut le définir dans render.yaml
- **CORS** : `FRONTEND_URL` doit correspondre exactement à l'URL du frontend (avec `https://`)

---

## SQLite dans Docker

### ⚠️ Limitations importantes

#### Sur Render (Plan gratuit)

1. **Stockage éphémère**
   - La base de données est perdue à chaque redéploiement
   - Les conteneurs peuvent être supprimés/recréés automatiquement
   - **Recommandation** : Acceptable pour démo/test uniquement

2. **Pas de volume persistant**
   - Le plan gratuit ne supporte pas les volumes persistants
   - Les données ne survivent pas aux redémarrages de service

3. **Performance**
   - Performances limitées sur le plan gratuit
   - Pas de scaling horizontal possible avec SQLite

#### Solutions pour la production

##### Option 1 : PostgreSQL sur Render (Recommandé)

```bash
# 1. Créer une base PostgreSQL
# Dashboard → "New +" → "PostgreSQL"
# Plan: Free (90 jours de rétention)

# 2. Installer le driver PostgreSQL
cd backend
npm install pg

# 3. Modifier la configuration TypeORM
# backend/src/app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { rejectUnauthorized: false },
  // ... reste de la config
})

# 4. Ajouter les variables d'environnement Render
# DATABASE_HOST=xxx.render.com
# DATABASE_PORT=5432
# DATABASE_USERNAME=xxx
# DATABASE_PASSWORD=xxx
# DATABASE_NAME=xxx
```

##### Option 2 : Migrations TypeORM

Pour éviter la perte de données entre redéploiements avec SQLite :

```bash
# 1. Désactiver synchronize en production
# backend/src/app.module.ts
synchronize: process.env.NODE_ENV !== 'production',
migrationsRun: process.env.NODE_ENV === 'production',

# 2. Générer des migrations
npm run migration:generate -- -n InitialSchema

# 3. Exécuter au déploiement
# Ajouter au startCommand dans render.yaml
startCommand: npm run migration:run && npm run start:prod -w backend
```

### Configuration actuelle

#### Dockerfile Backend

```dockerfile
# Création du répertoire avec permissions
RUN mkdir -p /app/backend && chmod 777 /app/backend
```

#### Variables d'environnement

```yaml
DATABASE_PATH: /app/backend/database.sqlite
```

### Accès à la base de données

#### Local (Docker Compose)

```bash
# Accéder au conteneur backend
docker compose exec backend sh

# Vérifier la base de données
ls -lh /app/backend/database.sqlite

# Installer sqlite3 CLI (optionnel)
apk add sqlite
sqlite3 /app/backend/database.sqlite ".tables"
```

#### Render

```bash
# Via le Render Shell (dashboard)
# Settings → "Shell" tab
ls -lh /app/backend/
```

---

## Dépannage

### Problème : Build Docker échoue localement

**Symptômes** : Erreur pendant `docker build`

**Solutions** :

1. **Vérifier le contexte de build**
   ```bash
   # Le contexte DOIT être la racine du projet (.)
   docker build -f backend/Dockerfile -t notes-frais-backend:latest .
   #                                                                 ^
   #                                                          Point important !
   ```

2. **Vérifier .dockerignore**
   ```bash
   # S'assurer que node_modules/ est exclu
   cat .dockerignore | grep node_modules
   ```

3. **Nettoyer le cache Docker**
   ```bash
   docker build --no-cache -f backend/Dockerfile -t notes-frais-backend:latest .
   ```

4. **Vérifier l'espace disque**
   ```bash
   docker system df
   docker system prune -a  # Attention : supprime toutes les images inutilisées
   ```

### Problème : Erreur "ENOENT: no such file or directory"

**Symptômes** : Le build ne trouve pas les fichiers `shared/` ou `backend/`

**Cause** : Mauvais contexte de build

**Solution** :
```bash
# ❌ INCORRECT
cd backend
docker build -t notes-frais-backend:latest .

# ✅ CORRECT
docker build -f backend/Dockerfile -t notes-frais-backend:latest .
```

### Problème : Conteneur backend ne démarre pas

**Symptômes** : Le conteneur se termine immédiatement

**Diagnostic** :

```bash
# Voir les logs du conteneur
docker compose logs backend

# Ou pour une image isolée
docker run --rm notes-frais-backend:latest
```

**Solutions courantes** :

1. **Port déjà utilisé**
   ```bash
   # Changer le port dans docker-compose.yml
   ports:
     - "3001:3000"  # au lieu de 3000:3000
   ```

2. **Variable d'environnement manquante**
   ```bash
   # Vérifier les variables
   docker compose config
   ```

### Problème : Frontend ne peut pas communiquer avec le backend

**Symptômes** : Erreurs CORS ou "Failed to fetch"

**Solutions** :

1. **Vérifier FRONTEND_URL dans le backend**
   ```bash
   # Dans docker-compose.yml
   backend:
     environment:
       - FRONTEND_URL=http://localhost:3001  # Doit matcher le frontend
   ```

2. **Vérifier VITE_API_URL dans le frontend**
   ```bash
   # Le frontend doit pointer vers le backend
   # Local: http://localhost:3000/api/v1
   # Render: https://your-backend.onrender.com/api/v1
   ```

3. **Vérifier la configuration CORS** ([`backend/src/main.ts`](backend/src/main.ts:14))
   ```typescript
   app.enableCors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     credentials: true,
   });
   ```

### Problème : Image Docker trop grande

**Symptômes** : Build lent, image > 500 MB

**Solutions** :

1. **Vérifier le multi-stage build**
   - Builder stage : Avec dev dependencies
   - Production stage : Sans dev dependencies

2. **Optimiser .dockerignore**
   ```
   node_modules/
   dist/
   **/__tests__/
   **/*.test.ts
   *.md
   ```

3. **Analyser la taille de l'image**
   ```bash
   docker images notes-frais-backend:latest
   docker history notes-frais-backend:latest
   ```

### Problème : Render build timeout

**Symptômes** : Le build dépasse 15 minutes et échoue

**Solutions** :

1. **Optimiser le Dockerfile**
   - Copier `package*.json` avant le code source
   - Utiliser `npm ci` au lieu de `npm install`
   - Minimiser les layers Docker

2. **Utiliser le cache Docker de Render**
   - Render met en cache les layers Docker
   - Éviter `--no-cache` en production

3. **Vérifier les dépendances**
   ```bash
   # Local : tester le temps de build
   time docker build -f backend/Dockerfile -t test .
   ```

### Problème : Service Render en erreur 503

**Symptômes** : Service déployé mais inaccessible

**Solutions** :

1. **Vérifier que le port est correct**
   ```dockerfile
   # Le conteneur DOIT écouter sur $PORT (10000 sur Render)
   ENV PORT=10000
   EXPOSE ${PORT}
   ```

2. **Vérifier le health check**
   - Health Check Path: `/api/v1/hello`
   - Le endpoint doit retourner 200 OK

3. **Consulter les logs Render**
   - Dashboard → Service → "Logs"
   - Chercher les erreurs de démarrage

4. **Vérifier la commande de démarrage**
   ```dockerfile
   CMD ["npm", "run", "start:prod", "-w", "backend"]
   ```

### Problème : SQLite database is locked

**Symptômes** : Erreur "database is locked" dans les logs

**Cause** : Accès concurrent non géré par SQLite

**Solutions** :

1. **Court terme : Augmenter le timeout**
   ```typescript
   // backend TypeORM config
   extra: {
     max_connections: 1,
     busy_timeout: 30000
   }
   ```

2. **Long terme : Migrer vers PostgreSQL**
   - SQLite n'est pas conçu pour la concurrence élevée
   - Voir "Option 1 : PostgreSQL sur Render" ci-dessus

---

## Checklist de déploiement

### Préparation locale

- [ ] Les Dockerfiles existent et sont valides
- [ ] `.dockerignore` est configuré
- [ ] `docker-compose.yml` existe (pour tests locaux)
- [ ] Le code compile sans erreurs : `npm run build`
- [ ] Les tests passent : `npm run test`

### Build et test Docker local

- [ ] Backend build réussit : `docker build -f backend/Dockerfile -t notes-frais-backend .`
- [ ] Frontend build réussit : `docker build -f frontend/Dockerfile -t notes-frais-frontend .`
- [ ] Docker Compose démarre : `docker compose up`
- [ ] Backend accessible : http://localhost:3000/api/docs
- [ ] Frontend accessible : http://localhost:3001
- [ ] Communication backend-frontend fonctionne
- [ ] SQLite database créée et fonctionnelle

### Déploiement Render

- [ ] Code poussé sur Git : `git push`
- [ ] `render.yaml` configuré en mode Docker
- [ ] Blueprint créé sur Render
- [ ] Backend déployé avec succès
- [ ] Frontend déployé avec succès
- [ ] URLs notées (backend et frontend)

### Configuration post-déploiement

- [ ] `FRONTEND_URL` configuré dans le backend
- [ ] `VITE_API_URL` configuré dans le frontend
- [ ] Frontend redéployé après modification de `VITE_API_URL`
- [ ] Backend redémarré après modification de `FRONTEND_URL`

### Vérification finale

- [ ] Backend accessible : `https://your-backend.onrender.com/api/docs`
- [ ] Frontend accessible : `https://your-frontend.onrender.com`
- [ ] Health checks OK (green status sur Render)
- [ ] Pas d'erreurs CORS
- [ ] Création de données fonctionne
- [ ] Routing SPA fonctionne (refresh sur une sous-route)

---

## Ressources

### Documentation Docker

- [Docker Documentation](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

### Documentation Render

- [Render Docker Deployment](https://render.com/docs/docker)
- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Render Health Checks](https://render.com/docs/health-checks)

### Documentation NestJS/React

- [NestJS Docker](https://docs.nestjs.com/recipes/docker)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [React Router SPA Deployment](https://reactrouter.com/en/main/guides/spa)

---

## Support

Pour toute question ou problème :

1. Consulter ce guide de dépannage
2. Vérifier les logs Docker : `docker compose logs`
3. Vérifier les logs Render : Dashboard → Service → "Logs"
4. Consulter la [documentation Render](https://render.com/docs)

---

**Document créé le** : 2026-01-18  
**Dernière mise à jour** : 2026-01-18  
**Version** : 1.0.0
