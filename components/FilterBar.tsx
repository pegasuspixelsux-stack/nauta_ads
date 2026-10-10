"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal, Search } from "lucide-react";
import { Input, Select } from "@/components/ui/field";
import { CATEGORIES, LENGTH_RANGES, PORTS, PROPULSIONS, type Filters } from "@/lib/boats";
import { cn } from "@/lib/utils";

const CHIPS = [
  { value: "Yate", label: "Yates" },
  { value: "Velero", label: "Veleros" },
  { value: "Lancha", label: "Lanchas" },
  { value: "Semirrígido", label: "Semirrígidos" },
  { value: "Moto de agua", label: "Motos de agua" },
];

const priceSteps = [50000, 100000, 250000, 500000, 1000000];

const selectClass = "h-11 border-transparent bg-ink/5";

/** Buscador, filtros y chips de categoría de la sección «Embarcaciones destacadas». */
export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const [open, setOpen] = useState(false);
  const activeCount = [
    filters.category,
    filters.length,
    filters.propulsion,
    filters.port,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="mb-10">

      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          document.getElementById("listado")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="grid gap-3 rounded-3xl border border-ink/10 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-xl"
      >
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-500" />
            <Input
              id="search-input"
              type="search"
              value={filters.query}
              onChange={(event) => set({ query: event.target.value })}
              placeholder="Buscá por astillero o modelo: Sea Ray, Beneteau, Riva…"
              aria-label="Buscar astillero o modelo"
              className="h-14 border-transparent bg-ink/5 pl-12 text-base"
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="filtros-avanzados"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-slate-800/80 bg-ink/5 px-6 text-base font-medium text-slate-100 transition-[background-color,transform] duration-200 hover:bg-ink/10 active:scale-[0.98]"
          >
            <SlidersHorizontal className="size-4" />
            Filtros
            {activeCount > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                {activeCount}
              </span>
            )}
            <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
          </button>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="h-14 rounded-xl bg-accent px-8 text-base font-semibold text-white transition-colors hover:bg-accent-strong"
          >
            Buscar
          </motion.button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="filtros-avanzados"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Select
                  value={filters.category}
                  onChange={(event) => set({ category: event.target.value })}
                  aria-label="Tipo de embarcación"
                  className={selectClass}
                >
                  <option value="">Todos los tipos</option>
                  {CATEGORIES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
                <Select
                  value={filters.length}
                  onChange={(event) => set({ length: event.target.value })}
                  aria-label="Eslora"
                  className={selectClass}
                >
                  <option value="">Cualquier eslora</option>
                  {LENGTH_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </Select>
                <Select
                  value={filters.propulsion}
                  onChange={(event) => set({ propulsion: event.target.value })}
                  aria-label="Propulsión"
                  className={selectClass}
                >
                  <option value="">Toda propulsión</option>
                  {PROPULSIONS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
                <Select
                  value={filters.port}
                  onChange={(event) => set({ port: event.target.value })}
                  aria-label="Puerto de amarre"
                  className={selectClass}
                >
                  <option value="">Cualquier puerto</option>
                  {PORTS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
                <Select
                  value={filters.maxPrice}
                  onChange={(event) => set({ maxPrice: event.target.value })}
                  aria-label="Precio máximo"
                  className={selectClass}
                >
                  <option value="">Cualquier precio</option>
                  {priceSteps.map((step) => (
                    <option key={step} value={step}>
                      Hasta US$ {step.toLocaleString("es-UY")}
                    </option>
                  ))}
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <ul aria-label="Categorías" className="mt-4 flex flex-wrap gap-2">
        {CHIPS.map(({ value: category, label }) => {
          const active = filters.category === category;
          return (
            <li key={category}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => set({ category: active ? "" : category })}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.97]",
                  "text-white",
                  active
                    ? "border-white bg-accent-strong ring-2 ring-accent/50"
                    : "border-accent bg-accent hover:bg-accent-strong",
                )}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
