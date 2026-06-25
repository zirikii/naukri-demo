import { NextResponse } from "next/server";

import { getSettings } from "@/lib/data/queries";
import { writeData } from "@/lib/data/store";
import { getSession } from "@/lib/auth/getSession";
import type { Settings } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Partial<Settings> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
  }

  const current = await getSettings();
  const updated: Settings = { ...current, ...body };
  await writeData("settings", updated);

  return NextResponse.json({ settings: updated });
}
