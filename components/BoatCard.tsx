"use client";

import { motion } from "framer-motion";
import { Anchor, MapPin, MessageCircle, Ruler, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { boatLabel } from "@/lib/boats";
import { cn, formatCurrency } from "@/lib/utils";
import type { Boat } from "@/lib/types";

export function BoatCard({
  boat,
  currency,
  onInquire,
  portrait = false,
}: {
  boat: Boat;
  currency: string;
  onInquire: (boat: Boat) => void;
  /** Tarjeta 3:4 en todos los anchos (por defecto es 3:4 en celular y 1:2 desde 640 px). */
  portrait?: boolean;
}) {
  const specs = [
    { icon: Ruler, label: `${boat.length.toLocaleString("es-UY")} m` },
    { icon: Anchor, label: boat.propulsion },
  ].filter((spec) => spec.label);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={cn(
        "group flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-surface transition-colors duration-300 hover:border-accent",
        !portrait && "sm:aspect-[1/2]",
      )}
    >
      <div
        className={cn(
          "relative min-h-0 flex-1 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900",
          !portrait && "sm:aspect-square sm:flex-none sm:shrink-0",
        )}
      >
        {boat.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={boat.images[0]}
            alt={boatLabel(boat)}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-slate-700">
            <Ship className="size-14" strokeWidth={1.25} />
          </div>
        )}
        {boat.portLocation && (
          <Badge className="absolute top-2 left-2 max-w-[calc(100%-1rem)] gap-1 border-white/30 bg-black/50 text-white backdrop-blur-xl sm:top-3 sm:left-3">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span className="truncate">{boat.portLocation}</span>
          </Badge>
        )}
        <div className="absolute right-2 bottom-2 flex gap-2 sm:top-3 sm:right-3 sm:bottom-auto">
          {boat.featured && <Badge className="bg-slate-950/60 backdrop-blur-xl">Destacada</Badge>}
          {boat.status === "reserved" && <Badge tone="amber">Reservada</Badge>}
        </div>
      </div>

      <div
        className={cn(
          "flex shrink-0 flex-col px-5 pt-5 pb-6",
          !portrait && "sm:flex-1",
          // Versión compacta para la grilla de 2 columnas en celular.
          "px-3 pt-3 pb-3 sm:px-5 sm:pt-5 sm:pb-6",
        )}
      >
        <p className="hidden text-sm font-medium text-slate-500 sm:block">
          {boat.year} · {boat.category} · {boat.condition}
        </p>
        <h3
          className={cn(
            "mt-1 truncate text-sm font-bold tracking-tight text-slate-100 sm:text-xl",
          )}
        >
          {boat.builder} {boat.model}
        </h3>

        <ul className="mt-4 hidden flex-wrap gap-2 sm:flex">
          {specs.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-800/80 bg-ink/5 px-3 py-1 text-xs text-slate-300"
            >
              <Icon className="size-3.5 text-accent" />
              {label}
            </li>
          ))}
        </ul>

        <div
          className={cn(
            "mt-auto flex items-center justify-between gap-2 pt-2 sm:items-end sm:gap-4 sm:pt-6",
          )}
        >
          <p
            className={cn(
              "order-2 text-sm font-bold tracking-tight text-slate-100 sm:order-none sm:text-2xl",
            )}
          >
            {formatCurrency(boat.price, currency)}
          </p>
          <Button
            size="sm"
            variant="secondary"
            className="order-1 px-2 sm:order-none sm:px-3"
            onClick={() => onInquire(boat)}
          >
            <MessageCircle className="size-4 sm:hidden" aria-hidden />
            <span className="sr-only sm:not-sr-only">Consultar</span>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
