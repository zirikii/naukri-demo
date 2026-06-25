"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@/lib/types";

/**
 * Persist a partial profile update via PATCH /api/profile, then refresh server data.
 * Returns a saving flag and a `save` callback for section editors.
 */
export function useProfileSection() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const save = React.useCallback(
    async (patch: Partial<Profile>): Promise<boolean> => {
      setSaving(true);
      try {
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? "Could not save changes");
        }
        toast({ title: "Profile updated", variant: "success" });
        router.refresh();
        return true;
      } catch (err) {
        toast({
          title: "Update failed",
          description: err instanceof Error ? err.message : undefined,
          variant: "error",
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [router, toast],
  );

  return { saving, save };
}
