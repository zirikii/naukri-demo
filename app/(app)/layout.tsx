import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { getSession } from "@/lib/auth/getSession";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
