"use client";

import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { Ship, Pencil, Plus, Trash2 } from "lucide-react";
import { BoatForm } from "@/components/dashboard/BoatForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { boatTone } from "@/components/dashboard/status";
import { Button } from "@/components/ui/button";
import { Badge, Card, EmptyState } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { boatLabel, STATUS_LABEL } from "@/lib/boats";
import { db, storage } from "@/lib/firebase";
import { useCollection, useSettings } from "@/lib/firestore";
import type { Boat } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function BoatsPage() {
  const { data: boats, loading, error } = useCollection<Boat>("boats", { orderByField: "createdAt" });
  const { currency } = useSettings();
  const [editing, setEditing] = useState<Boat | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Boat | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const openForm = (boat: Boat | null) => {
    setEditing(boat);
    setOpen(true);
  };

  const remove = async (boat: Boat) => {
    setDeleteError("");
    try {
      // Firestore no borra subcolecciones solas: se elimina el contacto del anunciante primero.
      await deleteDoc(doc(db, "boats", boat.id, "private", "owner")).catch(() => undefined);
      await deleteDoc(doc(db, "boats", boat.id));
      // Best effort: orphaned files are harmless, the record is the source of truth.
      await Promise.allSettled(boat.imagePaths.filter(Boolean).map((path) => deleteObject(ref(storage, path))));
      setPendingDelete(null);
    } catch {
      setDeleteError("No se pudo eliminar la embarcación.");
    }
  };

  return (
    <>
      <PageHeader
        title="Embarcaciones"
        description="Revisá los avisos nuevos, activá el cobro y gestioná lo publicado en el sitio."
        action={
          <Button onClick={() => openForm(null)}>
            <Plus className="size-4" />
            Agregar embarcación
          </Button>
        }
      />

      <Card className="overflow-hidden">
        {error ? (
          <EmptyState>{error}</EmptyState>
        ) : boats.length === 0 ? (
          <EmptyState>{loading ? "Cargando embarcaciones…" : "Todavía no hay embarcaciones."}</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800/80 text-xs tracking-wide text-slate-500 uppercase">
                  <th className="px-6 py-4 font-medium">Embarcación</th>
                  <th className="px-6 py-4 font-medium">Precio</th>
                  <th className="px-6 py-4 font-medium">Eslora / horas</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {boats.map((boat) => (
                  <tr key={boat.id} className="transition-colors hover:bg-ink/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800/60 text-slate-600">
                          {boat.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={boat.images[0]} alt="" className="size-full object-cover" />
                          ) : (
                            <Ship className="size-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">
                            {boatLabel(boat)}
                          </p>
                          <p className="text-slate-500">
                            {boat.category} · {boat.portLocation}
                            {boat.featured && " · Destacada"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-100">
                      {formatCurrency(boat.price, currency)}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{boat.length} m · {formatNumber(boat.engineHours)} h</td>
                    <td className="px-6 py-4">
                      <Badge tone={boatTone[boat.status]}>
                        {STATUS_LABEL[boat.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Revisar o editar ${boat.builder} ${boat.model}`}
                          onClick={() => openForm(boat)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Eliminar ${boat.builder} ${boat.model}`}
                          onClick={() => setPendingDelete(boat)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Revisar embarcación" : "Agregar embarcación"}
      >
        {/* se remonta por embarcación para reiniciar valores iniciales e id reservado */}
        <BoatForm key={editing?.id ?? "new"} boat={editing} onDone={() => setOpen(false)} />
      </Modal>

      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="¿Eliminar embarcación?"
      >
        <p className="text-slate-400">
          {pendingDelete && boatLabel(pendingDelete)} y sus fotos se eliminarán de forma permanente.
        </p>
        {deleteError && <p className="mt-4 text-sm text-red-700 dark:text-red-400">{deleteError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setPendingDelete(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => pendingDelete && void remove(pendingDelete)}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </>
  );
}
