import type { Metadata } from "next";
import { Cog, Fan, Gauge, LifeBuoy, Wrench, Zap } from "lucide-react";
import { SectionPage } from "@/components/SectionPage";

export const metadata: Metadata = { title: "Motores y Repuestos · Nauta" };

export default function EnginesPage() {
  return (
    <SectionPage
      title="Motores y Repuestos"
      intro="Fuera de borda, intraborda, hélices, electrónica y accesorios. Muy pronto vas a poder publicar y encontrar repuestos náuticos nuevos y usados."
      items={[
        { icon: Cog, title: "Motores fuera de borda", text: "Nuevos y usados, con horas de uso y año verificados." },
        { icon: Gauge, title: "Motores intraborda", text: "Diésel y nafta, líneas de eje, reductores y repuestos." },
        { icon: Fan, title: "Hélices y transmisión", text: "Hélices, ejes, colas y componentes de propulsión." },
        { icon: Zap, title: "Electrónica", text: "GPS, sondas, radares, radios VHF y pilotos automáticos." },
        { icon: LifeBuoy, title: "Seguridad", text: "Chalecos, balsas, extintores y equipamiento exigido." },
        { icon: Wrench, title: "Mantenimiento", text: "Antifouling, lubricantes y repuestos de servicio." },
      ]}
      note="¿Querés vender un motor o repuesto? Escribinos desde la sección Publicar y lo sumamos."
    />
  );
}
