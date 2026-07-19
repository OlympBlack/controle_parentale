# Contrôle Parentale

Application de contrôle parental permettant aux parents de superviser et gérer l'activité de leurs enfants (temps d'écran, règles de filtrage, géolocalisation, notifications, etc.).

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| **Backend** | Laravel 13 (PHP 8.3), API REST avec Sanctum |
| **Frontend** | React 19, TypeScript, Vite 8, TailwindCSS 4 |
| **Base de données** | MySQL 8.0 |
| **Cache / Queue** | Redis 7 |
| **Documentation API** | Swagger (l5-swagger) |

## Structure du projet

```
controle_parentale/
├── backend/                # API Laravel
│   ├── app/
│   ├── routes/api.php      # Routes API
│   ├── database/migrations/
│   └── .env.example
├── frontend/               # SPA React
│   ├── src/
│   └── vite.config.ts
└── README.md
```

---

## Démarrage en local (développement)

### Prérequis

- **PHP** 8.3+
- **Composer** 2+
- **Node.js** 20+ et **npm**
- **MySQL** 8.0+
- **Redis** (optionnel pour le dev local)

### 1. Backend (Laravel)

```bash
cd backend

# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# DB_DATABASE=controle_parentale
# DB_USERNAME=root
# DB_PASSWORD=

# Migrer la base de données
php artisan migrate

# (Optionnel) Seed avec des données de test
php artisan db:seed

# Démarrer le serveur de développement
php artisan serve
```

Le backend est accessible sur `http://localhost:8000`.

Pour lancer simultanément le serveur, les queues, les logs et Vite :

```bash
composer dev
```

### 2. Frontend (React)

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend est accessible sur `http://localhost:3000`.

Le proxy Vite est configuré pour rediriger `/api` vers `http://localhost:8000` (voir `frontend/vite.config.ts`).

### 3. Build de production

```bash
# Backend
cd backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend
cd frontend
npm run build
# Les fichiers sont générés dans frontend/dist/
```

---

## API

La documentation Swagger est disponible à :

```
http://localhost:8000/api/documentation   # en local
https://votre-domaine.com/api/documentation  # en production
```

### Authentification

L'API utilise **Laravel Sanctum** (token Bearer).

```bash
# Inscription
POST /api/register

# Connexion (retourne un token)
POST /api/login

# Routes protégées
GET /api/me
Authorization: Bearer <token>
```

---

## Tests

```bash
# Backend
cd backend
php artisan test

# Frontend
cd frontend
npm run lint
```

---

## Variables d'environnement clés

| Variable | Description | Défaut |
|----------|-------------|--------|
| `APP_ENV` | Environnement (`local`, `production`) | `local` |
| `APP_DEBUG` | Mode debug | `true` / `false` |
| `APP_URL` | URL de l'application | `http://localhost` |
| `DB_HOST` | Hôte MySQL | `127.0.0.1` |
| `DB_DATABASE` | Nom de la BDD | `controle_parentale` |
| `REDIS_HOST` | Hôte Redis | `127.0.0.1` |
| `CACHE_STORE` | Driver de cache | `database` / `redis` |
| `QUEUE_CONNECTION` | Driver de queue | `database` / `redis` |
| `FRONTEND_URL` | URL du frontend | `http://localhost:3000` |
| `VITE_API_URL` | URL de l'API pour le frontend | `/api` |
