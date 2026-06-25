"use client";

import * as React from "react";
import { CheckCircle2, Loader2, Play } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STARTER = `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`;

const TESTS = [
  "twoSum([2,7,11,15], 9) → [0,1]",
  "twoSum([3,2,4], 6) → [1,2]",
  "twoSum([3,3], 6) → [0,1]",
];

export function CodingPracticeTool({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [code, setCode] = React.useState(STARTER);
  const [status, setStatus] = React.useState<"idle" | "running" | "passed">("idle");

  React.useEffect(() => {
    if (!open) {
      setStatus("idle");
      setCode(STARTER);
    }
  }, [open]);

  function run() {
    setStatus("running");
    setTimeout(() => setStatus("passed"), 1500);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Coding Practice — Two Sum</DialogTitle>
          <DialogDescription>
            Given an array of integers and a target, return indices of the two numbers that add up
            to the target. (Simulated runner — demo only.)
          </DialogDescription>
        </DialogHeader>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={10}
          spellCheck={false}
          className="w-full rounded-md border border-border bg-foreground/95 p-3 font-mono text-xs text-background outline-none"
        />

        <div className="flex items-center justify-between">
          <Button onClick={run} disabled={status === "running"}>
            {status === "running" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run tests
          </Button>
          {status === "passed" ? (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4" />
              All {TESTS.length} tests passed
            </span>
          ) : null}
        </div>

        {status === "passed" ? (
          <ul className="space-y-1 rounded-md bg-success/10 p-3 text-xs text-success">
            {TESTS.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t}
              </li>
            ))}
          </ul>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
