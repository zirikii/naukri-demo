"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";

import { useToast, type ToastVariant } from "@/hooks/use-toast";
import { cn } from "@/lib/utils/cn";

const variantStyles: Record<ToastVariant, { border: string; icon: React.ReactNode }> = {
  default: { border: "border-l-primary", icon: <Info className="h-5 w-5 text-primary" /> },
  success: {
    border: "border-l-success",
    icon: <CheckCircle2 className="h-5 w-5 text-success" />,
  },
  error: { border: "border-l-destructive", icon: <XCircle className="h-5 w-5 text-destructive" /> },
  info: { border: "border-l-sky", icon: <Info className="h-5 w-5 text-sky" /> },
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const style = variantStyles[t.variant];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-md border border-l-4 border-border bg-card p-4 shadow-card-hover animate-in slide-in-from-right-5",
              style.border,
            )}
          >
            <div className="mt-0.5">{style.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{t.title}</p>
              {t.description ? (
                <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismiss(t.id)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
