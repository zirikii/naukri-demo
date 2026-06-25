import type { Metadata } from "next";
import { MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CompletenessRing } from "@/components/profile/CompletenessRing";
import { HeadlineSection } from "@/components/profile/sections/HeadlineSection";
import { KeySkillsSection } from "@/components/profile/sections/KeySkillsSection";
import { EmploymentSection } from "@/components/profile/sections/EmploymentSection";
import { EducationSection } from "@/components/profile/sections/EducationSection";
import { ProjectsSection } from "@/components/profile/sections/ProjectsSection";
import { CertificationsSection } from "@/components/profile/sections/CertificationsSection";
import { ItSkillsSection } from "@/components/profile/sections/ItSkillsSection";
import { PersonalSection } from "@/components/profile/sections/PersonalSection";
import { CareerProfileSection } from "@/components/profile/sections/CareerProfileSection";
import { getProfile } from "@/lib/data/queries";
import { profileCompleteness } from "@/lib/utils/score";
import { initials } from "@/lib/utils/format";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const profile = await getProfile();
  const completeness = profileCompleteness(profile);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Card className="overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-primary to-primary-dark" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-card">
                <AvatarFallback className="bg-secondary text-2xl text-primary">
                  {initials(profile.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <h1 className="text-xl font-semibold text-foreground">{profile.fullName}</h1>
                <p className="text-sm text-muted-foreground">
                  {profile.currentRole} at {profile.currentCompany}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location} · {profile.experienceYears} yrs · {profile.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <CompletenessRing value={completeness} size={64} />
              <span className="text-sm text-muted-foreground">Profile strength</span>
            </div>
          </div>
        </div>
      </Card>

      <HeadlineSection headline={profile.headline} />
      <KeySkillsSection keySkills={profile.keySkills} />
      <EmploymentSection employment={profile.employment} />
      <EducationSection education={profile.education} />
      <ProjectsSection projects={profile.projects} />
      <CertificationsSection certifications={profile.certifications} />
      <ItSkillsSection itSkills={profile.itSkills} />
      <PersonalSection personal={profile.personal} />
      <CareerProfileSection career={profile.career} />
    </div>
  );
}
