"use client";

import * as React from "react";
import { useForm, type DefaultValues, type FieldValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "./TagInput";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "tags";

export interface FieldSpec<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: FieldType;
  placeholder?: string;
  colSpan?: 1 | 2;
}

interface EntryDialogProps<T extends FieldValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  schema: ZodType<T>;
  fields: FieldSpec<T>[];
  defaultValues: DefaultValues<T>;
  onSubmit: (values: T) => Promise<boolean>;
  saving?: boolean;
}

/** Generic react-hook-form + zod dialog used by profile list-section editors. */
export function EntryDialog<T extends FieldValues>({
  open,
  onOpenChange,
  title,
  schema,
  fields,
  defaultValues,
  onSubmit,
  saving,
}: EntryDialogProps<T>) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<T>({ resolver: zodResolver(schema), defaultValues });

  React.useEffect(() => {
    if (open) reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function submit(values: T) {
    const ok = await onSubmit(values);
    if (ok) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="grid grid-cols-2 gap-4" noValidate>
          {fields.map((field) => {
            const error = errors[field.name];
            const span = field.colSpan === 1 ? "col-span-1" : "col-span-2";

            if (field.type === "checkbox") {
              return (
                <div key={String(field.name)} className={`${span} flex items-center gap-2`}>
                  <Checkbox
                    id={String(field.name)}
                    checked={Boolean(watch(field.name))}
                    onCheckedChange={(c) =>
                      setValue(field.name, Boolean(c) as never, { shouldValidate: true })
                    }
                  />
                  <Label htmlFor={String(field.name)} className="font-normal">
                    {field.label}
                  </Label>
                </div>
              );
            }

            if (field.type === "tags") {
              const current = (watch(field.name) as string[]) ?? [];
              return (
                <div key={String(field.name)} className={`${span} space-y-1.5`}>
                  <Label>{field.label}</Label>
                  <TagInput
                    value={current}
                    onChange={(v) => setValue(field.name, v as never, { shouldValidate: true })}
                    placeholder={field.placeholder}
                  />
                </div>
              );
            }

            return (
              <div key={String(field.name)} className={`${span} space-y-1.5`}>
                <Label htmlFor={String(field.name)}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <textarea
                    id={String(field.name)}
                    rows={3}
                    placeholder={field.placeholder}
                    className="w-full rounded-md border border-input bg-card p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...register(field.name)}
                  />
                ) : (
                  <Input
                    id={String(field.name)}
                    type={field.type === "number" ? "number" : "text"}
                    placeholder={field.placeholder}
                    {...register(field.name)}
                  />
                )}
                {error ? <p className="text-xs text-destructive">{String(error.message)}</p> : null}
              </div>
            );
          })}

          <DialogFooter className="col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
