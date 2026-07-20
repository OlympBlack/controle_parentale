# SafeKid API — Documentation des endpoints Usage & Location

## Authentification
Tous les endpoints nécessitent un token Bearer Sanctum dans le header `Authorization: Bearer {token}`.

---

## Devices

### POST /api/devices
Associer un nouvel appareil à un enfant.

**Body:**
```json
{
  "child_id": 1,
  "name": "Téléphone de Lucas",
  "type": "mobile",
  "os": "android",
  "os_version": "14",
  "device_token": "unique-device-identifier"
}
```

### GET /api/devices/{id}
Détails d'un appareil (inclut `permissions_accordees`, `derniere_synchronisation`).

### PATCH /api/devices/{id}/permissions
Mettre à jour l'état des permissions accordées sur l'appareil enfant.

**Body:**
```json
{
  "permissions": {
    "usage_access": true,
    "location": true,
    "notifications": false
  }
}
```

### POST /api/devices/{id}/usage
Recevoir un batch de données d'usage depuis l'app enfant.

**Body:**
```json
{
  "sessions": [
    {
      "package_name": "com.whatsapp",
      "nom_application": "WhatsApp",
      "duree_secondes": 1800,
      "date_utilisation": "2026-07-20"
    }
  ]
}
```

**Réponse:** `201 Created` avec les sessions créées + mise à jour de `derniere_synchronisation` + recalcul du résumé journalier.

### POST /api/devices/{id}/location
Recevoir une position GPS depuis l'app enfant.

**Body:**
```json
{
  "latitude": 48.8566,
  "longitude": 2.3522,
  "precision_metres": 15.0,
  "captured_at": "2026-07-20T10:30:00Z"
}
```

---

## Children — Usage

### GET /api/children/{id}/usage
Données d'usage agrégées pour le dashboard parent.

**Query params:**
- `from` (date, ex: `2026-07-01`) — filtre début
- `to` (date, ex: `2026-07-20`) — filtre fin

**Réponse:** Array de `UsageSessionResource`:
```json
{
  "id": 1,
  "device_id": 3,
  "package_name": "com.whatsapp",
  "nom_application": "WhatsApp",
  "duree_secondes": 1800,
  "date_utilisation": "2026-07-20",
  "categorie": null,
  "created_at": "2026-07-20T10:00:00+00:00"
}
```

### GET /api/children/{id}/usage/today
Résumé du jour en cours.

**Réponse:**
```json
{
  "sessions": [ ... ],
  "resume": {
    "date": "2026-07-20",
    "temps_ecran_total_secondes": 7200,
    "nombre_apps_utilisees": 5
  }
}
```

---

## Children — Location

### GET /api/children/{id}/location/last
Dernière position connue de l'enfant.

**Réponse:** `LocationResource`:
```json
{
  "id": 42,
  "child_id": 1,
  "device_id": 3,
  "latitude": 48.8566,
  "longitude": 2.3522,
  "accuracy_meters": 15.0,
  "recorded_at": "2026-07-20T10:30:00+00:00",
  "created_at": "2026-07-20T10:30:05+00:00"
}
```

### GET /api/children/{id}/location/history
Historique des positions (paginé).

**Query params:**
- `from` (datetime) — filtre début
- `to` (datetime) — filtre fin
- `per_page` (int, default: 50)

---

## Modèles de données partagés

### UsageSession
| Champ | Type | Description |
|-------|------|-------------|
| `id` | int | ID unique |
| `device_id` | int | FK vers device |
| `package_name` | string | Nom du package Android (ex: `com.whatsapp`) |
| `nom_application` | string\|null | Nom lisible de l'app |
| `duree_secondes` | int | Durée d'utilisation en secondes |
| `date_utilisation` | date (Y-m-d) | Date d'utilisation |
| `categorie` | string\|null | Catégorie (classification future) |

### AppUsageSummary
| Champ | Type | Description |
|-------|------|-------------|
| `id` | int | ID unique |
| `device_id` | int | FK vers device |
| `date` | date (Y-m-d) | Date du résumé |
| `temps_ecran_total_secondes` | int | Total temps d'écran en secondes |
| `nombre_apps_utilisees` | int | Nombre d'apps utilisées |

### DeviceLocation
| Champ | Type | Description |
|-------|------|-------------|
| `id` | int | ID unique |
| `child_id` | int | FK vers enfant |
| `device_id` | int | FK vers device |
| `latitude` | decimal(10,7) | Latitude |
| `longitude` | decimal(10,7) | Longitude |
| `accuracy_meters` | float\|null | Précision en mètres |
| `recorded_at` | timestamp | Date/heure de capture |

### Device (champs ajoutés)
| Champ | Type | Description |
|-------|------|-------------|
| `device_token` | string\|null | Identifiant unique de l'appareil |
| `permissions_accordees` | json\|null | `{ usage_access, location, notifications }` |
| `derniere_synchronisation` | timestamp\|null | Dernière sync usage/location |
