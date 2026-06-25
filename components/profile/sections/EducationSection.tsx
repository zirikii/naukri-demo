"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { z } from "zod";

import { SectionCard } from "../SectionCard";
import { EntryDialog, type FieldSpec } from "../fields/EntryDialog";
import { Button } from "@/components/ui/button";
import { useProfileSection } from "@/hooks/use-profile-section";
import type { EducationEntry } from "@/lib/types";

const schema = z.object({
  degree: z.string().min(1, "Required"),
  institution: z.string().min(1, "Required"),
  startYear: z.string().min(1, "Required"),
  endYear: z.string().min(1, "Required"),
  grade: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const fields: FieldSpec<FormValues>[] = [
  { name: "degree", label: "Degree", colSpan: 2 },
  { name: "institution", label: "Institution", colSpan: 2 },
  { name: "startYear", label: "Start year", colSpan: 1, placeholder: "2016" },
  { name: "endYear", label: "End year", colSpan: 1, placeholder: "2020" },
  { name: "grade", label: "Grade / CGPA", colSpan: 2, placeholder: "8.4 CGPA" },
];

export function EducationSection({ education }: { education: EducationEntry[] }) {
  const { saving, save } = useProfileSection();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<EducationEntry | null>(null);

  async function handleSubmit(values: FormValues): Promise<boolean> {
    const entry: EducationEntry = {
      id: editing?.id ?? `edu-${Date.now()}`,
      degree: values.degree,
      institution: values.institution,
      startYear: values.startYear,
      endYear: values.endYear,
      grade: values.grade ?? "",
    };
    const next = editing
      ? education.map((e) => (e.id === editing.id ? entry : e))
      : [...education, entry];
    return save({ education: next });
  }

  return (
    <SectionCard
      title="Education"
      actionLabel="add"
      onAction={() => {
        setEditing(null);
        setOpen(true);
      }}
    >
      {education.length === 0 ? (
        <p className="text-sm text-muted-foreground">Add your education details.</p>
      ) : (
        <ul className="space-y-3">
          {education.map((e) => (
            <li key={e.id} className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{e.degree}</p>
                <p className="text-sm text-muted-foreground">{e.institution}</p>
                <p className="text-xs text-muted-foreground">
                  {e.startYear} – {e.endYear}
                  {e.grade ? ` · ${e.grade}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditing(e);
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
                  onClick={() => save({ education: education.filter((x) => x.id !== e.id) })}
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <EntryDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit education" : "Add education"}
        schema={schema}
        fields={fields}
        saving={saving}
        defaultValues={{
          degree: editing?.degree ?? "",
          institution: editing?.institution ?? "",
          startYear: editing?.startYear ?? "",
          endYear: editing?.endYear ?? "",
          grade: editing?.grade ?? "",
        }}
        onSubmit={handleSubmit}
      />
    </SectionCard>
  );
}
