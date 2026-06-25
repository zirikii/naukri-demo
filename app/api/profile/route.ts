import { NextResponse } from "next/server";

import { getProfile } from "@/lib/data/queries";
import { writeData } from "@/lib/data/store";
import { getSession } from "@/lib/auth/getSession";
import type { Profile } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Partial<Profile> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid profile payload" }, { status: 400 });
  }

  const current = await getProfile();
  // Shallow merge of provided top-level keys (sections are replaced wholesale).
  const updated: Profile = { ...current, ...body };
  await writeData("profile", updated);

  return NextResponse.json({ profile: updated });
}
