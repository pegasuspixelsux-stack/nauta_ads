"use client";

import { useMemo, useState } from "react";
import { Hero } from "@/components/Hero";
import { InquiryModal } from "@/components/InquiryModal";
import { ListingGrid } from "@/components/ListingGrid";
import { StoreBanner } from "@/components/StoreBanner";
import { EMPTY_FILTERS, filterBoats, PUBLIC_STATUSES, type Filters } from "@/lib/boats";
import { useCollection, useSettings } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { SAMPLE_BOATS } from "@/lib/sample-boats";
import type { Boat } from "@/lib/types";

export function Storefront({ initialCategory = "" }: { initialCategory?: string }) {
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS, category: initialCategory });
  const [inquiry, setInquiry] = useState<Boat | null>(null);
  // Sin orderBy: combinarlo con `in` exigiría un índice compuesto; se ordena abajo.
  const { data, loading } = useCollection<Boat>("boats", {
    whereIn: { field: "status", values: PUBLIC_STATUSES },
  });
  const { currency } = useSettings();

  const boats = useMemo(
    () => filterBoats(isFirebaseConfigured ? data : SAMPLE_BOATS, filters),
    [data, filters],
  );

  return (
    <>
      <Hero />
      <ListingGrid
        boats={boats}
        loading={loading}
        currency={currency}
        filters={filters}
        onFiltersChange={setFilters}
        onInquire={setInquiry}
      />
      <StoreBanner />
      <InquiryModal boat={inquiry} onClose={() => setInquiry(null)} />
    </>
  );
}
