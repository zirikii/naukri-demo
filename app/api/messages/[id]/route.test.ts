import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Message } from "@/lib/types";

const getSession = vi.fn();
const getMessages = vi.fn();
const writeData = vi.fn();

vi.mock("@/lib/auth/getSession", () => ({ getSession: () => getSession() }));
vi.mock("@/lib/data/queries", () => ({
  getMessages: () => getMessages(),
}));
vi.mock("@/lib/data/store", () => ({ writeData: (k: string, d: unknown) => writeData(k, d) }));

import { GET, PATCH, POST } from "./route";

const baseMessage: Message = {
  id: "msg-001",
  recruiterName: "Priya Nair",
  recruiterTitle: "Senior Talent Partner",
  companyId: "cmp-flipkart",
  subject: "Opportunity: Software Engineer",
  snippet: "Hi Aarav",
  bodyMd: "Hi Aarav",
  unread: true,
  sentAt: "2026-06-25T08:40:19.674Z",
  jobId: "job-005",
  replies: [],
};

const context = { params: { id: "msg-001" } };

function patch(body: unknown) {
  return PATCH(
    new Request("http://localhost/api/messages/msg-001", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    context,
  );
}

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/messages/msg-001", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    context,
  );
}

describe("GET /api/messages/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a message by id", async () => {
    getMessages.mockResolvedValue([baseMessage]);

    const res = await GET(new Request("http://localhost/api/messages/msg-001"), context);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.message.id).toBe("msg-001");
    expect(data.message.subject).toBe("Opportunity: Software Engineer");
  });

  it("returns 404 when the message is not found", async () => {
    getMessages.mockResolvedValue([]);

    const res = await GET(new Request("http://localhost/api/messages/msg-001"), context);
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/messages/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMessages.mockResolvedValue([baseMessage]);
  });

  it("rejects unauthenticated requests", async () => {
    getSession.mockResolvedValue(null);
    const res = await patch({ unread: false });
    expect(res.status).toBe(401);
  });

  it("returns 404 when the message is not found", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    getMessages.mockResolvedValue([]);

    const res = await patch({ unread: false });
    expect(res.status).toBe(404);
  });

  it("marks a message as read", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });

    const res = await patch({ unread: false });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.message.unread).toBe(false);

    expect(writeData).toHaveBeenCalledTimes(1);
    const [, written] = writeData.mock.calls[0] as [string, Message[]];
    expect(written[0]?.unread).toBe(false);
  });
});

describe("POST /api/messages/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMessages.mockResolvedValue([baseMessage]);
  });

  it("rejects unauthenticated requests", async () => {
    getSession.mockResolvedValue(null);
    const res = await post({ body: "Thanks for reaching out" });
    expect(res.status).toBe(401);
  });

  it("returns 400 when the reply body is empty", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    const res = await post({ body: "" });
    expect(res.status).toBe(400);
  });

  it("returns 404 when the message is not found", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    getMessages.mockResolvedValue([]);

    const res = await post({ body: "Thanks" });
    expect(res.status).toBe(404);
  });

  it("adds a candidate reply and marks the message read", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });

    const res = await post({ body: "I am interested. Let's connect." });
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.reply.body).toBe("I am interested. Let's connect.");
    expect(data.reply.from).toBe("candidate");
    expect(data.message.unread).toBe(false);
    expect(data.message.replies).toHaveLength(1);

    expect(writeData).toHaveBeenCalledTimes(1);
    const [, written] = writeData.mock.calls[0] as [string, Message[]];
    expect(written[0]?.replies).toHaveLength(1);
    expect(written[0]?.replies[0]?.body).toBe("I am interested. Let's connect.");
  });
});
