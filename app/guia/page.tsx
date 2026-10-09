import type { Metadata } from "next";
import { FileCheck, Flag, Landmark, Scale, ShieldCheck, Stamp } from "lucide-react";
import { SectionPage } from "@/components/SectionPage";

export const metadata: Metadata = { title: "Guía y Trámites · Nauta" };

export default function GuidePage() {
  return (
    <SectionPage
      title="Guía y Trámites"
      intro="Lo básico que conviene saber antes de comprar o vender una embarcación: documentación, bandera, aduana, transferencia y seguro."
      items={[
        { icon: FileCheck, title: "Documentación", text: "Título de propiedad, matrícula e historial. Un aviso con documentación al día se vende más rápido." },
        { icon: Flag, title: "Bandera", text: "Diferencias entre embarcaciones de bandera uruguaya y extranjera, y qué implica cambiar de bandera." },
        { icon: Landmark, title: "Aduana e importación", text: "Ingreso temporal o definitivo, tributos y despachantes de aduana." },
        { icon: Stamp, title: "Transferencia", text: "Cómo se formaliza el cambio de titularidad ante la autoridad marítima." },
        { icon: ShieldCheck, title: "Seguros", text: "Tipos de cobertura y qué suelen pedir las marinas y autoridades." },
        { icon: Scale, title: "Aspectos legales", text: "Gravámenes, embargos y verificación de que la embarcación esté libre de deudas." },
      ]}
      note="Contenido orientativo. Los requisitos y costos cambian: confirmalos siempre con la autoridad competente o un profesional antes de operar."
    />
  );
}
