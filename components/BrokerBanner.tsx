"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

/** Banner publicitario para brokers: 25 % del alto de la ventana. Colores fijos, iguales en ambos temas. */
export function BrokerBanner() {
  return (
    <section
      aria-label="Publicidad para brokers"
      className="flex min-h-[25dvh] items-center bg-blue-950 text-white"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div>
          <span className="inline-block rounded-full border border-blue-400/20 bg-blue-600/30 px-3 py-1 text-xs font-semibold tracking-wider text-blue-300 uppercase">
            Para Brokers
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            Publicá toda tu flota en Nauta
          </h2>
          <p className="mt-2 max-w-2xl text-blue-100/80">
            Paquetes para brokers con vitrina en Uruguay, Argentina, Brasil y Miami, reportes de
            visitas y gestión pericial personalizada.
          </p>
        </div>
        <Link
          href="/publicar"
          className={`${buttonStyles("primary", "lg")} shrink-0 !bg-white !text-blue-950 hover:!bg-blue-50`}
        >
          Consultar paquetes
        </Link>
      </div>
    </section>
  );
}
