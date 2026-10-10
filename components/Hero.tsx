"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const HERO_PHOTO =
  "https://images.unsplash.com/photo-1674606867042-2aa3581c1bb5?auto=format&fit=crop&w=2000&q=80";


const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <>
      <section className="relative z-10 border-b border-slate-800/80 flex min-h-[80dvh] items-center">
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
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent"
          />
          {/* Oscurece el lado del texto: el casco del yate es blanco, igual que el título. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_oklab,var(--color-slate-700)_55%,transparent),transparent),linear-gradient(to_bottom,transparent_60%,var(--color-slate-950))]"
          />
        </div>
        <div className="relative mx-auto w-full max-w-[1440px] px-6 pt-28 pb-20 text-left md:pt-32 md:pb-24">
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
        </div>
      </section>
    </>
  );
}
