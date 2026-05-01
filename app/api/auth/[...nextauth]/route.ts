import NextAuth, { type AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { AppUser, UserRole } from "@/types/auth";
import type { JWT } from "next-auth/jwt";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials): Promise<AppUser | null> {
        if (!credentials?.email) return null;

        const supabase = createSupabaseServerClient();

        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, name, role, company_id")
          .eq("email", credentials.email)
          .single();

        if (error || !data) return null;

        return {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          companyId: data.company_id,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AppUser }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.companyId = user.companyId;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.companyId = token.companyId as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
