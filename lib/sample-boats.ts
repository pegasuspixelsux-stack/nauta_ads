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

type Seed = Omit<Boat, keyof typeof base | "id"> & Partial<Pick<Boat, "condition">>;

const seeds: [string, Seed][] = [
  ["sample-1", { builder: "Riva", model: "Rivale 56", category: "Yate", year: 2021, price: 1450000, length: 17.2, engineHours: 410, propulsion: "Intraborda", flagType: "Extranjera", documentationStatus: "Al día", portLocation: "Marbella", featured: true, createdAt: 11 }],
  ["sample-2", { builder: "Beneteau", model: "Oceanis 46.1", category: "Velero", year: 2019, price: 285000, length: 14.0, engineHours: 1250, propulsion: "Vela", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Punta del Este", featured: true, createdAt: 10 }],
  ["sample-3", { builder: "Sea Ray", model: "SLX 310", category: "Lancha", year: 2018, price: 129000, length: 9.6, engineHours: 520, propulsion: "Intraborda", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Buceo", featured: false, createdAt: 9 }],
  ["sample-4", { builder: "Azimut", model: "55 Flybridge", category: "Yate", year: 2016, price: 620000, length: 16.8, engineHours: 1900, propulsion: "Intraborda", flagType: "Extranjera", documentationStatus: "En trámite", portLocation: "Miami", featured: false, createdAt: 8 }],
  ["sample-5", { builder: "Jeanneau", model: "Sun Odyssey 410", category: "Velero", year: 2020, price: 215000, length: 12.3, engineHours: 640, propulsion: "Vela", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Piriápolis", featured: false, createdAt: 7 }],
  ["sample-6", { builder: "Boston Whaler", model: "280 Outrage", category: "Lancha", year: 2022, price: 235000, length: 8.5, engineHours: 180, propulsion: "Fuera de borda", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Punta del Este", featured: false, createdAt: 6 }],
  ["sample-7", { builder: "Zodiac", model: "Medline 9", category: "Semirrígido", year: 2017, price: 68000, length: 9.0, engineHours: 740, propulsion: "Fuera de borda", flagType: "Uruguaya", documentationStatus: "En trámite", portLocation: "Montevideo", featured: false, createdAt: 5 }],
  ["sample-8", { builder: "Sunseeker", model: "Predator 57", category: "Yate", year: 2015, price: 540000, length: 17.5, engineHours: 2300, propulsion: "Intraborda", flagType: "Extranjera", documentationStatus: "Al día", portLocation: "Marbella", featured: false, createdAt: 4 }],
  ["sample-9", { builder: "Bavaria", model: "Cruiser 34", category: "Velero", year: 2014, price: 78000, length: 10.4, engineHours: 1500, propulsion: "Vela", flagType: "Uruguaya", documentationStatus: "Sin documentación", portLocation: "Buceo", featured: false, createdAt: 3 }],
  ["sample-10", { builder: "Fairline", model: "Squadron 50", category: "Yate", year: 2023, price: 980000, length: 15.6, engineHours: 40, propulsion: "Intraborda", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Punta del Este", featured: false, condition: "Nueva", createdAt: 2 }],
  ["sample-11", { builder: "Sea-Doo", model: "GTX Limited 300", category: "Moto de agua", year: 2024, price: 19500, length: 3.4, engineHours: 12, propulsion: "Intraborda", flagType: "Uruguaya", documentationStatus: "Al día", portLocation: "Piriápolis", featured: false, condition: "Nueva", createdAt: 1 }],
  ["sample-12", { builder: "Catalina", model: "355", category: "Velero", year: 2012, price: 96000, length: 10.8, engineHours: 2100, propulsion: "Vela", flagType: "Otra", documentationStatus: "En trámite", portLocation: "Colonia", featured: false, createdAt: 0 }],
];

export const SAMPLE_BOATS: Boat[] = seeds.map(([id, seed]) => ({ ...base, ...seed, id }));
