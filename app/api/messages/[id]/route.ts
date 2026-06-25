import { NextResponse } from "next/server";
import { z } from "zod";

import { getMessages } from "@/lib/data/queries";
import { writeData } from "@/lib/data/store";
import { getSession } from "@/lib/auth/getSession";
import type { Message, MessageReply } from "@/lib/types";

export const runtime = "nodejs";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const messages = await getMessages();
  const message = messages.find((m) => m.id === params.id);
  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }
  return NextResponse.json({ message });
}

/** PATCH marks a conversation as read/unread. */
export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { unread?: boolean };
  const messages = await getMessages();
  let updated: Message | undefined;
  const next = messages.map((m) => {
    if (m.id !== params.id) return m;
    updated = { ...m, unread: body.unread ?? false };
    return updated;
  });

  if (!updated) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  await writeData("messages", next);
  return NextResponse.json({ message: updated });
}

const replySchema = z.object({ body: z.string().min(1, "Reply cannot be empty") });

/** POST adds a candidate reply to the conversation. */
export async function POST(request: Request, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const parsed = replySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid reply" },
      { status: 400 },
    );
  }

  const messages = await getMessages();
  const reply: MessageReply = {
    id: `reply-${Date.now()}`,
    from: "candidate",
    body: parsed.data.body,
    sentAt: new Date().toISOString(),
  };

  let updated: Message | undefined;
  const next = messages.map((m) => {
    if (m.id !== params.id) return m;
    updated = { ...m, unread: false, replies: [...m.replies, reply] };
    return updated;
  });

  if (!updated) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  await writeData("messages", next);
  return NextResponse.json({ message: updated, reply }, { status: 201 });
}
