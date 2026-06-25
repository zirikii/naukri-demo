"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SectionCard } from "../SectionCard";
import { useProfileSection } from "@/hooks/use-profile-section";

export function HeadlineSection({ headline }: { headline: string }) {
  const { saving, save } = useProfileSection();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(headline);

  async function handleSave() {
    if (await save({ headline: value.trim() })) setOpen(false);
  }

  return (
    <SectionCard title="Resume headline" onAction={() => setOpen(true)}>
      {headline ? (
        <p className="text-sm text-foreground/90">{headline}</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Add a headline to summarise your profile for recruiters.
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resume headline</DialogTitle>
            <DialogDescription>
              A crisp summary that highlights your expertise and aspirations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="headline">Headline</Label>
            <textarea
              id="headline"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-card p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}
