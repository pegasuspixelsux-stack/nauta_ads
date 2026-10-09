import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SubmitBoatForm } from "@/components/SubmitBoatForm";

export const metadata: Metadata = { title: "Publicar una embarcación · Nauta" };

export default function PublishPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Publicá tu embarcación</h1>
        <p className="mt-3 mb-10 text-slate-400">
          Completá el formulario sin registrarte. Revisamos fotos, especificaciones y estado legal, y
          te enviamos el link de pago para activar el aviso.
        </p>
        <SubmitBoatForm />
      </main>
      <Footer />
    </>
  );
}
