import { NextResponse } from "next/server";
import { z } from "zod";

import { getApplications, getJobById } from "@/lib/data/queries";
import { writeData } from "@/lib/data/store";
import { getSession } from "@/lib/auth/getSession";
import type { Application } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const applications = await getApplications();
  return NextResponse.json({ applications });
}

const applySchema = z.object({ jobId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in to apply" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "A jobId is required" }, { status: 400 });
  }

  const job = await getJobById(parsed.data.jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const applications = await getApplications();
  if (applications.some((a) => a.jobId === job.id)) {
    return NextResponse.json({ error: "You have already applied to this job" }, { status: 409 });
  }

  const application: Application = {
    id: `app-${Date.now()}`,
    jobId: job.id,
    appliedAt: new Date().toISOString(),
    status: "Applied",
  };

  await writeData("applications", [application, ...applications]);
  return NextResponse.json({ application }, { status: 201 });
}
