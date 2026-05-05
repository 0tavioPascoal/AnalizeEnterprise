export type UserRole = "admin" | "recruiter";

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  company_id: string;
}

export interface ActionResponse {
  success: boolean;
  message: string;
}