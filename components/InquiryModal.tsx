"use client";

import { useState, type FormEvent } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { boatLabel } from "@/lib/boats";
import type { Boat } from "@/lib/types";

export function InquiryModal({ boat, onClose }: { boat: Boat | null; onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    onClose();
    setSent(false);
    setError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!boat) return;
    const form = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    try {
      if (!isFirebaseConfigured) throw new Error("Firebase no está configurado.");
      await addDoc(collection(db, "leads"), {
        name: String(form.get("name")),
        email: String(form.get("email")),
        phone: String(form.get("phone")),
        message: String(form.get("message")),
        boatId: boat.id,
        boatLabel: boatLabel(boat),
        status: "new",
        createdAt: Date.now(),
      });
      setSent(true);
    } catch {
      setError("No pudimos enviar tu consulta. Intentá de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open={boat !== null}
      onClose={close}
      title={boat ? `Consultar por ${boat.builder} ${boat.model}` : "Consultar"}
    >
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <Check className="size-7" />
          </div>
          <p className="text-lg font-semibold">Gracias, te contactaremos a la brevedad.</p>
          <Button variant="secondary" onClick={close}>
            Listo
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre">
              <Input name="name" required autoComplete="name" />
            </Field>
            <Field label="Teléfono">
              <Input name="phone" type="tel" autoComplete="tel" />
            </Field>
          </div>
          <Field label="Email">
            <Input name="email" type="email" required autoComplete="email" />
          </Field>
          <Field label="Mensaje">
            <Textarea name="message" placeholder="Me gustaría coordinar una visita a la embarcación." />
          </Field>
          {error && <p className="text-sm text-red-700 dark:text-red-400">{error}</p>}
          <Button type="submit" size="lg" disabled={sending}>
            {sending ? "Enviando…" : "Enviar consulta"}
          </Button>
        </form>
      )}
    </Modal>
  );
}
