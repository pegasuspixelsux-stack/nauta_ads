import type { BoatStatus, LeadStatus } from "@/lib/types";

export const leadTone = {
  new: "blue",
  contacted: "amber",
  converted: "green",
} as const satisfies Record<LeadStatus, string>;

export const leadLabel: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  converted: "Concretado",
};

export const boatTone = {
  pending_review: "blue",
  awaiting_payment: "amber",
  active: "green",
  reserved: "amber",
  sold: "neutral",
} as const satisfies Record<BoatStatus, string>;
