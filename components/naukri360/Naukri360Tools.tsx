"use client";

import * as React from "react";
import { ArrowRight, Code2, FileText, MessageCircleQuestion, Newspaper } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResumeBuilderTool } from "./ResumeBuilderTool";
import { InterviewPrepTool } from "./InterviewPrepTool";
import { CodingPracticeTool } from "./CodingPracticeTool";

type ToolKey = "resume" | "interview" | "coding" | null;

const NEWS = [
  {
    title: "India's tech hiring rebounds with 12% YoY growth",
    source: "Career Insights",
    time: "2 days ago",
  },
  {
    title: "Top in-demand skills for 2026: AI, Cloud, and Data",
    source: "Industry Report",
    time: "5 days ago",
  },
  {
    title: "How to negotiate your salary: a fresher's guide",
    source: "Naukri Learning",
    time: "1 week ago",
  },
];

export function Naukri360Tools() {
  const [active, setActive] = React.useState<ToolKey>(null);

  const tools = [
    {
      key: "resume" as const,
      icon: FileText,
      title: "Resume Builder",
      body: "Generate a recruiter-ready resume summary tailored to your profile.",
      cta: "Build resume",
    },
    {
      key: "interview" as const,
      icon: MessageCircleQuestion,
      title: "Interview Prep",
      body: "Practice common technical and behavioural questions with model answers.",
      cta: "Start practising",
    },
    {
      key: "coding" as const,
      icon: Code2,
      title: "Coding Practice",
      body: "Solve coding problems and run them against test cases in the browser.",
      cta: "Solve a problem",
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.key} className="flex flex-col p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">{tool.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{tool.body}</p>
              <Button
                variant="outline"
                className="mt-4 self-start"
                onClick={() => setActive(tool.key)}
              >
                {tool.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          );
        })}

        <Card className="p-5 lg:col-span-3">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-primary">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Career News &amp; Insights
              </h3>
              <p className="text-sm text-muted-foreground">Stay ahead with the latest trends</p>
            </div>
          </div>
          <ul className="divide-y divide-border">
            {NEWS.map((item) => (
              <li key={item.title} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.source} · {item.time}
                  </p>
                </div>
                <Badge variant="muted">Read</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <ResumeBuilderTool open={active === "resume"} onOpenChange={(o) => !o && setActive(null)} />
      <InterviewPrepTool
        open={active === "interview"}
        onOpenChange={(o) => !o && setActive(null)}
      />
      <CodingPracticeTool open={active === "coding"} onOpenChange={(o) => !o && setActive(null)} />
    </>
  );
}
