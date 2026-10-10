// Carga la colección `boats` con 12 embarcaciones de demostración (con fotos de Unsplash) más 2 avisos
// "en revisión" para probar el flujo del administrador.
//
// Uso: node scripts/seed-boats.mjs [ruta-a-service-account.json]
// La clave también puede venir de GOOGLE_APPLICATION_CREDENTIALS. Se lee localmente y nunca
// se commitea (temp/ y *adminsdk*.json están en .gitignore). Se puede repetir sin duplicar:
// los documentos usan ids fijos.

import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const keyPath = process.argv[2] ?? process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyPath) {
  console.error("Pasá la ruta del JSON de la service account como primer argumento.");
  process.exit(1);
}

initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, "utf8"))) });
const db = getFirestore();

// [id, builder, model, category, condition, year, price, length, engineHours, propulsion, flag, docs, port, featured, status]
const boats = [
  ["riva-rivale-56", "Riva", "Rivale 56", "Yate", "Usada", 2021, 1450000, 17.2, 410, "Intraborda", "Extranjera", "Al día", "Marbella", true, "active"],
  ["beneteau-oceanis-46-1", "Beneteau", "Oceanis 46.1", "Velero", "Usada", 2019, 285000, 14.0, 1250, "Vela", "Uruguaya", "Al día", "Punta del Este", true, "active"],
  ["sea-ray-slx-310", "Sea Ray", "SLX 310", "Lancha", "Usada", 2018, 129000, 9.6, 520, "Intraborda", "Uruguaya", "Al día", "Buceo", false, "active"],
  ["azimut-55-flybridge", "Azimut", "55 Flybridge", "Yate", "Usada", 2016, 620000, 16.8, 1900, "Intraborda", "Extranjera", "En trámite", "Miami", false, "active"],
  ["jeanneau-sun-odyssey-410", "Jeanneau", "Sun Odyssey 410", "Velero", "Usada", 2020, 215000, 12.3, 640, "Vela", "Uruguaya", "Al día", "Piriápolis", false, "reserved"],
  ["boston-whaler-280-outrage", "Boston Whaler", "280 Outrage", "Lancha", "Usada", 2022, 235000, 8.5, 180, "Fuera de borda", "Uruguaya", "Al día", "Punta del Este", false, "active"],
  ["zodiac-medline-9", "Zodiac", "Medline 9", "Semirrígido", "Usada", 2017, 68000, 9.0, 740, "Fuera de borda", "Uruguaya", "En trámite", "Montevideo", false, "active"],
  ["sunseeker-predator-57", "Sunseeker", "Predator 57", "Yate", "Usada", 2015, 540000, 17.5, 2300, "Intraborda", "Extranjera", "Al día", "Marbella", false, "active"],
  ["bavaria-cruiser-34", "Bavaria", "Cruiser 34", "Velero", "Usada", 2014, 78000, 10.4, 1500, "Vela", "Uruguaya", "Sin documentación", "Buceo", false, "active"],
  ["fairline-squadron-50", "Fairline", "Squadron 50", "Yate", "Nueva", 2023, 980000, 15.6, 40, "Intraborda", "Uruguaya", "Al día", "Punta del Este", false, "active"],
  ["sea-doo-gtx-limited-300", "Sea-Doo", "GTX Limited 300", "Moto de agua", "Nueva", 2024, 19500, 3.4, 12, "Intraborda", "Uruguaya", "Al día", "Piriápolis", false, "active"],
  ["catalina-355", "Catalina", "355", "Velero", "Usada", 2012, 96000, 10.8, 2100, "Vela", "Otra", "En trámite", "Colonia", false, "active"],
  // Avisos recién enviados desde /publicar: no son visibles al público hasta que el admin los active.
  ["pendiente-grand-banks-42", "Grand Banks", "42 Classic", "Yate", "Usada", 2008, 210000, 13.0, 3100, "Intraborda", "Uruguaya", "En trámite", "Montevideo", false, "pending_review"],
  ["pendiente-yamaha-242x", "Yamaha", "242X E-Series", "Lancha", "Usada", 2020, 54000, 7.4, 260, "Intraborda", "Uruguaya", "Al día", "Piriápolis", false, "awaiting_payment"],
];

// Fotos de Unsplash enlazadas (no se suben a Storage), elegidas por tipo de embarcación.
const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
const PHOTOS = {
  "riva-rivale-56": "1528154291023-a6525fabe5b4",
  "beneteau-oceanis-46-1": "1540946485063-a40da27545f8",
  "sea-ray-slx-310": "1552160757-52790c6f4faf",
  "azimut-55-flybridge": "1605281317010-fe5ffe798166",
  "jeanneau-sun-odyssey-410": "1546214755-c5d22447b43b",
  "boston-whaler-280-outrage": "1604737637145-48cc31d160eb",
  "zodiac-medline-9": "1593351415075-3bac9f45c877",
  "sunseeker-predator-57": "1562281302-809108fd533c",
  "bavaria-cruiser-34": "1603275218135-07c03485bba9",
  "fairline-squadron-50": "1535024966840-e7424dc2635b",
  "sea-doo-gtx-limited-300": "1563187867-2cd158d07999",
  "catalina-355": "1534296264129-b318f8140c27",
  "pendiente-grand-banks-42": "1567899378494-47b22a2ae96a",
  "pendiente-yamaha-242x": "1585000962552-70f0a67223d9",
};

// Avisos de broker: el resto lo ofrece su propietario.
const BROKERS = {
  "riva-rivale-56": "Marbella Yachts",
  "azimut-55-flybridge": "Miami Marine Group",
  "sunseeker-predator-57": "Marbella Yachts",
  "fairline-squadron-50": "Punta Yachting",
};

const HOUR = 60 * 60 * 1000;
const now = Date.now();
const batch = db.batch();

boats.forEach(
  (
    [id, builder, model, category, condition, year, price, length, engineHours, propulsion, flagType, documentationStatus, portLocation, featured, status],
    index,
  ) => {
    const pending = status === "pending_review" || status === "awaiting_payment";
    const ref = db.collection("boats").doc(id);
    batch.set(ref, {
      builder,
      model,
      category,
      condition,
      year,
      price,
      length,
      engineHours,
      propulsion,
      hullIdentificationNumber: "",
      flagType,
      documentationStatus,
      portLocation,
      description: `${year} ${builder} ${model}. Aviso de demostración.`,
      status,
      featured,
      images: [photo(PHOTOS[id])],
      imagePaths: [],
      plan: BROKERS[id] ? "broker_fleet" : "individual",
      brokerName: BROKERS[id] ?? "",
      paid: !pending,
      paymentUrl: status === "awaiting_payment" ? "https://example.com/pago" : "",
      // Más nuevo primero, separados una hora para que el panel tenga un orden real.
      createdAt: now - index * HOUR,
      soldAt: null,
    });
    if (pending) {
      batch.set(ref.collection("private").doc("owner"), {
        name: "Anunciante de prueba",
        email: "anunciante@example.com",
        phone: "+598 99 000 000",
      });
    }
  },
);

await batch.commit();
console.log(`Se cargaron ${boats.length} embarcaciones en Firestore.`);
