export interface Stage {
  id: number;
  titre: string;
  description: string;
  exigences: string[];
  duree: number; // en semaines
  dateDebut: Date;
  dateFin: Date;
  lieu: string;
  remuneration?: number;
  type: StageType;
  statut: StageStatus;
  entreprise: Enterprise;
  candidatures: Application[];
  encadrant?: User;
  tuteur?: User;
  creeLe: Date;
  modifieLe: Date;
}

export enum StageType {
  STAGE = 'internship',
  RECHERCHE = 'research',
  PROJET = 'project'
}

export enum StageStatus {
  BROUILLON = 'draft',
  PUBLIE = 'published',
  FERME = 'closed',
  EN_COURS = 'in_progress',
  TERMINE = 'completed',
  ANNULE = 'cancelled'
}

export interface Application {
  id: number;
  stage: Stage;
  etudiant: Student;
  statut: ApplicationStatus;
  lettreMotivation: string;
  cv: string;
  dateSoumission: Date;
  dateRevue?: Date;
  relecteur?: User;
  commentaires?: string;
}

export enum ApplicationStatus {
  EN_ATTENTE = 'pending',
  REVUE = 'reviewed',
  ACCEPTEE = 'accepted',
  REFUSEE = 'rejected',
  RETIREE = 'withdrawn'
}

export interface Convention {
  id: number;
  stage: Stage;
  etudiant: Student;
  entreprise: Enterprise;
  encadrant: User;
  tuteur?: User;
  dateDebut: Date;
  dateFin: Date;
  objectifs: string[];
  taches: string[];
  criteresEvaluation: string[];
  statut: ConventionStatus;
  signeParEtudiant: boolean;
  signeParEntreprise: boolean;
  signeParEncadrant: boolean;
  signeParTuteur: boolean;
  creeLe: Date;
  modifieLe: Date;
}

export enum ConventionStatus {
  BROUILLON = 'draft',
  EN_ATTENTE_SIGNATURES = 'pending_signatures',
  SIGNEE = 'signed',
  ACTIVE = 'active',
  TERMINEE = 'completed',
  ANNULEE = 'cancelled'
}

export interface Evaluation {
  id: number;
  stage: Stage;
  etudiant: Student;
  evaluateur: User;
  type: EvaluationType;
  criteres: EvaluationCriteria[];
  noteGlobale: number;
  commentaires: string;
  dateSoumission: Date;
}

export enum EvaluationType {
  MI_PARCOURS = 'mid_term',
  FINALE = 'final',
  ENTREPRISE = 'enterprise',
  ENCADRANT = 'supervisor'
}

export interface EvaluationCriteria {
  id: number;
  nom: string;
  description: string;
  poids: number;
  note: number;
  noteMax: number;
  commentaires?: string;
}

export interface Report {
  id: number;
  stage: Stage;
  etudiant: Student;
  type: ReportType;
  titre: string;
  contenu: string;
  piecesJointes: string[];
  dateSoumission: Date;
  dateRevue?: Date;
  relecteur?: User;
  statut: ReportStatus;
}

export enum ReportType {
  HEBDOMADAIRE = 'weekly',
  MENSUEL = 'monthly',
  FINAL = 'final'
}

export enum ReportStatus {
  BROUILLON = 'draft',
  SOUMIS = 'submitted',
  APPROUVE = 'approved',
  REFUSE = 'rejected'
} 