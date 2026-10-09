"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { authErrorMessage, registerWithEmail, signInWithEmail, signInWithGoogle } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { isFirebaseConfigured } from "@/lib/firebase";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await action();
      router.replace("/dashboard");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    void run(() =>
      mode === "login"
        ? signInWithEmail(email, password)
        : registerWithEmail(String(form.get("name") ?? ""), email, password),
    );
  };

  const isLogin = mode === "login";
  const disabled = busy || loading || !isFirebaseConfigured;

  return (
    <main className="relative flex flex-1 items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_oklab,var(--color-slate-700)_40%,transparent),transparent)]"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <Link href="/" className="mb-10 block text-center text-lg font-bold tracking-tight">
          Nauta
        </Link>

        <div className="rounded-3xl border border-ink/10 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            {isLogin ? "Bienvenido de nuevo" : "Creá tu cuenta"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isLogin ? "Ingresá para gestionar el marketplace." : "Registrate para acceder al panel."}
          </p>

          {!isFirebaseConfigured && (
            <p className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              Firebase no está configurado. Copiá <code>.env.example</code> a{" "}
              <code>.env.local</code> y agregá las claves de tu proyecto.
            </p>
          )}

          <form onSubmit={submit} className="mt-8 grid gap-5">
            {!isLogin && (
              <Field label="Nombre completo">
                <Input name="name" required autoComplete="name" />
              </Field>
            )}
            <Field label="Correo">
              <Input name="email" type="email" required autoComplete="email" />
            </Field>
            <Field label="Contraseña">
              <Input
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </Field>

            {error && (
              <p role="alert" className="text-sm text-red-700 dark:text-red-400">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={disabled}>
              {busy ? "Un momento…" : isLogin ? "Ingresar" : "Crear cuenta"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4 text-xs text-slate-500">
            <span className="h-px flex-1 bg-slate-800" />
            o
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            disabled={disabled}
            onClick={() => void run(signInWithGoogle)}
          >
            Continuar con Google
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          {isLogin ? "¿Primera vez en Nauta?" : "¿Ya tenés cuenta?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isLogin ? "register" : "login");
              setError("");
            }}
            className="font-medium text-slate-100 underline-offset-4 hover:underline"
          >
            {isLogin ? "Crear una cuenta" : "Ingresar"}
          </button>
        </p>
      </motion.div>
    </main>
  );
}
