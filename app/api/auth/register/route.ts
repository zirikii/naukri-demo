import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getUsers } from "@/lib/data/queries";
import { writeData } from "@/lib/data/store";
import { SESSION_COOKIE, SESSION_MAX_AGE, encodeSession } from "@/lib/auth/session";
import type { SessionUser, UserAccount } from "@/lib/types";

export const runtime = "nodejs";

const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  experienceYears: z.number().min(0).max(50),
  currentLocation: z.string().min(1, "Enter your current location"),
  keySkills: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { name, email, experienceYears, currentLocation, keySkills } = parsed.data;
  const users = await getUsers();

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  const newUser: UserAccount = {
    id: `user-${Date.now()}`,
    name,
    email,
    experienceYears,
    currentLocation,
    keySkills,
    createdAt: new Date().toISOString(),
  };

  await writeData("users", [...users, newUser]);

  const sessionUser: SessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
  const token = await encodeSession(sessionUser);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return NextResponse.json({ user: sessionUser }, { status: 201 });
}
