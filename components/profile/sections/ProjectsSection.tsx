"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { z } from "zod";

import { SectionCard } from "../SectionCard";
import { EntryDialog, type FieldSpec } from "../fields/EntryDialog";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/common/Chip";
import { useProfileSection } from "@/hooks/use-profile-section";
import type { ProjectEntry } from "@/lib/types";

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  skills: z.array(z.string()),
});
type FormValues = z.infer<typeof schema>;

const fields: FieldSpec<FormValues>[] = [
  { name: "title", label: "Project title", colSpan: 2 },
  { name: "description", label: "Description", type: "textarea", colSpan: 2 },
  { name: "skills", label: "Skills used", type: "tags", colSpan: 2, placeholder: "e.g. React" },
];

export function ProjectsSection({ projects }: { projects: ProjectEntry[] }) {
  const { saving, save } = useProfileSection();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ProjectEntry | null>(null);

  async function handleSubmit(values: FormValues): Promise<boolean> {
    const entry: ProjectEntry = {
      id: editing?.id ?? `proj-${Date.now()}`,
      title: values.title,
      description: values.description,
      skills: values.skills,
    };
    const next = editing
      ? projects.map((p) => (p.id === editing.id ? entry : p))
      : [...projects, entry];
    return save({ projects: next });
  }

  return (
    <SectionCard
      title="Projects"
      actionLabel="add"
      onAction={() => {
        setEditing(null);
        setOpen(true);
      }}
    >
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">Showcase projects you&apos;ve worked on.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li key={p.id} className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{p.title}</p>
                <p className="text-sm text-foreground/80">{p.description}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.skills.map((s) => (
                    <Chip key={s} label={s} />
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditing(p);
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
                  onClick={() => save({ projects: projects.filter((x) => x.id !== p.id) })}
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
        title={editing ? "Edit project" : "Add project"}
        schema={schema}
        fields={fields}
        saving={saving}
        defaultValues={{
          title: editing?.title ?? "",
          description: editing?.description ?? "",
          skills: editing?.skills ?? [],
        }}
        onSubmit={handleSubmit}
      />
    </SectionCard>
  );
}
