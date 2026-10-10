"use client";

import Link from "next/link";
import { Anchor, LineChart, Scale, Users, type LucideIcon } from "lucide-react";
import { GlowCard } from "@/components/GlowCard";
import { buttonStyles } from "@/components/ui/button";

const items: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Scale,
    title: "Estatus Legal y Notarial",
    text: "Escribanía especializada en embarcaciones para títulos de propiedad limpios de gravámenes.",
  },
  {
    icon: Anchor,
    title: "Respaldo de Prefectura",
    text: "Inspección de elementos de seguridad (SOLAS) y tramitación de libro de rol de navegación al día.",
  },
  {
    icon: LineChart,
    title: "Valuaciones Reales de Mercado",
    text: "Precios tasados con analítica comparativa de ventas efectivas en el Atlántico Sur.",
  },
  {
    icon: Users,
    title: "Red Privada para Armadores",
    text: "Comunidad selecta de propietarios, capitanes profesionales y brokers de alta gama.",
  },
];

const photo =
  "https://images.unsplash.com/photo-1498623116890-37e912163d5d?auto=format&fit=crop&w=1200&q=80";

export function TrustSection() {
  return (
    <section aria-labelledby="trust-title" className="border-t border-slate-800/80">
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">
            Seguridad y Tradición Marítima
          </p>
          <h2
            id="trust-title"
            className="mt-3 text-3xl font-bold tracking-tight text-slate-100 md:text-4xl"
          >
            ¿Por qué confiar su embarcación en NAUTA?
          </h2>
          <p className="mt-4 text-slate-400">
            Eliminamos la fricción burocrática y garantizamos la seguridad jurídica en cada
            operación marítima en Uruguay y con compradores extranjeros.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:min-h-[440px] md:grid-cols-2">
          {/* Dos cajas lado a lado: la foto llena la suya, pero la altura la da la caja del texto. */}
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-800/80 bg-surface md:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt="Armador náutico en cubierta"
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-6 md:py-4">
            <div className="flex flex-col items-start gap-4 text-left">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium tracking-wide text-accent uppercase">
                  Para Armadores &amp; Brokers
                </p>
                <h3 className="text-xl font-bold tracking-tight text-slate-100 md:text-2xl">
                  ¿Desea comercializar su barco con máxima confidencialidad?
                </h3>
                <p className="text-sm text-slate-400">
                  Publicamos en vitrinas exclusivas en Uruguay, Argentina, Brasil y Miami. Reportes
                  de visitas y gestión pericial personalizada.
                </p>
              </div>
              <Link href="/publicar" className={buttonStyles("primary", "md")}>
                Publicar mi Embarcación
              </Link>
            </div>
            <ul className="grid w-full gap-3 sm:grid-cols-2">
              {items.map(({ icon: Icon, title, text }) => (
                <GlowCard
                  key={title}
                  className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 hover:bg-ink/5"
                >
                  <Icon className="size-6 text-accent transition-colors duration-300 group-hover:text-accent-strong" strokeWidth={1.5} />
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-100">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
                </GlowCard>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
