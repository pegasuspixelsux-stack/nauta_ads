"use client";

import { useState, type FormEvent } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { db, isFirebaseConfigured } from "@/lib/firebase";

/** Banner a todo el ancho para suscribirse al boletín. Guarda el correo en `subscribers`. */
export function NewsletterBanner() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim().toLowerCase();
    setSending(true);
    setError("");
    try {
      if (!isFirebaseConfigured) throw new Error("Firebase no está configurado.");
      await addDoc(collection(db, "subscribers"), { email, createdAt: Date.now() });
      setDone(true);
    } catch {
      setError("No pudimos registrar tu correo. Intentá de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      aria-labelledby="newsletter-title"
      className="relative overflow-hidden border-t border-slate-800/80"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_50%_100%,color-mix(in_oklab,var(--color-slate-700)_55%,transparent),transparent)]"
      />
      <div className="relative mx-auto flex min-h-[18rem] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
        <h2
          id="newsletter-title"
          className="text-3xl font-bold tracking-tight text-slate-100 md:text-5xl"
        >
          Boletín Náutico: Oportunidades &amp; Mareas
        </h2>
        <p className="mt-5 max-w-xl text-lg text-slate-400">
          Reciba avisos de nuevos ingresos exclusivos en Punta del Este y Montevideo antes de que
          salgan a la venta pública.
        </p>

        {done ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4 text-emerald-700 dark:text-emerald-300">
            <Check className="size-5" />
            <p className="font-medium">¡Listo! Ya estás suscripto al boletín.</p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-8 grid w-full max-w-xl gap-3 rounded-3xl border border-ink/10 bg-slate-900/60 p-3 shadow-2xl backdrop-blur-xl sm:grid-cols-[1fr_auto]"
          >
            <Input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Ingrese su correo electrónico..."
              aria-label="Correo electrónico"
              className="h-12 border-transparent bg-ink/5"
            />
            <Button type="submit" size="lg" disabled={sending}>
              {sending ? "Enviando…" : "Suscribirme"}
            </Button>
          </form>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
