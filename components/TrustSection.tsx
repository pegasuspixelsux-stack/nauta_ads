"use client";

import Link from "next/link";
import { Anchor, LineChart, Scale, Users, type LucideIcon } from "lucide-react";
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

        <div className="mt-8 grid overflow-hidden rounded-3xl border border-slate-800/80 bg-surface md:min-h-[440px] md:grid-cols-2">
          {/* La foto llena toda la altura del panel pero no la define: la altura la da el texto. */}
          <div className="relative h-40 md:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt="Armador náutico en cubierta"
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-6 p-6 md:p-10">
            <div className="flex flex-col items-start gap-4">
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
                <li key={title} className="group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:border-accent hover:bg-ink/5 hover:shadow-[0_0_0_1px_var(--color-accent),0_0_36px_0_color-mix(in_oklab,var(--color-accent)_55%,transparent)]">
                  <Icon className="size-6 text-accent transition-colors duration-300 group-hover:text-accent-strong" strokeWidth={1.5} />
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-100">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
