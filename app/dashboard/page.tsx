"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Ship } from "lucide-react";
import { Badge, Card, CardHeader, EmptyState } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { leadLabel, leadTone } from "@/components/dashboard/status";
import { useCollection, useSettings } from "@/lib/firestore";
import { boatLabel } from "@/lib/boats";
import type { Boat, Lead } from "@/lib/types";
import { cn, formatCurrency, formatNumber, monthRange, percentChange, timeAgo } from "@/lib/utils";

interface Kpi {
  label: string;
  value: string;
  /** `undefined` oculta la variación (métricas sin comparación mensual). */
  change?: number | null;
}

function inRange(value: number | null | undefined, range: { start: number; end: number }) {
  return value != null && value >= range.start && value < range.end;
}

export default function ControlPanelPage() {
  const { data: boats, loading: boatsLoading } = useCollection<Boat>("boats", { orderByField: "createdAt" });
  const { data: leads, loading: leadsLoading } = useCollection<Lead>("leads", {
    orderByField: "createdAt",
  });
  const { currency } = useSettings();

  const kpis = useMemo<Kpi[]>(() => {
    const thisMonth = monthRange(0);
    const lastMonth = monthRange(-1);

    const revenue = (range: { start: number; end: number }) =>
      boats.filter((boat) => inRange(boat.soldAt, range)).reduce((sum, boat) => sum + boat.price, 0);
    const conversion = (range: { start: number; end: number }) => {
      const created = leads.filter((lead) => inRange(lead.createdAt, range));
      return created.length
        ? (created.filter((lead) => lead.status === "converted").length / created.length) * 100
        : 0;
    };
    const count = <T extends { createdAt: number }>(items: T[], range: { start: number; end: number }) =>
      items.filter((item) => inRange(item.createdAt, range)).length;

    const overallConversion = leads.length
      ? (leads.filter((lead) => lead.status === "converted").length / leads.length) * 100
      : 0;

    return [
      {
        label: "Embarcaciones publicadas",
        value: formatNumber(boats.filter((boat) => boat.status === "active" || boat.status === "reserved").length),
        change: percentChange(count(boats, thisMonth), count(boats, lastMonth)),
      },
      {
        label: "Por revisar",
        value: formatNumber(
          boats.filter((boat) => boat.status === "pending_review" || boat.status === "awaiting_payment").length,
        ),
      },
      {
        label: "Ventas del mes (valor)",
        value: formatCurrency(revenue(thisMonth), currency),
        change: percentChange(revenue(thisMonth), revenue(lastMonth)),
      },
      {
        label: "Conversión de consultas",
        value: `${overallConversion.toFixed(1)}%`,
        change: percentChange(conversion(thisMonth), conversion(lastMonth)),
      },
    ];
  }, [boats, leads, currency]);

  const latestBoats = boats.slice(0, 5);
  const latestLeads = leads.slice(0, 5);

  return (
    <>
      <PageHeader title="Panel de control" description="Un resumen en vivo de Nauta." />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-6">
              <p className="text-sm font-medium text-slate-400">{kpi.label}</p>
              <p className="mt-3 text-4xl font-bold tracking-tight text-slate-100">
                {boatsLoading || leadsLoading ? "–" : kpi.value}
              </p>
              <Change value={kpi.change} />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Últimos avisos recibidos" description="Embarcaciones agregadas recientemente" />
          {latestBoats.length === 0 ? (
            <EmptyState>{boatsLoading ? "Cargando…" : "Todavía no hay embarcaciones."}</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-800/80">
              {latestBoats.map((boat) => (
                <li key={boat.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800/60 text-slate-600">
                    {boat.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={boat.images[0]} alt="" className="size-full object-cover" />
                    ) : (
                      <Ship className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-100">
                      {boatLabel(boat)}
                    </p>
                    <p className="text-sm text-slate-500">{timeAgo(boat.createdAt)}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-100">
                    {formatCurrency(boat.price, currency)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Últimas consultas" description="Consultas entrantes de compradores" />
          {latestLeads.length === 0 ? (
            <EmptyState>{leadsLoading ? "Cargando…" : "Todavía no hay consultas."}</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-800/80">
              {latestLeads.map((lead) => (
                <li key={lead.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-100">{lead.name}</p>
                    <p className="truncate text-sm text-slate-500">
                      {lead.boatLabel || "Consulta general"} · {timeAgo(lead.createdAt)}
                    </p>
                  </div>
                  <Badge tone={leadTone[lead.status]}>
                    {leadLabel[lead.status]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function Change({ value }: { value: number | null | undefined }) {
  if (value === undefined) return null;
  if (value === null) {
    return <p className="mt-3 text-sm text-slate-500">Nuevo este mes</p>;
  }
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <p
      className={cn(
        "mt-3 inline-flex items-center gap-1 text-sm font-medium",
        value === 0 ? "text-slate-500" : up ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400",
      )}
    >
      <Icon className="size-4" />
      {Math.abs(value).toFixed(1)}%
      <span className="font-normal text-slate-500">vs. mes anterior</span>
    </p>
  );
}
