"use client";

import Link from "next/link";
import { ExternalLink, Send } from "lucide-react";
import * as React from "react";

import { CompanyLogo } from "@/components/common/CompanyLogo";
import { Markdown } from "@/components/common/Markdown";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/common/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { initials, postedAgo } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Company, Message } from "@/lib/types";
import { MessageSquare } from "lucide-react";

type MessageWithCompany = Message & { company: Company | undefined };

export function MessagesInbox({ messages: initial }: { messages: MessageWithCompany[] }) {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState(initial);
  const [selectedId, setSelectedId] = React.useState<string | null>(initial[0]?.id ?? null);
  const [reply, setReply] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const selected = messages.find((m) => m.id === selectedId) ?? null;
  const unreadCount = messages.filter((m) => m.unread).length;

  async function openConversation(id: string) {
    setSelectedId(id);
    const msg = messages.find((m) => m.id === id);
    if (msg?.unread) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
      await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unread: false }),
      });
    }
  }

  async function sendReply() {
    if (!selected || !reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: reply.trim() }),
      });
      if (!res.ok) throw new Error("Failed to send");
      const data = (await res.json()) as { reply: Message["replies"][number] };
      setMessages((prev) =>
        prev.map((m) => (m.id === selected.id ? { ...m, replies: [...m.replies, data.reply] } : m)),
      );
      setReply("");
      toast({ title: "Reply sent", variant: "success" });
    } catch {
      toast({ title: "Could not send reply", variant: "error" });
    } finally {
      setSending(false);
    }
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No messages yet"
        description="Recruiter messages and job invites will appear here."
      />
    );
  }

  return (
    <div className="grid h-[calc(100vh-12rem)] grid-cols-1 overflow-hidden rounded-lg border border-border bg-card md:grid-cols-[320px_1fr]">
      {/* Conversation list */}
      <div
        className={cn(
          "scroll-area overflow-y-auto border-r border-border",
          selected && "hidden md:block",
        )}
      >
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold text-foreground">
            Inbox{" "}
            {unreadCount > 0 ? <span className="text-primary">({unreadCount} unread)</span> : null}
          </h2>
        </div>
        <ul>
          {messages.map((msg) => (
            <li key={msg.id}>
              <button
                type="button"
                onClick={() => openConversation(msg.id)}
                className={cn(
                  "flex w-full gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50",
                  selectedId === msg.id && "bg-secondary",
                )}
              >
                {msg.company ? (
                  <CompanyLogo name={msg.company.name} hue={msg.company.logoHue} size={40} />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {msg.recruiterName}
                    </p>
                    {msg.unread ? (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    ) : null}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{msg.company?.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{msg.snippet}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{postedAgo(msg.sentAt)}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Reading pane */}
      {selected ? (
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-start justify-between gap-3 border-b border-border p-4">
            <div className="flex items-center gap-3">
              {selected.company ? (
                <CompanyLogo
                  name={selected.company.name}
                  hue={selected.company.logoHue}
                  size={44}
                />
              ) : null}
              <div>
                <p className="text-sm font-semibold text-foreground">{selected.recruiterName}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.recruiterTitle}
                  {selected.company ? ` · ${selected.company.name}` : ""}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-sm text-primary hover:underline md:hidden"
              onClick={() => setSelectedId(null)}
            >
              Back
            </button>
          </div>

          <div className="scroll-area flex-1 space-y-4 overflow-y-auto p-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">{selected.subject}</h3>
              <p className="text-xs text-muted-foreground">{postedAgo(selected.sentAt)}</p>
            </div>
            <div className="rounded-lg bg-muted/40 p-4">
              <Markdown>{selected.bodyMd}</Markdown>
            </div>

            {selected.jobId ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/jobs/${selected.jobId}`}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  View job
                </Link>
              </Button>
            ) : null}

            {selected.replies.map((r) => (
              <div
                key={r.id}
                className="ml-auto max-w-[85%] rounded-lg rounded-br-none bg-primary p-3 text-sm text-primary-foreground"
              >
                <div className="mb-1 flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-white/20 text-xs text-white">
                      {initials("You")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">You</span>
                </div>
                <p className="whitespace-pre-wrap">{r.body}</p>
                <p className="mt-1 text-right text-[10px] text-primary-foreground/70">
                  {postedAgo(r.sentAt)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply…"
                rows={2}
                className="flex-1 resize-none rounded-md border border-input bg-card p-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    void sendReply();
                  }
                }}
              />
              <Button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                size="icon"
                className="h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden items-center justify-center p-8 text-sm text-muted-foreground md:flex">
          Select a conversation to read
        </div>
      )}
    </div>
  );
}
