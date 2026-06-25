"use client";

import * as React from "react";

import { Chip } from "@/components/common/Chip";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  id?: string;
}

/** Add/remove string tags by typing and pressing Enter or comma. */
export function TagInput({ value, onChange, placeholder, id }: TagInputProps) {
  const [draft, setDraft] = React.useState("");

  function commit() {
    const trimmed = draft.trim().replace(/,$/, "").trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft("");
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <Chip key={tag} label={tag} onRemove={() => onChange(value.filter((t) => t !== tag))} />
        ))}
        {value.length === 0 ? (
          <span className="text-xs text-muted-foreground">No items added yet</span>
        ) : null}
      </div>
      <Input
        id={id}
        value={draft}
        placeholder={placeholder ?? "Type and press Enter"}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
      />
    </div>
  );
}
