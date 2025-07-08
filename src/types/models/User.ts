export interface User {
  id: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  STUDENT = 'student',
  ENTERPRISE = 'enterprise',
  TEACHER = 'teacher',
  RESPONSIBLE = 'responsible',
  TUTOR = 'tutor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface Student extends User {
  role: UserRole.STUDENT;
  studentId: string;
  program: string;
  year: number;
  department: string;
  supervisor?: User;
}

export interface Enterprise extends User {
  role: UserRole.ENTERPRISE;
  companyName: string;
  industry: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  website?: string;
  description?: string;
}

export interface Teacher extends User {
  role: UserRole.TEACHER;
  department: string;
  specialization: string;
  office?: string;
}

export interface Responsible extends User {
  role: UserRole.RESPONSIBLE;
  department: string;
  responsibilities: string[];
}

export interface Tutor extends User {
  role: UserRole.TUTOR;
  specialization: string;
  experience: number;
}

export interface Admin extends User {
  role: UserRole.ADMIN | UserRole.SUPER_ADMIN;
  permissions: string[];
} 