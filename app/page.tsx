import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/features/auth/server/current-profile";

export default async function HomePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.status === "inactive") {
    redirect("/login");
  }

  redirect("/dashboard");
}