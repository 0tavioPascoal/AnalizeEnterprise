import { redirect } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { getCurrentProfile } from "@/features/auth/server/current-profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    redirect("/login");
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar
        user={{
          name: currentProfile.name,
          email: currentProfile.email,
          role: currentProfile.role,
          company_name: currentProfile.company_name,
        }}
      />

      <main className="relative h-full min-w-0 flex-1 overflow-hidden bg-muted/40">
        {children}
      </main>
    </div>
  );
}
