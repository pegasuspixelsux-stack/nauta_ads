"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

/**
 * `overHero`: la barra flota sobre la foto del hero. Arriba del todo es transparente con texto
 * blanco; al hacer scroll (o abrir el menú) toma fondo con desenfoque y texto oscuro.
 */
export function Navbar({ overHero = false }: { overHero?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const transparent = overHero && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Enlaces de la barra: blancos sobre la foto, oscuros sobre el fondo con desenfoque.
  const barLink = cn(
    "rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200",
    transparent ? "text-white hover:bg-white/15" : "text-slate-100 hover:bg-ink/5",
  );
  const barIcon = cn(
    "rounded-xl p-2.5 transition-[background-color,color,transform] duration-200 active:scale-[0.95]",
    transparent ? "text-white hover:bg-white/15" : "text-slate-100 hover:bg-ink/5",
  );

  // Escape cierra el menú.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const focusSearch = () => {
    setOpen(false);
    const input = document.getElementById("search-input");
    // offsetParent es null si el campo existe pero está oculto (panel plegado en celular).
    if (input && input.offsetParent !== null) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      input.focus({ preventScroll: true });
    } else if (pathname === "/embarcaciones") {
      window.dispatchEvent(new Event("nauta:open-search"));
    } else {
      router.push("/embarcaciones");
    }
  };

  return (
    <header
      className={cn(
        overHero ? "fixed inset-x-0" : "sticky",
        "top-0 z-40 border-b transition-[background-color,border-color] duration-300",
        transparent
          ? "border-transparent bg-transparent"
          : open
            ? "border-slate-800/80 bg-slate-950"
            : "border-slate-800/80 bg-slate-950/70 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className={cn(
            "text-lg font-bold tracking-tight transition-colors duration-200",
            transparent ? "text-white" : "text-slate-100",
          )}
        >
          Nauta
        </Link>

        <nav aria-label="Secciones" className="hidden items-center gap-1 lg:flex">
          <Link href="/" className={barLink}>
            Inicio
          </Link>
          <div className="group relative">
            <Link href="/embarcaciones" className={cn(barLink, "inline-flex items-center gap-1")}>
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
            <Link key={section.href} href={section.href} className={barLink}>
              {section.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={focusSearch}
            aria-label="Buscar embarcaciones"
            className={barIcon}
          >
            <Search className="size-5" />
          </button>
          <Link href="/publicar" className={cn(
              buttonStyles("secondary", "sm"),
              "hidden lg:inline-flex",
              transparent && "border-white/40 bg-white/15 text-white hover:bg-white/25",
            )}
          >
            Publicar
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="menu-principal"
            className={cn(barIcon, "lg:hidden")}
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
