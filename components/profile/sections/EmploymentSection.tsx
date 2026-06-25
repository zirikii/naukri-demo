"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { z } from "zod";

import { SectionCard } from "../SectionCard";
import { EntryDialog, type FieldSpec } from "../fields/EntryDialog";
import { Button } from "@/components/ui/button";
import { useProfileSection } from "@/hooks/use-profile-section";
import type { EmploymentEntry } from "@/lib/types";

const schema = z.object({
  title: z.string().min(1, "Required"),
  company: z.string().min(1, "Required"),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const fields: FieldSpec<FormValues>[] = [
  { name: "title", label: "Job title", colSpan: 2 },
  { name: "company", label: "Company", colSpan: 2 },
  { name: "startDate", label: "Start (YYYY-MM)", colSpan: 1, placeholder: "2022-06" },
  { name: "endDate", label: "End (YYYY-MM)", colSpan: 1, placeholder: "2024-01" },
  { name: "current", label: "I currently work here", type: "checkbox", colSpan: 2 },
  { name: "description", label: "Description", type: "textarea", colSpan: 2 },
];

export function EmploymentSection({ employment }: { employment: EmploymentEntry[] }) {
  const { saving, save } = useProfileSection();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<EmploymentEntry | null>(null);

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(entry: EmploymentEntry) {
    setEditing(entry);
    setOpen(true);
  }

  async function handleSubmit(values: FormValues): Promise<boolean> {
    const entry: EmploymentEntry = {
      id: editing?.id ?? `emp-${Date.now()}`,
      title: values.title,
      company: values.company,
      startDate: values.startDate,
      endDate: values.current ? null : values.endDate || null,
      current: values.current,
      description: values.description ?? "",
    };
    const next = editing
      ? employment.map((e) => (e.id === editing.id ? entry : e))
      : [...employment, entry];
    return save({ employment: next });
  }

  async function remove(id: string) {
    await save({ employment: employment.filter((e) => e.id !== id) });
  }

  return (
    <SectionCard title="Employment" actionLabel="add" onAction={openAdd}>
      {employment.length === 0 ? (
        <p className="text-sm text-muted-foreground">Add your work experience.</p>
      ) : (
        <ol className="space-y-4">
          {employment.map((e) => (
            <li key={e.id} className="relative border-l-2 border-border pl-4">
              <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{e.title}</p>
                  <p className="text-sm text-muted-foreground">{e.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.startDate} – {e.current ? "Present" : e.endDate}
                  </p>
                  {e.description ? (
                    <p className="mt-1 text-sm text-foreground/80">{e.description}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(e)}
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => remove(e.id)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      <EntryDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit employment" : "Add employment"}
        schema={schema}
        fields={fields}
        saving={saving}
        defaultValues={{
          title: editing?.title ?? "",
          company: editing?.company ?? "",
          startDate: editing?.startDate ?? "",
          endDate: editing?.endDate ?? "",
          current: editing?.current ?? false,
          description: editing?.description ?? "",
        }}
        onSubmit={handleSubmit}
      />
    </SectionCard>
  );
}
