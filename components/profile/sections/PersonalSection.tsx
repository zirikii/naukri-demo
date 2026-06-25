"use client";

import * as React from "react";
import { z } from "zod";

import { SectionCard } from "../SectionCard";
import { EntryDialog, type FieldSpec } from "../fields/EntryDialog";
import type { PersonalDetails } from "@/lib/types";
import { useProfileSection } from "@/hooks/use-profile-section";

const schema = z.object({
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  maritalStatus: z.string().optional(),
  phone: z.string().min(1, "Required"),
  address: z.string().optional(),
  languages: z.array(z.string()),
});
type FormValues = z.infer<typeof schema>;

const fields: FieldSpec<FormValues>[] = [
  { name: "phone", label: "Phone", colSpan: 1 },
  { name: "dateOfBirth", label: "Date of birth", colSpan: 1, placeholder: "1998-04-12" },
  { name: "gender", label: "Gender", colSpan: 1 },
  { name: "maritalStatus", label: "Marital status", colSpan: 1 },
  { name: "address", label: "Address", colSpan: 2 },
  { name: "languages", label: "Languages", type: "tags", colSpan: 2, placeholder: "e.g. English" },
];

export function PersonalSection({ personal }: { personal: PersonalDetails }) {
  const { saving, save } = useProfileSection();
  const [open, setOpen] = React.useState(false);

  const rows: { label: string; value: string }[] = [
    { label: "Phone", value: personal.phone || "—" },
    { label: "Date of birth", value: personal.dateOfBirth || "—" },
    { label: "Gender", value: personal.gender || "—" },
    { label: "Marital status", value: personal.maritalStatus || "—" },
    { label: "Address", value: personal.address || "—" },
    { label: "Languages", value: personal.languages.join(", ") || "—" },
  ];

  return (
    <SectionCard title="Personal details" onAction={() => setOpen(true)}>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-xs text-muted-foreground">{r.label}</dt>
            <dd className="text-sm font-medium text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>

      <EntryDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit personal details"
        schema={schema}
        fields={fields}
        saving={saving}
        defaultValues={{
          gender: personal.gender,
          dateOfBirth: personal.dateOfBirth,
          maritalStatus: personal.maritalStatus,
          phone: personal.phone,
          address: personal.address,
          languages: personal.languages,
        }}
        onSubmit={(values) =>
          save({
            personal: {
              gender: values.gender ?? "",
              dateOfBirth: values.dateOfBirth ?? "",
              maritalStatus: values.maritalStatus ?? "",
              phone: values.phone,
              address: values.address ?? "",
              languages: values.languages,
            },
          })
        }
      />
    </SectionCard>
  );
}
