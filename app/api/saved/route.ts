import { NextResponse } from "next/server";
import { z } from "zod";

import { getSavedJobs, getJobById } from "@/lib/data/queries";
import { writeData } from "@/lib/data/store";
import { getSession } from "@/lib/auth/getSession";
import type { SavedJob } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const saved = await getSavedJobs();
  return NextResponse.json({ saved });
}

const savedSchema = z.object({ jobId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in to save jobs" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = savedSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "A jobId is required" }, { status: 400 });
  }

  const job = await getJobById(parsed.data.jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const saved = await getSavedJobs();
  const exists = saved.some((s) => s.jobId === job.id);

  // Toggle: remove if already saved, otherwise add.
  let next: SavedJob[];
  let isSaved: boolean;
  if (exists) {
    next = saved.filter((s) => s.jobId !== job.id);
    isSaved = false;
  } else {
    next = [{ jobId: job.id, savedAt: new Date().toISOString() }, ...saved];
    isSaved = true;
  }

  await writeData("saved", next);
  return NextResponse.json({ saved: isSaved });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "A jobId is required" }, { status: 400 });
  }

  const saved = await getSavedJobs();
  await writeData(
    "saved",
    saved.filter((s) => s.jobId !== jobId),
  );
  return NextResponse.json({ ok: true });
}
