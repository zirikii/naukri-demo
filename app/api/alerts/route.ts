import { NextResponse } from "next/server";
import { z } from "zod";

import { getSettings } from "@/lib/data/queries";
import { writeData } from "@/lib/data/store";
import { getSession } from "@/lib/auth/getSession";
import type { JobAlert } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ alerts: settings.alerts });
}

const alertSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  location: z.string().default(""),
  experience: z.string().default(""),
  frequency: z.enum(["Daily", "Weekly"]).default("Daily"),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = alertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid alert" },
      { status: 400 },
    );
  }

  const settings = await getSettings();
  const alert: JobAlert = {
    id: `alert-${Date.now()}`,
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };
  const updated = { ...settings, alerts: [alert, ...settings.alerts] };
  await writeData("settings", updated);

  return NextResponse.json({ alert }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "An alert id is required" }, { status: 400 });
  }

  const settings = await getSettings();
  const updated = { ...settings, alerts: settings.alerts.filter((a) => a.id !== id) };
  await writeData("settings", updated);

  return NextResponse.json({ ok: true });
}
