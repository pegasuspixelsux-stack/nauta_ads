"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, CalendarDays, Star, Cog, Ship, Wrench, type LucideIcon } from "lucide-react";

const HERO_PHOTO =
  "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?auto=format&fit=crop&w=2000&q=80";

const SECTIONS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Embarcaciones", href: "/embarcaciones", icon: Ship },
  { label: "Motores y Repuestos", href: "/motores", icon: Cog },
  { label: "Servicios y Brokers", href: "/servicios", icon: Wrench },
  { label: "Guía y Trámites", href: "/guia", icon: BookOpen },
  { label: "Eventos", href: "/eventos", icon: CalendarDays },
];

const ease = [0.16, 1, 0.3, 1] as const;

/** Accesos a las secciones del sitio: solo íconos en celular, con nombre desde 640 px. */
function SectionBoxes() {
  return (
    <motion.nav
      aria-label="Secciones principales"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease }}
      className="mx-auto max-w-[1400px] lg:hidden"
    >
      <ul className="grid grid-cols-5 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        {SECTIONS.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl group border border-blue-900 bg-blue-900 px-2 py-4 text-center text-base font-semibold text-white transition-[background-color,border-color,color,transform] duration-300 ease-out-expo hover:-translate-y-1 hover:bg-white hover:text-blue-900 active:scale-[0.98] sm:px-4 sm:py-6"
            >
              <Icon className="size-7 text-white transition-colors duration-300 group-hover:text-blue-900" strokeWidth={1.5} />
              {/* Solo íconos en celular; el nombre queda para lectores de pantalla. */}
              <span className="sr-only sm:not-sr-only">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}

export function Hero() {
  return (
    <>
      <section className="relative z-10 border-b border-slate-800/80 flex min-h-[90dvh] items-center">
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_PHOTO}
            alt=""
            aria-hidden
            fetchPriority="high"
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
          {/* Velo del color de la página (oscuro o claro según el tema) para mantener legible el texto. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-slate-950/5"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_oklab,var(--color-slate-700)_55%,transparent),transparent),linear-gradient(to_bottom,transparent_60%,var(--color-slate-950))]"
          />
        </div>
        <div className="relative mx-auto w-full max-w-[1440px] px-6 pt-12 pb-12 text-left sm:pb-24 md:pt-16 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="mb-6 inline-flex items-center rounded-full border border-white/30 bg-white/15 gap-2 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-xl">
              <Star className="size-4 fill-current" aria-hidden />
              Explora • Navega • Descubre Uruguay<span className="hidden sm:inline">&nbsp;&amp; El Mundo</span>
            </span>
            <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-white drop-shadow-md md:text-7xl">
              El Marketplace Náutico<br className="hidden md:block" /> de Referencia en el<br className="hidden md:block" /> <span className="text-sky-400">Río de la Plata</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white drop-shadow-md md:text-xl">
              Compra, venta y chárter de yates, veleros y catamaranes verificados con rigurosa
              inspección pericial naval y tramitación oficial ante Prefectura Nacional Naval (ROU).
            </p>
            <Link href="/embarcaciones" className={cn(buttonStyles("primary", "lg"), "mt-8 hidden sm:inline-flex")}>
              Explorar Embarcaciones
            </Link>
          </motion.div>

          {/* Celular: los íconos van justo debajo del texto, sin colgar del borde. */}
          <div className="mt-8 sm:hidden">
            <SectionBoxes />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-1/2 px-6 sm:block">
          <SectionBoxes />
        </div>
      </section>
      {/* Reserva el espacio de la mitad de la caja de secciones que sobresale del hero. */}
      <div aria-hidden className="hidden sm:block sm:h-28 lg:hidden" />
    </>
  );
}
