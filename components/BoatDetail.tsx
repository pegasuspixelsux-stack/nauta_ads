"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, MapPin, Ship } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { Badge } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { boatLabel, PUBLIC_STATUSES } from "@/lib/boats";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { useSettings } from "@/lib/firestore";
import { SAMPLE_BOATS } from "@/lib/sample-boats";
import type { Boat } from "@/lib/types";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

type State = { boat: Boat | null; loading: boolean };

/** Ficha pública de una embarcación. Solo muestra avisos publicados o reservados. */
export function BoatDetail({ id }: { id: string }) {
  const { currency } = useSettings();
  const [state, setState] = useState<State>({ boat: null, loading: true });
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const finish = (boat: Boat | null) => !cancelled && setState({ boat, loading: false });

    if (!isFirebaseConfigured) {
      finish(SAMPLE_BOATS.find((item) => item.id === id) ?? null);
      return;
    }
    getDoc(doc(db, "boats", id))
      .then((snap) => finish(snap.exists() ? ({ ...snap.data(), id: snap.id } as Boat) : null))
      .catch(() => finish(null)); // las reglas rechazan los avisos que no están publicados
    return () => {
      cancelled = true;
    };
  }, [id]);

  const { boat, loading } = state;

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl border border-slate-800/80 bg-surface" />;
  }

  if (!boat || !PUBLIC_STATUSES.includes(boat.status)) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-surface px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-100">No encontramos esta embarcación</p>
        <p className="mt-2 text-slate-400">Puede que ya no esté publicada.</p>
        <Link
          href="/embarcaciones"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <ArrowLeft className="size-4" /> Ver todas las embarcaciones
        </Link>
      </div>
    );
  }

  const specs: [string, string][] = [
    ["Tipo", boat.category],
    ["Condición", boat.condition],
    ["Año", String(boat.year)],
    ["Eslora", `${boat.length.toLocaleString("es-UY")} m`],
    ["Horas de motor", `${formatNumber(boat.engineHours)} h`],
    ["Propulsión", boat.propulsion],
    ["Puerto de amarre", boat.portLocation],
    ["Bandera", boat.flagType],
    ["Documentación", boat.documentationStatus],
    ...(boat.hullIdentificationNumber ? ([["HIN / matrícula", boat.hullIdentificationNumber]] as [string, string][]) : []),
  ];

  return (
    <>
      <Link
        href="/embarcaciones"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-slate-100"
      >
        <ArrowLeft className="size-4" /> Embarcaciones
      </Link>

      <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-800 to-slate-900">
            {boat.images[photo] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={boat.images[photo]} alt={boatLabel(boat)} className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-slate-700">
                <Ship className="size-20" strokeWidth={1.25} />
              </div>
            )}
          </div>
          {boat.images.length > 1 && (
            <ul className="mt-3 grid grid-cols-5 gap-3 sm:grid-cols-6">
              {boat.images.map((src, index) => (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => setPhoto(index)}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-current={index === photo}
                    className={cn(
                      "aspect-square w-full overflow-hidden rounded-xl border-2 transition-colors",
                      index === photo ? "border-accent" : "border-transparent hover:border-slate-700",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="size-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="gap-1">
              <MapPin className="size-3" aria-hidden />
              {boat.portLocation}
            </Badge>
            {boat.status === "reserved" && <Badge tone="amber">Reservada</Badge>}
            {boat.featured && <Badge>Destacada</Badge>}
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-100 md:text-4xl">
            {boat.builder} {boat.model}
          </h1>
          <p className="mt-1 text-slate-500">
            {boat.year} · {boat.category} · {boat.condition}
          </p>
          <p className="mt-6 text-4xl font-bold tracking-tight text-slate-100">
            {formatCurrency(boat.price, currency)}
          </p>
          <a href="#contacto" className={cn(buttonStyles("primary", "lg"), "mt-6 w-full")}>
            Consultar por esta embarcación
          </a>

          <dl className="mt-8 divide-y divide-slate-800/80 rounded-2xl border border-slate-800/80 bg-surface">
            {specs.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 px-5 py-3 text-sm">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-right font-medium text-slate-100">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {boat.description && (
        <section className="mt-10 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Descripción</h2>
          <p className="mt-3 leading-relaxed whitespace-pre-line text-slate-400">{boat.description}</p>
        </section>
      )}

      <section
        id="contacto"
        aria-labelledby="contacto-title"
        className="mt-12 max-w-2xl scroll-mt-24 rounded-2xl border border-slate-800/80 bg-surface p-6 md:p-8"
      >
        <h2 id="contacto-title" className="text-xl font-semibold tracking-tight text-slate-100">
          Contactar por esta embarcación
        </h2>
        <p className="mt-2 mb-6 text-sm text-slate-400">
          Dejanos tus datos y te respondemos a la brevedad sobre {boatLabel(boat)}.
        </p>
        <InquiryForm boat={boat} />
      </section>
    </>
  );
}
