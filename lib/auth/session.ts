import { SignJWT, jwtVerify } from "jose";

import type { SessionUser } from "@/lib/types";

export const SESSION_COOKIE = "naukri_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecretKey(): Uint8Array {
  const secret = process.env.DEMO_AUTH_SECRET || "change-me";
  return new TextEncoder().encode(secret);
}

/** Sign a session payload into a compact JWT (HS256). */
export async function encodeSession(user: SessionUser): Promise<string> {
  return new SignJWT({ name: user.name, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

/** Verify and decode a session token. Returns null on any failure (expired/tampered). */
export async function decodeSession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return {
      id: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : payload.email,
    };
  } catch {
    return null;
  }
}
