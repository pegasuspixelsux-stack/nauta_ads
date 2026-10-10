import type { Metadata } from "next";
import { BoatDetail } from "@/components/BoatDetail";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = { title: "Embarcación · Nauta" };

export default async function BoatPage({ params }: PageProps<"/embarcaciones/[id]">) {
  const { id } = await params;

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-12 md:py-16">
        <BoatDetail id={id} />
      </main>
      <Footer />
    </>
  );
}
