import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  Briefcase,
  FileText,
  LayoutDashboard,
  Settings,
  TrendingUp,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/holdings", label: "Holdings", icon: Briefcase },
  { path: "/recommendations", label: "Recommendations", icon: TrendingUp },
  { path: "/risk", label: "Risk Metrics", icon: BarChart2 },
  { path: "/tax", label: "Tax Analysis", icon: FileText },
  { path: "/settings", label: "Settings", icon: Settings },
] as const;

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border w-60 shrink-0",
        className,
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-sidebar-border">
        <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <TrendingUp className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-lg text-sidebar-foreground tracking-tight">
          360° Portfolio Manager
        </span>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-4 space-y-0.5"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive =
            path === "/" ? currentPath === "/" : currentPath.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-smooth",
                isActive
                  ? "bg-sidebar-primary/15 text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
