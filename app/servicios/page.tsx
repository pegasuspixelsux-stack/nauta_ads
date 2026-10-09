import type { Metadata } from "next";
import { Anchor, Briefcase, ClipboardCheck, Hammer, Shield, Ship } from "lucide-react";
import { SectionPage } from "@/components/SectionPage";

export const metadata: Metadata = { title: "Servicios Náuticos y Brokers · Nauta" };

export default function ServicesPage() {
  return (
    <SectionPage
      title="Servicios Náuticos y Brokers"
      intro="Directorio profesional del sector: brokers, astilleros, marinas, peritos y más. Los profesionales verificados por Nauta se irán incorporando acá."
      items={[
        { icon: Briefcase, title: "Brokers", text: "Corredores náuticos y agencias, con paquetes de flota para sus avisos." },
        { icon: Hammer, title: "Astilleros y talleres", text: "Reparación, refit, pintura y mantenimiento de casco y motor." },
        { icon: Anchor, title: "Marinas y guarderías", text: "Amarras, guardería en seco y servicios en Punta del Este, Piriápolis, Buceo y Montevideo." },
        { icon: ClipboardCheck, title: "Peritos y tasadores", text: "Inspección previa a la compra y tasación de embarcaciones." },
        { icon: Shield, title: "Seguros", text: "Cobertura de casco, responsabilidad civil y navegación." },
        { icon: Ship, title: "Traslados y charters", text: "Capitanes, traslados de embarcaciones y alquileres." },
      ]}
      note="¿Sos broker o prestás servicios náuticos? Escribinos para sumarte al directorio."
    />
  );
}
