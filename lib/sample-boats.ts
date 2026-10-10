import type { Boat } from "@/lib/types";

/** Se muestran en el sitio público solo mientras Firebase no está configurado (vista local). */
const base = {
  description: "",
  status: "active" as const,
  images: [],
  imagePaths: [],
  plan: "individual" as const,
  paid: true,
  paymentUrl: "",
  condition: "Usada" as const,
  hullIdentificationNumber: "",
  soldAt: null,
};

type Seed = Omit<Boat, keyof typeof base | "id"> & Partial<Pick<Boat, "condition" | "plan" | "brokerName">>;

const seeds: [string, Seed][] = [
  ["sample-1", { plan: "broker_fleet", brokerName: "Marbella Yachts", builder: "Riva", model: "Rivale 56", category: "Yate", year: 2021, price: 1450000, length: 17.2, engineHours: 410, propulsion: "Intraborda", flagType: "Extranjera", documentationStatus: "Al día", portLocation: "Marbella", featured: true, createdAt: 11 }],
  ["sample-2", { builder: "Beneteau", model: "Oceanis 46.1", category: "Velero", year: 2019, price: 285000, length: 14.0, engineHours: 1250, propulsion: "Vela", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Punta del Este", featured: true, createdAt: 10 }],
  ["sample-3", { builder: "Sea Ray", model: "SLX 310", category: "Lancha", year: 2018, price: 129000, length: 9.6, engineHours: 520, propulsion: "Intraborda", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Buceo", featured: false, createdAt: 9 }],
  ["sample-4", { plan: "broker_fleet", brokerName: "Miami Marine Group", builder: "Azimut", model: "55 Flybridge", category: "Yate", year: 2016, price: 620000, length: 16.8, engineHours: 1900, propulsion: "Intraborda", flagType: "Extranjera", documentationStatus: "En trámite", portLocation: "Miami", featured: false, createdAt: 8 }],
  ["sample-5", { builder: "Jeanneau", model: "Sun Odyssey 410", category: "Velero", year: 2020, price: 215000, length: 12.3, engineHours: 640, propulsion: "Vela", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Piriápolis", featured: false, createdAt: 7 }],
  ["sample-6", { builder: "Boston Whaler", model: "280 Outrage", category: "Lancha", year: 2022, price: 235000, length: 8.5, engineHours: 180, propulsion: "Fuera de borda", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Punta del Este", featured: false, createdAt: 6 }],
  ["sample-7", { builder: "Zodiac", model: "Medline 9", category: "Semirrígido", year: 2017, price: 68000, length: 9.0, engineHours: 740, propulsion: "Fuera de borda", flagType: "Uruguaya", documentationStatus: "En trámite", portLocation: "Montevideo", featured: false, createdAt: 5 }],
  ["sample-8", { plan: "broker_fleet", brokerName: "Marbella Yachts", builder: "Sunseeker", model: "Predator 57", category: "Yate", year: 2015, price: 540000, length: 17.5, engineHours: 2300, propulsion: "Intraborda", flagType: "Extranjera", documentationStatus: "Al día", portLocation: "Marbella", featured: false, createdAt: 4 }],
  ["sample-9", { builder: "Bavaria", model: "Cruiser 34", category: "Velero", year: 2014, price: 78000, length: 10.4, engineHours: 1500, propulsion: "Vela", flagType: "Uruguaya", documentationStatus: "Sin documentación", portLocation: "Buceo", featured: false, createdAt: 3 }],
  ["sample-10", { plan: "broker_fleet", brokerName: "Punta Yachting", builder: "Fairline", model: "Squadron 50", category: "Yate", year: 2023, price: 980000, length: 15.6, engineHours: 40, propulsion: "Intraborda", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Punta del Este", featured: false, condition: "Nueva", createdAt: 2 }],
  ["sample-11", { builder: "Sea-Doo", model: "GTX Limited 300", category: "Moto de agua", year: 2024, price: 19500, length: 3.4, engineHours: 12, propulsion: "Intraborda", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Piriápolis", featured: false, condition: "Nueva", createdAt: 1 }],
  ["sample-12", { builder: "Catalina", model: "355", category: "Velero", year: 2012, price: 96000, length: 10.8, engineHours: 2100, propulsion: "Vela", flagType: "Otra", documentationStatus: "En trámite", portLocation: "Colonia", featured: false, createdAt: 0 }],
];

// Mismas fotos de Unsplash que scripts/seed-boats.mjs, en el mismo orden que `seeds`.
const PHOTO_IDS = [
  "1528154291023-a6525fabe5b4", // Riva Rivale 56
  "1540946485063-a40da27545f8", // Beneteau Oceanis 46.1
  "1552160757-52790c6f4faf", // Sea Ray SLX 310
  "1605281317010-fe5ffe798166", // Azimut 55 Flybridge
  "1546214755-c5d22447b43b", // Jeanneau Sun Odyssey 410
  "1604737637145-48cc31d160eb", // Boston Whaler 280 Outrage
  "1593351415075-3bac9f45c877", // Zodiac Medline 9
  "1562281302-809108fd533c", // Sunseeker Predator 57
  "1603275218135-07c03485bba9", // Bavaria Cruiser 34
  "1535024966840-e7424dc2635b", // Fairline Squadron 50
  "1563187867-2cd158d07999", // Sea-Doo GTX Limited 300
  "1534296264129-b318f8140c27", // Catalina 355
];

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const SAMPLE_BOATS: Boat[] = seeds.map(([id, seed], index) => ({
  ...base,
  ...seed,
  images: [photo(PHOTO_IDS[index])],
  id,
}));
