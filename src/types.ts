export type UserRole = 'teacher' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  subject?: string;
  assignedClassIds?: string[];
}

export interface Student {
  id: string;
  name: string;
  grades: Record<string, number>; // assignmentId -> score
  attendance: string[]; // dates of absence
}

export interface Assignment {
  id: string;
  title: string;
  maxScore: number;
  weight: number; // percentage of total grade
}

export interface Class {
  id: string;
  name: string;
  students: Student[];
  assignments: Assignment[];
}

export interface TeacherAccount {
  id: string;
  name: string;
  password: string;
  subject: string;
  assignedClassIds: string[];
}

export interface TeacherData {
  classes: Class[];
  teachers: TeacherAccount[];
}
