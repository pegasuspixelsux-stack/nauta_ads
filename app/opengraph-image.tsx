import { ImageResponse } from "next/og";

// Miniatura que muestran WhatsApp, iMessage y redes al compartir el enlace.
export const alt = "Nauta · Marketplace & Directorio Náutico";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          background: "linear-gradient(135deg, #0c4a6e 0%, #075985 55%, #0369a1 100%)",
          color: "#ffffff",
        }}
      >
        <svg
          width="220"
          height="220"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M12 2v7.5" />
          <path d="m19 5-5.23 5.23" />
          <path d="M22 12h-7.5" />
          <path d="m19 19-5.23-5.23" />
          <path d="M12 14.5V22" />
          <path d="M10.23 13.77 5 19" />
          <path d="M9.5 12H2" />
          <path d="M10.23 10.23 5 5" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
        <div style={{ display: "flex", fontSize: 120, fontWeight: 700, letterSpacing: -2 }}>
          Nauta
        </div>
        <div style={{ display: "flex", fontSize: 38, color: "#bae6fd" }}>
          Marketplace & Directorio Náutico del Río de la Plata
        </div>
      </div>
    ),
    { ...size },
  );
}
