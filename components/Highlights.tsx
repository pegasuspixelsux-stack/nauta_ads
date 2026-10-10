import { FileCheck, Globe, Handshake, ShieldCheck, type LucideIcon } from "lucide-react";

const items: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ShieldCheck,
    title: "Inspección Naval Certificada",
    text: "Evaluaciones periciales rigurosas de casco y motorización previas a la transacción.",
  },
  {
    icon: FileCheck,
    title: "Trámites y Prefectura ROU",
    text: "Gestión integral de transferencias, matrícula, bandera uruguaya y despachos aduaneros.",
  },
  {
    icon: Handshake,
    title: "Brokers & Astilleros Oficiales",
    text: "Red avalada de profesionales marítimos, marinas privadas y varaderos de prestigio regional.",
  },
  {
    icon: Globe,
    title: "Vitrina Global Conectada",
    text: "Alcance inmediato con compradores e inversores de Uruguay, Argentina, Brasil, Miami y Europa.",
  },
];

export function Highlights() {
  return (
    <section aria-label="Por qué Nauta" className="border-t border-slate-800/80">
      <ul className="mx-auto grid max-w-[1440px] gap-6 px-6 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="group rounded-2xl border border-slate-800/80 bg-surface p-6 transition-[transform,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-accent"
          >
            <Icon className="size-6 text-accent transition-colors duration-300 group-hover:text-accent-strong" strokeWidth={1.5} />
            <h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-100">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
