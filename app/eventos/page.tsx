import type { Metadata } from "next";
import { Anchor, CalendarDays, Flag, Sailboat, Trophy, Users } from "lucide-react";
import { SectionPage } from "@/components/SectionPage";

export const metadata: Metadata = { title: "Eventos · Nauta" };

export default function EventsPage() {
  return (
    <SectionPage
      title="Eventos"
      intro="El calendario náutico de los yacht clubs: regatas, exposiciones, salidas y encuentros. Estamos cargando las próximas fechas."
      items={[
        { icon: Trophy, title: "Regatas", text: "Campeonatos y regatas de oceánicos, cruceros y clases monotipo." },
        { icon: Sailboat, title: "Exposiciones", text: "Ferias y muestras de embarcaciones, motores y accesorios." },
        { icon: Flag, title: "Yacht clubs", text: "Agenda de los clubes de Punta del Este, Piriápolis, Buceo y Montevideo." },
        { icon: Anchor, title: "Aperturas de temporada", text: "Inicio de temporada, bendición de la flota y botaduras." },
        { icon: Users, title: "Encuentros", text: "Reuniones de propietarios, charlas y capacitaciones." },
        { icon: CalendarDays, title: "Tu evento", text: "Si organizás un evento náutico, escribinos para publicarlo." },
      ]}
    />
  );
}
