"use client";

import * as React from "react";
import { FileText, Loader2, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SAMPLE = `Results-driven Software Engineer with 4+ years building scalable web applications.
Proven expertise in React, Node.js, TypeScript, and AWS, with a track record of improving
API latency by 35% and leading a TypeScript migration across a banking platform. Strong
collaborator who ships customer-focused features end-to-end and mentors peers.`;

export function ResumeBuilderTool({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [status, setStatus] = React.useState<"idle" | "loading" | "done">("idle");

  React.useEffect(() => {
    if (!open) setStatus("idle");
  }, [open]);

  function generate() {
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1800);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Resume Builder</DialogTitle>
          <DialogDescription>
            Generate a polished resume summary from your profile. (Simulated — demo only.)
          </DialogDescription>
        </DialogHeader>

        {status === "idle" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <FileText className="h-10 w-10 text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">
              We&apos;ll craft a recruiter-ready summary based on your profile.
            </p>
            <Button className="mt-4" onClick={generate}>
              <Sparkles className="h-4 w-4" />
              Generate summary
            </Button>
          </div>
        ) : null}

        {status === "loading" ? (
          <div className="flex flex-col items-center py-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Analysing your profile…</p>
          </div>
        ) : null}

        {status === "done" ? (
          <div>
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed text-foreground/90">
              {SAMPLE}
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" onClick={generate}>
                Regenerate
              </Button>
              <Button onClick={() => onOpenChange(false)}>Use this</Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
