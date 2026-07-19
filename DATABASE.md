# Modélisation de la Base de Données — Contrôle Parental

> **Moteur** : MySQL 8.0  
> **ORM** : Laravel Eloquent  
> **Convention** : snake_case, clés primaires `id` auto-increment BIGINT, horodatage `created_at` / `updated_at` systématique, soft delete (`deleted_at`) sur les entités sensibles.

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Schéma des relations (ERD textuel)](#erd)
3. [Tables du domaine Utilisateurs & Familles](#domaine-utilisateurs)
4. [Tables du domaine Enfants & Appareils](#domaine-enfants)
5. [Tables du domaine Filtrage & Contrôle](#domaine-filtrage)
6. [Tables du domaine Temps d'écran](#domaine-temps-ecran)
7. [Tables du domaine Activités & Supervision](#domaine-activites)
8. [Tables du domaine Alertes & Notifications](#domaine-alertes)
9. [Tables du domaine Rapports](#domaine-rapports)
10. [Tables système Laravel](#domaine-systeme)
11. [Index & Performances](#index)
12. [Contraintes & Règles d'intégrité](#contraintes)
13. [Conventions de suppression](#soft-delete)

---

## 1. Vue d'ensemble <a name="vue-densemble"></a>

| # | Table | Domaine | Soft Delete | Enregistrements estimés |
|---|-------|---------|:-----------:|------------------------|
| 1 | `users` | Utilisateurs | ✅ | Faible |
| 2 | `roles` | Utilisateurs | ❌ | Fixe (3-5 rôles) |
| 3 | `families` | Familles | ❌ | Moyen |
| 4 | `family_user` | Familles | ❌ | Moyen |
| 5 | `children` | Enfants | ✅ | Moyen |
| 6 | `devices` | Appareils | ✅ | Moyen |
| 7 | `applications` | Référentiel | ❌ | Élevé (référentiel global) |
| 8 | `content_categories` | Référentiel | ❌ | Faible (référentiel fixe) |
| 9 | `device_installed_apps` | Appareils | ❌ | Élevé |
| 10 | `filter_rules` | Filtrage | ✅ | Moyen |
| 11 | `filter_rule_content_category` | Filtrage | ❌ | Moyen |
| 12 | `filter_rule_histories` | Filtrage | ❌ | Élevé (audit) |
| 13 | `app_rules` | Filtrage | ✅ | Moyen |
| 14 | `screen_time_rules` | Temps d'écran | ✅ | Moyen |
| 15 | `screen_time_usages` | Temps d'écran | ❌ | Très élevé (quotidien) |
| 16 | `screen_time_bonuses` | Temps d'écran | ❌ | Moyen |
| 17 | `activities` | Supervision | ❌ | Très élevé (temps réel) |
| 18 | `locations` | Supervision | ❌ | Très élevé (GPS) |
| 19 | `behavior_anomalies` | Supervision | ❌ | Élevé |
| 20 | `alerts` | Alertes | ❌ | Élevé |
| 21 | `notifications` | Alertes | ❌ | Élevé |
| 22 | `reports` | Rapports | ❌ | Moyen |
| 23 | `personal_access_tokens` | Système | ❌ | Élevé (Sanctum) |
| 24 | `password_reset_tokens` | Système | ❌ | Faible |
| 25 | `sessions` | Système | ❌ | Moyen |
| 26 | `cache` | Système | ❌ | Variable |
| 27 | `jobs` / `job_batches` / `failed_jobs` | Système | ❌ | Variable |

---

## 2. Schéma des relations (ERD textuel) <a name="erd"></a>

```
users ──────────────────────────────────── N
  │                                         │
  │ 1                                        │
  ├── (owner_id) ──► families ◄── (family_id + role_id) ── family_user ◄── (user_id)
  │                      │
  │                      │ 1
  │                      ├──► children (1..N)
  │                               │
  │                               ├──► devices (1..N)
  │                               │         │
  │                               │         ├──► device_installed_apps ──► applications
  │                               │         │         │
  │                               │         └──► activities ──► content_categories
  │                               │         └──► locations
  │                               │         └──► screen_time_usages
  │                               │
  │                               ├──► filter_rules (1..N)
  │                               │         └──► filter_rule_content_category ──► content_categories
  │                               │         └──► filter_rule_histories
  │                               │
  │                               ├──► app_rules ──► applications
  │                               │
  │                               ├──► screen_time_rules
  │                               ├──► screen_time_usages
  │                               ├──► screen_time_bonuses ◄── (granted_by) users
  │                               │
  │                               ├──► behavior_anomalies ──► activities
  │                               ├──► alerts ──► devices
  │                               └──► reports
  │
  └──► notifications ──► alerts

content_categories ──► content_categories (auto-référence parent_category_id)
applications ──► content_categories
```

---

## 3. Domaine — Utilisateurs & Familles <a name="domaine-utilisateurs"></a>

### Table `users`

Utilisateurs de la plateforme (parents, co-parents, observateurs, admins).

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `name` | VARCHAR(255) | ❌ | — | Nom complet |
| `email` | VARCHAR(255) | ❌ | — | Email unique |
| `phone` | VARCHAR(255) | ✅ | NULL | Téléphone unique |
| `avatar` | VARCHAR(255) | ✅ | NULL | URL de l'avatar |
| `locale` | VARCHAR(255) | ❌ | `fr` | Langue préférée |
| `timezone` | VARCHAR(255) | ✅ | NULL | Fuseau horaire |
| `email_verified_at` | TIMESTAMP | ✅ | NULL | Date vérification email |
| `password` | VARCHAR(255) | ❌ | — | Hash bcrypt |
| `two_factor_secret` | TEXT | ✅ | NULL | Secret 2FA (chiffré) |
| `two_factor_recovery_codes` | TEXT | ✅ | NULL | Codes de récupération |
| `two_factor_confirmed_at` | TIMESTAMP | ✅ | NULL | Date activation 2FA |
| `last_login_at` | TIMESTAMP | ✅ | NULL | Dernière connexion |
| `status` | ENUM | ❌ | `active` | `active` \| `suspended` \| `pending` |
| `remember_token` | VARCHAR(100) | ✅ | NULL | Token "se souvenir" |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |
| `deleted_at` | TIMESTAMP | ✅ | NULL | Soft delete |

**Index** : `email` (unique), `phone` (unique)

---

### Table `roles`

Référentiel des rôles disponibles dans une famille.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `name` | VARCHAR(255) | ❌ | — | Libellé du rôle |
| `slug` | VARCHAR(255) | ❌ | — | Identifiant unique (`admin`, `gestionnaire`, `observateur`) |
| `description` | TEXT | ✅ | NULL | Description |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Index** : `slug` (unique)

---

### Table `families`

Unité familiale regroupant parents et enfants.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `name` | VARCHAR(255) | ❌ | — | Nom de la famille |
| `owner_id` | BIGINT UNSIGNED | ❌ | — | FK → `users.id` (cascade delete) |
| `plan` | ENUM | ❌ | `free` | `free` \| `premium` |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

---

### Table `family_user` *(pivot)*

Association N:N entre utilisateurs et familles avec rôle.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `family_id` | BIGINT UNSIGNED | ❌ | — | FK → `families.id` (cascade delete) |
| `user_id` | BIGINT UNSIGNED | ❌ | — | FK → `users.id` (cascade delete) |
| `role_id` | BIGINT UNSIGNED | ❌ | — | FK → `roles.id` (restrict delete) |
| `invited_by` | BIGINT UNSIGNED | ✅ | NULL | FK → `users.id` (null on delete) |
| `joined_at` | TIMESTAMP | ✅ | NULL | Date d'acceptation |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Contrainte** : `UNIQUE (family_id, user_id)`

---

## 4. Domaine — Enfants & Appareils <a name="domaine-enfants"></a>

### Table `children`

Profils des enfants supervisés.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `family_id` | BIGINT UNSIGNED | ❌ | — | FK → `families.id` (cascade delete) |
| `first_name` | VARCHAR(255) | ✅ | NULL | Prénom |
| `last_name` | VARCHAR(255) | ✅ | NULL | Nom |
| `birth_date` | DATE | ❌ | — | Date de naissance |
| `avatar` | VARCHAR(255) | ✅ | NULL | URL de l'avatar |
| `maturity_level` | ENUM | ❌ | — | `enfant` \| `preado` \| `ado` |
| `pin_code` | VARCHAR(255) | ✅ | NULL | Code PIN (hashé) |
| `status` | ENUM | ❌ | `active` | `active` \| `paused` \| `archived` |
| `digital_health_score` | INT | ✅ | NULL | Score santé numérique (0-100) |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |
| `deleted_at` | TIMESTAMP | ✅ | NULL | Soft delete |

**Index** : `family_id`

---

### Table `devices`

Appareils des enfants (mobiles, tablettes, PC).

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `child_id` | BIGINT UNSIGNED | ✅ | NULL | FK → `children.id` (null on delete) |
| `name` | VARCHAR(255) | ❌ | — | Nom de l'appareil |
| `type` | ENUM | ❌ | — | `mobile` \| `tablette` \| `pc` \| `autre` |
| `os` | ENUM | ❌ | — | `android` \| `ios` \| `windows` \| `macos` \| `autre` |
| `os_version` | VARCHAR(255) | ✅ | NULL | Version de l'OS |
| `app_version` | VARCHAR(255) | ✅ | NULL | Version de l'agent installé |
| `pairing_code` | VARCHAR(255) | ✅ | NULL | Code de jumelage (unique) |
| `pairing_code_expires_at` | TIMESTAMP | ✅ | NULL | Expiration du code |
| `paired_at` | TIMESTAMP | ✅ | NULL | Date du jumelage effectif |
| `status` | ENUM | ❌ | `pending` | `pending` \| `active` \| `inactive` \| `blocked` |
| `last_seen_at` | TIMESTAMP | ✅ | NULL | Dernière activité |
| `is_online` | TINYINT(1) | ❌ | `0` | Connecté en temps réel |
| `battery_level` | INT | ✅ | NULL | Niveau batterie (%) |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |
| `deleted_at` | TIMESTAMP | ✅ | NULL | Soft delete |

**Index** : `child_id`, `status` ; `pairing_code` (unique)

---

### Table `applications`

Référentiel global des applications connues de la plateforme.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `name` | VARCHAR(255) | ❌ | — | Nom de l'application |
| `package_name` | VARCHAR(255) | ❌ | — | Identifiant technique unique (ex: `com.whatsapp`) |
| `platform` | ENUM | ❌ | — | `android` \| `ios` \| `both` |
| `content_category_id` | BIGINT UNSIGNED | ✅ | NULL | FK → `content_categories.id` |
| `icon_url` | VARCHAR(255) | ✅ | NULL | URL de l'icône |
| `is_system_app` | TINYINT(1) | ❌ | `0` | Application système (non désinstallable) |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Index** : `package_name` (unique)

---

### Table `content_categories`

Référentiel des catégories de contenus (hiérarchique).

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `name` | VARCHAR(255) | ❌ | — | Nom de la catégorie |
| `slug` | VARCHAR(255) | ❌ | — | Identifiant unique (`adulte`, `violence`, `jeux`, etc.) |
| `description` | TEXT | ✅ | NULL | Description |
| `is_sensitive` | TINYINT(1) | ❌ | `0` | Catégorie sensible (bloquée par défaut) |
| `parent_category_id` | BIGINT UNSIGNED | ✅ | NULL | FK → `content_categories.id` (auto-référence) |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Index** : `slug` (unique)

---

### Table `device_installed_apps` *(pivot)*

Applications installées sur un appareil donné.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `device_id` | BIGINT UNSIGNED | ❌ | — | FK → `devices.id` (cascade delete) |
| `application_id` | BIGINT UNSIGNED | ❌ | — | FK → `applications.id` (cascade delete) |
| `installed_at` | TIMESTAMP | ✅ | NULL | Date d'installation |
| `version` | VARCHAR(255) | ✅ | NULL | Version installée |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Contrainte** : `UNIQUE (device_id, application_id)`

---

## 5. Domaine — Filtrage & Contrôle <a name="domaine-filtrage"></a>

### Table `filter_rules`

Règles de filtrage web définies par le parent pour un enfant.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `child_id` | BIGINT UNSIGNED | ❌ | — | FK → `children.id` (cascade delete) |
| `type` | ENUM | ❌ | — | `whitelist` \| `blacklist` \| `category_block` \| `time_based` |
| `value` | VARCHAR(255) | ✅ | NULL | URL ou pattern ciblé |
| `status` | ENUM | ❌ | `active` | `active` \| `inactive` |
| `version` | INT | ❌ | `1` | Version de la règle (audit) |
| `created_by` | BIGINT UNSIGNED | ✅ | NULL | FK → `users.id` (null on delete) |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |
| `deleted_at` | TIMESTAMP | ✅ | NULL | Soft delete |

**Index** : `child_id`, `status`

---

### Table `filter_rule_content_category` *(pivot)*

Catégories bloquées associées à une règle de type `category_block`.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `filter_rule_id` | BIGINT UNSIGNED | ❌ | — | FK → `filter_rules.id` (cascade delete) |
| `content_category_id` | BIGINT UNSIGNED | ❌ | — | FK → `content_categories.id` (cascade delete) |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Contrainte** : `UNIQUE (filter_rule_id, content_category_id)`

---

### Table `filter_rule_histories`

Audit des modifications de règles de filtrage.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `filter_rule_id` | BIGINT UNSIGNED | ❌ | — | FK → `filter_rules.id` (cascade delete) |
| `previous_value` | JSON | ✅ | NULL | État précédent de la règle (snapshot) |
| `changed_by` | BIGINT UNSIGNED | ✅ | NULL | FK → `users.id` (null on delete) |
| `changed_at` | TIMESTAMP | ❌ | — | Horodatage de la modification |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

---

### Table `app_rules`

Règles d'accès aux applications (autorisation / blocage / restriction).

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `child_id` | BIGINT UNSIGNED | ❌ | — | FK → `children.id` (cascade delete) |
| `application_id` | BIGINT UNSIGNED | ❌ | — | FK → `applications.id` (cascade delete) |
| `status` | ENUM | ❌ | `allowed` | `allowed` \| `blocked` \| `restricted` |
| `daily_quota_minutes` | INT | ✅ | NULL | Quota journalier en minutes (si `restricted`) |
| `created_by` | BIGINT UNSIGNED | ✅ | NULL | FK → `users.id` (null on delete) |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |
| `deleted_at` | TIMESTAMP | ✅ | NULL | Soft delete |

**Contrainte** : `UNIQUE (child_id, application_id)`

---

## 6. Domaine — Temps d'écran <a name="domaine-temps-ecran"></a>

### Table `screen_time_rules`

Règles de planification et quotas de temps d'écran.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `child_id` | BIGINT UNSIGNED | ❌ | — | FK → `children.id` (cascade delete) |
| `type` | ENUM | ❌ | — | `daily_quota` \| `schedule` \| `bedtime` \| `homework` \| `break` |
| `duration_minutes` | INT | ✅ | NULL | Durée en minutes (quotas et pauses) |
| `day_of_week` | TINYINT | ✅ | NULL | Jour de la semaine 0=dim … 6=sam (pour `schedule`) |
| `start_time` | TIME | ✅ | NULL | Heure de début |
| `end_time` | TIME | ✅ | NULL | Heure de fin |
| `status` | ENUM | ❌ | `active` | `active` \| `inactive` |
| `created_by` | BIGINT UNSIGNED | ✅ | NULL | FK → `users.id` (null on delete) |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |
| `deleted_at` | TIMESTAMP | ✅ | NULL | Soft delete |

**Index** : `child_id`

---

### Table `screen_time_usages`

Consommation journalière de temps d'écran par enfant et par appareil.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `child_id` | BIGINT UNSIGNED | ❌ | — | FK → `children.id` (cascade delete) |
| `device_id` | BIGINT UNSIGNED | ✅ | NULL | FK → `devices.id` (null on delete) |
| `date` | DATE | ❌ | — | Date de la consommation |
| `minutes_used` | INT | ❌ | `0` | Minutes consommées |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Contrainte** : `UNIQUE (child_id, device_id, date)`

---

### Table `screen_time_bonuses`

Temps supplémentaire accordé ponctuellement par un parent.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `child_id` | BIGINT UNSIGNED | ❌ | — | FK → `children.id` (cascade delete) |
| `minutes` | INT | ❌ | — | Durée du bonus en minutes |
| `reason` | VARCHAR(255) | ✅ | NULL | Motif du bonus |
| `granted_by` | BIGINT UNSIGNED | ✅ | NULL | FK → `users.id` (null on delete) |
| `expires_at` | TIMESTAMP | ✅ | NULL | Expiration du bonus |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

---

## 7. Domaine — Activités & Supervision <a name="domaine-activites"></a>

### Table `activities`

Historique de toutes les activités numériques des enfants.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `child_id` | BIGINT UNSIGNED | ❌ | — | FK → `children.id` (cascade delete) |
| `device_id` | BIGINT UNSIGNED | ❌ | — | FK → `devices.id` (cascade delete) |
| `type` | ENUM | ❌ | — | `web` \| `app` \| `search` \| `call` \| `sms` \| `autre` |
| `target` | VARCHAR(255) | ❌ | — | URL, package_name ou identifiant cible |
| `content_category_id` | BIGINT UNSIGNED | ✅ | NULL | FK → `content_categories.id` (null on delete) |
| `duration_seconds` | INT | ✅ | NULL | Durée de l'activité |
| `started_at` | TIMESTAMP | ❌ | — | Début de l'activité |
| `ended_at` | TIMESTAMP | ✅ | NULL | Fin de l'activité |
| `metadata` | JSON | ✅ | NULL | Données complémentaires (titre de page, etc.) |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Index** : `(child_id, started_at)`, `device_id`, `type`

> ⚠️ Table à fort volume. Envisager un partitionnement par `started_at` ou une purge automatique au-delà de N mois.

---

### Table `locations`

Historique GPS des appareils enfants.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `child_id` | BIGINT UNSIGNED | ❌ | — | FK → `children.id` (cascade delete) |
| `device_id` | BIGINT UNSIGNED | ❌ | — | FK → `devices.id` (cascade delete) |
| `latitude` | DECIMAL(10,7) | ❌ | — | Latitude (précision ~1cm) |
| `longitude` | DECIMAL(10,7) | ❌ | — | Longitude (précision ~1cm) |
| `accuracy_meters` | FLOAT | ✅ | NULL | Précision GPS en mètres |
| `recorded_at` | TIMESTAMP | ❌ | — | Horodatage de la position |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Index** : `(child_id, recorded_at)`

---

### Table `behavior_anomalies`

Anomalies comportementales détectées par le système.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `child_id` | BIGINT UNSIGNED | ❌ | — | FK → `children.id` (cascade delete) |
| `activity_id` | BIGINT UNSIGNED | ✅ | NULL | FK → `activities.id` (null on delete) |
| `type` | VARCHAR(255) | ❌ | — | Type d'anomalie (`excessive_usage`, `bypass_attempt`, etc.) |
| `description` | TEXT | ✅ | NULL | Description détaillée |
| `severity` | ENUM | ❌ | — | `low` \| `medium` \| `high` \| `critical` |
| `detected_at` | TIMESTAMP | ❌ | — | Horodatage de la détection |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

---

## 8. Domaine — Alertes & Notifications <a name="domaine-alertes"></a>

### Table `alerts`

Alertes générées par le système à destination des parents.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `child_id` | BIGINT UNSIGNED | ❌ | — | FK → `children.id` (cascade delete) |
| `device_id` | BIGINT UNSIGNED | ✅ | NULL | FK → `devices.id` (null on delete) |
| `type` | ENUM | ❌ | — | `content_blocked` \| `quota_exceeded` \| `bypass_attempt` \| `suspicious_activity` \| `new_app_installed` |
| `severity` | ENUM | ❌ | — | `low` \| `medium` \| `high` \| `critical` |
| `message` | TEXT | ❌ | — | Message descriptif |
| `status` | ENUM | ❌ | `new` | `new` \| `read` \| `archived` |
| `triggered_at` | TIMESTAMP | ❌ | — | Horodatage du déclenchement |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Index** : `(child_id, status)`, `severity`

---

### Table `notifications`

Envois de notifications multi-canal aux parents.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `user_id` | BIGINT UNSIGNED | ❌ | — | FK → `users.id` (cascade delete) |
| `alert_id` | BIGINT UNSIGNED | ✅ | NULL | FK → `alerts.id` (null on delete) |
| `channel` | ENUM | ❌ | — | `push` \| `email` \| `sms` |
| `title` | TEXT | ❌ | — | Titre de la notification |
| `body` | TEXT | ❌ | — | Corps du message |
| `status` | ENUM | ❌ | `pending` | `pending` \| `sent` \| `failed` \| `read` |
| `sent_at` | TIMESTAMP | ✅ | NULL | Date d'envoi effectif |
| `read_at` | TIMESTAMP | ✅ | NULL | Date de lecture |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Index** : `(user_id, status)`

---

## 9. Domaine — Rapports <a name="domaine-rapports"></a>

### Table `reports`

Rapports périodiques de synthèse générés pour chaque enfant.

| Colonne | Type | Null | Défaut | Description |
|---------|------|:----:|--------|-------------|
| `id` | BIGINT UNSIGNED | ❌ | auto | Clé primaire |
| `child_id` | BIGINT UNSIGNED | ❌ | — | FK → `children.id` (cascade delete) |
| `period_type` | ENUM | ❌ | — | `weekly` \| `monthly` |
| `period_start` | DATE | ❌ | — | Début de la période |
| `period_end` | DATE | ❌ | — | Fin de la période |
| `digital_health_score` | INT | ✅ | NULL | Score de santé numérique global (0-100) |
| `statistics` | JSON | ❌ | — | Statistiques détaillées (apps, sites, durées) |
| `file_path` | VARCHAR(255) | ✅ | NULL | Chemin du PDF généré |
| `generated_at` | TIMESTAMP | ❌ | — | Date de génération |
| `created_at` | TIMESTAMP | ✅ | NULL | — |
| `updated_at` | TIMESTAMP | ✅ | NULL | — |

**Index** : `(child_id, period_type, period_start)`

---

## 10. Tables système Laravel <a name="domaine-systeme"></a>

| Table | Rôle |
|-------|------|
| `personal_access_tokens` | Tokens Sanctum (auth API) |
| `password_reset_tokens` | Réinitialisation de mot de passe |
| `sessions` | Sessions serveur (driver `database`) |
| `cache` | Cache Laravel (driver `database`) |
| `jobs` | File d'attente (driver `database`) |
| `job_batches` | Batches de jobs |
| `failed_jobs` | Jobs échoués |

---

## 11. Index & Performances <a name="index"></a>

| Table | Index | Justification |
|-------|-------|---------------|
| `users` | `email` (unique), `phone` (unique) | Authentification, unicité |
| `children` | `family_id` | Requêtes par famille |
| `devices` | `child_id`, `status`, `pairing_code` (unique) | Filtrage par état, jumelage |
| `activities` | `(child_id, started_at)`, `device_id`, `type` | Historique chronologique, dashboards |
| `filter_rules` | `child_id`, `status` | Synchronisation règles actives |
| `alerts` | `(child_id, status)`, `severity` | Centre d'alertes, priorisation |
| `notifications` | `(user_id, status)` | Lecture des notifications parent |
| `locations` | `(child_id, recorded_at)` | Historique GPS chronologique |
| `screen_time_usages` | `(child_id, device_id, date)` (unique) | Cumul journalier |
| `reports` | `(child_id, period_type, period_start)` | Requêtes rapports |

---

## 12. Contraintes & Règles d'intégrité <a name="contraintes"></a>

| Relation | Comportement ON DELETE |
|----------|----------------------|
| `families.owner_id` → `users` | CASCADE |
| `family_user.family_id` → `families` | CASCADE |
| `family_user.user_id` → `users` | CASCADE |
| `family_user.role_id` → `roles` | RESTRICT |
| `family_user.invited_by` → `users` | SET NULL |
| `children.family_id` → `families` | CASCADE |
| `devices.child_id` → `children` | SET NULL |
| `device_installed_apps.device_id` → `devices` | CASCADE |
| `device_installed_apps.application_id` → `applications` | CASCADE |
| `filter_rules.child_id` → `children` | CASCADE |
| `filter_rules.created_by` → `users` | SET NULL |
| `filter_rule_content_category.filter_rule_id` → `filter_rules` | CASCADE |
| `filter_rule_histories.changed_by` → `users` | SET NULL |
| `app_rules.child_id` → `children` | CASCADE |
| `app_rules.created_by` → `users` | SET NULL |
| `screen_time_rules.child_id` → `children` | CASCADE |
| `screen_time_bonuses.granted_by` → `users` | SET NULL |
| `activities.child_id` → `children` | CASCADE |
| `activities.device_id` → `devices` | CASCADE |
| `activities.content_category_id` → `content_categories` | SET NULL |
| `alerts.child_id` → `children` | CASCADE |
| `alerts.device_id` → `devices` | SET NULL |
| `notifications.user_id` → `users` | CASCADE |
| `notifications.alert_id` → `alerts` | SET NULL |
| `reports.child_id` → `children` | CASCADE |
| `behavior_anomalies.activity_id` → `activities` | SET NULL |
| `content_categories.parent_category_id` → `content_categories` | SET NULL |
| `applications.content_category_id` → `content_categories` | SET NULL |

---

## 13. Conventions de suppression <a name="soft-delete"></a>

Les entités métier sensibles utilisent le **soft delete** (colonne `deleted_at`) pour garantir la traçabilité et permettre la restauration.

| Table | Soft Delete | Raison |
|-------|:-----------:|--------|
| `users` | ✅ | Conformité RGPD, audit |
| `children` | ✅ | Historique conservé après archivage |
| `devices` | ✅ | Appareils dissociés restent traçables |
| `filter_rules` | ✅ | Audit des règles passées |
| `app_rules` | ✅ | Audit des règles passées |
| `screen_time_rules` | ✅ | Audit des règles passées |
| `activities` | ❌ | Volume trop élevé — purge périodique préférable |
| `alerts` | ❌ | Statut `archived` suffit |
| `notifications` | ❌ | Statut `read` suffit |
