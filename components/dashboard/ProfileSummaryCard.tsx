import Link from "next/link";
import { ArrowRight, MapPin, Pencil } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CompletenessRing } from "@/components/profile/CompletenessRing";
import { Chip } from "@/components/common/Chip";
import { initials } from "@/lib/utils/format";
import type { Profile } from "@/lib/types";

interface ProfileSummaryCardProps {
  profile: Profile;
  completeness: number;
  missing: string[];
}

export function ProfileSummaryCard({ profile, completeness, missing }: ProfileSummaryCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-16 bg-gradient-to-r from-primary to-primary-dark" />
      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between">
          <Avatar className="h-20 w-20 border-4 border-card">
            <AvatarFallback className="bg-secondary text-xl text-primary">
              {initials(profile.fullName)}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground">{profile.fullName}</h2>
            <p className="text-sm text-muted-foreground">
              {profile.currentRole} at {profile.currentCompany}
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location} · {profile.experienceYears} yrs experience
            </p>
          </div>
          <CompletenessRing value={completeness} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.keySkills.slice(0, 6).map((skill) => (
            <Chip key={skill} label={skill} />
          ))}
        </div>

        {missing.length > 0 ? (
          <div className="mt-4 rounded-md border border-warning/40 bg-warning/10 p-3">
            <p className="text-sm font-medium text-warning-foreground">
              Add missing details to boost your profile
            </p>
            <p className="mt-0.5 text-xs text-warning-foreground/80">
              Missing: {missing.join(", ")}
            </p>
            <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs" asChild>
              <Link href="/profile">
                Complete now
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
