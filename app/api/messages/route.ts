import { NextResponse } from "next/server";

import { getMessages } from "@/lib/data/queries";

export const runtime = "nodejs";

export async function GET() {
  const messages = await getMessages();
  return NextResponse.json({ messages });
}
