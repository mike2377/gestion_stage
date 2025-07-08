-- Création de la base de données
CREATE DATABASE gestion_stages;
USE gestion_stages;

-- Extension pour la fonction UNACCENT (suppression des accents)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Types de rôles utilisateurs
CREATE TYPE type_utilisateur AS ENUM (
    'etudiant',
    'tuteur_entreprise',
    'responsable_entreprise',
    'enseignant_referent',
    'responsable_stages',
    'super_admin'
);

-- Table principale des utilisateurs avec ID personnalisé
CREATE TABLE utilisateurs (
    id_utilisateur VARCHAR(20) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    role type_utilisateur NOT NULL,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP,
    url_photo_profil VARCHAR(255)
);

-- Fonction pour générer l'ID personnalisé
CREATE OR REPLACE FUNCTION generer_id_utilisateur(
    p_prenom VARCHAR, 
    p_nom VARCHAR, 
    p_date_creation TIMESTAMP
) RETURNS VARCHAR AS $$
DECLARE
    annee_creation VARCHAR;
    prenom_formate VARCHAR;
    nom_formate VARCHAR;
    id_base VARCHAR;
    compteur INTEGER := 0;
    id_final VARCHAR;
BEGIN
    -- Formatage des éléments de base
    annee_creation := TO_CHAR(p_date_creation, 'YY'); -- On prend seulement les 2 derniers chiffres
    prenom_formate := LOWER(REPLACE(UNACCENT(TRIM(p_prenom)), ' ', ''));
    nom_formate := LOWER(REPLACE(UNACCENT(TRIM(p_nom)), ' ', ''));
    
    -- Création de la base de l'ID (3 lettres prénom + 3 lettres nom + 2 chiffres année + numéro si besoin)
    id_base := 
        CASE WHEN LENGTH(prenom_formate) >= 3 THEN SUBSTRING(prenom_formate FROM 1 FOR 3) ELSE LPAD(prenom_formate, 3, 'x') END ||
        CASE WHEN LENGTH(nom_formate) >= 3 THEN SUBSTRING(nom_formate FROM 1 FOR 3) ELSE LPAD(nom_formate, 3, 'x') END ||
        annee_creation;
    
    -- Vérification de l'unicité et ajout d'un numéro si nécessaire
    id_final := id_base;
    WHILE EXISTS (SELECT 1 FROM utilisateurs WHERE id_utilisateur = id_final) LOOP
        compteur := compteur + 1;
        id_final := id_base || compteur;
    END LOOP;
    
    RETURN id_final;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement l'ID avant insertion
CREATE OR REPLACE FUNCTION before_insert_utilisateur()
RETURNS TRIGGER AS $$
BEGIN
    NEW.id_utilisateur := generer_id_utilisateur(
        NEW.prenom, 
        NEW.nom, 
        COALESCE(NEW.date_creation, CURRENT_TIMESTAMP)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_before_insert_utilisateur
BEFORE INSERT ON utilisateurs
FOR EACH ROW
EXECUTE FUNCTION before_insert_utilisateur();

-- Table des universités
CREATE TABLE universites (
    id_universite SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(20),
    pays VARCHAR(100),
    site_web VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des étudiants (extension utilisateurs)
CREATE TABLE etudiants (
    id_etudiant SERIAL PRIMARY KEY,
    id_utilisateur VARCHAR(20) UNIQUE NOT NULL REFERENCES utilisateurs(id_utilisateur),
    id_universite INTEGER REFERENCES universites(id_universite),
    numero_etudiant VARCHAR(50) UNIQUE,
    programme_etude VARCHAR(255),
    annee_etude INTEGER,
    url_cv VARCHAR(255),
    url_releve_notes VARCHAR(255)
);

-- Table des entreprises
CREATE TABLE entreprises (
    id_entreprise SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    siret VARCHAR(50) UNIQUE,
    secteur VARCHAR(255),
    adresse TEXT,
    site_web VARCHAR(255),
    description TEXT,
    url_logo VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des tuteurs en entreprise
CREATE TABLE tuteurs_entreprise (
    id_tuteur SERIAL PRIMARY KEY,
    id_utilisateur VARCHAR(20) UNIQUE NOT NULL REFERENCES utilisateurs(id_utilisateur),
    id_entreprise INTEGER NOT NULL REFERENCES entreprises(id_entreprise),
    poste VARCHAR(255) NOT NULL,
    departement VARCHAR(255)
);

-- Table des enseignants référents
CREATE TABLE enseignants_referents (
    id_enseignant SERIAL PRIMARY KEY,
    id_utilisateur VARCHAR(20) UNIQUE NOT NULL REFERENCES utilisateurs(id_utilisateur),
    id_universite INTEGER REFERENCES universites(id_universite),
    specialisation VARCHAR(255),
    annees_experience INTEGER
);

-- Table des responsables de stages
CREATE TABLE responsables_stages (
    id_responsable SERIAL PRIMARY KEY,
    id_utilisateur VARCHAR(20) UNIQUE NOT NULL REFERENCES utilisateurs(id_utilisateur),
    id_universite INTEGER NOT NULL REFERENCES universites(id_universite)
);

-- Table des offres de stage
CREATE TABLE offres_stage (
    id_offre SERIAL PRIMARY KEY,
    id_entreprise INTEGER NOT NULL REFERENCES entreprises(id_entreprise),
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    competences_requises TEXT,
    duree_semaines INTEGER,
    date_debut DATE,
    date_fin DATE,
    lieu VARCHAR(255),
    remuneration TEXT,
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validation_requise BOOLEAN DEFAULT TRUE,
    est_validee BOOLEAN DEFAULT FALSE,
    validee_par INTEGER REFERENCES responsables_stages(id_responsable),
    date_validation TIMESTAMP,
    statut VARCHAR(50) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'approuvee', 'rejetee', 'publiee')),
    CONSTRAINT dates_valides CHECK (date_fin > date_debut)
);

-- Table des candidatures
CREATE TABLE candidatures (
    id_candidature SERIAL PRIMARY KEY,
    id_offre INTEGER NOT NULL REFERENCES offres_stage(id_offre),
    id_etudiant INTEGER NOT NULL REFERENCES etudiants(id_etudiant),
    date_candidature TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    url_lettre_motivation VARCHAR(255),
    url_documents_supplementaires VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'acceptee', 'rejetee')),
    feedback TEXT,
    date_decision TIMESTAMP
);

-- Table des stages
CREATE TABLE stages (
    id_stage SERIAL PRIMARY KEY,
    id_candidature INTEGER UNIQUE REFERENCES candidatures(id_candidature),
    id_etudiant INTEGER NOT NULL REFERENCES etudiants(id_etudiant),
    id_entreprise INTEGER NOT NULL REFERENCES entreprises(id_entreprise),
    id_tuteur_entreprise INTEGER REFERENCES tuteurs_entreprise(id_tuteur),
    id_enseignant_referent INTEGER REFERENCES enseignants_referents(id_enseignant),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    titre VARCHAR(255) NOT NULL,
    objectifs TEXT,
    statut VARCHAR(50) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_cours', 'termine', 'annule'))
);

-- Table des conventions de stage
CREATE TABLE conventions_stage (
    id_convention SERIAL PRIMARY KEY,
    id_stage INTEGER UNIQUE REFERENCES stages(id_stage),
    signature_etudiant BOOLEAN DEFAULT FALSE,
    signature_entreprise BOOLEAN DEFAULT FALSE,
    signature_universite BOOLEAN DEFAULT FALSE,
    url_convention VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_signature_etudiant TIMESTAMP,
    date_signature_entreprise TIMESTAMP,
    date_signature_universite TIMESTAMP,
    statut VARCHAR(50) DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'signee_etudiant', 'signee_entreprise', 'signee_universite', 'complete'))
);

-- Table du journal de bord
CREATE TABLE journaux_bord (
    id_journal SERIAL PRIMARY KEY,
    id_stage INTEGER NOT NULL REFERENCES stages(id_stage),
    date_entree TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activites TEXT NOT NULL,
    competences_developpees TEXT,
    difficultes_rencontrees TEXT,
    commentaires_tuteur TEXT,
    est_brouillon BOOLEAN DEFAULT TRUE
);

-- Table des évaluations
CREATE TABLE evaluations (
    id_evaluation SERIAL PRIMARY KEY,
    id_stage INTEGER NOT NULL REFERENCES stages(id_stage),
    id_evaluateur VARCHAR(20) NOT NULL REFERENCES utilisateurs(id_utilisateur),
    type_evaluation VARCHAR(50) NOT NULL CHECK (type_evaluation IN ('auto', 'entreprise', 'pedagogique', 'finale')),
    date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    note_ponctualite INTEGER CHECK (note_ponctualite BETWEEN 1 AND 5),
    note_autonomie INTEGER CHECK (note_autonomie BETWEEN 1 AND 5),
    note_competences INTEGER CHECK (note_competences BETWEEN 1 AND 5),
    note_comportement INTEGER CHECK (note_comportement BETWEEN 1 AND 5),
    note_globale DECIMAL(3,1),
    points_forts TEXT,
    axes_amelioration TEXT,
    commentaires_finaux TEXT,
    est_terminee BOOLEAN DEFAULT FALSE
);

-- Table des documents
CREATE TABLE documents (
    id_document SERIAL PRIMARY KEY,
    id_stage INTEGER REFERENCES stages(id_stage),
    id_utilisateur VARCHAR(20) REFERENCES utilisateurs(id_utilisateur),
    type_document VARCHAR(100) NOT NULL,
    url_document VARCHAR(255) NOT NULL,
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Table des notifications
CREATE TABLE notifications (
    id_notification SERIAL PRIMARY KEY,
    id_destinataire VARCHAR(20) NOT NULL REFERENCES utilisateurs(id_utilisateur),
    id_expediteur VARCHAR(20) REFERENCES utilisateurs(id_utilisateur),
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type_notification VARCHAR(100) NOT NULL,
    est_lue BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_lecture TIMESTAMP,
    url_action VARCHAR(255)
);

-- Table des jetons de réinitialisation de mot de passe
CREATE TABLE jetons_reinitialisation_mdp (
    id_jeton SERIAL PRIMARY KEY,
    id_utilisateur VARCHAR(20) NOT NULL REFERENCES utilisateurs(id_utilisateur),
    jeton VARCHAR(255) UNIQUE NOT NULL,
    date_expiration TIMESTAMP NOT NULL,
    est_utilise BOOLEAN DEFAULT FALSE
);

-- Table des logs système
CREATE TABLE logs_systeme (
    id_log SERIAL PRIMARY KEY,
    id_utilisateur VARCHAR(20) REFERENCES utilisateurs(id_utilisateur),
    action VARCHAR(255) NOT NULL,
    type_entite VARCHAR(100),
    id_entite VARCHAR(20),
    adresse_ip VARCHAR(50),
    user_agent TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création des index pour les performances
CREATE INDEX idx_candidatures_offre ON candidatures(id_offre);
CREATE INDEX idx_candidatures_etudiant ON candidatures(id_etudiant);
CREATE INDEX idx_stages_etudiant ON stages(id_etudiant);
CREATE INDEX idx_stages_entreprise ON stages(id_entreprise);
CREATE INDEX idx_evaluations_stage ON evaluations(id_stage);
CREATE INDEX idx_notifications_destinataire ON notifications(id_destinataire);
CREATE INDEX idx_notifications_non_lues ON notifications(id_destinataire) WHERE est_lue = FALSE;