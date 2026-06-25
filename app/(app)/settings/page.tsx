import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { getSettings } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageHeader title="Settings" description="Manage your preferences, alerts, and privacy" />
      <Suspense fallback={null}>
        <SettingsClient settings={settings} />
      </Suspense>
    </div>
  );
}
