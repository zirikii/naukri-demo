"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";

const QUESTIONS: { q: string; a: string }[] = [
  {
    q: "Explain the difference between let, const, and var in JavaScript.",
    a: "var is function-scoped and hoisted; let and const are block-scoped. const cannot be reassigned. Prefer const by default, let when reassignment is needed, and avoid var.",
  },
  {
    q: "How does React's reconciliation (virtual DOM diffing) work?",
    a: "React builds a virtual DOM tree, diffs it against the previous tree using keys and element types, and applies the minimal set of real DOM mutations. Stable keys help React match list items efficiently.",
  },
  {
    q: "What is the difference between SQL JOIN types?",
    a: "INNER JOIN returns matching rows in both tables; LEFT/RIGHT JOIN keep all rows from one side; FULL OUTER JOIN keeps all rows from both, filling gaps with NULLs.",
  },
  {
    q: "Describe how you would design a URL shortener.",
    a: "Generate a unique short key (base62 of an incrementing ID or a hash), store key→URL mapping in a DB with caching, redirect on lookup, and handle collisions, analytics, and rate limiting.",
  },
];

export function InterviewPrepTool({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [revealed, setRevealed] = React.useState<Set<number>>(new Set());

  function toggle(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Interview Prep</DialogTitle>
          <DialogDescription>
            Practice common questions. Tap a question to reveal a model answer. (Demo only.)
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2">
          {QUESTIONS.map((item, i) => {
            const isOpen = revealed.has(i);
            return (
              <li key={i} className="rounded-md border border-border">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-2 p-3 text-left text-sm font-medium text-foreground"
                >
                  {item.q}
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen ? (
                  <p className="border-t border-border p-3 text-sm text-muted-foreground">
                    {item.a}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
