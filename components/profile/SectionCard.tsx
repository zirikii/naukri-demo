import { Plus, Pencil } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SectionCardProps {
  title: string;
  onAction?: () => void;
  actionLabel?: "edit" | "add";
  children: React.ReactNode;
  id?: string;
}

/** Card shell for a profile section with an edit/add affordance in the header. */
export function SectionCard({
  title,
  onAction,
  actionLabel = "edit",
  children,
  id,
}: SectionCardProps) {
  return (
    <Card id={id} className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {onAction ? (
          <Button variant="ghost" size="sm" onClick={onAction} className="text-primary">
            {actionLabel === "add" ? (
              <>
                <Plus className="h-4 w-4" /> Add
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </>
            )}
          </Button>
        ) : null}
      </div>
      {children}
    </Card>
  );
}
