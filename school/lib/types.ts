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