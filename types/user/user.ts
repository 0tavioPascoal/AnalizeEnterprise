import type { Enums, Tables } from "@/types/supabase/database";

export type UserRole = Enums<"user_role">;
export type UserStatus = Enums<"user_status">;

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export type UserProfile = Pick<
  Tables<"profiles">,
  "id" | "name" | "email" | "role" | "company_id" | "status"
>;

export interface ActionResponse {
  success: boolean;
  message: string;
}
