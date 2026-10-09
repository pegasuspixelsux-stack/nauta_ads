import type { Metadata } from "next";
import { BoatsExplorer } from "@/components/BoatsExplorer";
import { BrokerBanner } from "@/components/BrokerBanner";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = { title: "Embarcaciones · Nauta" };

export default async function BoatsPage({ searchParams }: PageProps<"/embarcaciones">) {
  const { category } = await searchParams;
  const initialCategory = typeof category === "string" ? category : "";

  return (
    <>
      <Navbar />
      <BrokerBanner />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-12 md:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Embarcaciones</h1>
        <p className="mt-3 mb-10 max-w-2xl text-slate-400">
          Yates, veleros y lanchas nuevas y usadas. Afiná la búsqueda por eslora, propulsión, puerto,
          bandera y documentación.
        </p>
        {/* key reinicia los filtros cuando un enlace cambia ?category= */}
        <BoatsExplorer key={initialCategory} initialCategory={initialCategory} />
      </main>
      <Footer />
    </>
  );
}
