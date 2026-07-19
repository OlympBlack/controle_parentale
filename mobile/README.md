# SafeKid — Application Mobile (React Native / Expo)

Application mobile parentale pour le contrôle parental SafeKid.

## Prérequis

- Node.js 18+
- Expo CLI (`npm install -g expo-cli` ou utiliser `npx expo`)
- Backend Laravel démarré sur `http://localhost:8000`

## Installation

```bash
cd mobile
npm install
```

## Configuration

### Variables d'environnement

Le fichier `.env` à la racine de `/mobile` contient :

```
EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

Modifiez cette URL si votre backend tourne sur une autre adresse (ex: `http://192.168.x.x:8000/api` pour un appareil physique).

### Connexion au backend Laravel

1. Démarrez le backend Laravel :
   ```bash
   cd backend
   php artisan serve
   ```
2. Vérifiez que l'API est accessible sur `http://localhost:8000/api`

## Lancement

```bash
npx expo start
```

Puis scannez le QR code avec l'app **Expo Go** (iOS/Android) ou appuyez sur :
- `a` pour lancer sur Android (émulateur)
- `i` pour lancer sur iOS (simulateur, macOS uniquement)
- `w` pour lancer sur le web

## Architecture

```
mobile/
├── App.tsx                    # Point d'entrée
├── app.json                   # Configuration Expo
├── .env                       # Variables d'environnement
├── src/
│   ├── components/            # Composants UI réutilisables (Button, Input, Card, Badge)
│   ├── constants/             # Constantes (config API, clés de stockage)
│   ├── navigation/            # React Navigation (Root, Auth, App navigators)
│   ├── screens/               # Écrans de l'application
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ChildrenScreen.tsx
│   │   ├── ChildDetailScreen.tsx
│   │   ├── RulesScreen.tsx
│   │   ├── AlertsScreen.tsx
│   │   ├── ReportsScreen.tsx
│   │   └── LoadingScreen.tsx
│   ├── services/              # Appels API (Axios + intercepteurs)
│   ├── store/                 # State management (Zustand)
│   ├── theme/                 # Design system (couleurs, typo, styles)
│   ├── types/                 # Types TypeScript
│   ├── hooks/                 # Hooks personnalisés (à venir)
│   └── utils/                 # Utilitaires (à venir)
└── assets/                    # Icônes et images
```

## Design System

Le thème est centralisé dans `src/theme/` et reprend fidèlement le design system du dashboard web :

- **Couleur principale** : `#3b5bf9` (brand-500)
- **Palette complète** : `src/theme/colors.ts`
- **Typographie** : Space Grotesk
- **Composants** : Button, Input, Card, Badge avec les mêmes variantes que le web

## Authentification

- Tokens Sanctum stockés via `expo-secure-store`
- Intercepteurs Axios pour injection automatique du token
- Gestion de l'expiration du token (401 → redirection login)
- Store Zustand pour l'état d'authentification

## Écrans

1. **Login** — Connexion avec email/mot de passe
2. **Register** — Inscription avec nom, email, mot de passe, téléphone
3. **Children** — Liste des profils enfants (pull-to-refresh)
4. **ChildDetail** — Détail d'un enfant (score, stats, appareils)
5. **Rules** — Configuration temps d'écran et filtrage (squelette)
6. **Alerts** — Centre de notifications avec sévérité
7. **Reports** — Liste des rapports hebdo/mensuels avec scores

## Navigation

- **RootNavigator** : Auth vs App selon l'état de connexion
- **AuthNavigator** : Stack (Login → Register)
- **AppNavigator** : Stack + Bottom Tabs (Children, Rules, Reports, Alerts)
