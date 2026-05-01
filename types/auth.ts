export type UserRole = "admin" | "recruiter";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
}
