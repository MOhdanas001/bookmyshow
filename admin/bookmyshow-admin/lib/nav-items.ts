import {
  LayoutDashboard,
  Clapperboard,
  Building2,
  CalendarClock,
  Ticket,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Movies", href: "/movies", icon: Clapperboard },
  { label: "Theatres", href: "/theatres", icon: Building2 },
  { label: "Shows", href: "/shows", icon: CalendarClock },
  { label: "Bookings", href: "/bookings", icon: Ticket },
  { label: "Users", href: "/users", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];
