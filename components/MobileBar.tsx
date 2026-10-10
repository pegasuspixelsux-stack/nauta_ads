"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, Cog, Ship, Wrench, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const items: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Embarcaciones", href: "/embarcaciones", icon: Ship },
  { label: "Motores y Repuestos", href: "/motores", icon: Cog },
  { label: "Servicios y Brokers", href: "/servicios", icon: Wrench },
  { label: "Guía y Trámites", href: "/guia", icon: BookOpen },
  { label: "Eventos", href: "/eventos", icon: CalendarDays },
];

/** Barra de accesos fija al borde inferior, solo en celular y solo en el sitio público. */
export function MobileBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/login")) return null;

  return (
    <>
      {/* Reserva el alto de la barra para que no tape el final de la página. */}
      <div aria-hidden className="h-16 sm:hidden" />
      <nav
        aria-label="Accesos rápidos"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-accent pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.4)] sm:hidden"
      >
        <ul className="grid grid-cols-5">
          {items.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className="group flex h-16 items-center justify-center"
                >
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-2xl transition-[background-color,transform] duration-200 group-active:scale-90",
                      active ? "bg-white/25" : "group-hover:bg-white/15",
                    )}
                  >
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
