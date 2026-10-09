"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const boatLinks = [
  { label: "Yates", href: "/embarcaciones?category=Yate" },
  { label: "Veleros", href: "/embarcaciones?category=Velero" },
  { label: "Lanchas", href: "/embarcaciones?category=Lancha" },
  { label: "Ver todas", href: "/embarcaciones" },
];

const sections = [
  { label: "Motores y Repuestos", href: "/motores" },
  { label: "Servicios y Brokers", href: "/servicios" },
  { label: "Guía y Trámites", href: "/guia" },
  { label: "Eventos", href: "/eventos" },
];

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-400 transition-colors duration-200 hover:bg-ink/5 hover:text-slate-100";

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Escape cierra el menú.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const focusSearch = () => {
    const input = document.getElementById("search-input");
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus({ preventScroll: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-100">
          Nauta
        </Link>

        <nav aria-label="Secciones" className="hidden items-center gap-1 lg:flex">
          <Link href="/" className={linkClass}>
            Inicio
          </Link>
          <div className="group relative">
            <Link href="/embarcaciones" className={cn(linkClass, "inline-flex items-center gap-1")}>
              Embarcaciones
              <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
            </Link>
            <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="min-w-44 rounded-xl border border-slate-800/80 bg-slate-950 p-1.5 shadow-xl">
                {boatLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={cn(linkClass, "block")}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className={linkClass}>
              {section.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={focusSearch}
            aria-label="Buscar embarcaciones"
            className={cn(
              "rounded-xl p-2.5 text-slate-400 transition-[background-color,color,transform] duration-200",
              "hover:bg-ink/5 hover:text-slate-100 active:scale-[0.95]",
            )}
          >
            <Search className="size-5" />
          </button>
          <Link href="/publicar" className={cn(buttonStyles("secondary", "sm"), "hidden lg:inline-flex")}>
            Publicar
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="menu-principal"
            className={cn(
              "rounded-xl p-2.5 text-slate-400 transition-[background-color,color,transform] duration-200 lg:hidden",
              "hover:bg-ink/5 hover:text-slate-100 active:scale-[0.95]",
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-principal"
          aria-label="Menú"
          className="border-t border-slate-800/80 bg-slate-950 lg:hidden"
        >
          <ul className="mx-auto grid max-w-[1440px] gap-1 px-6 py-4 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <Link href="/" onClick={() => setOpen(false)} className={cn(linkClass, "block")}>
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/embarcaciones"
                onClick={() => setOpen(false)}
                className={cn(linkClass, "block")}
              >
                Embarcaciones
              </Link>
            </li>
            {sections.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  onClick={() => setOpen(false)}
                  className={cn(linkClass, "block")}
                >
                  {section.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/publicar"
                onClick={() => setOpen(false)}
                className={cn(linkClass, "block")}
              >
                Publicar
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
