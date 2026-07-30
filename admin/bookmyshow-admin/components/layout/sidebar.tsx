"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Clapperboard className="h-4 w-4" />
            </span>
            <span>BookMyShow</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <SidebarLink key={item.href} href={item.href} label={item.label} Icon={item.icon} onNavigate={onClose} />
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4 text-xs text-muted-foreground">
          <p>BookMyShow Admin</p>
          <p>v1.0.0 &middot; Frontend</p>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  href,
  label,
  Icon,
  onNavigate,
}: {
  href: string;
  label: string;
  Icon: React.ElementType;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground/80 hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}
