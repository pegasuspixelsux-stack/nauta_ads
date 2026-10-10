import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileBar } from "@/components/MobileBar";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nautaads.vercel.app";
const description =
  "Yates, veleros, lanchas, motores y servicios náuticos nuevos y usados. Marketplace y directorio náutico del Río de la Plata.";

export const metadata: Metadata = {
  // Base para resolver la URL absoluta de la imagen que leen WhatsApp y las redes.
  metadataBase: new URL(siteUrl),
  title: "Nauta · Marketplace & Directorio Náutico",
  description,
  // La imagen sale de app/opengraph-image.tsx; el favicon, de app/icon.svg.
  openGraph: {
    title: "Nauta · Marketplace Náutico",
    description,
    siteName: "Nauta",
    locale: "es_UY",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

// Runs before first paint so the saved (or system) theme never flashes the wrong colors.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){document.documentElement.classList.add("dark")}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <AuthProvider>{children}</AuthProvider>
        <MobileBar />
      </body>
    </html>
  );
}
