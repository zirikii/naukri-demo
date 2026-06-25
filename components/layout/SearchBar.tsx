"use client";

import { useRouter } from "next/navigation";
import { Briefcase, MapPin, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPERIENCE_OPTIONS } from "@/lib/constants/locations";
import { serializeFilters } from "@/lib/utils/filter-url";
import { DEFAULT_FILTERS } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps {
  /** "hero" is the large landing variant; "compact" sits inside the global nav. */
  variant?: "hero" | "compact";
  defaultKeyword?: string;
  defaultLocation?: string;
  defaultExperience?: number | null;
  className?: string;
}

export function SearchBar({
  variant = "compact",
  defaultKeyword = "",
  defaultLocation = "",
  defaultExperience = null,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [keyword, setKeyword] = React.useState(defaultKeyword);
  const [location, setLocation] = React.useState(defaultLocation);
  const [experience, setExperience] = React.useState<string>(
    defaultExperience === null ? "any" : String(defaultExperience),
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = serializeFilters({
      ...DEFAULT_FILTERS,
      keyword: keyword.trim(),
      location: location.trim(),
      experience: experience === "any" ? null : Number(experience),
    });
    router.push(`/jobs${query ? `?${query}` : ""}`);
  }

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-stretch gap-2 rounded-full border border-border bg-card",
        isHero ? "flex-col p-2 shadow-card-hover sm:flex-row sm:rounded-full" : "h-11 px-1.5",
        className,
      )}
      role="search"
    >
      <div className={cn("flex flex-1 items-center gap-2 px-3", isHero && "py-1")}>
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter skills / designations / companies"
          aria-label="Search keywords"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className={cn("flex items-center border-border", isHero ? "sm:border-l" : "border-l")}>
        <Select value={experience} onValueChange={setExperience}>
          <SelectTrigger
            className="h-auto min-w-[8.5rem] border-0 bg-transparent px-3 text-sm shadow-none focus:ring-0"
            aria-label="Experience"
          >
            <span className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Experience" />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Experience</SelectItem>
            {EXPERIENCE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className={cn(
          "flex flex-1 items-center gap-2 border-border px-3",
          isHero ? "sm:border-l" : "border-l",
        )}
      >
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          aria-label="Location"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <Button type="submit" className={cn("rounded-full", isHero ? "px-10 sm:h-auto" : "px-6")}>
        Search
      </Button>
    </form>
  );
}
