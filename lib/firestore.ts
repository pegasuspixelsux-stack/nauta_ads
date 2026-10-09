"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  limit as limitTo,
  onSnapshot,
  orderBy,
  query,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/types";

interface CollectionOptions {
  orderByField?: string;
  direction?: "asc" | "desc";
  max?: number;
  /** Filtra por `field in values`. El sitio público lo necesita para cumplir las reglas de lectura. */
  whereIn?: { field: string; values: string[] };
  enabled?: boolean;
}

interface Snapshot<T> {
  data: T[];
  error: string | null;
}

/** Suscripción en vivo a una colección de Firestore. Cada documento incluye su `id`. */
export function useCollection<T extends { id: string }>(
  name: string,
  { orderByField, direction = "desc", max, whereIn, enabled = true }: CollectionOptions = {},
) {
  const [snap, setSnap] = useState<Snapshot<T> | null>(null);
  const active = enabled && isFirebaseConfigured;
  // Primitivos estables: evitan re-suscribirse si el llamador crea el array en cada render.
  const whereField = whereIn?.field ?? "";
  const whereValues = whereIn?.values.join(",") ?? "";

  useEffect(() => {
    if (!active) return;
    const constraints: QueryConstraint[] = [];
    if (whereField) constraints.push(where(whereField, "in", whereValues.split(",")));
    if (orderByField) constraints.push(orderBy(orderByField, direction));
    if (max) constraints.push(limitTo(max));

    return onSnapshot(
      query(collection(db, name), ...constraints),
      (result) =>
        setSnap({
          data: result.docs.map((d) => ({ ...d.data(), id: d.id }) as unknown as T),
          error: null,
        }),
      (err) => setSnap({ data: [], error: err.message }),
    );
  }, [active, name, orderByField, direction, max, whereField, whereValues]);

  return {
    data: snap?.data ?? [],
    loading: active && snap === null,
    error: snap?.error ?? null,
  };
}

/** Configuración del sitio en vivo; usa los valores por defecto hasta que se guarde. */
export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onSnapshot(
      doc(db, "settings", "site"),
      (result) =>
        setSettings({ ...DEFAULT_SETTINGS, ...(result.data() as Partial<SiteSettings>) }),
      () => setSettings(DEFAULT_SETTINGS),
    );
  }, []);

  return settings ?? DEFAULT_SETTINGS;
}
