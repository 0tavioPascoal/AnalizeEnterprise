import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/actions/auth/getCurrentProfile";

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