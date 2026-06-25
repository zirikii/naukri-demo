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
import { SectionCard } from "../SectionCard";
import { TagInput } from "../fields/TagInput";
import { Chip } from "@/components/common/Chip";
import { useProfileSection } from "@/hooks/use-profile-section";

export function KeySkillsSection({ keySkills }: { keySkills: string[] }) {
  const { saving, save } = useProfileSection();
  const [open, setOpen] = React.useState(false);
  const [skills, setSkills] = React.useState<string[]>(keySkills);

  async function handleSave() {
    if (await save({ keySkills: skills })) setOpen(false);
  }

  return (
    <SectionCard title="Key skills" onAction={() => setOpen(true)}>
      {keySkills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {keySkills.map((skill) => (
            <Chip key={skill} label={skill} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Add skills recruiters search for.</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Key skills</DialogTitle>
            <DialogDescription>Add the skills that best represent you.</DialogDescription>
          </DialogHeader>
          <TagInput value={skills} onChange={setSkills} placeholder="e.g. React, AWS" />
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
