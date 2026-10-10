/** Ciclo de vida de un aviso: revisión → link de pago → publicado → vendido. */
export type BoatStatus = "pending_review" | "awaiting_payment" | "active" | "reserved" | "sold";

export type BoatCategory = "Yate" | "Velero" | "Lancha" | "Semirrígido" | "Moto de agua" | "Otro";
export type Propulsion = "Fuera de borda" | "Intraborda" | "Vela" | "Sin motor";
export type FlagType = "Uruguaya" | "Extranjera" | "Otra";
export type DocumentationStatus = "Al día" | "En trámite" | "Sin documentación";
export type ListingPlan = "individual" | "broker_fleet";
export type Condition = "Nueva" | "Usada";

export interface Boat {
  id: string;
  builder: string;
  model: string;
  category: BoatCategory;
  condition: Condition;
  year: number;
  price: number;
  /** Eslora en metros. */
  length: number;
  engineHours: number;
  propulsion: Propulsion;
  hullIdentificationNumber: string;
  flagType: FlagType;
  documentationStatus: DocumentationStatus;
  portLocation: string;
  description: string;
  status: BoatStatus;
  featured: boolean;
  images: string[];
  imagePaths: string[];
  plan: ListingPlan;
  /** Nombre público del broker o agencia (solo plan de flota). Vacío = ofrece el propietario. */
  brokerName?: string;
  paid: boolean;
  /** Link de pago que el administrador envía al anunciante tras la revisión. */
  paymentUrl: string;
  createdAt: number;
  soldAt: number | null;
}

/** Datos de contacto del anunciante. Se guardan en boats/{id}/private/owner (solo staff). */
export interface BoatOwner {
  name: string;
  email: string;
  phone: string;
}

export type LeadStatus = "new" | "contacted" | "converted";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  boatId: string | null;
  boatLabel: string;
  status: LeadStatus;
  createdAt: number;
}

export type UserRole = "admin" | "manager" | "operator" | "pending";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: number;
}

export interface SiteSettings {
  name: string;
  currency: string;
  email: string;
  phone: string;
  address: string;
  notifyNewLead: boolean;
  notifyStatusChange: boolean;
  weeklyDigest: boolean;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  name: "Nauta",
  currency: "USD",
  email: "",
  phone: "",
  address: "",
  notifyNewLead: true,
  notifyStatusChange: false,
  weeklyDigest: true,
};
