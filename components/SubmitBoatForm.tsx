"use client";

import { useRef, useState, type FormEvent } from "react";
import { collection, doc, writeBatch } from "firebase/firestore";
import { Check, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import {
  CATEGORIES,
  CONDITIONS,
  DOCUMENTATION,
  FLAGS,
  PLANS,
  PORTS,
  PROPULSIONS,
} from "@/lib/boats";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { uploadBoatImage } from "@/lib/image";
import type { ListingPlan } from "@/lib/types";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 12;

/** Formulario público: no requiere cuenta. El aviso queda "en revisión" hasta que un admin lo active. */
export function SubmitBoatForm() {
  const [plan, setPlan] = useState<ListingPlan>("individual");
  const [images, setImages] = useState<{ url: string; path: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // El id se reserva de entrada para subir las fotos a boats/{id}/ antes de guardar el aviso.
  const [boatId] = useState(() => (isFirebaseConfigured ? doc(collection(db, "boats")).id : ""));

  const addImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const room = MAX_PHOTOS - images.length;
      const uploaded = await Promise.all(
        Array.from(files)
          .slice(0, room)
          .map((file) => uploadBoatImage(boatId, file)),
      );
      setImages((current) => [...current, ...uploaded]);
    } catch {
      setError("No se pudieron subir una o más fotos. Probá de nuevo.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    try {
      if (!isFirebaseConfigured) throw new Error("Firebase no está configurado.");
      const text = (key: string) => String(form.get(key) ?? "").trim();
      const batch = writeBatch(db);
      batch.set(doc(db, "boats", boatId), {
        builder: text("builder"),
        model: text("model"),
        category: text("category"),
        condition: text("condition"),
        year: Number(form.get("year")),
        price: Number(form.get("price")),
        length: Number(form.get("length")),
        engineHours: Number(form.get("engineHours")) || 0,
        propulsion: text("propulsion"),
        hullIdentificationNumber: text("hin"),
        flagType: text("flagType"),
        documentationStatus: text("documentationStatus"),
        portLocation: text("portLocation"),
        description: text("description"),
        status: "pending_review",
        featured: false,
        images: images.map((image) => image.url),
        imagePaths: images.map((image) => image.path),
        plan,
        paid: false,
        paymentUrl: "",
        createdAt: Date.now(),
        soldAt: null,
      });
      // Contacto en un documento aparte: nunca se expone en el sitio público.
      batch.set(doc(db, "boats", boatId, "private", "owner"), {
        name: text("ownerName"),
        email: text("ownerEmail"),
        phone: text("ownerPhone"),
      });
      await batch.commit();
      setSent(true);
    } catch {
      setError("No pudimos enviar tu aviso. Revisá los datos e intentá de nuevo.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800/80 bg-surface px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          <Check className="size-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">¡Recibimos tu aviso!</h2>
        <p className="max-w-md text-slate-400">
          Nuestro equipo va a revisar las fotos, las especificaciones y el estado legal. Cuando todo
          esté en orden te enviaremos por correo el link de pago para publicarlo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-10">
      <fieldset className="grid gap-4">
        <legend className="mb-1 text-sm font-semibold text-slate-100">Tipo de publicación</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(PLANS) as ListingPlan[]).map((key) => (
            <label
              key={key}
              className={cn(
                "cursor-pointer rounded-2xl border p-5 transition-colors",
                plan === key
                  ? "border-slate-100 bg-ink/5"
                  : "border-slate-800/80 hover:border-slate-700",
              )}
            >
              <input
                type="radio"
                name="plan"
                value={key}
                checked={plan === key}
                onChange={() => setPlan(key)}
                className="sr-only"
              />
              <span className="block text-sm text-slate-400">{PLANS[key].label}</span>
              <span className="mt-1 block text-xl font-bold tracking-tight text-slate-100">
                {PLANS[key].price}
              </span>
              <span className="mt-2 block text-sm text-slate-500">
                {key === "individual"
                  ? "Un aviso, pago único una vez aprobado."
                  : "Varias embarcaciones; coordinamos el paquete con vos."}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-slate-100">La embarcación</legend>
        <Field label="Astillero">
          <Input name="builder" required placeholder="Sea Ray, Beneteau, Riva…" />
        </Field>
        <Field label="Modelo">
          <Input name="model" required />
        </Field>
        <Field label="Tipo">
          <Select name="category" defaultValue={CATEGORIES[0]}>
            {CATEGORIES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="Condición">
          <Select name="condition" defaultValue="Usada">
            {CONDITIONS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="Año">
          <Input
            name="year"
            type="number"
            required
            min={1950}
            max={new Date().getFullYear() + 1}
            defaultValue={new Date().getFullYear()}
          />
        </Field>
        <Field label="Precio (US$)">
          <Input name="price" type="number" required min={1} />
        </Field>
        <Field label="Eslora (m)">
          <Input name="length" type="number" required min={1} max={200} step="0.1" />
        </Field>
        <Field label="Horas de motor" hint="Dejalo en 0 para veleros sin motor o embarcaciones nuevas.">
          <Input name="engineHours" type="number" min={0} defaultValue={0} />
        </Field>
        <Field label="Propulsión">
          <Select name="propulsion" defaultValue={PROPULSIONS[0]}>
            {PROPULSIONS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="Puerto de amarre">
          <Select name="portLocation" defaultValue={PORTS[0]}>
            {PORTS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="Descripción" className="sm:col-span-2">
          <Textarea name="description" placeholder="Equipamiento, mantenimiento, historial…" />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-slate-100">Estado legal</legend>
        <Field label="Bandera">
          <Select name="flagType" defaultValue={FLAGS[0]}>
            {FLAGS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="Documentación">
          <Select name="documentationStatus" defaultValue={DOCUMENTATION[0]}>
            {DOCUMENTATION.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field
          label="HIN o matrícula"
          hint="Número de identificación del casco o matrícula de registro."
          className="sm:col-span-2"
        >
          <Input name="hin" required />
        </Field>
      </fieldset>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-100">Fotos</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {images.map((image, index) => (
            <div key={image.url} className="relative aspect-square overflow-hidden rounded-xl bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="size-full object-cover" />
              <button
                type="button"
                aria-label="Quitar foto"
                onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
                className="absolute top-1.5 right-1.5 rounded-full bg-slate-950/80 p-1 text-slate-300 backdrop-blur transition-[color,transform] hover:text-slate-50 active:scale-90"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {images.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading || !isFirebaseConfigured}
              className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 text-xs text-slate-500 transition-[border-color,color,transform] hover:border-slate-500 hover:text-slate-300 active:scale-[0.98] disabled:opacity-50"
            >
              <ImagePlus className="size-5" />
              {uploading ? "Subiendo…" : "Agregar fotos"}
            </button>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => void addImages(event.target.files)}
        />
        <p className="mt-2 text-xs text-slate-500">
          Hasta {MAX_PHOTOS} fotos. Se reducen y convierten a WebP en tu dispositivo antes de subirse.
        </p>
      </div>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-slate-100">Tus datos de contacto</legend>
        <Field label="Nombre">
          <Input name="ownerName" required autoComplete="name" />
        </Field>
        <Field label="Teléfono / WhatsApp">
          <Input name="ownerPhone" type="tel" required autoComplete="tel" />
        </Field>
        <Field label="Correo" hint="Acá te enviamos el link de pago." className="sm:col-span-2">
          <Input name="ownerEmail" type="email" required autoComplete="email" />
        </Field>
      </fieldset>

      {!isFirebaseConfigured && (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          Firebase no está configurado: el formulario no puede enviarse en esta vista local.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={sending || uploading || !isFirebaseConfigured}>
        {sending ? "Enviando…" : "Enviar aviso a revisión"}
      </Button>
      <p className="-mt-6 text-xs text-slate-500">
        No necesitás crear una cuenta. No se cobra nada hasta que aprobemos el aviso.
      </p>
    </form>
  );
}
