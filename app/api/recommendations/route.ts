import { NextResponse } from "next/server";

import { getJobsWithCompany, getProfile } from "@/lib/data/queries";
import { recommendJobs } from "@/lib/utils/score";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || undefined;

  const [jobs, profile] = await Promise.all([getJobsWithCompany(), getProfile()]);
  const recommendations = recommendJobs(jobs, profile, limit).map((r) => ({
    job: r.job,
    score: r.score,
    reasons: r.reasons,
  }));

  return NextResponse.json({ recommendations });
}
