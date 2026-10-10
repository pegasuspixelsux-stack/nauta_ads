"use client";

import { useId, useState } from "react";
import { Calculator } from "lucide-react";
import { Field, Input, Select } from "@/components/ui/field";
import { cn, formatCurrency } from "@/lib/utils";

const TERMS = [1, 2, 3, 5, 7, 10, 15];

/** Cuota mensual de un préstamo con sistema francés (cuotas fijas). */
export function monthlyPayment(principal: number, annualRatePct: number, years: number) {
  const n = years * 12;
  if (principal <= 0 || n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  return r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
}

export function FinancingCalculator({
  currency = "USD",
  className,
}: {
  currency?: string;
  className?: string;
}) {
  const titleId = useId();
  const [price, setPrice] = useState(150000);
  const [downPct, setDownPct] = useState(30);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(8);

  const down = (price * downPct) / 100;
  const financed = Math.max(0, price - down);
  const monthly = monthlyPayment(financed, rate, years);
  const total = monthly * years * 12;
  const interest = Math.max(0, total - financed);

  return (
    <section
      aria-labelledby={titleId}
      className={cn("rounded-2xl border border-slate-800/80 bg-surface p-5", className)}
    >
      <h2
        id={titleId}
        className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-100"
      >
        <Calculator className="size-4 text-accent" />
        Calculadora de financiación
      </h2>

      <div className="mt-5 grid gap-5">
        <Field label="Precio de la embarcación (US$)">
          <Input
            type="number"
            min={0}
            step={1000}
            value={price}
            onChange={(event) => setPrice(Math.max(0, Number(event.target.value)))}
          />
        </Field>
        <Field label={`Anticipo: ${downPct}% (${formatCurrency(down, currency)})`}>
          <input
            type="range"
            min={0}
            max={70}
            step={5}
            value={downPct}
            onChange={(event) => setDownPct(Number(event.target.value))}
            className="w-full accent-accent"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Plazo">
            <Select value={years} onChange={(event) => setYears(Number(event.target.value))}>
              {TERMS.map((term) => (
                <option key={term} value={term}>
                  {term} {term === 1 ? "año" : "años"}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tasa anual (%)">
            <Input
              type="number"
              min={0}
              max={60}
              step={0.1}
              value={rate}
              onChange={(event) => setRate(Math.min(60, Math.max(0, Number(event.target.value))))}
            />
          </Field>
        </div>
      </div>

      <div aria-live="polite" className="mt-5 rounded-xl bg-ink/5 p-4">
        <p className="text-sm text-slate-400">Cuota mensual estimada</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-100">
          {formatCurrency(monthly, currency)}
        </p>
        <dl className="mt-4 grid gap-1.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Monto financiado</dt>
            <dd className="font-medium text-slate-300">{formatCurrency(financed, currency)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Intereses totales</dt>
            <dd className="font-medium text-slate-300">{formatCurrency(interest, currency)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Total a pagar</dt>
            <dd className="font-medium text-slate-300">{formatCurrency(total + down, currency)}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Cálculo orientativo con cuotas fijas. La tasa y las condiciones reales dependen de la entidad
        financiera.
      </p>
    </section>
  );
}
