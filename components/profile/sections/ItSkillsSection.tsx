"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { z } from "zod";

import { SectionCard } from "../SectionCard";
import { EntryDialog, type FieldSpec } from "../fields/EntryDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProfileSection } from "@/hooks/use-profile-section";
import type { ItSkillEntry } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Required"),
  version: z.string().optional(),
  lastUsedYear: z.string().min(1, "Required"),
  experienceMonths: z.coerce.number().min(0).max(600),
});
type FormValues = z.infer<typeof schema>;

const fields: FieldSpec<FormValues>[] = [
  { name: "name", label: "Skill", colSpan: 2 },
  { name: "version", label: "Version", colSpan: 1, placeholder: "18" },
  { name: "lastUsedYear", label: "Last used (year)", colSpan: 1, placeholder: "2024" },
  { name: "experienceMonths", label: "Experience (months)", type: "number", colSpan: 2 },
];

export function ItSkillsSection({ itSkills }: { itSkills: ItSkillEntry[] }) {
  const { saving, save } = useProfileSection();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ItSkillEntry | null>(null);

  async function handleSubmit(values: FormValues): Promise<boolean> {
    const entry: ItSkillEntry = {
      id: editing?.id ?? `it-${Date.now()}`,
      name: values.name,
      version: values.version ?? "-",
      lastUsedYear: values.lastUsedYear,
      experienceMonths: Number(values.experienceMonths),
    };
    const next = editing
      ? itSkills.map((s) => (s.id === editing.id ? entry : s))
      : [...itSkills, entry];
    return save({ itSkills: next });
  }

  return (
    <SectionCard
      title="IT skills"
      actionLabel="add"
      onAction={() => {
        setEditing(null);
        setOpen(true);
      }}
    >
      {itSkills.length === 0 ? (
        <p className="text-sm text-muted-foreground">Add the tools and technologies you know.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Skill</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {itSkills.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-foreground">{s.name}</TableCell>
                <TableCell className="text-muted-foreground">{s.version}</TableCell>
                <TableCell className="text-muted-foreground">{s.lastUsedYear}</TableCell>
                <TableCell className="text-muted-foreground">
                  {Math.floor(s.experienceMonths / 12)}y {s.experienceMonths % 12}m
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditing(s);
                        setOpen(true);
                      }}
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => save({ itSkills: itSkills.filter((x) => x.id !== s.id) })}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <EntryDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit IT skill" : "Add IT skill"}
        schema={schema}
        fields={fields}
        saving={saving}
        defaultValues={{
          name: editing?.name ?? "",
          version: editing?.version ?? "",
          lastUsedYear: editing?.lastUsedYear ?? "",
          experienceMonths: editing?.experienceMonths ?? 0,
        }}
        onSubmit={handleSubmit}
      />
    </SectionCard>
  );
}
