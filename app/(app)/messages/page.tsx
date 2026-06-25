import type { Metadata } from "next";

import { PageHeader } from "@/components/common/PageHeader";
import { MessagesInbox } from "@/components/messages/MessagesInbox";
import { getCompanyMap, getMessages } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const [messages, companyMap] = await Promise.all([getMessages(), getCompanyMap()]);
  const withCompany = messages
    .slice()
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .map((m) => ({ ...m, company: companyMap.get(m.companyId) }));

  return (
    <div className="space-y-5">
      <PageHeader title="Recruiter messages" description="Conversations with recruiters" />
      <MessagesInbox messages={withCompany} />
    </div>
  );
}
