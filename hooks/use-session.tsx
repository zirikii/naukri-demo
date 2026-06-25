"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { SessionUser } from "@/lib/types";

interface SessionContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const SessionContext = React.createContext<SessionContextValue | null>(null);

export function SessionProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: SessionUser | null;
}) {
  const router = useRouter();

  const logout = React.useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }, [router]);

  const value = React.useMemo<SessionContextValue>(
    () => ({ user: initialUser, isAuthenticated: initialUser !== null, logout }),
    [initialUser, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = React.useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
