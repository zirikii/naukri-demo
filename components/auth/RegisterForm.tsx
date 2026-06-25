"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CITIES, EXPERIENCE_OPTIONS } from "@/lib/constants/locations";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  experienceYears: z.coerce.number().min(0).max(50),
  currentLocation: z.string().min(1, "Select your current location"),
  keySkills: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { experienceYears: 0, currentLocation: "Bengaluru" },
  });

  const experience = watch("experienceYears");
  const location = watch("currentLocation");

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
        experienceYears: Number(values.experienceYears),
        currentLocation: values.currentLocation,
        keySkills: (values.keySkills ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setServerError(data.error ?? "Registration failed");
      return;
    }
    toast({ title: "Account created!", description: "Welcome to Naukri.", variant: "success" });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Create your profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Register free and start applying to jobs</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="e.g. Aarav Sharma" {...register("name")} />
          {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email ID</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Experience</Label>
            <Select
              value={String(experience ?? 0)}
              onValueChange={(v) => setValue("experienceYears", Number(v))}
            >
              <SelectTrigger aria-label="Experience">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Current location</Label>
            <Select value={location} onValueChange={(v) => setValue("currentLocation", v)}>
              <SelectTrigger aria-label="Current location">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="keySkills">Key skills (comma separated)</Label>
          <Input id="keySkills" placeholder="e.g. React, Node.js, AWS" {...register("keySkills")} />
        </div>

        {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Register"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
