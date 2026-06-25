"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import * as React from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { APP_NAV, MARKETING_NAV, PROFILE_MENU } from "@/lib/constants/nav";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils/cn";

/** Hamburger menu for small screens. */
export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useSession();
  const [open, setOpen] = React.useState(false);

  const close = () => setOpen(false);
  const isActive = (href: string) => {
    const base = href.split("?")[0]!;
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] gap-0">
          <SheetHeader>
            <SheetTitle>{isAuthenticated && user ? user.name : "Menu"}</SheetTitle>
          </SheetHeader>

          <div className="my-4">
            <SearchBar variant="compact" />
          </div>

          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {(isAuthenticated ? APP_NAV : MARKETING_NAV).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium",
                  isActive(item.href)
                    ? "bg-secondary text-primary"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-border pt-4">
            {isAuthenticated ? (
              <>
                {PROFILE_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    close();
                    void logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm text-destructive hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild onClick={close}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild onClick={close}>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
