"use client";

import { BoatCard } from "@/components/BoatCard";
import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { buttonStyles } from "@/components/ui/button";
import type { Filters } from "@/lib/boats";
import type { Boat } from "@/lib/types";

export function ListingGrid({
  boats,
  loading,
  currency,
  filters,
  onFiltersChange,
  onInquire,
}: {
  boats: Boat[];
  loading: boolean;
  currency: string;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onInquire: (boat: Boat) => void;
}) {
  return (
    <section id="embarcaciones" className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-6 pb-12 md:pb-16">
      {/* El buscador cruza el borde del hero: la mitad queda sobre la foto, la otra mitad en esta sección. */}
      <div className="relative z-20 -mt-10">
        <FilterBar filters={filters} onChange={onFiltersChange} />
      </div>

      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 md:text-3xl">
            Embarcaciones destacadas
          </h2>
          <p className="mt-2 text-slate-400">Avisos revisados por Nauta antes de publicarse.</p>
        </div>
        {!loading && (
          <p className="hidden text-sm text-slate-500 sm:block">
            {boats.length} {boats.length === 1 ? "embarcación" : "embarcaciones"}
          </p>
        )}
      </div>

      <div id="listado" className="scroll-mt-24" />
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-2xl border border-slate-800/80 bg-surface"
            />
          ))}
        </div>
      ) : boats.length === 0 ? (
        <p className="rounded-2xl border border-slate-800/80 bg-surface px-6 py-16 text-center text-slate-500">
          Ninguna embarcación coincide con tu búsqueda. Probá ajustando los filtros.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {boats.map((boat) => (
            <BoatCard key={boat.id} boat={boat} currency={currency} onInquire={onInquire} />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link href="/embarcaciones" className={buttonStyles("primary", "lg")}>
          Ver todas las embarcaciones
        </Link>
      </div>
    </section>
  );
}
