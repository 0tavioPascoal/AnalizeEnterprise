export type UserRole = "admin" | "recruiter";

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole
  company_id: string; // Nome correto conforme seu SQL
}

export interface ActionResponse {
  success: boolean;
  message: string;
}

