"use client";

import { ToastProvider } from "@/hooks/use-toast";
import { SessionProvider } from "@/hooks/use-session";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SessionUser } from "@/lib/types";

export function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: SessionUser | null;
}) {
  return (
    <SessionProvider initialUser={initialUser}>
      <ToastProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster />
        </TooltipProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
