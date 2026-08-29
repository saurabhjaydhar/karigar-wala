import {
  LayoutDashboard,
  HardHat,
  CalendarCheck,
  FileSignature,
  LayoutGrid,
  FileText,
  Ticket,
  Users,
  Star,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: AdminNavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/karigars", label: "Karigar Verification", icon: HardHat },
  { href: "/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/contracts", label: "Contracts", icon: FileSignature },
  { href: "/catalog", label: "Services & Categories", icon: LayoutGrid },
  { href: "/content", label: "Page Content", icon: FileText },
  { href: "/coupons", label: "Coupons", icon: Ticket },
  { href: "/users", label: "Users", icon: Users },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/audit-log", label: "Audit Log", icon: ScrollText },
];
