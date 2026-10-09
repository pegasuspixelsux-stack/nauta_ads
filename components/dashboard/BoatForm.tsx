"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { ImagePlus, Mail, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea, Toggle } from "@/components/ui/field";
import {
  CATEGORIES,
  CONDITIONS,
  DOCUMENTATION,
  FLAGS,
  PLANS,
  PORTS,
  PROPULSIONS,
  STATUS_LABEL,
} from "@/lib/boats";
import { db } from "@/lib/firebase";
import { uploadBoatImage } from "@/lib/image";
import type { Boat, BoatOwner, BoatStatus, ListingPlan } from "@/lib/types";

const STATUSES = Object.keys(STATUS_LABEL) as BoatStatus[];

/**
 * Alta y revisión de una embarcación. El administrador verifica fotos, especificaciones y
 * estado legal, carga el link de pago y recién después activa el aviso.
 */
export function BoatForm({ boat, onDone }: { boat: Boat | null; onDone: () => void }) {
  const [status, setStatus] = useState<BoatStatus>(boat?.status ?? "pending_review");
  const [plan, setPlan] = useState<ListingPlan>(boat?.plan ?? "individual");
  const [paid, setPaid] = useState(boat?.paid ?? false);
  const [paymentUrl, setPaymentUrl] = useState(boat?.paymentUrl ?? "");
  const [featured, setFeatured] = useState(boat?.featured ?? false);
  const [owner, setOwner] = useState<BoatOwner | null>(null);
  const [images, setImages] = useState<{ url: string; path: string }[]>(
    boat ? boat.images.map((url, index) => ({ url, path: boat.imagePaths[index] ?? "" })) : [],
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // Reserva el id de entrada para que las fotos suban a boats/{id}/.
  const [boatId] = useState(() => boat?.id ?? doc(collection(db, "boats")).id);

  useEffect(() => {
    if (!boat) return;
    let cancelled = false;
    getDoc(doc(db, "boats", boat.id, "private", "owner"))
      .then((snap) => !cancelled && setOwner((snap.data() as BoatOwner | undefined) ?? null))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [boat]);

  const addImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded = await Promise.all(Array.from(files).map((file) => uploadBoatImage(boatId, file)));
      setImages((current) => [...current, ...uploaded]);
    } catch {
      setError("No se pudieron subir una o más fotos.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Compuerta de activación: nada se publica sin link de pago enviado y pago confirmado.
    if (status === "awaiting_payment" && !paymentUrl.trim()) {
      setError("Cargá el link de pago antes de pasar el aviso a «Esperando pago».");
      return;
    }
    if ((status === "active" || status === "reserved" || status === "sold") && !paid) {
      setError("Confirmá el pago antes de publicar el aviso.");
      return;
    }
    if (status === "active" && images.length === 0) {
      setError("Un aviso publicado necesita al menos una foto.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();
    setSaving(true);
    setError("");
    try {
      await setDoc(doc(db, "boats", boatId), {
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
        status,
        featured,
        images: images.map((image) => image.url),
        imagePaths: images.map((image) => image.path),
        plan,
        paid,
        paymentUrl: paymentUrl.trim(),
        createdAt: boat?.createdAt ?? Date.now(),
        // Fecha de venta al pasar a «vendida»; se borra si se revierte.
        soldAt: status === "sold" ? (boat?.soldAt ?? Date.now()) : null,
      });
      onDone();
    } catch {
      setError("No se pudo guardar la embarcación. Revisá tu conexión y permisos.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-6">
      {owner && (
        <div className="rounded-xl border border-slate-800/80 bg-ink/5 p-4 text-sm">
          <p className="font-medium text-slate-100">Anunciante: {owner.name}</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-slate-400">
            <a href={`mailto:${owner.email}`} className="inline-flex items-center gap-1.5 hover:text-slate-100">
              <Mail className="size-3.5" />
              {owner.email}
            </a>
            <a href={`tel:${owner.phone}`} className="inline-flex items-center gap-1.5 hover:text-slate-100">
              <Phone className="size-3.5" />
              {owner.phone}
            </a>
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-slate-300">Fotos ({images.length})</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.url} className="relative aspect-square overflow-hidden rounded-xl bg-slate-800">
              <a href={image.url} target="_blank" rel="noreferrer" aria-label="Abrir foto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" className="size-full object-cover" />
              </a>
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
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 text-xs text-slate-500 transition-[border-color,color,transform] hover:border-slate-500 hover:text-slate-300 active:scale-[0.98] disabled:opacity-50"
          >
            <ImagePlus className="size-5" />
            {uploading ? "Subiendo…" : "Agregar fotos"}
          </button>
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
          Las fotos se reducen y convierten a WebP en tu dispositivo antes de subirse.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Astillero">
          <Input name="builder" required defaultValue={boat?.builder} />
        </Field>
        <Field label="Modelo">
          <Input name="model" required defaultValue={boat?.model} />
        </Field>
        <Field label="Tipo">
          <Select name="category" defaultValue={boat?.category ?? CATEGORIES[0]}>
            {CATEGORIES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="Condición">
          <Select name="condition" defaultValue={boat?.condition ?? "Usada"}>
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
            defaultValue={boat?.year ?? new Date().getFullYear()}
          />
        </Field>
        <Field label="Precio (US$)">
          <Input name="price" type="number" required min={0} defaultValue={boat?.price} />
        </Field>
        <Field label="Eslora (m)">
          <Input
            name="length"
            type="number"
            required
            min={1}
            max={200}
            step="0.1"
            defaultValue={boat?.length}
          />
        </Field>
        <Field label="Horas de motor">
          <Input name="engineHours" type="number" min={0} defaultValue={boat?.engineHours ?? 0} />
        </Field>
        <Field label="Propulsión">
          <Select name="propulsion" defaultValue={boat?.propulsion ?? PROPULSIONS[0]}>
            {PROPULSIONS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="Puerto de amarre">
          <Select name="portLocation" defaultValue={boat?.portLocation ?? PORTS[0]}>
            {PORTS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="HIN o matrícula" className="sm:col-span-2">
          <Input name="hin" defaultValue={boat?.hullIdentificationNumber} />
        </Field>
        <Field label="Bandera">
          <Select name="flagType" defaultValue={boat?.flagType ?? FLAGS[0]}>
            {FLAGS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="Documentación">
          <Select name="documentationStatus" defaultValue={boat?.documentationStatus ?? DOCUMENTATION[0]}>
            {DOCUMENTATION.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Descripción">
        <Textarea name="description" defaultValue={boat?.description} />
      </Field>

      <div className="grid gap-5 rounded-xl border border-slate-800/80 p-4 sm:grid-cols-2">
        <p className="text-sm font-semibold text-slate-100 sm:col-span-2">Publicación y cobro</p>
        <Field label="Plan">
          <Select value={plan} onChange={(event) => setPlan(event.target.value as ListingPlan)}>
            {(Object.keys(PLANS) as ListingPlan[]).map((key) => (
              <option key={key} value={key}>
                {PLANS[key].label} · {PLANS[key].price}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Estado">
          <Select value={status} onChange={(event) => setStatus(event.target.value as BoatStatus)}>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABEL[value]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Link de pago" hint="Se lo enviás al anunciante una vez aprobada la revisión." className="sm:col-span-2">
          <Input
            type="url"
            placeholder="https://…"
            value={paymentUrl}
            onChange={(event) => setPaymentUrl(event.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Toggle
            checked={paid}
            onChange={setPaid}
            label="Pago confirmado"
            description="Requerido para publicar, reservar o marcar como vendida."
          />
        </div>
      </div>

      <Toggle
        checked={featured}
        onChange={setFeatured}
        label="Destacada"
        description="Mostrar esta embarcación primero en el sitio público."
      />

      {error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "Guardando…" : boat ? "Guardar cambios" : "Agregar embarcación"}
        </Button>
      </div>
    </form>
  );
}
