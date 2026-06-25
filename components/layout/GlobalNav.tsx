"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { ProfileMenu } from "./ProfileMenu";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { APP_NAV, MARKETING_NAV } from "@/lib/constants/nav";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils/cn";

interface GlobalNavProps {
  /** Hide the embedded compact search (e.g. on the landing hero which has its own). */
  showSearch?: boolean;
}

/** Sticky top global navigation with logo, embedded search, links, and profile menu. */
export function GlobalNav({ showSearch = true }: GlobalNavProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useSession();

  const isActive = (href: string) => {
    const base = href.split("?")[0]!;
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Logo className="shrink-0" />

        {showSearch ? (
          <div className="hidden flex-1 lg:block">
            <SearchBar variant="compact" className="max-w-2xl" />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {(isAuthenticated ? APP_NAV : MARKETING_NAV).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive(item.href) ? "text-primary" : "text-foreground/80",
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
