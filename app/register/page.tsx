import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getSession } from "@/lib/auth/getSession";

export const metadata: Metadata = { title: "Register" };

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
