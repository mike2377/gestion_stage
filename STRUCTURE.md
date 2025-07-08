# Structure du Projet Gestion Stage

## Vue d'ensemble

Ce projet React + Vite + TypeScript est organisé selon une architecture modulaire et scalable, inspirée de la structure du projet `mvp_pro` existant.

## Structure des Dossiers

### 📁 `src/`
Dossier principal contenant tout le code source de l'application.

#### 📁 `components/`
Composants React réutilisables organisés par catégorie :
- **`ui/`** - Composants d'interface utilisateur de base (boutons, inputs, modals, etc.)
- **`layout/`** - Composants de mise en page (header, sidebar, footer, etc.)
- **`forms/`** - Composants de formulaires spécialisés
- **`tables/`** - Composants de tableaux et listes
- **`charts/`** - Composants de graphiques et visualisations

#### 📁 `pages/`
Pages de l'application organisées par fonctionnalité et type d'utilisateur :

**Par type d'utilisateur :**
- **`auth/`** - Pages d'authentification (login, register)
- **`admin/`** - Pages pour les administrateurs
- **`entreprise/`** - Pages pour les entreprises
- **`etudiant/`** - Pages pour les étudiants
- **`enseignant/`** - Pages pour les enseignants
- **`responsable/`** - Pages pour les responsables de stage
- **`tuteur/`** - Pages pour les tuteurs

**Par fonctionnalité :**
- **`dashboard/`** - Tableaux de bord
- **`stages/`** - Gestion des stages
- **`conventions/`** - Gestion des conventions
- **`evaluations/`** - Système d'évaluations
- **`rapports/`** - Génération de rapports
- **`parametres/`** - Paramètres et configuration
- **`statistiques/`** - Statistiques et analyses

#### 📁 `hooks/`
Hooks React personnalisés :
- **`api/`** - Hooks pour les appels API
- **`auth/`** - Hooks pour l'authentification
- **`ui/`** - Hooks pour l'interface utilisateur

#### 📁 `services/`
Services pour la logique métier et les appels externes :
- **`api/`** - Services d'API REST
- **`auth/`** - Services d'authentification
- **`database/`** - Services de base de données

#### 📁 `types/`
Définitions TypeScript :
- **`api/`** - Types pour les réponses API
- **`models/`** - Types pour les modèles de données
- **`enums/`** - Énumérations

#### 📁 `utils/`
Utilitaires et fonctions helper :
- **`validation/`** - Fonctions de validation
- **`formatting/`** - Fonctions de formatage
- **`constants/`** - Constantes de l'application

#### 📁 `context/`
Contextes React pour la gestion d'état global

#### 📁 `styles/`
Fichiers de styles organisés :
- **`components/`** - Styles spécifiques aux composants
- **`pages/`** - Styles spécifiques aux pages
- **`layouts/`** - Styles de mise en page

#### 📁 `assets/`
Ressources statiques :
- **`images/`** - Images et photos
- **`icons/`** - Icônes SVG et autres

#### 📁 `config/`
Fichiers de configuration

#### 📁 `database/`
Scripts et schémas de base de données

## Conventions de Nommage

- **Composants** : PascalCase (ex: `UserProfile.tsx`)
- **Hooks** : camelCase avec préfixe "use" (ex: `useAuth.ts`)
- **Services** : camelCase (ex: `authService.ts`)
- **Types** : PascalCase (ex: `User.ts`)
- **Utilitaires** : camelCase (ex: `formatDate.ts`)

## Architecture Inspirée de mvp_pro

Cette structure reprend les fonctionnalités identifiées dans le projet `mvp_pro` :
- Gestion multi-utilisateurs (admin, entreprise, étudiant, enseignant, responsable, tuteur)
- Gestion des stages et conventions
- Système d'évaluations et rapports
- Tableaux de bord personnalisés
- Paramètres et statistiques

## Prochaines Étapes

1. Créer les composants de base (UI, Layout)
2. Implémenter l'authentification
3. Créer les pages principales par type d'utilisateur
4. Développer les services API
5. Ajouter les styles et la responsivité 