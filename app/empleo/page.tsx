import type { Metadata } from "next";
import { Anchor, Briefcase, Compass, Hammer, Ship, Wrench } from "lucide-react";
import { SectionPage } from "@/components/SectionPage";

export const metadata: Metadata = { title: "Employment · Nauta" };

export default function EmploymentPage() {
  return (
    <SectionPage
      title="Employment"
      intro="Bolsa de trabajo náutico: capitanes, tripulación, mecánicos y personal de marinas y astilleros. Estamos preparando las primeras ofertas."
      items={[
        { icon: Compass, title: "Capitanes y patrones", text: "Profesionales para traslados, charters y gestión de embarcaciones." },
        { icon: Anchor, title: "Tripulación", text: "Marineros, cocineros de a bordo y personal de cubierta." },
        { icon: Wrench, title: "Mecánicos y técnicos", text: "Motores, electrónica y sistemas de a bordo." },
        { icon: Hammer, title: "Astilleros y varaderos", text: "Carpinteros navales, pintores y personal de taller." },
        { icon: Ship, title: "Marinas y clubes", text: "Personal de atención, guardería y operaciones portuarias." },
        { icon: Briefcase, title: "Publicá una oferta", text: "Si tu empresa busca personal náutico, escribinos para publicarla." },
      ]}
    />
  );
}
