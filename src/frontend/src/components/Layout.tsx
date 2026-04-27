import { Button } from "@/components/ui/button";
import { Outlet } from "@tanstack/react-router";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 bg-card border-b border-border shadow-sm shrink-0">
          <h1 className="font-display font-semibold text-base text-foreground">
            360° Portfolio Manager
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle dark mode"
              data-ocid="header.theme_toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="User menu"
              data-ocid="header.user_icon"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-background px-6 py-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="shrink-0 border-t border-border bg-muted/40 px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} 360° Portfolio Manager. Built with love
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </span>
          <span className="font-medium">Built by Aviral Prasad</span>
        </footer>
      </div>
    </div>
  );
}
