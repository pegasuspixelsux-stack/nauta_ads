"use client";

import { useState, type FormEvent } from "react";
import { doc, setDoc } from "firebase/firestore";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Toggle } from "@/components/ui/field";
import { db } from "@/lib/firebase";
import { useSettings } from "@/lib/firestore";
import type { SiteSettings } from "@/lib/types";

const currencies = ["USD", "EUR", "GBP", "CAD", "MXN", "AUD"];

export default function ConfigPage() {
  const saved = useSettings();
  // `edits` overlays unsaved changes on top of the live settings document.
  const [edits, setEdits] = useState<Partial<SiteSettings>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const settings = { ...saved, ...edits };

  const update = (patch: Partial<SiteSettings>) => {
    setEdits((current) => ({ ...current, ...patch }));
    setStatus("idle");
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    try {
      await setDoc(doc(db, "settings", "site"), settings);
      setEdits({});
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <PageHeader title="Configuración" description="Datos de Nauta y preferencias de notificaciones." />

      <form onSubmit={save} className="grid max-w-3xl gap-8">
        <Card>
          <CardHeader title="Sitio" description="Se muestra a los visitantes y se usa en todo el panel." />
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <Field label="Nombre" className="sm:col-span-2">
              <Input
                value={settings.name}
                onChange={(event) => update({ name: event.target.value })}
                required
              />
            </Field>
            <Field label="Moneda">
              <Select value={settings.currency} onChange={(event) => update({ currency: event.target.value })}>
                {currencies.map((code) => (
                  <option key={code}>{code}</option>
                ))}
              </Select>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Contacto" description="Cómo te contactan visitantes y anunciantes." />
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <Field label="Correo">
              <Input
                type="email"
                value={settings.email}
                onChange={(event) => update({ email: event.target.value })}
              />
            </Field>
            <Field label="Teléfono">
              <Input
                type="tel"
                value={settings.phone}
                onChange={(event) => update({ phone: event.target.value })}
              />
            </Field>
            <Field label="Dirección" className="sm:col-span-2">
              <Input value={settings.address} onChange={(event) => update({ address: event.target.value })} />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Notificaciones" description="Elegí de qué querés enterarte." />
          <div className="divide-y divide-slate-800/80 px-6">
            <Toggle
              checked={settings.notifyNewLead}
              onChange={(value) => update({ notifyNewLead: value })}
              label="Alertas de consultas nuevas"
              description="Recibí un aviso cuando un visitante envía una consulta."
            />
            <Toggle
              checked={settings.notifyStatusChange}
              onChange={(value) => update({ notifyStatusChange: value })}
              label="Cambios de estado de consultas"
              description="Recibí un aviso cuando un compañero mueve una consulta."
            />
            <Toggle
              checked={settings.weeklyDigest}
              onChange={(value) => update({ weeklyDigest: value })}
              label="Resumen semanal"
              description="Un resumen de avisos y ventas cada lunes."
            />
          </div>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" size="lg" disabled={status === "saving"}>
            {status === "saving" ? "Guardando…" : "Guardar cambios"}
          </Button>
          <p aria-live="polite" className="text-sm">
            {status === "saved" && <span className="text-emerald-700 dark:text-emerald-400">Configuración guardada.</span>}
            {status === "error" && (
              <span className="text-red-700 dark:text-red-400">No se pudo guardar. Revisá tus permisos.</span>
            )}
          </p>
        </div>
      </form>
    </>
  );
}
