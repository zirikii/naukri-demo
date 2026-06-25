"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { z } from "zod";

import { SectionCard } from "../SectionCard";
import { EntryDialog, type FieldSpec } from "../fields/EntryDialog";
import { Button } from "@/components/ui/button";
import { useProfileSection } from "@/hooks/use-profile-section";
import type { CertificationEntry } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Required"),
  issuer: z.string().min(1, "Required"),
  year: z.string().min(1, "Required"),
});
type FormValues = z.infer<typeof schema>;

const fields: FieldSpec<FormValues>[] = [
  { name: "name", label: "Certification", colSpan: 2 },
  { name: "issuer", label: "Issued by", colSpan: 1 },
  { name: "year", label: "Year", colSpan: 1, placeholder: "2024" },
];

export function CertificationsSection({
  certifications,
}: {
  certifications: CertificationEntry[];
}) {
  const { saving, save } = useProfileSection();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CertificationEntry | null>(null);

  async function handleSubmit(values: FormValues): Promise<boolean> {
    const entry: CertificationEntry = {
      id: editing?.id ?? `cert-${Date.now()}`,
      name: values.name,
      issuer: values.issuer,
      year: values.year,
    };
    const next = editing
      ? certifications.map((c) => (c.id === editing.id ? entry : c))
      : [...certifications, entry];
    return save({ certifications: next });
  }

  return (
    <SectionCard
      title="Certifications"
      actionLabel="add"
      onAction={() => {
        setEditing(null);
        setOpen(true);
      }}
    >
      {certifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">Add certifications to stand out.</p>
      ) : (
        <ul className="space-y-3">
          {certifications.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.issuer} · {c.year}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditing(c);
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
                  onClick={() =>
                    save({ certifications: certifications.filter((x) => x.id !== c.id) })
                  }
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
        title={editing ? "Edit certification" : "Add certification"}
        schema={schema}
        fields={fields}
        saving={saving}
        defaultValues={{
          name: editing?.name ?? "",
          issuer: editing?.issuer ?? "",
          year: editing?.year ?? "",
        }}
        onSubmit={handleSubmit}
      />
    </SectionCard>
  );
}
