"use client";

import { Chip } from "@/components/common/Chip";
import { Button } from "@/components/ui/button";
import type { ArrayFacet, FilterAction } from "@/lib/utils/filter";
import type { JobFilterState } from "@/lib/types";
import { EXPERIENCE_OPTIONS } from "@/lib/constants/locations";

interface AppliedFilterChipsProps {
  filters: JobFilterState;
  dispatch: React.Dispatch<FilterAction>;
}

const ARRAY_FACETS: ArrayFacet[] = [
  "department",
  "workMode",
  "industry",
  "companyType",
  "education",
];

export function AppliedFilterChips({ filters, dispatch }: AppliedFilterChipsProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.keyword) {
    chips.push({
      label: `"${filters.keyword}"`,
      onRemove: () => dispatch({ type: "SET_KEYWORD", value: "" }),
    });
  }
  if (filters.location) {
    chips.push({
      label: filters.location,
      onRemove: () => dispatch({ type: "SET_LOCATION", value: "" }),
    });
  }
  if (filters.experience !== null) {
    const label =
      EXPERIENCE_OPTIONS.find((o) => o.value === filters.experience)?.label ??
      `${filters.experience} yrs`;
    chips.push({ label, onRemove: () => dispatch({ type: "SET_EXPERIENCE", value: null }) });
  }
  if (filters.salaryMin !== null) {
    chips.push({
      label: `${filters.salaryMin}+ LPA`,
      onRemove: () => dispatch({ type: "SET_SALARY", value: null }),
    });
  }
  if (filters.postedWithinDays !== null) {
    chips.push({
      label: `Last ${filters.postedWithinDays} days`,
      onRemove: () => dispatch({ type: "SET_POSTED", value: null }),
    });
  }
  for (const facet of ARRAY_FACETS) {
    for (const value of filters[facet]) {
      chips.push({
        label: value,
        onRemove: () => dispatch({ type: "TOGGLE_FACET", facet, value }),
      });
    }
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <Chip key={`${chip.label}-${i}`} label={chip.label} onRemove={chip.onRemove} />
      ))}
      <Button
        variant="link"
        size="sm"
        className="h-auto p-0 text-xs"
        onClick={() => dispatch({ type: "CLEAR_ALL" })}
      >
        Clear all
      </Button>
    </div>
  );
}
