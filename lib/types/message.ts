export interface MessageReply {
  id: string;
  from: "candidate" | "recruiter";
  body: string;
  sentAt: string;
}

export interface Message {
  id: string;
  recruiterName: string;
  recruiterTitle: string;
  companyId: string;
  subject: string;
  snippet: string;
  bodyMd: string;
  unread: boolean;
  sentAt: string;
  jobId?: string;
  replies: MessageReply[];
}
