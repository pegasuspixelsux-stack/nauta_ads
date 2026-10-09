import type {
  Boat,
  BoatCategory,
  BoatStatus,
  Condition,
  DocumentationStatus,
  FlagType,
  ListingPlan,
  Propulsion,
} from "@/lib/types";

export const CATEGORIES: BoatCategory[] = ["Yate", "Velero", "Lancha", "Semirrígido", "Moto de agua", "Otro"];
export const CONDITIONS: Condition[] = ["Nueva", "Usada"];
export const PROPULSIONS: Propulsion[] = ["Fuera de borda", "Intraborda", "Vela", "Sin motor"];
export const FLAGS: FlagType[] = ["Uruguaya", "Extranjera", "Otra"];
export const DOCUMENTATION: DocumentationStatus[] = ["Al día", "En trámite", "Sin documentación"];
export const PORTS = [
  "Punta del Este",
  "Piriápolis",
  "Buceo",
  "Montevideo",
  "Colonia",
  "Miami",
  "Marbella",
  "Otro puerto",
];

/** Rangos de eslora (metros) para el filtro público. */
export const LENGTH_RANGES = [
  { value: "0-8", label: "Hasta 8 m", min: 0, max: 8 },
  { value: "8-12", label: "8 a 12 m", min: 8, max: 12 },
  { value: "12-18", label: "12 a 18 m", min: 12, max: 18 },
  { value: "18-999", label: "Más de 18 m", min: 18, max: Infinity },
];

export const PLANS: Record<ListingPlan, { label: string; price: string }> = {
  individual: { label: "Particular", price: "US$ 99" },
  broker_fleet: { label: "Flota de broker", price: "Paquete a medida" },
};

export const STATUS_LABEL: Record<BoatStatus, string> = {
  pending_review: "En revisión",
  awaiting_payment: "Esperando pago",
  active: "Publicado",
  reserved: "Reservado",
  sold: "Vendido",
};

/** Estados visibles en el sitio público. */
export const PUBLIC_STATUSES: BoatStatus[] = ["active", "reserved"];

export const boatLabel = (boat: { year: number; builder: string; model: string }) =>
  `${boat.year} ${boat.builder} ${boat.model}`;

export interface Filters {
  query: string;
  category: string;
  length: string;
  propulsion: string;
  port: string;
  maxPrice: string;
  /** Solo se usan en la búsqueda avanzada de /embarcaciones. */
  condition: string;
  flagType: string;
  documentation: string;
}

export const EMPTY_FILTERS: Filters = {
  query: "",
  category: "",
  length: "",
  propulsion: "",
  port: "",
  maxPrice: "",
  condition: "",
  flagType: "",
  documentation: "",
};

/** Avisos visibles al público que cumplen todos los filtros, destacados y más nuevos primero. */
export function filterBoats(source: Boat[], filters: Filters): Boat[] {
  const query = filters.query.trim().toLowerCase();
  const maxPrice = Number(filters.maxPrice) || Infinity;
  const range = LENGTH_RANGES.find((item) => item.value === filters.length);
  return source
    .filter((boat) => PUBLIC_STATUSES.includes(boat.status))
    .filter((boat) => !filters.category || boat.category === filters.category)
    .filter((boat) => !filters.condition || boat.condition === filters.condition)
    .filter((boat) => !range || (boat.length >= range.min && boat.length < range.max))
    .filter((boat) => !filters.propulsion || boat.propulsion === filters.propulsion)
    .filter((boat) => !filters.port || boat.portLocation === filters.port)
    .filter((boat) => !filters.flagType || boat.flagType === filters.flagType)
    .filter((boat) => !filters.documentation || boat.documentationStatus === filters.documentation)
    .filter((boat) => boat.price <= maxPrice)
    .filter((boat) => !query || `${boat.builder} ${boat.model}`.toLowerCase().includes(query))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt - a.createdAt);
}
