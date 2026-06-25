import type { Metadata } from "next";

import { ProfileSummaryCard } from "@/components/dashboard/ProfileSummaryCard";
import { RecommendedJobs } from "@/components/dashboard/RecommendedJobs";
import { RecruiterActions } from "@/components/dashboard/RecruiterActions";
import { ProfilePerformance } from "@/components/dashboard/ProfilePerformance";
import { AppliedStatusSummary } from "@/components/dashboard/AppliedStatusSummary";
import { Naukri360Promo } from "@/components/dashboard/Naukri360Promo";
import {
  getApplications,
  getCompanyMap,
  getJobsWithCompany,
  getMessages,
  getProfile,
  getSavedJobs,
} from "@/lib/data/queries";
import { getSession } from "@/lib/auth/getSession";
import { missingProfileSections, profileCompleteness, recommendJobs } from "@/lib/utils/score";

export const metadata: Metadata = { title: "My Naukri" };

export default async function DashboardPage() {
  const [session, profile, allJobs, applications, saved, messages, companyMap] = await Promise.all([
    getSession(),
    getProfile(),
    getJobsWithCompany(),
    getApplications(),
    getSavedJobs(),
    getMessages(),
    getCompanyMap(),
  ]);

  const completeness = profileCompleteness(profile);
  const missing = missingProfileSections(profile);
  const recommended = recommendJobs(allJobs, profile, 3).map((r) => r.job);
  const savedIds = saved.map((s) => s.jobId);
  const appliedIds = applications.map((a) => a.jobId);

  const recentMessages = messages
    .slice()
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .slice(0, 3)
    .map((m) => ({ ...m, company: companyMap.get(m.companyId) }));

  const firstName = (session?.name ?? profile.fullName).split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {firstName}!</h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your job search today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <ProfileSummaryCard profile={profile} completeness={completeness} missing={missing} />
          <RecommendedJobs
            jobs={recommended}
            initialSavedIds={savedIds}
            initialAppliedIds={appliedIds}
          />
          <RecruiterActions messages={recentMessages} />
        </div>

        <div className="space-y-6">
          <ProfilePerformance />
          <AppliedStatusSummary applications={applications} />
          <Naukri360Promo />
        </div>
      </div>
    </div>
  );
}
