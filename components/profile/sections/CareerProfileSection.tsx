"use client";

import * as React from "react";
import { z } from "zod";

import { SectionCard } from "../SectionCard";
import { EntryDialog, type FieldSpec } from "../fields/EntryDialog";
import { Chip } from "@/components/common/Chip";
import type { CareerProfile } from "@/lib/types";
import { useProfileSection } from "@/hooks/use-profile-section";

const schema = z.object({
  preferredLocations: z.array(z.string()),
  industries: z.array(z.string()),
  roles: z.array(z.string()),
  expectedSalary: z.coerce.number().min(0).max(200),
  noticePeriod: z.string().optional(),
  workMode: z.string().optional(),
  employmentType: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const fields: FieldSpec<FormValues>[] = [
  { name: "preferredLocations", label: "Preferred locations", type: "tags", colSpan: 2 },
  { name: "roles", label: "Preferred roles", type: "tags", colSpan: 2 },
  { name: "industries", label: "Preferred industries", type: "tags", colSpan: 2 },
  { name: "expectedSalary", label: "Expected salary (₹ LPA)", type: "number", colSpan: 1 },
  { name: "noticePeriod", label: "Notice period", colSpan: 1, placeholder: "30 days" },
  { name: "workMode", label: "Work mode", colSpan: 1, placeholder: "Hybrid" },
  { name: "employmentType", label: "Employment type", colSpan: 1, placeholder: "Full Time" },
];

export function CareerProfileSection({ career }: { career: CareerProfile }) {
  const { saving, save } = useProfileSection();
  const [open, setOpen] = React.useState(false);

  return (
    <SectionCard title="Career profile" onAction={() => setOpen(true)}>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Preferred locations</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {career.preferredLocations.map((l) => (
              <Chip key={l} label={l} />
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Preferred roles</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {career.roles.map((r) => (
              <Chip key={r} label={r} />
            ))}
          </dd>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-xs text-muted-foreground">Expected salary</dt>
            <dd className="font-medium text-foreground">₹ {career.expectedSalary} LPA</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Notice period</dt>
            <dd className="font-medium text-foreground">{career.noticePeriod}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Work mode</dt>
            <dd className="font-medium text-foreground">{career.workMode}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Employment type</dt>
            <dd className="font-medium text-foreground">{career.employmentType}</dd>
          </div>
        </div>
      </dl>

      <EntryDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit career profile"
        schema={schema}
        fields={fields}
        saving={saving}
        defaultValues={{
          preferredLocations: career.preferredLocations,
          industries: career.industries,
          roles: career.roles,
          expectedSalary: career.expectedSalary,
          noticePeriod: career.noticePeriod,
          workMode: career.workMode,
          employmentType: career.employmentType,
        }}
        onSubmit={(values) =>
          save({
            career: {
              preferredLocations: values.preferredLocations,
              industries: values.industries,
              roles: values.roles,
              expectedSalary: Number(values.expectedSalary),
              noticePeriod: values.noticePeriod ?? "",
              workMode: values.workMode ?? "",
              employmentType: values.employmentType ?? "",
            },
          })
        }
      />
    </SectionCard>
  );
}
