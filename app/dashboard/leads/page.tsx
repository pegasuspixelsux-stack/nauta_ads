"use client";

import { useState, type FormEvent } from "react";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Mail, Phone, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { leadTone } from "@/components/dashboard/status";
import { Button } from "@/components/ui/button";
import { Badge, EmptyState } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { db } from "@/lib/firebase";
import { useCollection } from "@/lib/firestore";
import { boatLabel } from "@/lib/boats";
import type { Boat, Lead, LeadStatus } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

const columns: { status: LeadStatus; title: string }[] = [
  { status: "new", title: "Nuevas" },
  { status: "contacted", title: "Contactadas" },
  { status: "converted", title: "Concretadas" },
];

const order: LeadStatus[] = ["new", "contacted", "converted"];

export default function LeadsPage() {
  const { data: leads, loading, error } = useCollection<Lead>("leads", { orderByField: "createdAt" });
  const { data: boats } = useCollection<Boat>("boats");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const guard = async (action: () => Promise<unknown>) => {
    setActionError("");
    try {
      await action();
    } catch {
      setActionError("No se pudo guardar el cambio. Revisá tus permisos e intentá de nuevo.");
    }
  };

  const move = (lead: Lead, direction: 1 | -1) => {
    const next = order[order.indexOf(lead.status) + direction];
    if (next) void guard(() => updateDoc(doc(db, "leads", lead.id), { status: next }));
  };

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const boat = boats.find((item) => item.id === form.get("boatId"));
    setSaving(true);
    await guard(async () => {
      await addDoc(collection(db, "leads"), {
        name: String(form.get("name")),
        email: String(form.get("email")),
        phone: String(form.get("phone")),
        message: String(form.get("message")),
        boatId: boat?.id ?? null,
        boatLabel: boat ? boatLabel(boat) : "",
        status: "new",
        createdAt: Date.now(),
      });
      setOpen(false);
    });
    setSaving(false);
  };

  return (
    <>
      <PageHeader
        title="Consultas"
        description="Seguí cada consulta desde el primer contacto hasta la venta."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Agregar consulta
          </Button>
        }
      />

      {(error || actionError) && (
        <p role="alert" className="mb-6 text-sm text-red-700 dark:text-red-400">
          {error || actionError}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {columns.map(({ status, title }) => {
          const items = leads.filter((lead) => lead.status === status);
          return (
            <section
              key={status}
              aria-label={title}
              className="rounded-2xl border border-slate-800/80 bg-surface p-4"
            >
              <header className="flex items-center justify-between px-2 pt-1 pb-4">
                <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
                <Badge tone={leadTone[status]}>{items.length}</Badge>
              </header>

              {items.length === 0 ? (
                <EmptyState>{loading ? "Cargando…" : "Nada por acá."}</EmptyState>
              ) : (
                <ul className="grid gap-3">
                  {items.map((lead) => (
                    <li
                      key={lead.id}
                      className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition-colors hover:border-slate-700"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-100">{lead.name}</p>
                          <p className="truncate text-sm text-slate-500">
                            {lead.boatLabel || "Consulta general"}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-slate-500">{timeAgo(lead.createdAt)}</span>
                      </div>

                      {lead.message && (
                        <p className="mt-3 line-clamp-3 text-sm text-slate-400">{lead.message}</p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-100"
                          >
                            <Mail className="size-3.5" />
                            {lead.email}
                          </a>
                        )}
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-100"
                          >
                            <Phone className="size-3.5" />
                            {lead.phone}
                          </a>
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        {status !== "new" && (
                          <Button size="sm" variant="ghost" onClick={() => move(lead, -1)}>
                            Volver
                          </Button>
                        )}
                        {status !== "converted" && (
                          <Button size="sm" variant="secondary" onClick={() => move(lead, 1)}>
                            {status === "new" ? "Marcar contactada" : "Marcar concretada"}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-auto"
                          aria-label={`Eliminar consulta de ${lead.name}`}
                          onClick={() => void guard(() => deleteDoc(doc(db, "leads", lead.id)))}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Agregar consulta">
        <form onSubmit={create} className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre">
              <Input name="name" required />
            </Field>
            <Field label="Teléfono">
              <Input name="phone" type="tel" />
            </Field>
          </div>
          <Field label="Correo">
            <Input name="email" type="email" />
          </Field>
          <Field label="Interesado en">
            <Select name="boatId" defaultValue="">
              <option value="">Consulta general</option>
              {boats.map((boat) => (
                <option key={boat.id} value={boat.id}>
                  {boatLabel(boat)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Notas">
            <Textarea name="message" />
          </Field>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Agregar consulta"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
