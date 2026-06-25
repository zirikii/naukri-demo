import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

interface LogoProps {
  href?: string;
  variant?: "default" | "white";
  className?: string;
}

/** Naukri wordmark, linking home by default. */
export function Logo({ href = "/", variant = "default", className }: LogoProps) {
  const src = variant === "white" ? "/brand/logo-white.svg" : "/brand/logo.svg";
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center", className)}
      aria-label="naukri home"
    >
      <Image src={src} alt="naukri" width={104} height={28} priority className="h-7 w-auto" />
    </Link>
  );
}
