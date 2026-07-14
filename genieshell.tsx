import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/ask", label: "Ask" },
  { to: "/quiz", label: "Quiz" },
  { to: "/summarize", label: "Summarize" },
  { to: "/roadmap", label: "Roadmap" },
] as const;

export function GenieHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-genie shadow-warm">
            <Sparkles className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display text-xl">
            Edu<span className="text-gradient-genie">Genie</span>
          </span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function GenieShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <GenieHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      <footer className="mx-auto max-w-6xl px-6 pb-10 pt-4 text-center text-xs text-muted-foreground">
        EduGenie · learning, reimagined with AI
      </footer>
    </div>
  );
}

export function ShellOutlet() {
  return (
    <GenieShell>
      <Outlet />
    </GenieShell>
  );
}
