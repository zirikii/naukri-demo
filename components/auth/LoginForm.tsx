"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@example.com", password: "demo" },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setServerError(data.error ?? "Login failed");
      return;
    }
    toast({ title: "Welcome back!", variant: "success" });
    router.push(redirect);
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Login</h1>
      <p className="mt-1 text-sm text-muted-foreground">Continue to your Naukri account</p>

      <div className="mt-4 flex items-start gap-2 rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Demo mode — <strong>any email &amp; password works</strong>. Pre-filled with{" "}
          <code className="rounded bg-card px-1">admin@example.com</code> /{" "}
          <code className="rounded bg-card px-1">demo</code>.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email ID</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Login"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Naukri?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Register for free
        </Link>
      </p>
    </div>
  );
}
