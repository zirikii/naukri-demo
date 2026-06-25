import "server-only";

import { cookies } from "next/headers";

import type { SessionUser } from "@/lib/types";

import { SESSION_COOKIE, decodeSession } from "./session";

/** Read and decode the current session from the request cookie (server components). */
export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return decodeSession(token);
}
