# Fonctionnalités & Périmètre MVP — Contrôle Parental Intelligent

## Table des matières

1. [Acteurs du système](#acteurs)
2. [Fonctionnalités Web (Dashboard Parent)](#web)
3. [Fonctionnalités Mobile Parent](#mobile-parent)
4. [Fonctionnalités Mobile Enfant (Android / iOS)](#mobile-enfant)
5. [Périmètre MVP](#mvp)
6. [Extensions post-MVP](#extensions)
7. [Modules transverses](#transverses)

---

## 1. Acteurs du système <a name="acteurs"></a>

| Acteur | Rôle | Niveau d'accès |
|--------|------|---------------|
| **Parent** | Administrateur principal | Lecture + écriture totale |
| **Co-parent** | Gestionnaire secondaire | Lecture + écriture partielle |
| **Observateur** | Parent secondaire | Lecture seule |
| **Enfant** | Utilisateur supervisé | Accès limité par les règles |
| **Administrateur plateforme** | Gestion technique globale | Accès système complet |

---

## 2. Fonctionnalités Web — Dashboard Parent <a name="web"></a>

### 2.1 Authentification & Compte

- Inscription parent (email + mot de passe)
- Connexion sécurisée
- Authentification à deux facteurs (2FA)
- Connexion via OAuth 2.0 (Google / Apple)
- Gestion du profil parent (nom, email, préférences)
- Gestion des co-parents (invitation, droits, rôles)
- Déconnexion et gestion des sessions

### 2.2 Gestion des profils enfants

- Création de profils enfants (prénom, âge, photo)
- Modification et suppression de profils
- Niveau de maturité numérique par profil
- Gestion multi-enfants depuis un seul compte
- Attribution d'appareils à un profil enfant

### 2.3 Gestion des appareils

- Jumelage d'un appareil enfant (code de couplage)
- Liste des appareils associés (nom, OS, statut)
- Statut en temps réel (connecté / déconnecté)
- Dissociation d'un appareil
- Gestion multi-appareils par enfant

### 2.4 Filtrage et contrôle des contenus

- Activation / désactivation du filtrage web
- Filtrage par catégories de contenu (adulte, violence, jeux, réseaux sociaux, etc.)
- Gestion des listes blanches (sites toujours autorisés)
- Gestion des listes noires (sites toujours bloqués)
- Blocage d'applications installées sur l'appareil enfant
- Contrôle des vidéos YouTube (filtrage par catégorie / chaîne)
- Validation des nouvelles installations d'applications

### 2.5 Gestion du temps d'écran

- Définition de quotas journaliers (temps total d'écran)
- Quotas par application ou catégorie d'application
- Planification horaire (plages autorisées / interdites)
- Restrictions nocturnes (heure de coucher)
- Restrictions pendant les devoirs
- Blocage automatique au dépassement du quota
- Octroi de temps supplémentaire (bonus ponctuel)
- Pauses obligatoires

### 2.6 Supervision et monitoring

- Tableau de bord centralisé (vue globale de tous les enfants)
- Activité en cours (application utilisée, site visité)
- Historique de navigation (sites consultés + durée)
- Historique des applications utilisées
- Graphiques d'utilisation par jour / semaine / mois
- Indicateurs de santé numérique par enfant

### 2.7 Alertes et notifications

- Centre de notifications (liste des alertes reçues)
- Alertes critiques (tentative d'accès à un contenu bloqué)
- Alertes de dépassement de quota de temps
- Alertes de tentative de contournement
- Alertes d'installation d'une nouvelle application
- Paramétrage des types d'alertes à recevoir
- Priorisation intelligente des alertes (éviter la surcharge)

### 2.8 Reporting et analytics

- Rapport hebdomadaire automatique par enfant
- Rapport mensuel de synthèse
- Tableau de bord analytique (graphiques interactifs)
- Score de santé numérique par enfant
- Statistiques d'usage par application / site / catégorie
- Export des rapports en PDF
- Visualisation des tendances d'utilisation

---

## 3. Fonctionnalités Mobile — Application Parent <a name="mobile-parent"></a>

### 3.1 Authentification & Accès rapide

- Connexion sécurisée (email / OAuth)
- Authentification biométrique (empreinte / Face ID)
- Accès rapide au tableau de bord

### 3.2 Supervision rapide

- Vue en temps réel de l'activité de chaque enfant
- Statut des appareils (en ligne / hors ligne)
- Application ou site utilisé à l'instant
- Notifications push temps réel

### 3.3 Actions immédiates

- Bloquer / débloquer un appareil en un tap
- Octroyer du temps supplémentaire
- Activer le mode "devoirs" ou "coucher"
- Bloquer une application spécifique
- Approuver / refuser l'installation d'une application

### 3.4 Alertes

- Réception des alertes critiques en push
- Consultation du détail d'une alerte
- Marquage d'une alerte comme lue

### 3.5 Géolocalisation (extension)

- Visualisation de la position de l'enfant en temps réel
- Historique des déplacements
- Alertes de géofencing (zone de sécurité)

---

## 4. Fonctionnalités Mobile — Application Enfant <a name="mobile-enfant"></a>

### 4.1 Android

- Agent de supervision installé sur l'appareil
- Filtrage réseau (blocage des sites et applications)
- Monitoring des applications utilisées
- Gestion des quotas de temps d'écran
- Blocage automatique à dépassement du quota
- Respect des plages horaires définies par le parent
- Détection des tentatives de désinstallation
- Détection de VPN / proxy
- Mode "devoirs" et mode "coucher" (blocage selon règles)
- Synchronisation des règles avec le backend en temps réel
- Fonctionnement offline (application des règles sans connexion)
- Envoi d'événements au backend (navigation, usages, localisation)

### 4.2 iOS *(Phase 2 — Post-MVP)*

- Supervision via APIs natives Apple (Screen Time API)
- Filtrage web via Network Extension
- Monitoring limité selon les restrictions Apple
- Synchronisation des règles avec le backend
- Notifications et alertes

> **Note iOS** : les limitations imposées par Apple (sandbox, permissions système) restreignent certaines fonctionnalités avancées disponibles sur Android (monitoring profond, captures d'activité, filtrage réseau bas niveau).

---

## 5. Périmètre MVP <a name="mvp"></a>

Le MVP cible **Android uniquement** et se concentre sur la valeur essentielle : sécuriser et encadrer l'usage numérique des enfants.

### ✅ Dashboard Web (MVP)

| Fonctionnalité | Inclus |
|----------------|--------|
| Inscription / connexion parent | ✅ |
| Authentification 2FA | ✅ |
| Création et gestion de profils enfants | ✅ |
| Jumelage d'un appareil Android | ✅ |
| Filtrage web par catégories | ✅ |
| Listes blanches / noires | ✅ |
| Blocage d'applications | ✅ |
| Quotas de temps d'écran journaliers | ✅ |
| Planification horaire (plages autorisées) | ✅ |
| Blocage nocturne | ✅ |
| Supervision basique (historique, apps utilisées) | ✅ |
| Alertes critiques (push + web) | ✅ |
| Rapport hebdomadaire simple | ✅ |
| Gestion multi-appareils | ✅ |

### ✅ Application Enfant Android (MVP)

| Fonctionnalité | Inclus |
|----------------|--------|
| Agent de supervision | ✅ |
| Filtrage réseau (sites bloqués) | ✅ |
| Blocage d'applications | ✅ |
| Quotas de temps d'écran | ✅ |
| Restrictions horaires | ✅ |
| Synchronisation des règles en temps réel | ✅ |
| Fonctionnement offline | ✅ |
| Envoi d'événements au backend | ✅ |

### ✅ Application Mobile Parent (MVP)

| Fonctionnalité | Inclus |
|----------------|--------|
| Connexion sécurisée | ✅ |
| Vue rapide activité enfant | ✅ |
| Alertes push temps réel | ✅ |
| Blocage / déblocage rapide | ✅ |
| Octroi de temps supplémentaire | ✅ |

### ❌ Hors périmètre MVP

- Application iOS enfant
- Géolocalisation / géofencing
- Intelligence artificielle comportementale
- Analytics avancés et export PDF
- Contrôle YouTube avancé
- Multi-parents / rôles avancés (co-parent, observateur)
- Rapports mensuels et tableaux de bord interactifs
- Détection VPN / proxy avancée
- Intégrations tierces (stores, moteurs de recherche)

---

## 6. Extensions post-MVP <a name="extensions"></a>

### Phase 2 — Application iOS Enfant

- Supervision via Screen Time API
- Filtrage via Network Extension
- Synchronisation et alertes

### Phase 3 — Application Mobile Parent enrichie

- Supervision temps réel complète
- Géolocalisation et historique des déplacements
- Alertes géofencing (zones sécurisées)

### Phase 4 — Fonctionnalités Avancées

- **Intelligence artificielle** : détection de contenus sensibles, analyse comportementale, recommandations de règles
- **Contrôle YouTube intelligent** : filtrage par chaîne, catégorie, mots-clés
- **Analytics avancés** : tableaux de bord interactifs, indicateurs comportementaux, score santé numérique évolué
- **Géolocalisation avancée** : géofencing, historique GPS, zones de confiance
- **Gestion des rôles avancée** : co-parent avec droits configurables, observateur en lecture seule
- **Export rapports** : PDF, Excel
- **Rapports mensuels** automatisés

### Phase 5 — B2B & Scalabilité

- Offre établissements scolaires et structures éducatives
- Architecture multi-régions
- API publique partenaires
- Tableau de bord administrateur avancé

---

## 7. Modules transverses <a name="transverses"></a>

Ces modules sont présents dès le MVP et évoluent avec le produit.

### Synchronisation temps réel

- Synchronisation des règles entre backend et appareils enfants
- Mise à jour instantanée du dashboard parent
- Application des blocages sans délai perceptible
- Support offline sur l'application enfant Android

### Sécurité & Conformité

- Chiffrement TLS 1.3 (transit) + AES-256 (données au repos)
- Hashage des mots de passe (bcrypt)
- Authentification JWT + sessions sécurisées
- Contrôle d'accès basé sur les rôles (RBAC)
- Conformité **RGPD** (droit à l'effacement, portabilité, consentement)
- Soft delete (suppression logique pour conserver l'historique)
- Traçabilité complète des actions administratives

### Notifications multi-canal

| Canal | MVP | Extension |
|-------|-----|-----------|
| Push mobile | ✅ | ✅ |
| Notification web (in-app) | ✅ | ✅ |
| Email | ✅ | ✅ |
| SMS | ❌ | ✅ |

### Anti-contournement

| Mécanisme | MVP | Extension |
|-----------|-----|-----------|
| Détection désinstallation agent | ✅ | ✅ |
| Blocage mode navigation privée | ✅ | ✅ |
| Détection VPN / proxy | ❌ | ✅ |
| Verrouillage paramètres enfant | ✅ | ✅ |
