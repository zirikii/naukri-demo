import { Eye, Phone, Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkline } from "./Sparkline";

interface Metric {
  label: string;
  value: number;
  delta: string;
  icon: typeof Eye;
  trend: number[];
}

const METRICS: Metric[] = [
  {
    label: "Search appearances",
    value: 248,
    delta: "+18% this week",
    icon: Search,
    trend: [12, 18, 15, 22, 30, 28, 35],
  },
  {
    label: "Recruiter views",
    value: 64,
    delta: "+9 this week",
    icon: Eye,
    trend: [4, 6, 5, 8, 7, 10, 12],
  },
  {
    label: "Contact details viewed",
    value: 21,
    delta: "+3 this week",
    icon: Phone,
    trend: [1, 2, 2, 3, 2, 4, 3],
  },
];

export function ProfilePerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{metric.label}</p>
                  <p className="text-xs text-success">{metric.delta}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Sparkline data={metric.trend} />
                <span className="w-10 text-right text-lg font-bold text-foreground">
                  {metric.value}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
