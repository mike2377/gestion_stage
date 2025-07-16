export interface User {
  id: number;
  email: string;
  motDePasse?: string;
  prenom: string;
  nom: string;
  role: UserRole;
  telephone?: string;
  avatar?: string;
  actif: boolean;
  creeLe: Date;
  modifieLe: Date;
  universiteId?: string; // Ajout pour filtrage par université
}

export enum UserRole {
  ETUDIANT = 'student',
  ENTREPRISE = 'enterprise',
  ENSEIGNANT = 'teacher',
  RESPONSABLE = 'responsible',
  TUTEUR = 'tutor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface Student extends User {
  role: UserRole.ETUDIANT;
  matricule: string;
  programme: string;
  annee: number;
  departement: string;
  encadrant?: User;
  universiteId?: string;
}

export interface Enterprise extends User {
  role: UserRole.ENTREPRISE;
  nomEntreprise: string;
  secteur: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  siteWeb?: string;
  description?: string;
}

export interface Teacher extends User {
  role: UserRole.ENSEIGNANT;
  departement: string;
  specialite: string;
  bureau?: string;
  universiteId?: string;
}

export interface Responsible extends User {
  role: UserRole.RESPONSABLE;
  departement: string;
  responsabilites: string[];
  universiteId?: string;
}

export interface Tutor extends User {
  role: UserRole.TUTEUR;
  specialite: string;
  experience: number;
}

export interface Admin extends User {
  role: UserRole.ADMIN | UserRole.SUPER_ADMIN;
  permissions: string[];
} 