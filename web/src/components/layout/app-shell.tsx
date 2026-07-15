"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChartBar,
  ClockCounterClockwise,
  Leaf,
  Lightning,
  List,
  SignOut,
  X,
} from "@phosphor-icons/react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/generator", label: "Générateur", icon: Lightning },
  { href: "/history", label: "Historique", icon: ClockCounterClockwise },
  { href: "/dashboard", label: "Dashboard", icon: ChartBar },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={cn(
          "fixed left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[94%] md:max-w-5xl z-50 transition-all duration-300 glass-card rounded-[18px]",
          scrolled ? "top-2" : "top-4",
        )}
      >
        <div className="flex items-center justify-between h-[60px] px-5 md:px-8">
          <Link href="/generator" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf weight="fill" className="w-5 h-5 text-[var(--bg-primary)]" />
            </div>
            <span className="hidden sm:block text-base font-bold font-[family-name:var(--font-display)]">
              PromptOptim
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all min-h-11",
                    active
                      ? "bg-[var(--gradient-primary)] text-[var(--bg-primary)] shadow-[var(--neon-glow-sm)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5",
                  )}
                >
                  <Icon className="w-4 h-4" weight={active ? "fill" : "regular"} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-[var(--glass-border)]">
              <div className="w-7 h-7 rounded-lg bg-[var(--primary-dim)] flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                {initial}
              </div>
              <span className="text-xs text-[var(--text-secondary)] max-w-[140px] truncate">
                {user?.email}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={handleLogout} aria-label="Déconnexion">
              <SignOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--glass-border)] p-4 flex flex-col gap-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 min-h-11",
                  pathname === href ? "bg-[var(--primary-dim)] text-[var(--primary)]" : "text-[var(--text-secondary)]",
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-4 py-3 min-h-11 text-[var(--text-secondary)]"
            >
              <SignOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 pt-28 pb-12 px-4 md:px-6 max-w-6xl mx-auto w-full">{children}</main>

      <footer className="border-t border-[var(--glass-border)] py-6 px-4 text-center text-xs text-[var(--text-muted)]">
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <Link href="/mentions-legales" className="hover:text-[var(--primary)]">Mentions légales</Link>
          <Link href="/confidentialite" className="hover:text-[var(--primary)]">Confidentialité</Link>
          <Link href="/contact" className="hover:text-[var(--primary)]">Contact</Link>
        </div>
        <p>PromptOptim — Green IT & Souveraineté numérique</p>
      </footer>
    </div>
  );
}

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center p-12 border-r border-[var(--glass-border)]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center">
            <Leaf weight="fill" className="w-7 h-7 text-[var(--bg-primary)]" />
          </div>
          <span className="text-2xl font-bold font-[family-name:var(--font-display)]">PromptOptim</span>
        </div>
        <h1 className="text-4xl font-bold leading-tight mb-4 font-[family-name:var(--font-display)]">{title}</h1>
        <p className="text-[var(--text-secondary)] max-w-md">{subtitle}</p>
      </div>
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
