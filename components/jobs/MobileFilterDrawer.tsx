"use client";

import { SlidersHorizontal } from "lucide-react";
import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterRail } from "./FilterRail";
import type { FilterAction } from "@/lib/utils/filter";
import type { JobFilterState } from "@/lib/types";

interface MobileFilterDrawerProps {
  filters: JobFilterState;
  dispatch: React.Dispatch<FilterAction>;
  resultCount: number;
  activeCount: number;
}

export function MobileFilterDrawer({
  filters,
  dispatch,
  resultCount,
  activeCount,
}: MobileFilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 ? (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88%] max-w-sm overflow-y-auto p-0 sm:w-[360px]">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="scroll-area flex-1 overflow-y-auto p-2">
          <FilterRail filters={filters} dispatch={dispatch} className="border-0 shadow-none" />
        </div>
        <SheetFooter className="border-t border-border p-4">
          <SheetClose asChild>
            <Button className="w-full">Show {resultCount} jobs</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
