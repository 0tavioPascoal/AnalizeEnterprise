import type { UserRole, UserStatus } from "../user/user";

export interface CurrentProfile {
  id: string;
  company_id: string;
  company_name: string | null;
  role: UserRole;
  status: UserStatus;
  name: string | null;
  email: string | null;
}