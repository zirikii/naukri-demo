import type { Metadata } from "next";

import { Markdown } from "@/components/common/Markdown";
import { loadContent } from "@/lib/data/content";

export const metadata: Metadata = { title: "About & Help" };

export default async function AboutPage() {
  const [gettingStarted, faq, privacy, terms] = await Promise.all([
    loadContent("help/getting-started.md"),
    loadContent("help/faq.md"),
    loadContent("legal/privacy.md"),
    loadContent("legal/terms.md"),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
        This is an unofficial demo and is{" "}
        <strong>not affiliated with Naukri.com or Info Edge (India) Ltd.</strong> All data is dummy
        and for demonstration only.
      </div>

      <article className="surface-card mt-6 p-6">
        <Markdown>{gettingStarted.body}</Markdown>
      </article>
      <article className="surface-card mt-6 p-6">
        <Markdown>{faq.body}</Markdown>
      </article>
      <article className="surface-card mt-6 p-6">
        <Markdown>{privacy.body}</Markdown>
      </article>
      <article className="surface-card mt-6 p-6">
        <Markdown>{terms.body}</Markdown>
      </article>
    </div>
  );
}
