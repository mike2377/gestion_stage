export interface Stage {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  duration: number; // en semaines
  startDate: Date;
  endDate: Date;
  location: string;
  salary?: number;
  type: StageType;
  status: StageStatus;
  enterprise: Enterprise;
  applications: Application[];
  supervisor?: User;
  tutor?: User;
  createdAt: Date;
  updatedAt: Date;
}

export enum StageType {
  INTERNSHIP = 'internship',
  RESEARCH = 'research',
  PROJECT = 'project'
}

export enum StageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Application {
  id: number;
  stage: Stage;
  student: Student;
  status: ApplicationStatus;
  coverLetter: string;
  resume: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: User;
  comments?: string;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface Convention {
  id: number;
  stage: Stage;
  student: Student;
  enterprise: Enterprise;
  supervisor: User;
  tutor?: User;
  startDate: Date;
  endDate: Date;
  objectives: string[];
  tasks: string[];
  evaluationCriteria: string[];
  status: ConventionStatus;
  signedByStudent: boolean;
  signedByEnterprise: boolean;
  signedBySupervisor: boolean;
  signedByTutor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ConventionStatus {
  DRAFT = 'draft',
  PENDING_SIGNATURES = 'pending_signatures',
  SIGNED = 'signed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Evaluation {
  id: number;
  stage: Stage;
  student: Student;
  evaluator: User;
  type: EvaluationType;
  criteria: EvaluationCriteria[];
  overallScore: number;
  comments: string;
  submittedAt: Date;
}

export enum EvaluationType {
  MID_TERM = 'mid_term',
  FINAL = 'final',
  ENTERPRISE = 'enterprise',
  SUPERVISOR = 'supervisor'
}

export interface EvaluationCriteria {
  id: number;
  name: string;
  description: string;
  weight: number;
  score: number;
  maxScore: number;
  comments?: string;
}

export interface Report {
  id: number;
  stage: Stage;
  student: Student;
  type: ReportType;
  title: string;
  content: string;
  attachments: string[];
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: User;
  status: ReportStatus;
}

export enum ReportType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  FINAL = 'final'
}

export enum ReportStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected'
} 