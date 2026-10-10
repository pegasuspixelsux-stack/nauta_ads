"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { BoatCard } from "@/components/BoatCard";
import { FinancingCalculator } from "@/components/FinancingCalculator";
import { InquiryModal } from "@/components/InquiryModal";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import {
  CATEGORIES,
  CONDITIONS,
  DOCUMENTATION,
  EMPTY_FILTERS,
  filterBoats,
  FLAGS,
  LENGTH_RANGES,
  PORTS,
  PROPULSIONS,
  PUBLIC_STATUSES,
  type Filters,
} from "@/lib/boats";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useCollection, useSettings } from "@/lib/firestore";
import { SAMPLE_BOATS } from "@/lib/sample-boats";
import type { Boat } from "@/lib/types";
import { cn } from "@/lib/utils";

/** 3 columnas × 4 filas por página. */
const PAGE_SIZE = 12;

const priceSteps = [50000, 100000, 250000, 500000, 1000000];

export function BoatsExplorer({ initialCategory = "" }: { initialCategory?: string }) {
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS, category: initialCategory });
  const [page, setPage] = useState(1);
  const [panelOpen, setPanelOpen] = useState(false);
  const [inquiry, setInquiry] = useState<Boat | null>(null);
  const { data, loading } = useCollection<Boat>("boats", {
    whereIn: { field: "status", values: PUBLIC_STATUSES },
  });
  const { currency } = useSettings();

  // El buscador de la barra superior pide abrir el panel plegado (celular) y enfocar el campo.
  useEffect(() => {
    const onOpenSearch = () => {
      setPanelOpen(true);
      requestAnimationFrame(() => {
        const input = document.getElementById("search-input");
        input?.scrollIntoView({ behavior: "smooth", block: "center" });
        input?.focus({ preventScroll: true });
      });
    };
    window.addEventListener("nauta:open-search", onOpenSearch);
    return () => window.removeEventListener("nauta:open-search", onOpenSearch);
  }, []);

  const boats = useMemo(
    () => filterBoats(isFirebaseConfigured ? data : SAMPLE_BOATS, filters),
    [data, filters],
  );

  const pages = Math.max(1, Math.ceil(boats.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = boats.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // Cambiar un filtro vuelve a la primera página.
  const set = (patch: Partial<Filters>) => {
    setFilters((value) => ({ ...value, ...patch }));
    setPage(1);
  };
  const activeCount = Object.values(filters).filter(Boolean).length;

  const options = (values: readonly string[], label: string) => (
    <>
      <option value="">{label}</option>
      {values.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-4">
      <aside className="lg:col-span-1">
        <div>
          <button
            type="button"
            onClick={() => setPanelOpen((value) => !value)}
            aria-expanded={panelOpen}
            aria-controls="busqueda-avanzada"
            className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-800/80 bg-surface px-4 text-sm font-medium text-slate-100 lg:hidden"
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="size-4" />
              Búsqueda avanzada
              {activeCount > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                  {activeCount}
                </span>
              )}
            </span>
            <ChevronDown className={cn("size-4 transition-transform", panelOpen && "rotate-180")} />
          </button>

          <form
            id="busqueda-avanzada"
            role="search"
            onSubmit={(event) => event.preventDefault()}
            className={cn(
              "mt-3 grid gap-5 rounded-2xl border border-slate-800/80 bg-surface p-5 lg:mt-0 lg:block lg:space-y-5",
              panelOpen ? "grid" : "hidden lg:block",
            )}
          >
            <h2 className="hidden text-base font-semibold tracking-tight text-slate-100 lg:block">
              Búsqueda avanzada
            </h2>
            <Field label="Astillero o modelo">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="search-input"
                  type="search"
                  value={filters.query}
                  onChange={(event) => set({ query: event.target.value })}
                  placeholder="Sea Ray, Beneteau…"
                  className="pl-10"
                />
              </div>
            </Field>
            <Field label="Tipo">
              <Select value={filters.category} onChange={(event) => set({ category: event.target.value })}>
                {options(CATEGORIES, "Todos")}
              </Select>
            </Field>
            <Field label="Condición">
              <Select value={filters.condition} onChange={(event) => set({ condition: event.target.value })}>
                {options(CONDITIONS, "Nuevas y usadas")}
              </Select>
            </Field>
            <Field label="Eslora">
              <Select value={filters.length} onChange={(event) => set({ length: event.target.value })}>
                <option value="">Cualquiera</option>
                {LENGTH_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Propulsión">
              <Select value={filters.propulsion} onChange={(event) => set({ propulsion: event.target.value })}>
                {options(PROPULSIONS, "Toda")}
              </Select>
            </Field>
            <Field label="Puerto de amarre">
              <Select value={filters.port} onChange={(event) => set({ port: event.target.value })}>
                {options(PORTS, "Cualquiera")}
              </Select>
            </Field>
            <Field label="Bandera">
              <Select value={filters.flagType} onChange={(event) => set({ flagType: event.target.value })}>
                {options(FLAGS, "Cualquiera")}
              </Select>
            </Field>
            <Field label="Documentación">
              <Select
                value={filters.documentation}
                onChange={(event) => set({ documentation: event.target.value })}
              >
                {options(DOCUMENTATION, "Cualquiera")}
              </Select>
            </Field>
            <Field label="Precio máximo">
              <Select value={filters.maxPrice} onChange={(event) => set({ maxPrice: event.target.value })}>
                <option value="">Cualquiera</option>
                {priceSteps.map((step) => (
                  <option key={step} value={step}>
                    Hasta US$ {step.toLocaleString("es-UY")}
                  </option>
                ))}
              </Select>
            </Field>
            <Button
              variant="secondary"
              className="w-full"
              disabled={activeCount === 0}
              onClick={() => {
                setFilters(EMPTY_FILTERS);
                setPage(1);
              }}
            >
              Limpiar filtros
            </Button>
          </form>

          <FinancingCalculator currency={currency} className="mt-6 hidden lg:block" />
        </div>
      </aside>

      <section aria-label="Resultados" className="min-w-0 lg:col-span-3">
        {!loading && (
          <p aria-live="polite" className="mb-4 text-sm text-slate-500">
            {boats.length} {boats.length === 1 ? "embarcación" : "embarcaciones"}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
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
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {visible.map((boat) => (
              <BoatCard key={boat.id} boat={boat} currency={currency} onInquire={setInquiry} portrait />
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav aria-label="Páginas" className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
            >
              Anterior
            </Button>
            <span className="px-3 text-sm text-slate-400">
              Página {current} de {pages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={current === pages}
              onClick={() => setPage(current + 1)}
            >
              Siguiente
            </Button>
          </nav>
        )}

        {/* En celular la calculadora va debajo de los resultados; en escritorio, en la barra lateral. */}
        <FinancingCalculator currency={currency} className="mt-10 lg:hidden" />
      </section>

      <InquiryModal boat={inquiry} onClose={() => setInquiry(null)} />
    </div>
  );
}
