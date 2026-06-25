"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FilterFacet } from "./FilterFacet";
import type { ArrayFacet, FilterAction } from "@/lib/utils/filter";
import type { JobFilterState } from "@/lib/types";
import {
  COMPANY_TYPES,
  DEPARTMENTS,
  EDUCATION_LEVELS,
  INDUSTRIES,
  WORK_MODES,
} from "@/lib/constants/departments";
import { CITIES, EXPERIENCE_OPTIONS } from "@/lib/constants/locations";
import { POSTED_WINDOWS, SALARY_RANGES } from "@/lib/constants/skills";
import { cn } from "@/lib/utils/cn";

interface FilterRailProps {
  filters: JobFilterState;
  dispatch: React.Dispatch<FilterAction>;
  className?: string;
}

function CheckboxFacet({
  facet,
  options,
  filters,
  dispatch,
}: {
  facet: ArrayFacet;
  options: readonly string[];
  filters: JobFilterState;
  dispatch: React.Dispatch<FilterAction>;
}) {
  const selected = filters[facet];
  return (
    <div className="space-y-2.5">
      {options.map((option) => {
        const id = `${facet}-${option}`;
        return (
          <div key={option} className="flex items-center gap-2.5">
            <Checkbox
              id={id}
              checked={selected.includes(option)}
              onCheckedChange={() => dispatch({ type: "TOGGLE_FACET", facet, value: option })}
            />
            <Label htmlFor={id} className="cursor-pointer text-sm font-normal text-foreground/90">
              {option}
            </Label>
          </div>
        );
      })}
    </div>
  );
}

export function FilterRail({ filters, dispatch, className }: FilterRailProps) {
  return (
    <aside
      className={cn("surface-card divide-y divide-border px-4", className)}
      aria-label="Job filters"
    >
      <div className="flex items-center justify-between py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          All Filters
        </h2>
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs"
          onClick={() => dispatch({ type: "CLEAR_ALL" })}
        >
          Clear all
        </Button>
      </div>

      <FilterFacet id="department" title="Department">
        <CheckboxFacet
          facet="department"
          options={DEPARTMENTS}
          filters={filters}
          dispatch={dispatch}
        />
      </FilterFacet>

      <FilterFacet id="workMode" title="Work mode">
        <CheckboxFacet
          facet="workMode"
          options={WORK_MODES}
          filters={filters}
          dispatch={dispatch}
        />
      </FilterFacet>

      <FilterFacet id="experience" title="Experience">
        <div className="space-y-2.5">
          {EXPERIENCE_OPTIONS.map((opt) => {
            const id = `exp-${opt.value}`;
            return (
              <div key={opt.value} className="flex items-center gap-2.5">
                <Checkbox
                  id={id}
                  checked={filters.experience === opt.value}
                  onCheckedChange={(checked) =>
                    dispatch({ type: "SET_EXPERIENCE", value: checked ? opt.value : null })
                  }
                />
                <Label
                  htmlFor={id}
                  className="cursor-pointer text-sm font-normal text-foreground/90"
                >
                  {opt.label}
                </Label>
              </div>
            );
          })}
        </div>
      </FilterFacet>

      <FilterFacet id="salary" title="Salary (₹ LPA)">
        <div className="space-y-2.5">
          {SALARY_RANGES.map((range) => {
            const id = `sal-${range.min}`;
            return (
              <div key={range.min} className="flex items-center gap-2.5">
                <Checkbox
                  id={id}
                  checked={filters.salaryMin === range.min}
                  onCheckedChange={(checked) =>
                    dispatch({ type: "SET_SALARY", value: checked ? range.min : null })
                  }
                />
                <Label
                  htmlFor={id}
                  className="cursor-pointer text-sm font-normal text-foreground/90"
                >
                  {range.label}
                </Label>
              </div>
            );
          })}
        </div>
      </FilterFacet>

      <FilterFacet id="location" title="Location" defaultOpen={false}>
        <div className="space-y-2.5">
          {CITIES.map((city) => {
            const id = `loc-${city}`;
            return (
              <div key={city} className="flex items-center gap-2.5">
                <Checkbox
                  id={id}
                  checked={filters.location === city}
                  onCheckedChange={(checked) =>
                    dispatch({ type: "SET_LOCATION", value: checked ? city : "" })
                  }
                />
                <Label
                  htmlFor={id}
                  className="cursor-pointer text-sm font-normal text-foreground/90"
                >
                  {city}
                </Label>
              </div>
            );
          })}
        </div>
      </FilterFacet>

      <FilterFacet id="industry" title="Industry" defaultOpen={false}>
        <CheckboxFacet
          facet="industry"
          options={INDUSTRIES}
          filters={filters}
          dispatch={dispatch}
        />
      </FilterFacet>

      <FilterFacet id="companyType" title="Company type" defaultOpen={false}>
        <CheckboxFacet
          facet="companyType"
          options={COMPANY_TYPES}
          filters={filters}
          dispatch={dispatch}
        />
      </FilterFacet>

      <FilterFacet id="education" title="Education" defaultOpen={false}>
        <CheckboxFacet
          facet="education"
          options={EDUCATION_LEVELS}
          filters={filters}
          dispatch={dispatch}
        />
      </FilterFacet>

      <FilterFacet id="posted" title="Posted" defaultOpen={false}>
        <div className="space-y-2.5">
          {POSTED_WINDOWS.map((win) => {
            const id = `posted-${win.value}`;
            return (
              <div key={win.value} className="flex items-center gap-2.5">
                <Checkbox
                  id={id}
                  checked={filters.postedWithinDays === win.value}
                  onCheckedChange={(checked) =>
                    dispatch({ type: "SET_POSTED", value: checked ? win.value : null })
                  }
                />
                <Label
                  htmlFor={id}
                  className="cursor-pointer text-sm font-normal text-foreground/90"
                >
                  {win.label}
                </Label>
              </div>
            );
          })}
        </div>
      </FilterFacet>
    </aside>
  );
}
