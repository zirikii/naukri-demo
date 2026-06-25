import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Bookmark,
  Briefcase,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  Star,
  User,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Primary authenticated navigation ("My Naukri"). */
export const APP_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Recommendations", href: "/recommendations", icon: Star },
  { label: "Applied", href: "/applied", icon: FileText },
  { label: "Saved", href: "/saved", icon: Bookmark },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Naukri 360", href: "/naukri-360", icon: Sparkles },
];

/** Items shown in the profile dropdown menu. */
export const PROFILE_MENU: NavItem[] = [
  { label: "View & Edit Profile", href: "/profile", icon: User },
  { label: "My Naukri", href: "/dashboard", icon: LayoutDashboard },
  { label: "Job Alerts", href: "/settings?tab=alerts", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

/** Public marketing navigation. */
export const MARKETING_NAV: { label: string; href: string }[] = [
  { label: "Jobs", href: "/jobs" },
  { label: "Companies", href: "/jobs?tab=companies" },
  { label: "Naukri 360", href: "/naukri-360" },
  { label: "For employers", href: "/employers" },
];
