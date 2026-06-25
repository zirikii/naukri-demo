"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FilterFacetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/** A single collapsible facet section in the filter rail. */
export function FilterFacet({ id, title, children, defaultOpen = true }: FilterFacetProps) {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? id : undefined}>
      <AccordionItem value={id} className="border-b-0">
        <AccordionTrigger className="py-3 text-sm font-semibold">{title}</AccordionTrigger>
        <AccordionContent className="pb-4">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
