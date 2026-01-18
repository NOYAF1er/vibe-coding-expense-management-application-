# Docker Quick Start Guide - Notes de Frais

Guide de démarrage rapide pour la dockerisation et le déploiement.

## 🚀 Démarrage rapide local

### Prérequis
- Docker installé (≥ 20.10)
- Docker Compose installé (≥ 2.0)

### Lancer l'application avec Docker Compose

```bash
# Depuis la racine du projet
docker compose up -d

# Vérifier que les services sont lancés
docker compose ps

# Voir les logs
docker compose logs -f
```

**Accès** :
- Frontend : http://localhost:3001
- Backend API : http://localhost:3000
- Swagger : http://localhost:3000/api/docs

### Arrêter l'application

```bash
# Arrêter les services
docker compose down

# Arrêter et supprimer les données
docker compose down -v
```

---

## 🏗️ Build manuel des images

### Backend

```bash
docker build -f backend/Dockerfile -t notes-frais-backend:latest .
```

### Frontend

```bash
docker build -f frontend/Dockerfile -t notes-frais-frontend:latest .
```

### Tester les images

```bash
# Backend (remplacer FRONTEND_URL si nécessaire)
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DATABASE_PATH=/app/backend/database.sqlite \
  -e FRONTEND_URL=http://localhost:3001 \
  notes-frais-backend:latest

# Frontend (remplacer VITE_API_URL si nécessaire)
docker run -p 3001:3000 \
  -e PORT=3000 \
  notes-frais-frontend:latest
```

---

## ☁️ Déploiement sur Render

### Méthode automatique (recommandée)

1. **Pousser le code sur Git**
   ```bash
   git add .
   git commit -m "Add Docker configuration"
   git push origin main
   ```

2. **Sur Render Dashboard**
   - New + → Blueprint
   - Sélectionner votre repository
   - Render détecte automatiquement `render.yaml`
   - Cliquer sur "Apply"

3. **Configurer les URLs après déploiement**
   
   a. Noter les URLs déployées :
   - Backend : `https://notes-de-frais-api.onrender.com`
   - Frontend : `https://notes-de-frais-frontend.onrender.com`
   
   b. Backend → Settings → Environment :
   - `FRONTEND_URL` = `https://notes-de-frais-frontend.onrender.com`
   
   c. Frontend → Settings → Environment :
   - `VITE_API_URL` = `https://notes-de-frais-api.onrender.com/api/v1`
   - Manual Deploy → Clear build cache & deploy

---

## 📋 Checklist de vérification

### Local (Docker Compose)

- [ ] `docker compose up` démarre sans erreur
- [ ] Backend : http://localhost:3000/api/v1/hello retourne 200 OK
- [ ] Swagger : http://localhost:3000/api/docs affiche la documentation
- [ ] Frontend : http://localhost:3001 affiche l'interface
- [ ] Communication frontend-backend fonctionne (pas d'erreur CORS)
- [ ] Routing SPA fonctionne (actualiser sur une sous-route)

### Render

- [ ] Backend service déployé avec succès (status: Live)
- [ ] Frontend service déployé avec succès (status: Live)
- [ ] `FRONTEND_URL` configuré dans le backend
- [ ] `VITE_API_URL` configuré dans le frontend
- [ ] Backend : `https://your-backend.onrender.com/api/docs` accessible
- [ ] Frontend : `https://your-frontend.onrender.com` accessible
- [ ] Health checks verts sur Render dashboard
- [ ] Pas d'erreurs CORS dans la console du navigateur

---

## 🛠️ Commandes utiles

### Docker Compose

```bash
# Rebuild complet
docker compose up --build

# Rebuild un service spécifique
docker compose up --build backend

# Voir les logs d'un service
docker compose logs -f backend

# Accéder au shell d'un conteneur
docker compose exec backend sh

# Vérifier l'état des services
docker compose ps

# Supprimer tout (services + volumes)
docker compose down -v
```

### Docker

```bash
# Lister les images
docker images | grep notes-frais

# Supprimer une image
docker rmi notes-frais-backend:latest

# Nettoyer le cache Docker
docker system prune -a

# Voir l'utilisation de l'espace disque
docker system df
```

### Render

```bash
# Health check backend
curl https://your-backend.onrender.com/api/v1/hello

# Tester CORS
curl -H "Origin: https://your-frontend.onrender.com" \
  -I https://your-backend.onrender.com/api/v1/hello
```

---

## ⚠️ Points d'attention

### SQLite sur Render

- **Stockage éphémère** : Les données sont perdues à chaque redéploiement
- **Solution** : Migrer vers PostgreSQL pour la production
- **voir** : [`DOCKER_DEPLOYMENT.md`](DOCKER_DEPLOYMENT.md#sqlite-dans-docker)

### Variables d'environnement Vite

- Les variables `VITE_*` doivent être définies **avant le build**
- Si vous changez `VITE_API_URL`, il faut **redéployer** le frontend
- Render : Manual Deploy → Clear build cache & deploy

### CORS

- `FRONTEND_URL` dans le backend doit correspondre **exactement** à l'URL du frontend
- Format : `https://your-frontend.onrender.com` (sans slash final)
- Inclure le protocole (`https://`)

---

## 📚 Documentation complète

Pour plus de détails, consulter :
- [`DOCKER_DEPLOYMENT.md`](DOCKER_DEPLOYMENT.md) - Guide complet Docker et Render
- [`DEPLOYMENT.md`](DEPLOYMENT.md) - Guide de déploiement Render (mode non-Docker)
- [`docker-compose.yml`](docker-compose.yml) - Configuration Docker Compose
- [`render.yaml`](render.yaml) - Configuration Render Blueprint

---

## 🆘 Problèmes courants

### Build échoue : "ENOENT: no such file or directory"

**Cause** : Mauvais contexte de build

**Solution** :
```bash
# ❌ INCORRECT
cd backend && docker build -t backend .

# ✅ CORRECT
docker build -f backend/Dockerfile -t backend .
```

### Conteneur se termine immédiatement

**Diagnostic** :
```bash
docker compose logs backend
```

**Causes** :
- Port déjà utilisé → Changer le port dans docker-compose.yml
- Variable d'environnement manquante → Vérifier `docker compose config`

### CORS errors

**Vérifier** :
1. `FRONTEND_URL` dans le backend match l'URL du frontend
2. Format : `https://domain.com` (sans `/` final)
3. Configuration CORS dans [`backend/src/main.ts`](backend/src/main.ts)

### Render : Service 503

**Vérifier** :
1. Health check path : `/api/v1/hello`
2. Le conteneur écoute sur `$PORT` (10000)
3. Logs Render pour erreurs de démarrage

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2026-01-18
