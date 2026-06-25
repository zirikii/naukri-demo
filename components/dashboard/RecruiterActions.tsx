import Link from "next/link";
import { ArrowRight, Eye, MessageSquare, UserCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { postedAgo } from "@/lib/utils/format";
import type { Company, Message } from "@/lib/types";

interface RecruiterActionsProps {
  messages: (Message & { company: Company | undefined })[];
}

export function RecruiterActions({ messages }: RecruiterActionsProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recent recruiter actions</CardTitle>
        <Link
          href="/messages"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Inbox
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {messages.map((msg) => (
          <Link
            key={msg.id}
            href="/messages"
            className="flex items-start gap-3 rounded-md border border-border p-3 transition-colors hover:border-primary"
          >
            {msg.company ? (
              <CompanyLogo name={msg.company.name} hue={msg.company.logoHue} size={40} />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                {msg.recruiterName}
                {msg.unread ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
              </p>
              <p className="truncate text-xs text-muted-foreground">{msg.snippet}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{postedAgo(msg.sentAt)}</p>
            </div>
          </Link>
        ))}
        <div className="flex items-center gap-2 rounded-md bg-secondary p-3 text-xs text-secondary-foreground">
          <UserCheck className="h-4 w-4" />
          <span>2 recruiters viewed your profile</span>
          <Eye className="ml-auto h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}
