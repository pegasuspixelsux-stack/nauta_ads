"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Ship,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRoundCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const navigation: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Panel de control", href: "/dashboard", icon: LayoutDashboard },
  { label: "Embarcaciones", href: "/dashboard/boats", icon: Ship },
  { label: "Consultas", href: "/dashboard/leads", icon: Users },
  { label: "Usuarios", href: "/dashboard/users", icon: UserRoundCog },
  { label: "Configuración", href: "/dashboard/config", icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
        Verificando tu sesión…
      </div>
    );
  }

  if (profile?.role === "pending") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Esperando aprobación</h1>
        <p className="max-w-sm text-slate-400">
          Tu cuenta fue creada. Un administrador debe aprobarla antes de que puedas usar el panel.
        </p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="text-sm font-medium text-slate-100 underline-offset-4 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-slate-800/80 bg-slate-950 md:sticky md:top-0 md:h-dvh md:w-64 md:border-r md:border-b-0">
        <div className="flex h-16 items-center px-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Nauta
          </Link>
        </div>

        <nav
          aria-label="Panel"
          className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:pb-0"
        >
          {navigation.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98]",
                isActive(href)
                  ? "bg-ink/5 text-slate-100"
                  : "text-slate-400 hover:bg-ink/5 hover:text-slate-100",
              )}
            >
              {isActive(href) && (
                <motion.span
                  layoutId="sidebar-indicator"
                  className="absolute top-2 bottom-2 left-0 hidden w-0.5 rounded-full bg-slate-100 md:block"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                />
              )}
              <Icon className="size-[18px]" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden border-t border-slate-800/80 p-4 md:block">
          <p className="truncate text-sm font-medium text-slate-100">
            {profile?.displayName || user.displayName || user.email}
          </p>
          <p className="truncate text-xs text-slate-500 capitalize">{profile?.role ?? "operator"}</p>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-3 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-100"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-6 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
