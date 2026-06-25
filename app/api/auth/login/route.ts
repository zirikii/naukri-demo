import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getUsers } from "@/lib/data/queries";
import { SESSION_COOKIE, SESSION_MAX_AGE, encodeSession } from "@/lib/auth/session";
import type { SessionUser } from "@/lib/types";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { email } = parsed.data;

  // Demo mode: any valid credentials succeed. Match a seeded user when possible so the
  // session name is realistic; otherwise derive a friendly name from the email.
  const users = await getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  const user: SessionUser = existing
    ? { id: existing.id, name: existing.name, email: existing.email }
    : {
        id: `user-${email.split("@")[0]}`,
        name: email
          .split("@")[0]!
          .split(/[._-]/)
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" "),
        email,
      };

  const token = await encodeSession(user);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return NextResponse.json({ user });
}
