import Link from "next/link";
import { ShipWheel } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const columns = [
  {
    title: "Explorar",
    links: [
      { label: "Todas las embarcaciones", href: "/embarcaciones" },
      { label: "Yates", href: "/embarcaciones?category=Yate" },
      { label: "Veleros", href: "/embarcaciones?category=Velero" },
      { label: "Lanchas", href: "/embarcaciones?category=Lancha" },
    ],
  },
  {
    title: "Nauta",
    links: [
      { label: "Publicar una embarcación", href: "/publicar" },
      { label: "Motores y Repuestos", href: "/motores" },
      { label: "Servicios y Brokers", href: "/servicios" },
      { label: "Guía y Trámites", href: "/guia" },
      { label: "Eventos", href: "/eventos" },
    ],
  },
  {
    title: "Equipo",
    links: [
      { label: "Ingreso del equipo", href: "/login" },
      { label: "Panel", href: "/dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-slate-100">
            <ShipWheel className="size-6" strokeWidth={1.75} aria-hidden />
            Nauta
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            El marketplace náutico del Río de la Plata: embarcaciones, motores, servicios y trámites
            en un solo lugar.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-slate-100">{column.title}</h3>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-slate-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Nauta. Todos los derechos reservados.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
