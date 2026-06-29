export type GradeCategory =
  | "pre_primary"
  | "primary"
  | "middle"
  | "secondary"

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  parentName?: string;
  role?: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface MagicToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  used: boolean;
}